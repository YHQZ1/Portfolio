import { useEffect, useState } from "react";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionStats {
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  busiestMonth: { label: string; count: number };
}

interface ContributionsResponse {
  contributions: ContributionDay[];
}

const ENDPOINT = (username: string) =>
  `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;

export function computeStats(days: ContributionDay[]): ContributionStats {
  let total = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let run = 0;
  const months = new Map<string, number>();

  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      activeDays += 1;
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
    const key = day.date.slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + day.count);
  }

  // today may not have any activity yet, so the streak ends at yesterday
  let currentStreak = 0;
  let index = days.length - 1;
  if (index >= 0 && days[index].count === 0) index -= 1;
  while (index >= 0 && days[index].count > 0) {
    currentStreak += 1;
    index -= 1;
  }

  let busiest = { key: "", count: 0 };
  for (const [key, count] of months) {
    if (count > busiest.count) busiest = { key, count };
  }
  const label = busiest.key
    ? new Date(`${busiest.key}-01T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "-";

  return {
    total,
    activeDays,
    longestStreak,
    currentStreak,
    busiestMonth: { label, count: busiest.count },
  };
}

export function useContributions(username: string) {
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(ENDPOINT(username), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<ContributionsResponse>;
      })
      .then((data) => setDays(data.contributions))
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setFailed(true);
      });

    return () => controller.abort();
  }, [username]);

  return { days, failed };
}
