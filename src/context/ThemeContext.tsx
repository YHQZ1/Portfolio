import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useSound } from "./useSound";
import { ThemeContext } from "./useTheme";

const REVEAL_DURATION = 500;
const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const SAFETY_TIMEOUT = 1000;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const { play } = useSound();
  const activeTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = (origin?: Element | null) => {
    const root = document.documentElement;
    const next = !darkMode;
    play(next ? "sweepDown" : "sweepUp");

    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      root.classList.toggle("dark", next);
      flushSync(() => setDarkMode(next));
    };

    // Colours come from CSS variables, so every element with a colour
    // transition would otherwise fade at its own pace. Pausing transitions for
    // the swap makes the whole page change in one frame.
    root.classList.add("theme-switching");
    const done = () => root.classList.remove("theme-switching");

    activeTransition.current?.skipTransition();

    const canReveal =
      typeof document.startViewTransition === "function" &&
      !prefersReducedMotion();

    if (!canReveal) {
      apply();
      window.setTimeout(done, 100);
      return;
    }

    const rect = origin?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(apply);
    activeTransition.current = transition;

    // The browser only runs the update on a rendered frame. If it never does
    // (for example in a background tab), switch the theme anyway.
    window.setTimeout(() => {
      if (applied) return;
      transition.skipTransition();
      apply();
      done();
    }, SAFETY_TIMEOUT);

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: REVEAL_DURATION,
            easing: REVEAL_EASING,
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      if (activeTransition.current === transition) {
        activeTransition.current = null;
      }
      done();
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
