// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./contact";
import {
  buildEmail,
  createRateLimiter,
  escapeHtml,
  parseContact,
} from "./_lib/contact";

let visitor = 0;

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello",
  message: "I would like to talk about a role.",
  website: "",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  visitor += 1;
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `203.0.113.${visitor}`,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

const resend = vi.fn();

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_TO_EMAIL", "someone-else@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "");
  resend.mockReset();
  resend.mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", resend);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/contact", () => {
  it("delivers only to the site address, whatever the environment says", async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    expect(resend).toHaveBeenCalledTimes(1);
    const [url, init] = resend.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.authorization).toBe("Bearer re_test_key");

    const sent = JSON.parse(init.body);
    expect(sent.to).toEqual(["rupareluttkarsh2309@gmail.com"]);
    expect(sent.reply_to).toBe("ada@example.com");
    expect(sent.subject).toBe("[Portfolio] Hello");
    expect(sent.from).toContain("onboarding@resend.dev");
    expect(sent.text).toContain("I would like to talk about a role.");
  });

  it("falls back to a default subject and the configured sender", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "Site <contact@example.com>");

    await post({ ...valid, subject: "" });

    const sent = JSON.parse(resend.mock.calls[0][1].body);
    expect(sent.subject).toBe("[Portfolio] Message from Ada Lovelace");
    expect(sent.from).toBe("Site <contact@example.com>");
  });

  it("escapes HTML and keeps header fields on one line", async () => {
    await post({
      ...valid,
      name: "<b>Eve</b>\r\nBcc: evil@example.com",
      message: "<script>alert(1)</script>",
    });

    const sent = JSON.parse(resend.mock.calls[0][1].body);
    expect(sent.html).not.toContain("<script>");
    expect(sent.html).toContain("&lt;script&gt;");
    expect(sent.html).not.toContain("<b>Eve");
    expect(sent.text).not.toMatch(/\r|\nBcc/);
  });

  it("rejects anything but valid input", async () => {
    for (const body of [
      { ...valid, name: "" },
      { ...valid, email: "not-an-email" },
      { ...valid, message: "   " },
      { ...valid, message: "x".repeat(5001) },
      { ...valid, subject: "x".repeat(151) },
    ]) {
      const response = await post(body);
      expect(response.status).toBe(400);
    }

    expect((await post("not json")).status).toBe(400);
    expect(resend).not.toHaveBeenCalled();
  });

  it("pretends to succeed for bots that fill the hidden field", async () => {
    const response = await post({ ...valid, website: "https://spam.example" });

    expect(response.status).toBe(200);
    expect(resend).not.toHaveBeenCalled();
  });

  it("refuses oversized requests", async () => {
    const response = await post(valid, { "content-length": "999999" });

    expect(response.status).toBe(413);
    expect(resend).not.toHaveBeenCalled();
  });

  it("limits repeat senders", async () => {
    const headers = { "x-forwarded-for": "198.51.100.7" };

    for (let i = 0; i < 5; i += 1) {
      expect((await post(valid, headers)).status).toBe(200);
    }

    expect((await post(valid, headers)).status).toBe(429);
  });

  it("reports a failure when Resend rejects or is unreachable", async () => {
    resend.mockResolvedValueOnce(new Response("{}", { status: 422 }));
    expect((await post(valid)).status).toBe(502);

    resend.mockRejectedValueOnce(new Error("network"));
    expect((await post(valid)).status).toBe(502);
  });

  it("explains when the server is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(resend).not.toHaveBeenCalled();
  });
});

describe("contact helpers", () => {
  it("parses and trims the fields", () => {
    const result = parseContact({ ...valid, name: "  Ada  " });

    expect(result.ok && result.value.name).toBe("Ada");
    expect(parseContact(null).ok).toBe(false);
  });

  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;"
    );
  });

  it("builds a readable plain-text body", () => {
    const email = buildEmail({ ...valid, subject: "" });

    expect(email.text).toBe(
      "I would like to talk about a role.\n\nAda Lovelace <ada@example.com>"
    );
  });

  it("forgets old requests once the window has passed", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 500)).toBe(false);
    expect(allow("a", 1500)).toBe(true);
    expect(allow("b", 500)).toBe(true);
  });
});
