import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/useTheme";
import resumePDF from "/Resume.pdf";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] max-w-[400px] min-w-[280px] flex justify-between items-center py-3 px-6 sm:py-3 sm:px-6 md:py-2 md:px-4 backdrop-blur-xs bg-white/5 dark:bg-black/5 shadow-lg border border-white/20 dark:border-gray-500/20 rounded-full z-50 mt-4 sm:mt-5 md:mt-6 lg:mt-7`}
    >
      <div className="flex items-center select-none cursor-default">
        <img
          src="/logo.png"
          alt="Portfolio Logo"
          className="h-8 sm:h-9 md:h-9 lg:h-10 w-auto max-w-none min-w-[32px] sm:min-w-[36px]"
        />
      </div>

      <div
        className={`flex gap-3 sm:gap-4 md:gap-4 lg:gap-6 items-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <Link
          to="/"
          className={`${
            isActive("/")
              ? "font-semibold tracking-tight"
              : "font-normal opacity-80"
          } text-base sm:text-lg md:text-base lg:text-lg py-1 relative group`}
        >
          Profile
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
        </Link>

        <Link
          to="/about"
          className={`${
            isActive("/about")
              ? "font-semibold tracking-tight"
              : "font-normal opacity-80"
          } text-base sm:text-lg md:text-base lg:text-lg py-1 relative group`}
        >
          About
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
        </Link>

        <a
          href={resumePDF}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            isActive("/resume")
              ? "font-semibold tracking-tight"
              : "font-normal opacity-80"
          } text-base sm:text-lg md:text-base lg:text-lg py-1 relative group`}
        >
          Resume
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
        </a>
      </div>

      <button
        className="bg-transparent border-none cursor-pointer p-1.5 sm:p-2 md:p-1.5 lg:p-2 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
        onClick={toggleTheme}
      >
        {darkMode ? (
          <FaSun className="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-400" />
        ) : (
          <FaMoon className="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-700" />
        )}
      </button>
    </nav>
  );
}
