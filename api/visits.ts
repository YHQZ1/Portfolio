/// <reference types="node" />

// Anonymous visit counter. One self-contained file on purpose: Vercel runs
// functions as native ES modules, where extensionless relative imports fail.
//
// Storage is Upstash Redis through its REST API (added from the Vercel
// Marketplace, which sets the environment variables below). Without it the
// endpoint answers 503 and the site simply hides the counter.
//
// Privacy: no cookies and no raw IPs are stored. A visitor is counted once per
// day, identified only by a hash of IP + user agent + date that expires after
// a day, so it cannot be used to follow anyone around.

const KEYS = {
  total: "visitors:total",
  countries: "visitors:countries",
  since: "visitors:since",
} as const;

const DAY_SECONDS = 25 * 60 * 60;
const BOT =
  /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|curl|wget|python-requests|facebookexternalhit/i;
const COUNTRY = /^[A-Z]{2}$/;

interface Credentials {
  url: string;
  token: string;
}

type Command = (string | number)[];

function credentials(): Credentials | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(creds: Credentials, commands: Command[]) {
  const response = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${creds.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`redis ${response.status}`);

  const results = (await response.json()) as {
    result?: unknown;
    error?: string;
  }[];
  if (results.some((entry) => entry.error)) throw new Error("redis error");
  return results.map((entry) => entry.result);
}

async function readStats(creds: Credentials) {
  const [total, countries, since] = await redis(creds, [
    ["GET", KEYS.total],
    ["SCARD", KEYS.countries],
    ["GET", KEYS.since],
  ]);

  return {
    visitors: Number(total ?? 0),
    countries: Number(countries ?? 0),
    since: typeof since === "string" ? since : null,
  };
}

async function fingerprint(request: Request, day: string) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const agent = request.headers.get("user-agent") ?? "";
  const data = new TextEncoder().encode(`${ip}|${agent}|${day}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

const json = (body: Record<string, unknown>, status = 200, cache = false) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": cache
        ? "public, s-maxage=60, stale-while-revalidate=300"
        : "no-store",
    },
  });

export async function GET() {
  const creds = credentials();
  if (!creds) return json({ error: "not_configured" }, 503);

  try {
    return json(await readStats(creds), 200, true);
  } catch {
    return json({ error: "unavailable" }, 502);
  }
}

export async function POST(request: Request) {
  const creds = credentials();
  if (!creds) return json({ error: "not_configured" }, 503);

  try {
    const agent = request.headers.get("user-agent") ?? "";

    if (agent && !BOT.test(agent)) {
      const now = new Date();
      const day = now.toISOString().slice(0, 10);
      const [fresh] = await redis(creds, [
        [
          "SET",
          `seen:${await fingerprint(request, day)}`,
          "1",
          "NX",
          "EX",
          DAY_SECONDS,
        ],
      ]);

      if (fresh === "OK") {
        const country = request.headers.get("x-vercel-ip-country") ?? "";
        const commands: Command[] = [
          ["INCR", KEYS.total],
          ["SETNX", KEYS.since, day],
        ];
        if (COUNTRY.test(country))
          commands.push(["SADD", KEYS.countries, country]);
        await redis(creds, commands);
      }
    }

    return json(await readStats(creds));
  } catch {
    return json({ error: "unavailable" }, 502);
  }
}
