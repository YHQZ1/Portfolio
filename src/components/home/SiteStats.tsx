import { useSiteStats } from "../../hooks/useSiteStats";

const formatSince = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

export default function SiteStats() {
  const stats = useSiteStats();
  if (!stats) return null;

  const parts = [
    `${stats.visitors.toLocaleString("en-US")} ${
      stats.visitors === 1 ? "visitor" : "visitors"
    }`,
    stats.countries > 1 ? `${stats.countries} countries` : null,
    stats.since ? `since ${formatSince(stats.since)}` : null,
  ].filter(Boolean);

  return (
    <p className="pb-6 text-center text-xs tracking-wide text-faint tabular-nums">
      {parts.join(" · ")}
    </p>
  );
}
