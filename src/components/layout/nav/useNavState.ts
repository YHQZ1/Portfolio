import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSound } from "../../../context/useSound";
import { useTheme } from "../../../context/useTheme";
import { specialLinks } from "../../../data/links";

export const PAGES = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const discord = specialLinks.find((link) => link.type === "copy");

export function useNavState() {
  const { pathname } = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { play } = useSound();
  const [copied, setCopied] = useState(false);

  const isActive = (to: string) =>
    to === "/"
      ? pathname === "/" || pathname.startsWith("/projects/")
      : pathname === to;

  const copyDiscord = () => {
    if (!discord || discord.type !== "copy") return;
    navigator.clipboard.writeText(discord.value);
    play("copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return { isActive, darkMode, toggleTheme, copied, copyDiscord };
}
