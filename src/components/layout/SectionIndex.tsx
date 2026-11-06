import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

// Which section the reader is in: the last one whose top has passed roughly
// the upper third of the viewport.
function currentSection(sections: Section[]) {
  const line = window.innerHeight * 0.35;
  let current = "";

  for (const { id } of sections) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top <= line) current = id;
  }

  return current;
}

export default function SectionIndex({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(currentSection(sections)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 right-2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul>
        {sections.map(({ id, label }) => {
          const isActive = active === id;

          return (
            <li key={id}>
              <button
                type="button"
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                onClick={() =>
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative flex w-9 cursor-pointer items-center justify-end py-2.5 pr-1 outline-none"
              >
                <span
                  className={`absolute right-full mr-2 border border-line bg-bg/95 px-2.5 py-1 text-xs whitespace-nowrap backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    isActive ? "text-fg" : "text-muted"
                  } opacity-0`}
                >
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-300 group-hover:w-6 group-hover:bg-fg group-focus-visible:w-6 group-focus-visible:bg-fg ${
                    isActive ? "w-6 bg-fg" : "w-3 bg-line-strong"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
