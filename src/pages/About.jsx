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
    { label: "Roles & Contributions", id: "roles-and-contributions" },
    { label: "Key Achievements", id: "key-achievements" },
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
                  Hey, I'm Uttkarsh! I genuinely enjoy turning complex ideas
                  into clean, working solutions. There's something special about
                  watching a concept become something people actually use.
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
                  Outside of tech, I try to maintain a steady balance and focus
                  on the things that keep me grounded. I don’t overthink it. I
                  just move toward whatever feels right at the time.
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
                  I keep learning as I go and pick up skills that actually help
                  me build better things. Tech moves fast, so I just stay
                  curious and keep improving wherever I can.
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
                  I’m always trying out new ideas and figuring out what I can
                  improve or build next. I keep things simple and move at my own
                  pace. If you ever want to reach out or just say hi, I’m
                  around.
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
            {/* 1. Competitive Programming */}
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
                Solving algorithmic problems to build strong fundamentals in
                data structures, complexity analysis, and problem decomposition.
                This discipline sharpens my ability to reason precisely and
                write efficient, correct code under constraints.
              </p>
            </div>

            {/* 2. System Design */}
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
                Designing scalable architectures by balancing performance,
                reliability, and cost. I focus on clear component boundaries,
                well-understood trade-offs, and designs that evolve gracefully
                as requirements change.
              </p>
            </div>

            {/* 3. Distributed Systems & Reliability */}
            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#9aa0a6]" : "border-[#5f6368]"
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
                Building systems that behave predictably under scale, latency,
                and failure. I think deeply about consistency models, fault
                tolerance, load distribution, and observability to ensure
                correctness beyond the happy path.
              </p>
            </div>

            {/* 4. DevOps & Cloud */}
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
                Translating system designs into production-ready infrastructure.
                From containerization and CI/CD to observability and secure
                deployments, I engineer environments that are repeatable,
                resilient, and scalable.
              </p>
            </div>

            {/* 5. Full-Stack Development */}
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
                Full-Stack Development
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Building end-to-end applications with a strong emphasis on
                backend correctness and clean interfaces. I enjoy turning system
                designs into intuitive user-facing products that feel fast,
                reliable, and cohesive.
              </p>
            </div>

            {/* 6. Applied Machine Learning */}
            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#c58af9]" : "border-[#a142f4]"
              }`}
            >
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight leading-[1.3]`}
              >
                Applied Machine Learning
              </h3>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Applying machine learning where it meaningfully augments
                systems. From data preprocessing and model training to
                evaluation and deployment, I focus on ML workflows that are
                reproducible, interpretable, and production-aware.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>
        <section id="roles-and-contributions" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-12 sm:mb-16 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Roles & Contributions
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
            ></span>
          </h2>

          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div
              className={`border-l-4 ${
                darkMode ? "border-[#f28b82]" : "border-[#ea4335]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light mb-2 leading-[1.3] ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Competitive Programming Co-Head
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${
                  darkMode ? "text-[#666]" : "text-[#999]"
                }`}
              >
                Google Developer Students Club, SIT Pune
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Passionately led coding challenges and creative problem-solving
                sessions, inspiring students to explore new algorithms and push
                the boundaries of their coding skills. Fostered a campus
                environment where learning and collaboration thrived, organizing
                weekly contests and mentorship sessions.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#81c995]" : "border-[#34a853]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light mb-2 leading-[1.3] ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Media Co-Head
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${
                  darkMode ? "text-[#666]" : "text-[#999]"
                }`}
              >
                Google Developer Students Club, SIT Pune
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Led the club's digital presence with focused, high-impact media
                campaigns. Produced crisp visuals, announcements, and event
                coverage that boosted engagement and kept the community active
                and informed. Helped the club reach and interact with thousands
                of students across platforms.
              </p>
            </div>

            <div
              className={`border-l-4 ${
                darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
              } pl-4 sm:pl-6 md:pl-8`}
            >
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-light mb-2 leading-[1.3] ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                } tracking-tight`}
              >
                Social Media Head
              </h3>
              <p
                className={`text-sm italic mb-3 sm:mb-4 ${
                  darkMode ? "text-[#666]" : "text-[#999]"
                }`}
              >
                SymbiTech, SIT Pune
              </p>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Brought events to life online through innovative digital
                campaigns. Curated stories, visuals, and interactions that
                sparked excitement and strengthened the tech community's
                presence across platforms, reaching over 1,000+ students.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>
        <section id="key-achievements" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-12 sm:mb-16 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Key Achievements
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
            ></span>
          </h2>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16`}
          >
            <div
              className={`border-l-4 pl-4 sm:pl-6 md:pl-8 ${
                darkMode ? "border-[#81c995]" : "border-[#34a853]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 mb-3 sm:mb-4">
                <h3
                  className={`text-xl sm:text-2xl md:text-3xl font-light leading-[1.3] ${
                    darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                  } tracking-tight`}
                >
                  Hackathon Finalist – ACE 2.0
                </h3>
                <span
                  className={`text-sm mt-1 italic sm:mt-0 ${
                    darkMode ? "text-[#666]" : "text-[#999]"
                  }`}
                >
                  September, 2025
                </span>
              </div>
              <p
                className={`text-lg sm:text-xl leading-[1.6] ${
                  darkMode ? "text-[#888]" : "text-[#666]"
                }`}
              >
                Developed an innovative smart governance solution that stood out
                among 400+ competing teams, demonstrating both technical skill
                and real-world impact. Built a complete working prototype with
                modern tech stack.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />
        <section id="work-experience" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-12 sm:mb-16 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Work Experience
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
            ></span>
          </h2>

          <div
            className={`border-l-4 ${
              darkMode ? "border-[#8ab4f8]" : "border-[#4285f4]"
            } pl-4 sm:pl-6 md:pl-8`}
          >
            <div className="flex items-start sm:items-center gap-3 mb-3">
              <img
                src="https://iskconnyc.com/wp-content/uploads/2022/01/LOGO-Final_GLD-MED.png"
                alt="ISKCON logo"
                className="w-6 h-6 object-contain"
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <h3
                  className={`text-xl sm:text-2xl md:text-3xl font-light tracking-tight ${
                    darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                  }`}
                >
                  Full Stack Developer
                </h3>

                <span
                  className={`text-sm italic ${
                    darkMode ? "text-[#666]" : "text-[#999]"
                  }`}
                >
                  July, 2025 - November, 2025
                </span>
              </div>
            </div>

            <p
              className={`text-sm italic mb-3 ${
                darkMode ? "text-[#666]" : "text-[#999]"
              }`}
            >
              ISKCON · Grad Circle
            </p>

            <p
              className={`text-lg sm:text-xl leading-[1.6] ${
                darkMode ? "text-[#888]" : "text-[#666]"
              }`}
            >
              Built GradCircle, a full-stack fundraising platform designed to
              support government schools through alumni-driven and public
              donation campaigns. Implemented the complete frontend experience,
              role-based access control, and a voice-enabled bot for guided
              interactions. Integrated secure payments using the Cashfree
              payment gateway, supporting both monetary and in-kind donations.
              Dockerized the application and deployed the frontend and backend
              to production environments, focusing on reliability, security, and
              ease of use for real-world fundraising campaigns.
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
