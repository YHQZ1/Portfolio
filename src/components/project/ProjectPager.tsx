import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import type { Project } from "../../data/projects";

function PagerLink({
  project,
  direction,
}: {
  project: Project;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  // "Escrow Stock Exchange | ESX": show the short form quietly after the name
  // instead of letting the pipe wrap onto its own line.
  const [name, short] = project.title.split(" | ");

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group flex flex-col gap-4 border-line py-10 outline-none sm:py-14 ${
        isNext
          ? "items-end text-right md:border-l md:pl-10"
          : "items-start md:pr-10"
      }`}
    >
      <span className="flex items-center gap-2 eyebrow transition-colors duration-300 group-hover:text-fg group-focus-visible:text-fg">
        {!isNext && (
          <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
        )}
        {isNext ? "Next project" : "Previous project"}
        {isNext && (
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      <span className="text-3xl leading-[1.15] font-extralight tracking-tight text-balance text-fg sm:text-4xl lg:text-5xl">
        {name}
        {short && <span className="ml-3 text-faint">{short}</span>}
      </span>
      <span className="max-w-sm text-xs leading-[1.7] text-faint">
        {project.tags.join(" · ")}
      </span>
    </Link>
  );
}

export default function ProjectPager({
  previous,
  next,
}: {
  previous: Project;
  next: Project;
}) {
  return (
    <nav
      aria-label="More projects"
      className="grid border-t border-line md:grid-cols-2"
    >
      <PagerLink project={previous} direction="previous" />
      <PagerLink project={next} direction="next" />
    </nav>
  );
}
