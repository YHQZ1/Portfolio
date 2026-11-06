// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_EMAIL } from "../src/data/site";
import { POST } from "./contact";

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
    expect(sent.to).toEqual([CONTACT_EMAIL]);
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

describe("message content", () => {
  it("trims fields and sends a readable plain-text body", async () => {
    await post({ ...valid, name: "  Ada Lovelace  ", subject: "" });

    const sent = JSON.parse(resend.mock.calls[0][1].body);
    expect(sent.text).toContain(
      "New message from Ada Lovelace <ada@example.com>"
    );
    expect(sent.text).toContain("Subject: Message from Ada Lovelace");
    expect(sent.text).toContain("\nI would like to talk about a role.\n");
    expect(sent.text).toContain("Reply to this email to answer Ada directly.");
  });

  it("escapes every HTML special character", async () => {
    await post({ ...valid, message: `<a href="x">&'` });

    const sent = JSON.parse(resend.mock.calls[0][1].body);
    expect(sent.html).toContain("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });

  it("forgets old requests once the rate-limit window has passed", async () => {
    vi.useFakeTimers();
    try {
      const headers = { "x-forwarded-for": "198.51.100.99" };

      for (let i = 0; i < 5; i += 1) {
        expect((await post(valid, headers)).status).toBe(200);
      }
      expect((await post(valid, headers)).status).toBe(429);

      vi.setSystemTime(Date.now() + 11 * 60 * 1000);

      expect((await post(valid, headers)).status).toBe(200);
    } finally {
      vi.useRealTimers();
    }
  });

  it("builds a designed HTML email with a reply button", async () => {
    await post({
      ...valid,
      subject: "Role at Acme & Co",
      message: "Line one\nLine two",
    });

    const sent = JSON.parse(resend.mock.calls[0][1].body);
    expect(sent.html).toContain("<!doctype html>");
    expect(sent.html).toContain("Role at Acme &amp; Co");
    expect(sent.html).toContain("Line one<br>Line two");
    expect(sent.html).toContain("Reply to Ada");
    expect(sent.html).toContain(
      'href="mailto:ada@example.com?subject=Re%3A%20Role%20at%20Acme%20%26%20Co"'
    );
    expect(sent.html).toContain("prefers-color-scheme: dark");
    expect(sent.html).toMatch(/\d{1,2}:\d{2} (am|pm) IST/i);
  });
});
