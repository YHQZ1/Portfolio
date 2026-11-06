import { usePageMeta, type PageMeta } from "../hooks/usePageMeta";
import { getLogo } from "../data/logos";
import {
  COMPETENCIES,
  COMMUNITY_ROLES,
  INTRO,
  LEAD,
  TRACELINK_ROLES,
} from "../data/about";
import CommandPalette from "../components/layout/CommandPalette";
import Container from "../components/ui/Container";
import ScrollProgress from "../components/layout/ScrollProgress";
import SectionHeading from "../components/ui/SectionHeading";
import ShortcutHint from "../components/layout/ShortcutHint";
import Organization from "../components/about/Organization";
import RoleTimeline from "../components/about/RoleTimeline";
import LinkRow from "../components/ui/LinkRow";
import Signature from "../components/ui/Signature";
import ThemedImage from "../components/ui/ThemedImage";
import resumePDF from "/Resume.pdf";

const PAGE_META: PageMeta = {
  title: "About | Uttkarsh Ruparel",
  description:
    "About Uttkarsh Ruparel: a backend engineer and final-year CS student at SIT Pune, interning as a software engineer at TraceLink.",
  path: "/about",
};

const COMMANDS = [
  { label: "Core Competencies", id: "core-competencies" },
  { label: "Work Experience", id: "work-experience" },
  { label: "Beyond the Code", id: "beyond-the-code" },
];

export default function About() {
  usePageMeta(PAGE_META);

  return (
    <main className="min-h-screen bg-bg">
      <ScrollProgress />
      <CommandPalette commands={COMMANDS} />
      <ShortcutHint />

      <Container>
        <section className="pb-16 sm:pb-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_clamp(22rem,38%,34rem)] lg:gap-x-16">
            <div>
              <p className="eyebrow mb-8">About</p>
              <h1 className="text-3xl leading-[1.15] font-extralight tracking-tighter text-balance text-fg sm:text-4xl lg:text-5xl">
                Drawn to the parts of a system{" "}
                <span className="text-faint">most people never look at.</span>
              </h1>

              <p className="mt-10 text-xl leading-[1.5] font-light text-balance text-fg sm:text-2xl">
                {LEAD}
              </p>
              <div className="mt-8 space-y-6">
                {INTRO.map((paragraph) => (
                  <p key={paragraph} className="body-text lg:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="order-first flex lg:order-none">
              <figure className="mx-auto flex flex-1 flex-col sm:max-w-sm lg:mx-0 border border-line bg-surface p-3 sm:p-4 lg:max-w-none">
                <div className="relative aspect-square overflow-hidden bg-raised sm:aspect-[4/5] lg:aspect-auto lg:min-h-[36rem] lg:flex-1">
                  <img
                    src="/profile.webp"
                    alt="Uttkarsh Ruparel"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_62%]"
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between eyebrow sm:mt-4">
                  <span>Uttkarsh Ruparel</span>
                  <span>Pune, India</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <hr className="border-line" />

        <section className="py-16 sm:py-20">
          <SectionHeading id="core-competencies" title="Core Competencies" />

          <ol className="grid border-t border-line md:grid-cols-2">
            {COMPETENCIES.map(({ title, body, tech }, index) => (
              <li
                key={title}
                className="group border-b border-line py-8 md:py-10 md:odd:pr-12 md:even:border-l md:even:pl-12"
              >
                <span className="block text-xs tracking-widest text-faint tabular-nums transition-colors duration-300 group-hover:text-fg">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl leading-[1.3] font-extralight tracking-tight text-fg sm:text-3xl">
                  {title}
                </h3>
                <p className="body-text mt-5">{body}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {tech.map((name) => {
                    const source = getLogo(name);
                    if (!source) return null;

                    return (
                      <li
                        key={name}
                        className="flex items-center gap-2 text-sm text-muted"
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
              </li>
            ))}
          </ol>
        </section>

        <hr className="border-line" />

        <section className="py-16 sm:py-20">
          <SectionHeading id="work-experience" title="Work Experience" />

          <Organization
            logo="/experience/tracelink.png"
            name="TraceLink"
            place="Pune, India"
          >
            <RoleTimeline roles={TRACELINK_ROLES} />
          </Organization>
        </section>

        <hr className="border-line" />

        <section className="py-16 sm:py-20">
          <SectionHeading id="beyond-the-code" title="Beyond the Code" />

          <Organization
            name="SIT Developer Community"
            place="Student-run, SIT Pune"
            span="July 2024 – Present"
          >
            <RoleTimeline roles={COMMUNITY_ROLES} />
          </Organization>
        </section>

        <hr className="border-line" />

        <section className="py-20 sm:py-28">
          <p className="eyebrow mb-10">Looking for</p>

          <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-20">
            <p className="text-3xl leading-[1.15] font-extralight tracking-tighter text-balance text-fg sm:text-5xl lg:col-span-12 lg:text-6xl xl:text-7xl">
              A team that treats reliability as part of the product
              <span className="block text-faint">
                and likes building things properly.
              </span>
            </p>

            <div className="lg:col-span-8 lg:self-end">
              <Signature className="w-44 sm:w-52 lg:w-64" />
            </div>

            <div className="lg:col-span-4">
              <p className="mb-6 text-sm text-muted">
                If that sounds like yours, let's talk.
              </p>
              <ul className="border-t border-line">
                <li>
                  <LinkRow label="Get in touch" to="/contact" />
                </li>
                <li>
                  <LinkRow label="Resume" href={resumePDF} />
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
