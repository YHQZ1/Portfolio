import { useEffect, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { FaGithub } from "react-icons/fa";

export default function GitHubActivity({ darkMode }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth;
      });
    });
  }, []);

  return (
    <div
      className={`border ${
        darkMode ? "border-[#2a2a2a] bg-[#0f0f0f]" : "border-[#e0e0e0] bg-white"
      } rounded-md p-2 sm:p-3 md:p-4 lg:p-5 max-w-6xl w-full`}
    >
      <div ref={scrollRef} className="mb-4 overflow-x-auto">
        <div
          className="w-max mx-auto"
          style={{ color: darkMode ? "#888" : "#666" }}
        >
          <GitHubCalendar
            username="YHQZ1"
            blockSize={16}
            blockMargin={5}
            fontSize={18}
            colorScheme={darkMode ? "dark" : "light"}
          />
        </div>
      </div>

      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-4 border-t ${
          darkMode ? "border-[#2a2a2a]" : "border-[#e0e0e0]"
        }`}
      >
        <a
          href="https://github.com/YHQZ1"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-sm font-light group ${
            darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
          }`}
        >
          <FaGithub className="text-base sm:text-lg" />
          <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
            View GitHub Profile
          </span>
        </a>

        <span className={`text-xs ${darkMode ? "text-[#666]" : "text-[#888]"}`}>
          Last 12 months
        </span>
      </div>
    </div>
  );
}
