import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import type { Project } from "../../data/projects";
import CodeLink from "../ui/CodeLink";
import Collapse from "../ui/Collapse";
import TextLink from "../ui/TextLink";

function ArchiveRow({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `archive-${project.slug}`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="group relative border-b border-line">
      <div className="grid gap-x-8 gap-y-4 py-7 md:grid-cols-12 md:items-start">
        <span className="hidden pt-2 text-xs tracking-widest text-faint md:col-span-1 md:block">
          {number}
        </span>

        <div className="md:col-span-4">
          <h3 className="text-2xl font-extralight tracking-tight text-fg">
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
          <p className="mt-2 text-xs leading-[1.8] text-faint">
            {project.tags.join(" · ")}
          </p>
        </div>

        <div className="md:col-span-5">
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
                <div className="mt-6">
                  <TextLink href={project.live}>Live</TextLink>
                </div>
              )}
            </div>
          </Collapse>
        </div>

        <div className="flex items-center justify-between gap-6 md:col-span-2 md:justify-end">
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
    </li>
  );
}

export default function ProjectArchive({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-line">
      {projects.map((project, index) => (
        <ArchiveRow key={project.slug} project={project} index={index} />
      ))}
    </ul>
  );
}
