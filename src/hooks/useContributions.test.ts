import { describe, expect, it } from "vitest";
import { computeStats, type ContributionDay } from "./useContributions";

const day = (date: string, count: number): ContributionDay => ({
  date,
  count,
  level: count === 0 ? 0 : 1,
});

describe("computeStats", () => {
  it("returns zeros for no data", () => {
    const stats = computeStats([]);

    expect(stats.total).toBe(0);
    expect(stats.activeDays).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.busiestMonth.count).toBe(0);
  });

  it("totals contributions and counts active days", () => {
    const stats = computeStats([
      day("2026-03-01", 2),
      day("2026-03-02", 0),
      day("2026-03-03", 5),
    ]);

    expect(stats.total).toBe(7);
    expect(stats.activeDays).toBe(2);
  });

  it("finds the longest streak anywhere in the range", () => {
    const stats = computeStats([
      day("2026-03-01", 1),
      day("2026-03-02", 1),
      day("2026-03-03", 1),
      day("2026-03-04", 0),
      day("2026-03-05", 1),
    ]);

    expect(stats.longestStreak).toBe(3);
    expect(stats.currentStreak).toBe(1);
  });

  it("does not break the current streak when today has no activity yet", () => {
    const stats = computeStats([
      day("2026-03-01", 1),
      day("2026-03-02", 4),
      day("2026-03-03", 0),
    ]);

    expect(stats.currentStreak).toBe(2);
  });

  it("ends the current streak after a gap of more than today", () => {
    const stats = computeStats([
      day("2026-03-01", 1),
      day("2026-03-02", 0),
      day("2026-03-03", 0),
    ]);

    expect(stats.currentStreak).toBe(0);
  });

  it("picks the busiest month by total contributions", () => {
    const stats = computeStats([
      day("2026-01-10", 3),
      day("2026-02-01", 4),
      day("2026-02-02", 6),
      day("2026-03-05", 2),
    ]);

    expect(stats.busiestMonth.count).toBe(10);
    expect(stats.busiestMonth.label).toBe("February 2026");
  });
});
