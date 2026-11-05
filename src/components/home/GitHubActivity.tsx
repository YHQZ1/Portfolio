import { useMemo, useState, type PointerEvent, type ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import {
  computeStats,
  useContributions,
  type ContributionDay,
} from "../../hooks/useContributions";
import { useSound } from "../../context/useSound";
import { GITHUB_USERNAME } from "../../data/site";
import TextLink from "../ui/TextLink";

const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const PHONE_WEEKS = 18;

const LEVEL_CLASS = [
  "bg-fg/[0.08]",
  "bg-fg/30",
  "bg-fg/45",
  "bg-fg/70",
  "bg-fg",
] as const;

const parseDay = (date: string) => new Date(`${date}T00:00:00`);

function describeDay(day: ContributionDay) {
  const date = parseDay(day.date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const count = day.count === 0 ? "No" : day.count;
  return `${count} contribution${day.count === 1 ? "" : "s"} · ${date}`;
}

function groupByWeek(days: ContributionDay[]) {
  const weeks: (ContributionDay | null)[][] = [];
  let current: (ContributionDay | null)[] = [];

  days.forEach((day, index) => {
    const weekday = parseDay(day.date).getDay();
    if (index === 0) current = Array<null>(weekday).fill(null);
    current.push(day);
    if (weekday === 6) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length > 0) weeks.push(current);

  return weeks;
}

function Grid({ days }: { days: ContributionDay[] }) {
  const weeks = useMemo(() => groupByWeek(days), [days]);
  const { play } = useSound();
  const [active, setActive] = useState<ContributionDay | null>(null);
  const select = (day: ContributionDay) => {
    setActive(day);
    play("tick", { level: day.level });
  };
  const hiddenOnPhone = Math.max(0, weeks.length - PHONE_WEEKS);
  const byDate = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days]
  );

  // Fingers cover several small cells at once, so dragging across the grid
  // reads out whichever day is under the finger.
  const scrub = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const date =
      target instanceof HTMLElement ? target.dataset.date : undefined;
    const day = date ? byDate.get(date) : undefined;
    if (day && day.date !== active?.date) select(day);
  };

  return (
    <div>
      <div className="flex touch-pan-y gap-[3px]" onPointerMove={scrub}>
        {weeks.map((week, weekIndex) => {
          const first = week.find((day) => day !== null);
          const previous = weeks[weekIndex - 1]?.find((day) => day !== null);
          const startsMonth =
            first &&
            weekIndex < weeks.length - 2 &&
            (!previous || previous.date.slice(5, 7) !== first.date.slice(5, 7));

          return (
            <div
              key={weekIndex}
              className={`relative min-w-0 flex-1 pt-6 ${
                weekIndex < hiddenOnPhone ? "max-sm:hidden" : ""
              }`}
            >
              {startsMonth && (
                <span className="absolute top-0 left-0 text-xs whitespace-nowrap text-faint">
                  {parseDay(first.date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              )}

              <div className="grid gap-[3px]">
                {Array.from({ length: 7 }, (_, row) => {
                  const day = week[row];
                  if (!day) return <span key={row} className="aspect-square" />;

                  return (
                    <button
                      key={row}
                      type="button"
                      aria-label={describeDay(day)}
                      data-date={day.date}
                      onMouseEnter={() => select(day)}
                      onFocus={() => select(day)}
                      onClick={() => select(day)}
                      className={`aspect-square w-full cursor-default outline-none transition-colors hover:bg-fg focus-visible:bg-fg ${
                        LEVEL_CLASS[day.level]
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-faint">
        <span aria-live="polite" className="min-h-4 tabular-nums">
          {active ? (
            describeDay(active)
          ) : (
            <>
              <span className="pointer-coarse:hidden">
                Hover a day for details
              </span>
              <span className="hidden pointer-coarse:inline">
                Touch or drag across the days
              </span>
            </>
          )}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVEL_CLASS.map((level) => (
            <span key={level} className={`size-2.5 ${level}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="text-4xl font-extralight tracking-tight text-fg tabular-nums sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 eyebrow">{label}</p>
    </div>
  );
}

function ProfileLink() {
  return (
    <TextLink href={PROFILE_URL}>
      <span className="inline-flex items-center gap-2">
        <FaGithub /> View on GitHub
      </span>
    </TextLink>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-72 items-center border-t border-line text-sm text-faint">
      {children}
    </div>
  );
}

export default function GitHubActivity() {
  const { days, failed } = useContributions(GITHUB_USERNAME);
  const stats = useMemo(() => (days ? computeStats(days) : null), [days]);

  if (!days || !stats) {
    return (
      <div>
        <Placeholder>
          {failed ? "Activity is unavailable right now." : "Loading activity…"}
        </Placeholder>
        <div className="mt-8">
          <ProfileLink />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        <Stat value={stats.total.toLocaleString()} label="Contributions" />
        <Stat value={String(stats.activeDays)} label="Days active" />
        <Stat value={`${stats.longestStreak} days`} label="Longest streak" />
        <Stat
          value={stats.busiestMonth.label.split(" ")[0]}
          label={`Busiest month · ${stats.busiestMonth.count}`}
        />
      </div>

      <Grid days={days} />

      <div className="mt-8">
        <ProfileLink />
      </div>
    </div>
  );
}
