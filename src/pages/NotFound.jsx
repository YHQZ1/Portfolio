import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { usePageMeta } from "../hooks/usePageMeta";
import { useEffect } from "react";

const PAGE_META = {
  title: "Page not found | Uttkarsh Ruparel",
  description: "The page you were looking for does not exist.",
  path: "/",
  noindex: true,
};

export default function NotFound() {
  usePageMeta(PAGE_META);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#0a0a0a";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#fafafa";
    }

    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, [darkMode]);

  return (
    <div className="fixed inset-0 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <h1
          className={`text-[120px] sm:text-[160px] md:text-[200px] font-extralight tracking-tighter leading-none ${
            darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
          }`}
        >
          404
        </h1>

        <p
          className={`mt-4 text-lg sm:text-xl font-light ${
            darkMode ? "text-[#888]" : "text-[#666]"
          }`}
        >
          Page not found.
          <br className="hidden sm:block" />
          The link you followed doesn't exist.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => navigate("/")}
            className={`text-sm font-light relative ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/about")}
            className={`text-sm font-light relative ${
              darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
            } after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
          >
            About
          </button>
        </div>

        <div className="mt-4">
          <p className={`text-xs ${darkMode ? "text-[#666]" : "text-[#999]"}`}>
            Use the links above to continue.
          </p>
        </div>
      </div>
    </div>
  );
}
