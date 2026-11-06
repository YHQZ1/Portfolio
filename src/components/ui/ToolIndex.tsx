import type { SkillTier } from "../../data/skills";
import type { StackGroupData } from "../../data/types";
import ThemedImage from "./ThemedImage";

const TIER_TEXT: Record<SkillTier, string> = {
  core: "text-fg",
  applied: "text-muted",
  exploration: "text-faint",
};

const TIER_LABELS: { tier: SkillTier; label: string }[] = [
  { tier: "core", label: "Core" },
  { tier: "applied", label: "Applied" },
  { tier: "exploration", label: "Exploring" },
];

function ToolGroup({ label, blurb, items }: StackGroupData) {
  const tiers = TIER_LABELS.map((entry) => ({
    ...entry,
    count: items.filter((item) => item.tier === entry.tier).length,
  }));

  return (
    <section className="grid gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10">
      <div className="md:sticky md:top-28 md:col-span-3 md:self-start">
        <h4 className="flex items-baseline gap-3 eyebrow md:pt-1">
          {label}
          <span className="tabular-nums opacity-70 md:hidden">
            {items.length}
          </span>
        </h4>
        <p className="mt-5 hidden text-6xl leading-none font-extralight tracking-tight text-faint tabular-nums md:block">
          {String(items.length).padStart(2, "0")}
        </p>
        {blurb && (
          <p className="mt-5 max-w-60 text-xs leading-[1.7] text-faint">
            {blurb}
          </p>
        )}
        {tiers.some(({ count }) => count > 0) && (
          <ul className="mt-6 hidden max-w-60 space-y-2 border-t border-line pt-4 text-xs md:block">
            {tiers.map(({ tier, label: tierLabel, count }) =>
              count > 0 ? (
                <li
                  key={tier}
                  className={`flex items-center justify-between ${TIER_TEXT[tier]}`}
                >
                  {tierLabel}
                  <span className="tabular-nums">{count}</span>
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-6 min-[480px]:grid-cols-2 md:col-span-9 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.name} className="group border-t border-line pt-5">
            <div className="flex items-center gap-3">
              <ThemedImage
                light={item.logo}
                dark={item.darkLogo}
                alt=""
                className="size-6 transition-transform duration-300 group-hover:scale-110"
              />
              <span
                className={`text-base ${item.tier ? TIER_TEXT[item.tier] : "text-fg"}`}
              >
                {item.name}
              </span>
            </div>
            {item.meta && (
              <p className="mt-3 text-xs text-muted">{item.meta}</p>
            )}
            {item.tags && (
              <p
                className={`${item.meta ? "mt-1" : "mt-3"} text-xs leading-[1.8] text-faint`}
              >
                {item.tags.join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ToolIndex({ groups }: { groups: StackGroupData[] }) {
  return (
    <div className="border-t border-line">
      {groups.map((group) => (
        <ToolGroup key={group.label} {...group} />
      ))}
    </div>
  );
}
