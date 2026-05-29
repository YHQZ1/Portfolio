import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
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

export default function About() {
  const { darkMode } = useTheme();
  const commands = [
    { label: "Core Competencies", id: "core-competencies" },
    { label: "Beyond the Code", id: "beyond-the-code" },
    { label: "Work Experience", id: "work-experience" },
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
                src="/profile.jpeg"
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
                  I'm a backend and infrastructure engineer drawn to distributed
                  systems — not because it's a buzzword, but because most people
                  underestimate how much engineering discipline goes into
                  keeping systems correct, fast, and honest under real load.
                  That gap between "it works" and "it works at scale" is where
                  things get genuinely interesting.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#81c995]" : "border-[#34a853]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  I gravitate toward problems that are hard to get right —
                  event-driven architectures, low-latency pipelines,
                  kernel-level observability. Go is my primary language for
                  backend and cloud work, and the way it handles concurrency and
                  maps cleanly to infrastructure problems keeps pulling me
                  deeper into that space.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#f28b82]" : "border-[#ea4335]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  I'm a final year CS student at SIT Pune building things that
                  would hold up in production. I care about correctness,
                  performance, and systems that don't fall apart when something
                  goes wrong. If that's the kind of engineering your team does,
                  we should talk.
                </p>
              </div>

              <div
                className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                  darkMode ? "border-[#fdd663]" : "border-[#fbbc04]"
                }`}
              >
                <p
                  className={`text-lg sm:text-xl md:text-2xl leading-[1.6] ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  I move between a lot of things outside of code — some
                  structured, some not. I find that the best ideas usually show
                  up when you're not staring at a screen.
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
                darkMode ? "border-[#81c995]" : "border-[#34a853]"
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
                Distributed systems are hard in ways that don't show up in
                tutorials — clock skew, partial failures, split-brain scenarios,
                cascading latency. I've spent serious time understanding how
                systems behave when the happy path disappears, and I design with
                that reality in mind from the start rather than bolting on
                reliability as an afterthought.
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
                I think in systems — component boundaries, failure modes,
                consistency trade-offs, and the long-term cost of decisions made
                under pressure. Good system design isn't about picking the right
                buzzwords, it's about understanding what breaks first and
                building so that when it does, nothing else falls with it.
              </p>
            </div>

            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#fdd663]" : "border-[#fbbc04]"
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
                Infrastructure is just code with higher stakes. I treat
                deployment pipelines, container orchestration, and cloud
                architecture with the same engineering rigor as application code
                — reproducible, observable, and built to survive the unexpected.
                The gap between a system that works locally and one that holds
                up in production is where I focus.
              </p>
            </div>

            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#f28b82]" : "border-[#ea4335]"
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
                Algorithmic thinking isn't just a contest skill — it's how I
                approach real engineering problems. Years of competitive
                programming have sharpened my ability to reason about
                complexity, identify bottlenecks before they appear, and write
                code that's correct by construction rather than correct by luck.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>

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
                darkMode ? "border-[#c58af9]" : "border-[#a142f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] mb-2 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                President
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${darkMode ? "text-[#666]" : "text-[#999]"}`}
              >
                Google Developer Students Club, SIT Pune
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Running GDSC SIT Pune means more than organizing events — it
                means setting the technical direction for a 100+ member
                community. I focus on building a culture where engineers
                actually learn by doing, not just attending. That means hands-on
                sessions, real projects, and pushing members to build things
                that go beyond coursework.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#f28b82]" : "border-[#ea4335]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] mb-2 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Competitive Programming Co-Head
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${darkMode ? "text-[#666]" : "text-[#999]"}`}
              >
                Google Developer Students Club, SIT Pune
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Built and ran the competitive programming vertical at GDSC —
                designing problem sets, running contests, and mentoring students
                through the grind of algorithmic thinking. The goal was never
                leaderboard rankings, it was getting people to think precisely
                under pressure. That's a skill that transfers everywhere.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#fdd663]" : "border-[#fbbc04]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] mb-2 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Open Source Contributor
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${darkMode ? "text-[#666]" : "text-[#999]"}`}
              >
                GirlScript Summer of Code / GSSoC, 2026
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Selected as a contributor for GSSoC 2026, one of the largest
                open source programs in India. Working directly with project
                maintainers to ship real improvements — not documentation fixes,
                but actual code that goes into production repositories used by
                other developers.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#81c995]" : "border-[#34a853]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] mb-2 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Hackathon Finalist — ACE 2.0
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${darkMode ? "text-[#666]" : "text-[#999]"}`}
              >
                September, 2025
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${darkMode ? "text-[#888]" : "text-[#666]"}`}
              >
                Reached the finals at ACE 2.0 among 400+ competing teams. Built
                a complete working prototype under time pressure — the kind of
                constraint that reveals whether your engineering foundations
                actually hold up when there's no time to over-engineer anything.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />
        
        <section id="work-experience" className="mb-8 sm:mb-10">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-6 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Work Experience
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
          </h2>

          <div className="flex flex-col items-center justify-center text-center">
            <p
              className={`text-lg sm:text-xl font-light italic ${
                darkMode ? "text-[#444]" : "text-[#bbb]"
              }`}
            >
              Still in college. The GitHub disagrees.
            </p>
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
