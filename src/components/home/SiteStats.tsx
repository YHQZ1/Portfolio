import { useSiteStats } from "../../hooks/useSiteStats";

const formatSince = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

// One more entry for the hero's facts row. Renders nothing until the counter
// has answered, and stays hidden if it is not available.
export default function SiteStats() {
  const stats = useSiteStats();
  if (!stats) return null;

  const detail = [
    stats.countries > 1 ? `${stats.countries} countries` : null,
    stats.since ? `since ${formatSince(stats.since)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <dt className="mb-2 eyebrow">Visitors</dt>
      <dd className="text-sm leading-[1.6] text-fg tabular-nums">
        {stats.visitors.toLocaleString("en-US")}
        {detail && <span className="mt-1 block text-muted">{detail}</span>}
      </dd>
    </div>
  );
}
