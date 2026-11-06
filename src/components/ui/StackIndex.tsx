import { useEffect, useState } from "react";
import type { SkillTier } from "../../data/skills";
import type { StackGroupData } from "../../data/types";
import ThemedImage from "./ThemedImage";

type Align = "left" | "center" | "right";

const TIER_TEXT: Record<SkillTier, string> = {
  core: "text-fg",
  applied: "text-muted",
  exploration: "text-faint",
};

const ALIGN_CLASS: Record<Align, string> = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
};

const POPOVER_HALF_WIDTH = 120;

function StackRow({ label, blurb, items }: StackGroupData) {
  const [active, setActive] = useState<string | null>(null);
  const [align, setAlign] = useState<Align>("center");

  useEffect(() => {
    if (active === null) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-stack-item]")) {
        setActive(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [active]);

  const activate = (name: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    if (center < POPOVER_HALF_WIDTH + 8) setAlign("left");
    else if (window.innerWidth - center < POPOVER_HALF_WIDTH + 8)
      setAlign("right");
    else setAlign("center");

    setActive(name);
  };

  return (
    <div className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-3">
        <h4 className="flex items-baseline gap-3 eyebrow md:pt-3">
          {label}
          <span className="tabular-nums opacity-70 md:hidden">
            {items.length}
          </span>
        </h4>
        <p className="mt-3 hidden text-5xl leading-none font-extralight tracking-tight text-faint tabular-nums md:block">
          {String(items.length).padStart(2, "0")}
        </p>
        {blurb && (
          <p className="mt-4 hidden max-w-60 text-xs leading-[1.7] text-faint md:block">
            {blurb}
          </p>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-6 sm:grid sm:content-start sm:grid-cols-3 sm:gap-x-0 md:col-span-9 xl:grid-cols-5">
        {items.map((item) => {
          const isActive = active === item.name;

          return (
            <li
              key={item.name}
              data-stack-item
              className={`relative ${isActive ? "z-30" : ""}`}
            >
              <button
                type="button"
                aria-label={
                  item.meta ? `${item.name}, ${item.meta}` : item.name
                }
                aria-expanded={isActive}
                onMouseEnter={(event) =>
                  activate(item.name, event.currentTarget)
                }
                onMouseLeave={() => setActive(null)}
                onFocus={(event) => activate(item.name, event.currentTarget)}
                onBlur={() => setActive(null)}
                onClick={(event) => activate(item.name, event.currentTarget)}
                className={`flex w-full cursor-pointer items-center gap-3 py-2.5 text-sm outline-none transition-colors duration-200 hover:text-fg focus-visible:text-fg ${
                  isActive
                    ? "text-fg"
                    : item.tier
                      ? TIER_TEXT[item.tier]
                      : "text-muted"
                }`}
              >
                <ThemedImage
                  light={item.logo}
                  dark={item.darkLogo}
                  alt=""
                  className="size-5"
                />
                <span className="truncate">{item.name}</span>
              </button>

              {isActive && (item.meta || item.tags) && (
                <div
                  role="tooltip"
                  className={`pointer-events-none absolute bottom-full z-30 mb-1 w-60 border border-line-strong bg-surface p-3 text-left shadow-lg ${ALIGN_CLASS[align]}`}
                >
                  <p className="text-sm text-fg">{item.name}</p>
                  {item.meta && (
                    <p className="mt-1 text-xs text-muted">{item.meta}</p>
                  )}
                  {item.tags && (
                    <p className="mt-2 text-xs leading-[1.6] text-faint">
                      {item.tagsLabel ? `${item.tagsLabel}: ` : ""}
                      {item.tags.join(" · ")}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StackIndex({ groups }: { groups: StackGroupData[] }) {
  return (
    <div className="border-t border-line">
      {groups.map((group) => (
        <StackRow key={group.label} {...group} />
      ))}
    </div>
  );
}
