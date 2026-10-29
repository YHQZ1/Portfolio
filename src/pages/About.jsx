import { useState, useEffect } from "react";
import { useTheme } from "../context/useTheme";
import { usePageMeta } from "../hooks/usePageMeta";
import CommandPalette from "../components/CommandPalette";

function useTypewriter(text, speed = 80) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
}

function RoleHeader({ darkMode, logo, logoAlt, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-3 sm:mb-4">
      <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
        <img
          src={logo}
          alt={logoAlt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div>
        <h3
          className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] mb-1 ${
            darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
          } tracking-tight`}
        >
          {title}
        </h3>
        <p
          className={`text-sm italic ${darkMode ? "text-[#666]" : "text-[#999]"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const PAGE_META = {
  title: "About | Uttkarsh Ruparel",
  description:
    "About Uttkarsh Ruparel: a backend engineer and final-year CS student at SIT Pune, interning as a software engineer and organizing GDG on Campus.",
  path: "/about",
};

export default function About() {
  usePageMeta(PAGE_META);
  const { darkMode } = useTheme();
  const commands = [
    { label: "Core Competencies", id: "core-competencies" },
    { label: "Work Experience", id: "work-experience" },
    { label: "Beyond the Code", id: "beyond-the-code" },
  ];

  const typedText = useTypewriter("About", 80);
  const [showShortcutHint, setShowShortcutHint] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      setShowShortcutHint(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowShortcutHint(false);
      }, 1200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className={`min-h-screen ${
        darkMode ? "bg-[#0a0a0a]" : "bg-[#fafafa]"
      } px-4 sm:px-6`}
    >
      <div
        className={`
    fixed top-0 left-0 h-[2px] z-50
    ${
      darkMode
        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]"
        : "bg-black shadow-[0_0_6px_rgba(0,0,0,0.25)]"
    }
    transition-[width] duration-500 ease-out
  `}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <CommandPalette darkMode={darkMode} commands={commands} />
      <div className="max-w-8xl mx-auto px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 pt-24 sm:pt-28 md:pt-32 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-16 sm:mb-20">
          <div className="order-1 lg:order-1 lg:col-span-1">
            <div
              className={`border ${
                darkMode
                  ? "border-[#1a1a1a] bg-[#0f0f0f]"
                  : "border-[#e8e8e8] bg-white"
              } rounded-sm overflow-hidden h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px]`}
            >
              <img
                src="/profile.webp"
                alt="Uttkarsh"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-2 lg:order-2 lg:col-span-2 flex flex-col justify-center">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-8 sm:mb-10 md:mb-12 ${
                darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
              } tracking-tighter leading-[1.1]`}
            >
              {typedText}
              <span className="ml-1 animate-pulse">|</span>
            </h1>

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  I'm Uttkarsh, a backend engineer who's drawn to the parts of a
                  system most people never look at: how it behaves under load,
                  how it fails, and how quickly you find out. I'm finishing my
                  CS degree at SIT Pune and interning as a software engineer.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  My side projects usually start with a question like "how does
                  this actually work?" and end with me building my own version
                  to find out: a stock exchange, a memory allocator, a deploy
                  platform. I'd rather ship something people can trust than
                  something that only looks good in a demo.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  Away from the terminal, I like working with people. I started
                  in GDG's media team with a camera, moved on to setting contest
                  problems, and now I organize the chapter. Running a community
                  and running a production system have more in common than you'd
                  think: both go better when you plan for things not going to
                  plan.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  I'm looking for a team that treats reliability as part of the
                  product and likes building things properly. If that sounds
                  like yours, let's talk.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>
        <section id="core-competencies" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-12 sm:mb-16 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Core Competencies
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              }`}
            >
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight leading-[1.3]`}
              >
                Distributed Systems & Reliability
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Things fail: networks drop, disks fill up, and a service that
                behaved all week picks the worst possible moment to stop. I like
                designing for that day instead of hoping it never comes, and I
                like the detective work of finding out what actually went wrong.
              </p>
            </div>

            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              }`}
            >
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight leading-[1.3]`}
              >
                System Design
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Before I build anything, I try to work out what will break first
                and what it will take down with it. Good design is mostly
                deciding where the walls go, so a failure in one place stays in
                that place. I'd rather spend an afternoon on a whiteboard than a
                month untangling a rushed decision.
              </p>
            </div>

            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              }`}
            >
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight leading-[1.3]`}
              >
                DevOps & Cloud
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Shipping is part of the job, not something that happens
                afterwards. I like pipelines that are boring, deployments I can
                repeat, and dashboards that tell me something is wrong before a
                user does. And I keep an eye on cost too, because a good system
                shouldn't surprise you on the invoice.
              </p>
            </div>

            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              }`}
            >
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight leading-[1.3]`}
              >
                Competitive Programming
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Contests taught me to think clearly with a clock running, and to
                be suspicious of any solution I can't explain. I spent a year
                co-heading the competitive programming vertical at GDG on
                Campus, designing problems, running contests and helping people
                get unstuck.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>

        <section id="work-experience" className="mb-8 sm:mb-10">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-6 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Work Experience
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
          </h2>

          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div
              className={`border-l-4 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <RoleHeader
                darkMode={darkMode}
                logo="/experience/tracelink.png"
                logoAlt="TraceLink logo"
                title="Software Engineer Intern"
                subtitle="TraceLink · Pune · September 2026 – Present"
              />
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Working across the solution design and solution builder teams as
                a backend engineer, designing and building solutions in Node.js,
                Express and Java. The stack includes Redis, S3, OpenSearch,
                RocksDB and Kafka, shipped through Jenkins pipelines with
                Docker, Kubernetes and AWS, and watched through Grafana and
                Jaeger.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />

        <section id="beyond-the-code" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-12 sm:mb-16 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Beyond the Code
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
            ></span>
          </h2>

          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div
              className={`border-l-4 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <RoleHeader
                darkMode={darkMode}
                logo="/experience/gdg.png"
                logoAlt="GDG on Campus logo"
                title="Organizer"
                subtitle="GDG on Campus, SIT Pune · July 2026 – Present"
              />
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Leading the GDG on Campus chapter at SIT Pune, taking over right
                after my time as Competitive Programming Co-Head. That means
                setting the technical direction for a 30+ member team and
                building a culture where people learn by doing: hands-on
                sessions, real projects, and pushing members to build things
                that go beyond coursework.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <RoleHeader
                darkMode={darkMode}
                logo="/experience/gdg.png"
                logoAlt="GDG on Campus logo"
                title="Competitive Programming Co-Head"
                subtitle="GDG on Campus, SIT Pune · July 2025 – June 2026"
              />
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Built and ran the competitive programming vertical at GDG on
                Campus — designing problem sets, running contests, and mentoring
                students through the grind of algorithmic thinking. The goal was
                never leaderboard rankings, it was getting people to think
                precisely under pressure. That's a skill that transfers
                everywhere.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <RoleHeader
                darkMode={darkMode}
                logo="/experience/gdg.png"
                logoAlt="GDG on Campus logo"
                title="Media Co-Head"
                subtitle="GDG on Campus, SIT Pune · July 2024 – June 2025"
              />
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Ran the chapter's media: photographing events, making reels and
                edits, and covering flagship events like the tech fest,
                induction and the hackathon. Later moved over to co-lead the
                competitive programming vertical.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div
        className={`
    fixed bottom-6 left-6 text-xs z-40
    px-2 py-1 rounded-md
    backdrop-blur-md
    ${
      darkMode
        ? "bg-white/10 border-white/20 text-white/80"
        : "bg-black/10 border-black/20 text-black/70"
    }
    transition-opacity duration-300
    ${showShortcutHint ? "opacity-100" : "opacity-0 pointer-events-none"}
    whitespace-nowrap
    hidden sm:block
  `}
      >
        ⌘K / Ctrl+K to search
      </div>
    </main>
  );
}
