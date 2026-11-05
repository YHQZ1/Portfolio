import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageMeta, type PageMeta } from "../hooks/usePageMeta";
import { projects } from "../data/projects";
import { skillGroups, toolGroups } from "../data/stackGroups";
import CommandPalette from "../components/layout/CommandPalette";
import Container from "../components/ui/Container";
import GitHubActivity from "../components/home/GitHubActivity";
import Hero from "../components/home/hero/Hero";
import ProjectArchive from "../components/home/ProjectArchive";
import ScrollProgress from "../components/layout/ScrollProgress";
import SectionHeading from "../components/ui/SectionHeading";
import ShortcutHint from "../components/layout/ShortcutHint";
import StackIndex from "../components/ui/StackIndex";

const PAGE_META: PageMeta = {
  title: "Uttkarsh Ruparel | Software Engineer",
  description:
    "Portfolio of Uttkarsh Ruparel, a final-year CS student and software engineering intern building distributed systems and backend services.",
  path: "/",
};

const COMMANDS = [
  { label: "Selected Work", id: "selected-work" },
  { label: "Smaller Builds", id: "my-work" },
  { label: "Technical Skills", id: "technical-skills" },
  { label: "Tools & Workflow", id: "tools-and-workflow" },
  { label: "Activity", id: "activity" },
];

const focusedProjects = projects.filter(
  (project) => project.category === "focused"
);

function Divider() {
  return <hr className="border-line" />;
}

export default function Home() {
  usePageMeta(PAGE_META);
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <main className="min-h-screen bg-bg">
      <ScrollProgress />
      <CommandPalette commands={COMMANDS} />
      <ShortcutHint />

      <Container>
        <Hero />

        <div className="pb-16 sm:pb-20" />

        <Divider />

        <section className="py-16 sm:py-20">
          <SectionHeading
            id="my-work"
            title="Smaller Builds"
            count={focusedProjects.length}
          >
            Tightly scoped builds, tools and experiments.
          </SectionHeading>

          <ProjectArchive projects={focusedProjects} />
        </section>

        <Divider />

        <section className="py-16 sm:py-20">
          <SectionHeading id="technical-skills" title="Technical Skills">
            A structured overview of the technologies I work with, grouped by
            what they are used for. Hover or tap one for details.
          </SectionHeading>
          <StackIndex groups={skillGroups} />

          <div id="tools-and-workflow" className="mt-20 scroll-mt-28">
            <h3 className="mb-2 text-2xl font-extralight text-fg sm:text-3xl">
              Tools & Workflow
            </h3>
            <p className="mb-8 max-w-3xl text-sm text-muted">
              Supporting tools used for development, testing, deployment, and
              collaboration.
            </p>
            <StackIndex groups={toolGroups} />
          </div>
        </section>

        <Divider />

        <section className="py-16 sm:py-20">
          <SectionHeading id="activity" title="Activity">
            Public GitHub contributions over the last 12 months.
          </SectionHeading>

          <GitHubActivity />
        </section>

        <Divider />

        <p className="py-10 text-center text-sm text-faint italic">
          My microservices talk to each other more politely than most humans
        </p>
      </Container>
    </main>
  );
}
