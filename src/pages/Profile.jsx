import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { toolsAndWorkflow } from "../data/tools";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import CommandPalette from "../components/CommandPalette";
import GitHubActivity from "../components/GitHubActivity";

function useTypewriter(text, speed = 80) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

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

const FILTERS = [
  { label: "Languages", key: "languages" },
  { label: "Frontend", key: "frontend" },
  { label: "Backend", key: "backend" },
  { label: "Database", key: "database" },
  { label: "Cloud", key: "cloud" },
  { label: "DevOps", key: "devops" },
  { label: "Data Science", key: "data-science" },
  { label: "AI / ML", key: "ai-ml" },
  { label: "App Development", key: "app-development" },
  { label: "Testing", key: "testing" },
];

function SkillFilters({ darkMode, activeFilters, setActiveFilters }) {
  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  };

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide sm:flex-wrap sm:overflow-visible">
      {FILTERS.map(({ label, key }) => {
        const isActive = activeFilters.includes(key);

        return (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`
        px-3 py-1 text-sm rounded-sm border cursor-pointer select-none
        transition-none duration-200
        ${
          darkMode
            ? isActive
              ? "bg-[#f5f5f5] text-black border-[#f5f5f5]"
              : "border-[#2a2a2a] text-[#aaa] bg-[#111]"
            : isActive
              ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
              : "border-[#ddd] text-[#444] bg-white"
        }
        hover:scale-[1.04]
        hover:shadow-[0_2px_6px_rgba(0,0,0,0.15)]
        hover:border-current
      `}
          >
            {label}
          </button>
        );
      })}

      {activeFilters.length > 0 && (
        <button
          onClick={() => setActiveFilters([])}
          className={`px-3 py-1 text-sm rounded-sm border transition-none cursor-pointer ${
            darkMode
              ? "border-[#2a2a2a] text-[#aaa] bg-[#111] hover:border-[#444]"
              : "border-[#ddd] text-[#444] bg-white hover:border-[#aaa]"
          }`}
        >
          Clear Filters ✕
        </button>
      )}
    </div>
  );
}

function SkillsGridSection({
  title,
  description,
  skills,
  darkMode,
  activeFilters,
}) {
  const filteredSkills =
    activeFilters.length === 0
      ? skills
      : skills.filter((skill) =>
          activeFilters.every((tag) => skill.filterCategories.includes(tag)),
        );

  if (filteredSkills.length === 0) return null;

  return (
    <div className="mb-16">
      <h3
        className={`text-2xl sm:text-3xl font-extralight mb-2 ${
          darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-sm mb-6 max-w-3xl ${
          darkMode ? "text-[#888]" : "text-[#666]"
        }`}
      >
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className={`p-4 sm:p-6 border ${
              darkMode
                ? "border-[#2a2a2a] bg-[#0f0f0f]"
                : "border-[#e0e0e0] bg-white"
            } rounded-sm`}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img
                src={darkMode && skill.darkLogo ? skill.darkLogo : skill.logo}
                alt={skill.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg sm:text-xl font-medium truncate leading-[1.3] ${
                    darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                  }`}
                >
                  {skill.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      darkMode
                        ? "border-[#8ab4f8] text-[#8ab4f8] bg-[#8ab4f8]/10"
                        : "border-[#4285f4] text-[#4285f4] bg-[#4285f4]/10"
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  Experience
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                  }`}
                >
                  {skill.experience}
                </span>
              </div>

              <div>
                <span
                  className={`text-sm block mb-1 sm:mb-2 ${
                    darkMode ? "text-[#888]" : "text-[#666]"
                  }`}
                >
                  Used in:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skill.category.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded border leading-[1.4] ${
                        darkMode
                          ? "border-[#2a2a2a] bg-[#1a1a1a] text-[#888]"
                          : "border-[#e0e0e0] bg-[#f5f5f5] text-[#666]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { darkMode } = useTheme();

  const commands = [
    { label: "My Work", id: "my-work" },
    { label: "Technical Skills", id: "technical-skills" },
    { label: "Activity", id: "activity" },
    { label: "Tools & Workflow", id: "tools-and-workflow" },
  ];

  const typedText = useTypewriter("Hey, I'm Uttkarsh!", 80);
  const [activeFilters, setActiveFilters] = useState([]);
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

  const hasAnyFilteredSkills =
    activeFilters.length === 0 ||
    skills.some((skill) =>
      activeFilters.every((tag) => skill.filterCategories.includes(tag)),
    );

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
        <div className="mb-16 sm:mb-20 md:mb-24">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-6 sm:mb-8 ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tighter leading-[1.1]`}
          >
            {typedText}
            <span className="ml-1 animate-pulse">|</span>
          </h1>
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-[1.6] max-w-4xl ${
              darkMode ? "text-[#888]" : "text-[#666]"
            }`}
          >
            A computer science major passionate about building projects and
            turning ideas into clean, scalable code.
          </p>
        </div>

        <section id="my-work" className="mb-10 sm:mb-16 md:mb-20">
          <div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-3 relative inline-block group ${
                darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
              } tracking-tight leading-[1.2]`}
            >
              My Work
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </h2>

            <p
              className={`text-sm max-w-3xl mb-10 ${
                darkMode ? "text-[#888]" : "text-[#666]"
              }`}
            >
              A curated selection of projects ranging from long-running,
              system-focused builds to smaller, tightly scoped experiments and
              tools.
            </p>

            {/* SELECTED WORK */}
            <h3
              className={`text-2xl sm:text-3xl font-extralight mb-6 ${
                darkMode ? "text-[#ddd]" : "text-[#333]"
              }`}
            >
              Selected Work
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4 md:gap-4 mb-16">
              {projects
                .filter((project) => project.category === "selected")
                .map((project, index) => (
                  <div
                    key={index}
                    className={`border ${
                      darkMode
                        ? "border-[#1a1a1a] bg-[#0f0f0f]"
                        : "border-[#e8e8e8] bg-white"
                    } rounded-sm overflow-hidden flex flex-col`}
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <h4
                        className={`text-xl sm:text-2xl font-light mb-2 sm:mb-3 ${
                          darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                        }`}
                      >
                        {project.title}
                      </h4>

                      <p
                        className={`text-sm leading-[1.6] mb-4 sm:mb-6 flex-1 ${
                          darkMode ? "text-[#888]" : "text-[#666]"
                        }`}
                      >
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded border ${
                              darkMode
                                ? "border-[#2a2a2a] bg-[#1a1a1a] text-[#888]"
                                : "border-[#e0e0e0] bg-[#f5f5f5] text-[#666]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 sm:gap-6 mt-auto">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-sm font-light ${
                            darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                          }`}
                        >
                          <FaGithub className="text-base sm:text-lg" />
                          <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                            Code
                          </span>
                        </a>

                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-sm font-light ${
                              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                            }`}
                          >
                            <FaExternalLinkAlt className="text-sm sm:text-base" />
                            <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                              Live
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* FOCUSED PROJECTS */}
            <h3
              className={`text-2xl sm:text-3xl font-extralight mb-6 ${
                darkMode ? "text-[#ddd]" : "text-[#333]"
              }`}
            >
              Focused Projects & Tools
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-4 md:gap-4">
              {projects
                .filter((project) => project.category === "focused")
                .map((project, index) => (
                  <div
                    key={index}
                    className={`border ${
                      darkMode
                        ? "border-[#1a1a1a] bg-[#0f0f0f]"
                        : "border-[#e8e8e8] bg-white"
                    } rounded-sm p-4 sm:p-6 flex flex-col`}
                  >
                    <h4
                      className={`text-lg sm:text-xl font-light mb-2 ${
                        darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                      }`}
                    >
                      {project.title}
                    </h4>

                    <p
                      className={`text-sm leading-[1.6] mb-4 flex-1 ${
                        darkMode ? "text-[#888]" : "text-[#666]"
                      }`}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded border ${
                            darkMode
                              ? "border-[#2a2a2a] bg-[#1a1a1a] text-[#888]"
                              : "border-[#e0e0e0] bg-[#f5f5f5] text-[#666]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 sm:gap-6 mt-auto">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm font-light ${
                          darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                        }`}
                      >
                        <FaGithub className="text-base" />
                        <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                          Code
                        </span>
                      </a>

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-sm font-light ${
                            darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                          }`}
                        >
                          <FaExternalLinkAlt className="text-sm" />
                          <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                            Live
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />

        <section id="technical-skills" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-3 sm:mb-4 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Technical Skills
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
            ></span>
          </h2>
          <p
            className={`text-sm max-w-3xl mb-6 ${
              darkMode ? "text-[#888]" : "text-[#666]"
            }`}
          >
            A structured overview of the technologies I work with, organized by
            depth of experience.
          </p>
          <SkillFilters
            darkMode={darkMode}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />

          {!hasAnyFilteredSkills && (
            <div
              className={`mb-16 text-sm max-w-3xl ${
                darkMode ? "text-[#666]" : "text-[#888]"
              }`}
            >
              Nothing here… looks like you've filtered me into a corner.
            </div>
          )}

          <SkillsGridSection
            title="Core Stack"
            description="Primary technologies used across most projects I build."
            skills={skills.filter((s) => s.tier === "core")}
            darkMode={darkMode}
            activeFilters={activeFilters}
          />

          <SkillsGridSection
            title="Applied Experience"
            description="Technologies used in shipped features and real-world implementations."
            skills={skills.filter((s) => s.tier === "applied")}
            darkMode={darkMode}
            activeFilters={activeFilters}
          />

          <SkillsGridSection
            title="Exploration & Learning"
            description="Technologies explored through focused prototypes and learning-driven projects."
            skills={skills.filter((s) => s.tier === "exploration")}
            darkMode={darkMode}
            activeFilters={activeFilters}
          />
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />

        <section id="activity" className="mb-16 sm:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-3 relative inline-block group ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } tracking-tight leading-[1.2]`}
          >
            Activity
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
          </h2>

          <p
            className={`text-sm max-w-3xl mb-6 ${
              darkMode ? "text-[#888]" : "text-[#666]"
            }`}
          >
            An overview of ongoing development cycles, active experimentation,
            and production-oriented work.
          </p>

          <div
            className="
    grid
    grid-cols-1
    lg:grid-cols-[minmax(0,1fr)_420px]
    gap-6
    lg:gap-12
    items-stretch
  "
          >
            <GitHubActivity darkMode={darkMode} />

            <div className="hidden lg:flex items-center pl-6">
              <h3
                className={`
        text-[4.5rem] xl:text-[5.5rem]
        font-extralight
        tracking-[-0.04em]
        leading-[1.05]
        ${darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"}
      `}
              >
                Shipping.
                <br />
                Iterating.
                <br />
                Refining.
              </h3>
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        />

        <section id="tools-and-workflow" className="mb-16 sm:mb-20">
          <div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-3 sm:mb-4 relative inline-block group ${
                darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
              } tracking-tight leading-[1.2]`}
            >
              Tools & Workflow
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`}
              ></span>
            </h2>
            <p
              className={`text-sm max-w-3xl mb-6 ${
                darkMode ? "text-[#888]" : "text-[#666]"
              }`}
            >
              Supporting tools used for development, testing, deployment, and
              collaboration.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4">
              {toolsAndWorkflow.map((tool, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-6 border ${
                    darkMode
                      ? "border-[#2a2a2a] bg-[#0f0f0f]"
                      : "border-[#e0e0e0] bg-white"
                  } rounded-sm`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img
                      src={
                        darkMode && tool.darkLogo ? tool.darkLogo : tool.logo
                      }
                      alt={tool.name}
                      className="w-10 h-10 sm:w-12 sm:h-12"
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg sm:text-xl font-medium truncate leading-[1.3] ${
                          darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                        }`}
                      >
                        {tool.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <span
                      className={`text-sm block mb-1 sm:mb-2 ${
                        darkMode ? "text-[#888]" : "text-[#666]"
                      }`}
                    >
                      Used for:
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {tool.category.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`text-xs px-2 py-1 rounded border leading-[1.4] ${
                            darkMode
                              ? "border-[#2a2a2a] bg-[#1a1a1a] text-[#888]"
                              : "border-[#e0e0e0] bg-[#f5f5f5] text-[#666]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"
          } my-8 sm:my-10`}
        ></div>
        <div className="text-center py-4 sm:py-5">
          <p
            className={`text-sm italic ${
              darkMode ? "text-[#666]" : "text-[#999]"
            }`}
          >
            My microservices talk to each other more politely than most humans
          </p>
        </div>
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
