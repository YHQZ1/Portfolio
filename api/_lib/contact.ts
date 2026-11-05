export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
  body: 16_000,
} as const;

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export type ParseResult =
  { ok: true; value: ContactMessage } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Header fields must stay on one line, otherwise a crafted value could inject
// extra headers into the outgoing email.
const singleLine = (value: string) =>
  value.replace(/[\r\n\u2028\u2029]+/g, " ").trim();

const text = (value: unknown) => (typeof value === "string" ? value : "");

export function parseContact(raw: unknown): ParseResult {
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

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmail({ name, email, subject, message }: ContactMessage) {
  const title = subject || `Message from ${name}`;

  return {
    subject: `[Portfolio] ${title}`,
    text: `${message}\n\n${name} <${email}>`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr /><p><strong>${escapeHtml(
      name
    )}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
  };
}

export function createRateLimiter({
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
