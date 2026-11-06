// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./visits";

const BROWSER =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";

const fetchMock = vi.fn();

function request(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/visits", {
    method: "POST",
    headers: { "user-agent": BROWSER, ...headers },
  });
}

// Upstash answers each pipeline with one { result } entry per command.
const reply = (...results: unknown[]) =>
  Promise.resolve({
    ok: true,
    json: async () => results.map((result) => ({ result })),
  });

const sentCommands = (call: number) =>
  JSON.parse(fetchMock.mock.calls[call][1].body) as (string | number)[][];

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "secret");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("visits API", () => {
  it("reports it is not configured without Redis credentials", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("KV_REST_API_URL", "");

    expect((await GET()).status).toBe(503);
    expect((await POST(request())).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts the KV_REST_API_* variable names the Marketplace sets", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("KV_REST_API_URL", "https://kv.example.com/");
    vi.stubEnv("KV_REST_API_TOKEN", "kv-secret");
    fetchMock.mockReturnValueOnce(reply("3", 2, "2026-11-06"));

    expect((await GET()).status).toBe(200);
    expect(fetchMock.mock.calls[0][0]).toBe("https://kv.example.com/pipeline");
    expect(fetchMock.mock.calls[0][1].headers.authorization).toBe(
      "Bearer kv-secret"
    );
  });

  it("returns the running totals", async () => {
    fetchMock.mockReturnValueOnce(reply("42", 5, "2026-11-06"));

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      visitors: 42,
      countries: 5,
      since: "2026-11-06",
    });
  });

  it("counts a new visitor once, with their country", async () => {
    fetchMock
      .mockReturnValueOnce(reply("OK"))
      .mockReturnValueOnce(reply(43, 1, 1))
      .mockReturnValueOnce(reply("43", 6, "2026-11-06"));

    const response = await POST(request({ "x-vercel-ip-country": "IN" }));
    const commands = sentCommands(1).map(([name]) => name);

    expect((await response.json()).visitors).toBe(43);
    expect(commands).toEqual(["INCR", "SETNX", "SADD"]);
    expect(sentCommands(1)[2]).toEqual(["SADD", "visitors:countries", "IN"]);
  });

  it("does not store the raw IP address", async () => {
    fetchMock
      .mockReturnValueOnce(reply("OK"))
      .mockReturnValueOnce(reply(1, 1))
      .mockReturnValueOnce(reply("1", 0, null));

    await POST(request({ "x-forwarded-for": "203.0.113.7" }));

    expect(JSON.stringify(sentCommands(0))).not.toContain("203.0.113.7");
    expect(String(sentCommands(0)[0][1])).toMatch(/^seen:[0-9a-f]{64}$/);
  });

  it("does not count the same visitor twice in a day", async () => {
    fetchMock
      .mockReturnValueOnce(reply(null))
      .mockReturnValueOnce(reply("43", 6, "2026-11-06"));

    const response = await POST(request());

    expect((await response.json()).visitors).toBe(43);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentCommands(0)[0][0]).toBe("SET");
  });

  it("ignores crawlers and requests without a user agent", async () => {
    fetchMock.mockReturnValue(reply("10", 2, "2026-11-06"));

    await POST(request({ "user-agent": "Googlebot/2.1" }));
    await POST(request({ "user-agent": "" }));

    for (let call = 0; call < fetchMock.mock.calls.length; call += 1) {
      expect(sentCommands(call).map(([name]) => name)).not.toContain("INCR");
    }
  });

  it("ignores a malformed country header", async () => {
    fetchMock
      .mockReturnValueOnce(reply("OK"))
      .mockReturnValueOnce(reply(1, 1))
      .mockReturnValueOnce(reply("1", 0, null));

    await POST(request({ "x-vercel-ip-country": "<script>" }));

    expect(sentCommands(1).map(([name]) => name)).toEqual(["INCR", "SETNX"]);
  });

  it("answers 502 when Redis fails", async () => {
    fetchMock.mockReturnValueOnce(Promise.resolve({ ok: false, status: 500 }));
    expect((await GET()).status).toBe(502);

    fetchMock.mockRejectedValueOnce(new Error("network"));
    expect((await POST(request())).status).toBe(502);
  });
});
