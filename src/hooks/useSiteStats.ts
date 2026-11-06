import { useEffect, useState } from "react";

export interface SiteStats {
  visitors: number;
  countries: number;
  since: string | null;
}

const STORAGE_KEY = "visit-registered";
const today = () => new Date().toISOString().slice(0, 10);

function remembered() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === today();
  } catch {
    return false;
  }
}

function remember() {
  try {
    window.localStorage.setItem(STORAGE_KEY, today());
  } catch {
    // Private windows can refuse storage; the server de-duplicates anyway.
  }
}

function isStats(value: unknown): value is SiteStats {
  const stats = value as Partial<SiteStats> | null;
  return (
    typeof stats?.visitors === "number" && typeof stats.countries === "number"
  );
}

// Registers today's visit once per browser and returns the running totals.
// Stays null (so nothing is shown) whenever the counter is unavailable.
export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const register = !remembered();

    fetch("/api/visits", {
      method: register ? "POST" : "GET",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (!isStats(data)) return;
        if (register) remember();
        setStats(data);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return stats;
}
