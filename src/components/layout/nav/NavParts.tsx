import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { useSound } from "../../../context/useSound";
import { socialLinks } from "../../../data/links";
import resumePDF from "/Resume.pdf";
import { PAGES, discord, useNavState } from "./useNavState";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Portfolio Logo"
      className={`${className} shrink-0 cursor-default select-none`}
      draggable={false}
    />
  );
}

export function NavLinks({ gap = "gap-8" }: { gap?: string }) {
  const { isActive } = useNavState();

  return (
    <ul className={`flex items-center text-[15px] text-fg ${gap}`}>
      {PAGES.map(({ to, label }) => (
        <li key={to}>
          <Link
            to={to}
            aria-current={isActive(to) ? "page" : undefined}
            className={`group relative block py-1 transition-opacity ${
              isActive(to) ? "opacity-100" : "opacity-60 hover:opacity-100"
            }`}
          >
            {label}
            <span
              className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-300 ${
                isActive(to)
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        </li>
      ))}
      <li>
        <a
          href={resumePDF}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 py-1 opacity-60 transition-opacity hover:opacity-100"
        >
          Resume
          <FiArrowUpRight className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </li>
    </ul>
  );
}

export function ThemeButton() {
  const { darkMode, toggleTheme } = useNavState();

  return (
    <button
      type="button"
      onClick={(event) => toggleTheme(event.currentTarget)}
      aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-fg"
    >
      {darkMode ? (
        <FaSun key="sun" className="icon-swap size-4" />
      ) : (
        <FaMoon key="moon" className="icon-swap size-4" />
      )}
    </button>
  );
}

export function SoundButton() {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-fg"
    >
      {enabled ? (
        <FiVolume2 key="on" className="icon-swap size-4" />
      ) : (
        <FiVolumeX key="off" className="icon-swap size-4" />
      )}
    </button>
  );
}

export function ConnectMenu() {
  const { copied, copyDiscord } = useNavState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const DiscordIcon = discord?.icon;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const row =
    "flex w-full cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-left text-sm text-fg transition-colors hover:bg-raised";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-1.5 py-1 text-[15px] text-fg underline-offset-4 opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:underline aria-expanded:opacity-100"
      >
        Connect
        <FiChevronDown
          className={`text-sm transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-5 w-56 overflow-hidden rounded-lg border border-line-strong bg-bg py-1.5 shadow-lg"
        >
          {socialLinks.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={row}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4 text-muted" />
                {name}
              </span>
              <FiArrowUpRight className="text-xs text-faint" />
            </a>
          ))}
          {discord && DiscordIcon && (
            <button
              type="button"
              role="menuitem"
              onClick={copyDiscord}
              className={row}
            >
              <span className="flex items-center gap-3">
                <DiscordIcon className="size-4 text-muted" />
                Discord
              </span>
              <span className="text-xs text-faint">
                {copied ? "Copied!" : "Copy handle"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
