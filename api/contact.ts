/// <reference types="node" />

// Keep in sync with CONTACT_EMAIL in src/data/site.ts (a test checks they match).
// The function is deliberately one self-contained file: Vercel runs it as
// native ES modules, where extensionless relative imports fail at runtime.
const CONTACT_EMAIL = "rupareluttkarsh2309@gmail.com";

const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
  body: 16_000,
} as const;

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

type ParseResult =
  { ok: true; value: ContactMessage } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Header fields must stay on one line, otherwise a crafted value could inject
// extra headers into the outgoing email.
const singleLine = (value: string) =>
  value.replace(/[\r\n\u2028\u2029]+/g, " ").trim();

const text = (value: unknown) => (typeof value === "string" ? value : "");

function parseContact(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "invalid_body" };
  }

  const input = raw as Record<string, unknown>;
  const value: ContactMessage = {
    name: singleLine(text(input.name)),
    email: singleLine(text(input.email)),
    subject: singleLine(text(input.subject)),
    message: text(input.message).trim(),
    website: text(input.website).trim(),
  };

  if (!value.name || value.name.length > LIMITS.name) {
    return { ok: false, error: "invalid_name" };
  }
  if (!EMAIL_PATTERN.test(value.email) || value.email.length > LIMITS.email) {
    return { ok: false, error: "invalid_email" };
  }
  if (value.subject.length > LIMITS.subject) {
    return { ok: false, error: "invalid_subject" };
  }
  if (!value.message || value.message.length > LIMITS.message) {
    return { ok: false, error: "invalid_message" };
  }

  return { ok: true, value };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail({ name, email, subject, message }: ContactMessage) {
  const title = subject || `Message from ${name}`;

  return {
    subject: `[Portfolio] ${title}`,
    text: `${message}\n\n${name} <${email}>`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr /><p><strong>${escapeHtml(
      name
    )}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
  };
}

function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, number[]>();

  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }

    hits.set(key, [...recent, now]);
    return true;
  };
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Messages are only ever delivered to the address in src/data/site.ts. It is
// deliberately not configurable, so a leaked or misused request can never
// redirect mail somewhere else.
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

// Best effort: each serverless instance keeps its own counter, which is enough
// to blunt a burst from one visitor. Add a Vercel firewall rule for more.
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "not_configured" }, 500);

  if (Number(request.headers.get("content-length") ?? 0) > LIMITS.body) {
    return json({ error: "too_large" }, 413);
  }

  const visitor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(visitor)) return json({ error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = parseContact(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  // Real visitors never see this field, so any value means a bot. Answer as if
  // it worked so the bot learns nothing.
  if (parsed.value.website) return json({ ok: true });

  const email = buildEmail(parsed.value);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [CONTACT_EMAIL],
        reply_to: parsed.value.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return json({ error: "send_failed" }, 502);
  } catch {
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
}
