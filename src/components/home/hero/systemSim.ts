// A tiny model of a request path (client → gateway → service → cache → db)
// that the hero panel animates. It is pure so it can be tested: randomness and
// the clock are passed in rather than read.

export type Service = "a" | "b" | "cache" | "db";
export type Failed = Record<Service, boolean>;
export type Route = "a" | "b" | null;

export interface Result {
  ok: boolean;
  status: number;
  ms: number;
  source: "cache" | "db" | "none";
  path: string;
  note: string | null;
}

interface Tick {
  ok: number;
  fail: number;
  hits: number;
}

export interface SimState {
  failed: Failed;
  lastRoute: Route;
  served: number;
  errors: number;
  p99: number;
  rps: number;
  samples: number[];
  recent: Tick[];
  log: string[];
}

const PATHS = ["/orders", "/orders/42", "/users/me", "/products"] as const;
const REQUESTS_PER_TICK = 4;
const ROLLS_PER_TICK = REQUESTS_PER_TICK * 3 + 1;
const CACHE_HIT_RATE = 0.9;
const LOG_LINES = 7;
const SAMPLES = 40;
const WINDOW = 20;

export const rollsNeeded = ROLLS_PER_TICK;

export const pickRoute = (failed: Failed): Route =>
  !failed.a ? "a" : !failed.b ? "b" : null;

export function handleRequest(
  failed: Failed,
  [pathRoll, speedRoll, cacheRoll]: [number, number, number],
  retry: boolean
): Result {
  const path = PATHS[Math.floor(pathRoll * PATHS.length)];
  const route = pickRoute(failed);

  if (!route) {
    return {
      ok: false,
      status: 503,
      ms: 3,
      source: "none",
      path,
      note: "no healthy upstream",
    };
  }

  const service = (route === "a" ? 8 : 12) + speedRoll * 6 + (retry ? 180 : 0);
  const note = retry ? "retried" : null;

  if (!failed.cache && cacheRoll < CACHE_HIT_RATE) {
    return {
      ok: true,
      status: 200,
      ms: Math.round(service + 2 + speedRoll * 3),
      source: "cache",
      path,
      note,
    };
  }

  if (failed.db) {
    return {
      ok: false,
      status: 503,
      ms: Math.round(service + 40),
      source: "db",
      path,
      note: "unreachable",
    };
  }

  // Without the cache every read lands on the database, which slows it down.
  const load = failed.cache ? 14 : 0;
  return {
    ok: true,
    status: 200,
    ms: Math.round(service + 12 + cacheRoll * 8 + load),
    source: "db",
    path,
    note,
  };
}

const clock = (date: Date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");

function describe(result: Result, now: Date) {
  const source = result.source === "none" ? "-" : result.source;
  const line = `${clock(now)}  ${result.status}  ${result.path.padEnd(10)} ${String(
    result.ms
  ).padStart(3)}ms  ${source}`;
  return result.note ? `${line}  ${result.note}` : line;
}

const event = (now: Date, text: string) => `${clock(now)}  ${text}`;

export function step(state: SimState, rolls: number[], now: Date): SimState {
  const route = pickRoute(state.failed);
  const retry = route !== state.lastRoute;

  const results = Array.from({ length: REQUESTS_PER_TICK }, (_, index) =>
    handleRequest(
      state.failed,
      [rolls[index * 3], rolls[index * 3 + 1], rolls[index * 3 + 2]],
      retry && index === 0
    )
  );

  const succeeded = results.filter((result) => result.ok);
  const hits = succeeded.filter((result) => result.source === "cache").length;
  const p99 = succeeded.length
    ? Math.max(...succeeded.map((result) => result.ms))
    : state.p99;
  const notable =
    results.find((result) => !result.ok) ??
    results.find((result) => result.note) ??
    results[0];

  return {
    ...state,
    lastRoute: route,
    served: state.served + succeeded.length,
    errors: state.errors + results.length - succeeded.length,
    p99,
    rps: 112 + Math.round(rolls[ROLLS_PER_TICK - 1] * 40),
    samples: [...state.samples, p99].slice(-SAMPLES),
    recent: [
      ...state.recent,
      {
        ok: succeeded.length,
        fail: results.length - succeeded.length,
        hits,
      },
    ].slice(-WINDOW),
    log: [...state.log, describe(notable, now)].slice(-LOG_LINES),
  };
}

export function toggle(
  state: SimState,
  service: Service,
  down: boolean,
  now: Date
): SimState {
  if (state.failed[service] === down) return state;

  const failed = { ...state.failed, [service]: down };
  const route = pickRoute(failed);
  const name =
    service === "a" || service === "b" ? `service-${service}` : service;
  const lines: string[] = [];

  if (service === "a" || service === "b") {
    lines.push(event(now, `${name}  ${down ? "timeout" : "healthy"}`));
    if (route) {
      lines.push(
        event(
          now,
          down
            ? `gateway  retry → service-${route}`
            : `gateway → service-${route}  ok`
        )
      );
    } else {
      lines.push(event(now, "gateway  503  no healthy upstream"));
    }
  } else if (service === "cache") {
    lines.push(
      event(now, down ? "cache  unreachable  reads go to db" : "cache  healthy")
    );
  } else {
    lines.push(
      event(
        now,
        down ? "db  unreachable  circuit open" : "db  healthy  circuit closed"
      )
    );
  }

  return { ...state, failed, log: [...state.log, ...lines].slice(-LOG_LINES) };
}

export function hitRate(state: SimState) {
  const ok = state.recent.reduce((sum, tick) => sum + tick.ok, 0);
  const hits = state.recent.reduce((sum, tick) => sum + tick.hits, 0);
  return ok ? Math.round((hits / ok) * 100) : 0;
}

export function errorRate(state: SimState) {
  const ok = state.recent.reduce((sum, tick) => sum + tick.ok, 0);
  const fail = state.recent.reduce((sum, tick) => sum + tick.fail, 0);
  return ok + fail ? Math.round((fail / (ok + fail)) * 1000) / 10 : 0;
}

// A small seeded generator, so the panel's first paint is the same every time.
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function initialState(failed: Failed, now: Date): SimState {
  let state: SimState = {
    failed,
    lastRoute: pickRoute(failed),
    served: 1204,
    errors: 0,
    p99: 14,
    rps: 124,
    samples: [],
    recent: [],
    log: [],
  };

  const random = seeded(7);
  for (let index = 5; index >= 0; index -= 1) {
    const at = new Date(now.getTime() - index * 500);
    state = step(state, Array.from({ length: ROLLS_PER_TICK }, random), at);
  }

  return state;
}
