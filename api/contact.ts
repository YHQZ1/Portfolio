/// <reference types="node" />
import { CONTACT_EMAIL } from "../src/data/site";
import {
  LIMITS,
  buildEmail,
  createRateLimiter,
  parseContact,
} from "./_lib/contact";

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
