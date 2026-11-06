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

const FONT_STACK = "'Raleway','Helvetica Neue',Helvetica,Arial,sans-serif";

const formatSent = (now: Date) =>
  `${now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} IST`;

// Email clients ignore most modern CSS, so the layout is a plain table with
// inline styles. The <style> block only adds dark-mode colours where supported.
function buildEmail(
  { name, email, subject, message }: ContactMessage,
  now = new Date()
) {
  const title = subject || `Message from ${name}`;
  const sent = formatSent(now);
  const firstName = name.split(" ")[0] || name;
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${title}`)}`;
  const preheader = escapeHtml(message.replace(/\s+/g, " ").slice(0, 110));
  const body = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");

  const label = (value: string) =>
    `<td class="muted" style="padding:0 16px 10px 0;width:64px;vertical-align:top;font:500 11px/1.6 ${FONT_STACK};letter-spacing:0.14em;text-transform:uppercase;color:#767676;">${value}</td>`;

  return {
    subject: `[Portfolio] ${title}`,
    text: [
      `New message from ${name} <${email}>`,
      `Subject: ${title}`,
      `Sent: ${sent}`,
      "",
      message,
      "",
      "--",
      `Reply to this email to answer ${firstName} directly.`,
    ].join("\n"),
    html: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${escapeHtml(title)}</title>
<style>
@media (prefers-color-scheme: dark) {
  .page { background: #0a0a0a !important; }
  .card { background: #111111 !important; border-color: #262626 !important; }
  .fg { color: #f5f5f5 !important; }
  .muted { color: #a0a0a0 !important; }
  .rule { border-color: #262626 !important; }
  .button { border-color: #f5f5f5 !important; color: #f5f5f5 !important; }
}
@media only screen and (max-width: 520px) {
  .pad { padding-left: 22px !important; padding-right: 22px !important; }
  .title { font-size: 22px !important; }
}
</style>
</head>
<body class="page" style="margin:0;padding:0;background:#f4f4f4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f4f4f4;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="page" style="background:#f4f4f4;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e8e8e8;">
<tr><td class="pad" style="padding:30px 36px 0 36px;">
<p class="muted" style="margin:0;font:500 11px/1.6 ${FONT_STACK};letter-spacing:0.16em;text-transform:uppercase;color:#767676;">New message &middot; uttkarsh.dev</p>
</td></tr>
<tr><td class="pad" style="padding:14px 36px 0 36px;">
<h1 class="title fg" style="margin:0;font:300 28px/1.25 ${FONT_STACK};letter-spacing:-0.01em;color:#1a1a1a;">${escapeHtml(title)}</h1>
</td></tr>
<tr><td class="pad" style="padding:26px 36px 0 36px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>${label("From")}<td class="fg" style="padding:0 0 10px 0;font:400 15px/1.6 ${FONT_STACK};color:#1a1a1a;">${escapeHtml(name)} &nbsp;<a href="mailto:${escapeHtml(email)}" class="muted" style="color:#5f5f5f;text-decoration:underline;">${escapeHtml(email)}</a></td></tr>
<tr>${label("Sent")}<td class="muted" style="padding:0 0 10px 0;font:400 15px/1.6 ${FONT_STACK};color:#5f5f5f;">${escapeHtml(sent)}</td></tr>
</table>
</td></tr>
<tr><td class="pad" style="padding:8px 36px 0 36px;"><div class="rule" style="border-top:1px solid #e8e8e8;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
<tr><td class="pad fg" style="padding:26px 36px 6px 36px;font:400 16px/1.75 ${FONT_STACK};color:#1a1a1a;">${body}</td></tr>
<tr><td class="pad" style="padding:26px 36px 36px 36px;">
<a class="button fg" href="${escapeHtml(replyHref)}" style="display:inline-block;padding:13px 26px;border:1px solid #1a1a1a;color:#1a1a1a;font:500 14px/1 ${FONT_STACK};letter-spacing:0.02em;text-decoration:none;">Reply to ${escapeHtml(firstName)}</a>
</td></tr>
</table>
<p class="muted" style="margin:18px 0 0 0;max-width:600px;font:400 12px/1.7 ${FONT_STACK};color:#767676;text-align:center;">Sent from the contact form on uttkarsh.dev. Replying to this email goes straight to ${escapeHtml(firstName)}.</p>
</td></tr>
</table>
</body>
</html>`,
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
