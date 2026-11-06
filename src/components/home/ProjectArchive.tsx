import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import type { Project } from "../../data/projects";
import { getLogo } from "../../data/logos";
import CodeLink from "../ui/CodeLink";
import Collapse from "../ui/Collapse";
import TextLink from "../ui/TextLink";
import ThemedImage from "../ui/ThemedImage";

// Each project borrows its own brand colour, taken from the project itself or
// the technology it is built on. Sandboxed stays neutral, like the product.
const ACCENTS: Record<string, string> = {
  trixie: "#d97757", // Claude
  bitlink: "#76b900", // BitLink green
  sandboxed: "#8a8a8a", // monochrome product
  overclock: "#ffd23f", // Overclock yellow
  vouch: "#3395ff", // Razorpay blue
  bumper: "#c8501f", // Rust
};

const ROW_GRID = "grid grid-cols-[minmax(0,1fr)] gap-x-10 md:grid-cols-12";

function ArchiveRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = `archive-${project.slug}`;
  const accent = ACCENTS[project.slug] ?? "currentColor";

  return (
    <li
      className="group relative border-b border-line"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-0.5 w-12 bg-(--accent) md:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-0.5 md:block origin-top scale-y-0 bg-(--accent) transition-transform duration-300 group-hover:scale-y-100"
      />
      <div className={`${ROW_GRID} gap-y-6 py-10 md:items-start md:pl-5`}>
        <div className="md:col-span-4">
          <h3 className="text-3xl leading-[1.1] font-extralight tracking-tight text-fg sm:text-4xl">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
              className="cursor-pointer text-left underline-offset-4 outline-none focus-visible:underline after:absolute after:inset-0"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                {project.title}
              </span>
            </button>
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5 md:pt-2">
          <Collapse open={!open}>
            <p className="text-sm leading-[1.8] text-muted">
              {project.summary}
            </p>
          </Collapse>
          <Collapse open={open} id={panelId}>
            <div>
              <p className="text-sm leading-[1.8] text-muted">
                {project.description}
              </p>
              {project.live && (
                <div className="relative z-10 mt-6">
                  <TextLink href={project.live}>Live</TextLink>
                </div>
              )}
            </div>
          </Collapse>

          {project.stack && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {project.stack.map((name) => {
                const source = getLogo(name);
                if (!source) return null;

                return (
                  <li
                    key={name}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <ThemedImage
                      light={source.logo}
                      dark={source.darkLogo}
                      alt=""
                      className="size-4"
                    />
                    {name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end md:justify-start md:gap-6 md:text-right">
          {project.stat && (
            <p>
              <span className="block text-4xl leading-none font-extralight tracking-tight text-[color-mix(in_oklab,var(--accent)_75%,var(--color-fg))] tabular-nums sm:text-5xl">
                {project.stat.value}
              </span>
              <span className="mt-2 block max-w-52 text-xs leading-normal text-faint md:ml-auto">
                {project.stat.label}
              </span>
            </p>
          )}
          <div className="flex items-center gap-5">
            <CodeLink
              href={project.github}
              label={`${project.title} source code on GitHub`}
              className="relative z-10"
            />
            <span aria-hidden="true" className="text-fg">
              {open ? <FiMinus /> : <FiPlus />}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function ProjectArchive({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div
        aria-hidden="true"
        className={`${ROW_GRID} hidden border-t border-line py-3 md:grid md:pl-5`}
      >
        <span className="eyebrow md:col-span-4">Project</span>
        <span className="eyebrow md:col-span-5">Overview</span>
        <span className="eyebrow text-right md:col-span-3">Result</span>
      </div>
      <ul className="border-t border-line">
        {projects.map((project) => (
          <ArchiveRow key={project.slug} project={project} />
        ))}
      </ul>
    </div>
  );
}
