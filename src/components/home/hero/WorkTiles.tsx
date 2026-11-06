import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { projects } from "../../../data/projects";
import ProjectLogo from "../../ui/ProjectLogo";

const selected = projects.filter((project) => project.category === "selected");

export default function WorkTiles() {
  return (
    <div id="selected-work" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <h2 className="text-2xl leading-[1.2] font-extralight tracking-tight text-fg sm:text-3xl">
          Selected Work
          <sup className="ml-3 align-super text-sm font-normal tracking-widest text-faint">
            {String(selected.length).padStart(2, "0")}
          </sup>
        </h2>
        <p className="text-sm text-muted">
          Start here: my strongest projects, each with a full architecture
          write-up.
        </p>
      </div>

      <div className="group/tiles grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
        {selected.map((project, index) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            state={{ fromHome: true }}
            className="group/tile relative flex min-h-[230px] flex-col justify-between border-r border-b border-line p-5 outline-none transition-opacity duration-300 group-hover/tiles:not-hover:opacity-40 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-fg transition-transform duration-500 ease-out group-hover/tile:scale-x-100 group-focus-visible/tile:scale-x-100"
            />

            <div className="flex items-start justify-between">
              <span className="text-xs tracking-widest text-faint transition-colors duration-300 group-hover/tile:text-fg group-focus-visible/tile:text-fg">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-faint transition-colors duration-300 group-hover/tile:text-fg group-focus-visible/tile:text-fg">
                View
                <FiArrowRight className="transition-transform duration-300 group-hover/tile:translate-x-1 group-focus-visible/tile:translate-x-1" />
              </span>
            </div>

            {project.logo && (
              <ProjectLogo
                logo={project.logo}
                alt={`${project.title} logo`}
                className="size-14"
              />
            )}

            <div>
              <h3 className="text-xl leading-[1.25] font-extralight tracking-tight text-fg sm:text-2xl">
                {project.title}
              </h3>
              <p className="mt-2 text-xs text-faint">{project.tags[0]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
