import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { socialLinks } from "../../../data/links";
import resumePDF from "/Resume.pdf";
import {
  ConnectMenu,
  Logo,
  NavLinks,
  SoundButton,
  ThemeButton,
} from "./NavParts";
import { PAGES, discord, useNavState } from "./useNavState";

export default function Navbar() {
  const { pathname } = useLocation();
  const { isActive, copied, copyDiscord } = useNavState();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line ${
        menuOpen ? "bg-bg" : "bg-bg/95 backdrop-blur-md"
      }`}
    >
      <nav
        aria-label="Main"
        className="flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm tracking-wide text-fg">
            Uttkarsh Ruparel
          </span>
        </div>

        <div className="hidden items-center gap-9 lg:flex">
          <NavLinks gap="gap-8" />
          <ConnectMenu />
          <div className="flex items-center">
            <SoundButton />
            <ThemeButton />
          </div>
        </div>

        <div className="flex items-center lg:hidden">
          <SoundButton />
          <ThemeButton />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-fg"
          >
            {menuOpen ? (
              <FiX className="size-5" />
            ) : (
              <FiMenu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain border-t border-line bg-bg px-5 pt-4 pb-8 sm:px-8 lg:hidden">
          <ul>
            {PAGES.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive(to) ? "page" : undefined}
                  className={`block py-2 text-4xl font-extralight tracking-tight text-fg ${
                    isActive(to) ? "" : "opacity-60"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={resumePDF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-4xl font-extralight tracking-tight text-fg opacity-60"
              >
                Resume
                <FiArrowUpRight className="text-2xl" />
              </a>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-x-6 border-t border-line pt-4 text-base text-muted">
            {socialLinks.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 transition-colors hover:text-fg"
              >
                {name}
              </a>
            ))}
            {discord && (
              <button
                type="button"
                onClick={copyDiscord}
                className="cursor-pointer py-2.5 transition-colors hover:text-fg"
              >
                {copied ? "Copied!" : "Discord"}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
