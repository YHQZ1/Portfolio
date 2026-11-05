import { useState } from "react";
import { useTheme } from "../context/useTheme";
import { Link } from "react-router-dom";
import { socialLinks, specialLinks } from "../data/links";

export default function Footer() {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  const baseColor = darkMode
    ? "text-[#888] hover:text-[#f5f5f5]"
    : "text-[#666] hover:text-[#1a1a1a]";

  const tooltipBg = darkMode
    ? "bg-[#1a1a1a] text-[#f5f5f5] border border-[#2a2a2a]"
    : "bg-[#eaeaea] text-[#1a1a1a] border border-[#e0e0e0]";

  const tooltipArrow = darkMode
    ? "bg-[#1a1a1a] border-r border-b border-[#2a2a2a]"
    : "bg-[#eaeaea] border-r border-b border-[#e0e0e0]";

  return (
    <footer
      id="site-footer"
      className={`w-full py-6 sm:py-8 ${
        darkMode
          ? "bg-[#0a0a0a] border-[#1a1a1a]"
          : "bg-[#fafafa] border-[#e8e8e8]"
      } border-t`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <h3
          className={`mb-12 sm:mb-14 text-2xl sm:text-3xl font-light ${
            darkMode ? "text-[#888]" : "text-[#666]"
          }`}
        >
          Let's connect.
        </h3>

        <div className="max-w-md mx-auto flex justify-center gap-3 sm:gap-6 md:gap-8 mb-4 px-2">
          {socialLinks.map(({ name, url, icon }) => {
            const Icon = icon;
            return (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative text-2xl sm:text-3xl transition-colors duration-300 group ${baseColor}`}
              >
                <Icon />
                <span
                  className={`absolute -top-14 left-1/2 -translate-x-1/2 text-sm px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 pointer-events-none ${tooltipBg}`}
                >
                  {name}
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 pointer-events-none ${tooltipArrow}`}
                  />
                </span>
              </a>
            );
          })}

          {specialLinks.map((item) => {
            const Icon = item.icon;

            if (item.type === "copy") {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigator.clipboard.writeText(item.value);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  className={`relative cursor-pointer text-2xl sm:text-3xl transition-colors duration-300 group ${baseColor}`}
                >
                  <Icon />
                  <span
                    className={`absolute -top-14 left-1/2 -translate-x-1/2 text-sm px-3 py-2 rounded-sm transition-opacity duration-300 whitespace-nowrap z-50 pointer-events-none ${tooltipBg} ${
                      copied
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {copied ? "Copied!" : item.name}
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 pointer-events-none ${tooltipArrow}`}
                    />
                  </span>
                </button>
              );
            }

            if (item.type === "internal") {
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`relative text-2xl sm:text-3xl transition-colors duration-300 group ${baseColor}`}
                >
                  <Icon />
                  <span
                    className={`absolute -top-14 left-1/2 -translate-x-1/2 text-sm px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 pointer-events-none ${tooltipBg}`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 pointer-events-none ${tooltipArrow}`}
                    />
                  </span>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </footer>
  );
}
