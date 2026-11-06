import { describe, expect, it } from "vitest";
import {
  errorRate,
  handleRequest,
  hitRate,
  initialState,
  pickRoute,
  rollsNeeded,
  step,
  toggle,
  type Failed,
} from "./systemSim";

const HEALTHY: Failed = { a: false, b: false, cache: false, db: false };
const NOW = new Date("2026-11-06T18:00:00");

describe("pickRoute", () => {
  it("prefers service A, fails over to B and gives up when both are down", () => {
    expect(pickRoute(HEALTHY)).toBe("a");
    expect(pickRoute({ ...HEALTHY, a: true })).toBe("b");
    expect(pickRoute({ ...HEALTHY, a: true, b: true })).toBeNull();
  });
});

describe("handleRequest", () => {
  it("serves cache hits quickly and misses from the database", () => {
    const hit = handleRequest(HEALTHY, [0, 0.5, 0.1], false);
    const miss = handleRequest(HEALTHY, [0, 0.5, 0.95], false);

    expect(hit).toMatchObject({ ok: true, source: "cache" });
    expect(miss).toMatchObject({ ok: true, source: "db" });
    expect(hit.ms).toBeLessThan(miss.ms);
  });

  it("answers 503 when no service is healthy", () => {
    const result = handleRequest(
      { ...HEALTHY, a: true, b: true },
      [0, 0, 0],
      false
    );

    expect(result).toMatchObject({ ok: false, status: 503, source: "none" });
  });

  it("lets the cache absorb a database outage but fails the misses", () => {
    const down = { ...HEALTHY, db: true };

    expect(handleRequest(down, [0, 0, 0.1], false).ok).toBe(true);
    expect(handleRequest(down, [0, 0, 0.95], false)).toMatchObject({
      ok: false,
      status: 503,
      note: "unreachable",
    });
  });

  it("is slower without the cache and slower on the first request after a failover", () => {
    const normal = handleRequest(HEALTHY, [0, 0.5, 0.95], false);
    const noCache = handleRequest(
      { ...HEALTHY, cache: true },
      [0, 0.5, 0.95],
      false
    );
    const retried = handleRequest(HEALTHY, [0, 0.5, 0.95], true);

    expect(noCache.ms).toBeGreaterThan(normal.ms);
    expect(retried.ms).toBeGreaterThan(normal.ms + 150);
    expect(retried.note).toBe("retried");
  });
});

describe("simulation", () => {
  const rolls = Array<number>(rollsNeeded).fill(0.5);

  it("starts with history so the panel is never empty", () => {
    const state = initialState(HEALTHY, NOW);

    expect(state.log.length).toBeGreaterThan(3);
    expect(state.samples.length).toBeGreaterThan(3);
    expect(initialState(HEALTHY, NOW)).toEqual(state);
  });

  it("counts served requests and errors as it ticks", () => {
    const healthy = step(initialState(HEALTHY, NOW), rolls, NOW);
    expect(healthy.errors).toBe(0);
    expect(healthy.served).toBeGreaterThan(1204);

    const broken = initialState({ ...HEALTHY, a: true, b: true }, NOW);
    const after = step(broken, rolls, NOW);
    expect(after.errors).toBe(broken.errors + 4);
    expect(errorRate(after)).toBeGreaterThan(0);
  });

  it("keeps the log and samples bounded", () => {
    let state = initialState(HEALTHY, NOW);
    for (let index = 0; index < 100; index += 1)
      state = step(state, rolls, NOW);

    expect(state.log.length).toBeLessThanOrEqual(7);
    expect(state.samples.length).toBeLessThanOrEqual(40);
  });

  it("reports a cache hit rate only while the cache is serving", () => {
    let state = initialState(HEALTHY, NOW);
    for (let index = 0; index < 20; index += 1) {
      state = step(state, Array<number>(rollsNeeded).fill(0.1), NOW);
    }
    expect(hitRate(state)).toBeGreaterThan(80);
  });

  it("logs an explanation when a component fails and recovers", () => {
    const down = toggle(initialState(HEALTHY, NOW), "a", true, NOW);
    expect(down.failed.a).toBe(true);
    expect(down.log.at(-2)).toContain("service-a  timeout");
    expect(down.log.at(-1)).toContain("retry → service-b");

    const back = toggle(down, "a", false, NOW);
    expect(back.failed.a).toBe(false);
    expect(back.log.at(-2)).toContain("service-a  healthy");

    expect(
      toggle(initialState(HEALTHY, NOW), "db", true, NOW).log.at(-1)
    ).toContain("circuit open");
    expect(
      toggle(initialState(HEALTHY, NOW), "cache", true, NOW).log.at(-1)
    ).toContain("reads go to db");
  });

  it("ignores a toggle that changes nothing", () => {
    const state = initialState(HEALTHY, NOW);
    expect(toggle(state, "a", false, NOW)).toBe(state);
  });
});
