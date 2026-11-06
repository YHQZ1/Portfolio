import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { usePageMeta, type PageMeta } from "../hooks/usePageMeta";
import { getProject, projects, type Project } from "../data/projects";
import { getLogo } from "../data/logos";
import ProjectPager from "../components/project/ProjectPager";
import ArchitectureDiagram from "../components/project/ArchitectureDiagram";
import CodeLink from "../components/ui/CodeLink";
import Container from "../components/ui/Container";
import ProjectLogo from "../components/ui/ProjectLogo";
import ScrollProgress from "../components/layout/ScrollProgress";
import StackIndex from "../components/ui/StackIndex";
import type { StackItem } from "../data/types";
import TextLink from "../components/ui/TextLink";
import NotFound from "./NotFound";

const FALLBACK_META: PageMeta = {
  title: "Page not found | Uttkarsh Ruparel",
  description: "The page you were looking for does not exist.",
  path: "/",
  noindex: true,
};

const selectedProjects = projects.filter(
  (project) => project.category === "selected"
);

const pad = (value: number) => String(value).padStart(2, "0");

function builtWith(project: Project): StackItem[] {
  const names = new Set<string>();
  project.architecture?.nodes.forEach((node) =>
    node.icons?.forEach((name) => names.add(name))
  );

  return [...names].flatMap((name) => {
    const source = getLogo(name);
    return source
      ? [{ name, logo: source.logo, darkLogo: source.darkLogo }]
      : [];
  });
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-sm leading-[1.7] text-fg">{children}</dd>
    </div>
  );
}

function HeroPanel({ project, index }: { project: Project; index: number }) {
  const stages = project.architecture?.stages;

  return (
    <div className="relative min-h-80 border border-line bg-surface lg:col-span-5 lg:min-h-0">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px bg-line"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-px bg-line"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {project.logo && (
          <span className="bg-surface p-5 sm:p-6">
            <ProjectLogo
              logo={project.logo}
              alt={`${project.title} logo`}
              className="size-24 sm:size-32"
            />
          </span>
        )}
      </div>

      <p className="absolute top-4 left-4 eyebrow sm:top-5 sm:left-5">
        Selected work
      </p>
      <p className="absolute top-4 right-4 text-xs tracking-widest text-faint tabular-nums sm:top-5 sm:right-5">
        {pad(index + 1)} / {pad(selectedProjects.length)}
      </p>

      {stages && (
        <p className="absolute right-4 bottom-4 left-4 bg-surface pt-2 text-xs leading-[1.7] text-faint sm:right-5 sm:bottom-5 sm:left-5">
          {stages.join(" → ")}
        </p>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const project = getProject(slug);
  const isSelected = project?.category === "selected";

  usePageMeta(
    project && isSelected
      ? {
          title: `${project.title} | Uttkarsh Ruparel`,
          description: project.summary,
          path: `/projects/${project.slug}`,
        }
      : FALLBACK_META
  );

  if (!project || !isSelected) return <NotFound />;

  const index = selectedProjects.findIndex((p) => p.slug === project.slug);
  const previous =
    selectedProjects[
      (index - 1 + selectedProjects.length) % selectedProjects.length
    ];
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  const stack = builtWith(project);
  const architecture = project.architecture;

  return (
    <main className="min-h-screen bg-bg">
      <ScrollProgress />

      <Container>
        <Link
          to="/"
          state={{ scrollTo: "selected-work" }}
          onClick={(event) => {
            // Arrived from the home page: behave like the browser's back button,
            // so the address stays clean and the scroll position is restored.
            if ((location.state as { fromHome?: boolean } | null)?.fromHome) {
              event.preventDefault();
              navigate(-1);
            }
          }}
          className="group tap-area mb-12 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg sm:mb-16"
        >
          <FiArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
          All projects
        </Link>

        <header className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col justify-between gap-12 lg:col-span-7">
            <div>
              <h1 className="text-5xl leading-[1.05] font-extralight tracking-tighter text-fg sm:text-6xl lg:text-7xl xl:text-8xl">
                {project.title}
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-[1.6] font-light text-muted sm:text-2xl">
                {project.summary}
              </p>
            </div>

            <dl className="border-t border-line">
              <Fact label="Focus">{project.tags.join(" · ")}</Fact>
              {architecture && (
                <Fact label="Scope">
                  {architecture.nodes.length} components across{" "}
                  {architecture.stages.length} stages
                </Fact>
              )}
              {project.status && <Fact label="Status">{project.status}</Fact>}
              <Fact label="Links">
                <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <CodeLink href={project.github} />
                  {project.live && (
                    <TextLink href={project.live}>Live</TextLink>
                  )}
                </span>
              </Fact>
            </dl>
          </div>

          <HeroPanel project={project} index={index} />
        </header>

        {architecture && (
          <section className="border-t border-line py-12 sm:py-16">
            <h2 className="mb-8 eyebrow">Architecture</h2>
            <p className="mb-3 text-xs text-faint sm:hidden">
              Swipe sideways to follow the whole flow.
            </p>
            <div className="overflow-x-auto border border-line p-4 sm:p-8">
              <ArchitectureDiagram
                architecture={architecture}
                title={project.title}
              />
            </div>
            {architecture.note && (
              <p className="mt-6 max-w-3xl text-sm leading-[1.8] text-muted">
                {architecture.note}
              </p>
            )}
          </section>
        )}

        <section className="grid gap-6 border-t border-line py-12 sm:py-16 md:grid-cols-12 md:gap-10">
          <h2 className="eyebrow md:col-span-3">Overview</h2>
          <p className="max-w-3xl text-xl leading-[1.8] font-light text-fg/90 sm:text-2xl sm:leading-[1.7] md:col-span-9">
            {project.description}
          </p>
        </section>

        {project.highlights && (
          <section className="border-t border-line py-12 sm:py-16">
            <h2 className="mb-10 eyebrow">Highlights</h2>
            <ol className="grid md:grid-cols-2">
              {project.highlights.map((highlight, highlightIndex) => (
                <li
                  key={highlight}
                  className="group border-t border-line py-8 first:border-t-0 md:py-10 md:odd:pr-12 md:even:border-l md:even:pl-12 md:[&:nth-child(-n+2)]:border-t-0 md:[&:nth-child(-n+2)]:pt-0"
                >
                  <span className="block text-5xl font-extralight tracking-tight text-faint tabular-nums transition-colors duration-300 group-hover:text-fg">
                    {pad(highlightIndex + 1)}
                  </span>
                  <p className="mt-6 text-base leading-[1.9] text-muted">
                    {highlight}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {stack.length > 0 && (
          <section className="pb-16 sm:pb-24">
            <StackIndex groups={[{ label: "Built with", items: stack }]} />
          </section>
        )}

        <ProjectPager previous={previous} next={next} />
      </Container>
    </main>
  );
}
