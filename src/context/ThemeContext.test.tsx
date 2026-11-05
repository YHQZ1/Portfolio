import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./ThemeContext";
import { useTheme } from "./useTheme";

function Probe() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button onClick={(event) => toggleTheme(event.currentTarget)}>
      {darkMode ? "dark" : "light"}
    </button>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts from the saved theme", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByRole("button").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles, persists the choice and pauses transitions only during the swap", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const root = document.documentElement;
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByRole("button").textContent).toBe("light");

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("dark");
    expect(root.classList.contains("dark")).toBe(true);
    expect(root.classList.contains("theme-switching")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(root.classList.contains("theme-switching")).toBe(false);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("light");
    expect(root.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  describe("circular reveal", () => {
    const stubViewTransition = () => {
      const ready = Promise.resolve();
      const finished = Promise.resolve();
      const start = vi.fn((update: () => void) => {
        update();
        return { ready, finished, skipTransition: vi.fn() };
      });
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: start,
      });
      document.documentElement.animate = vi.fn() as never;
      return start;
    };

    afterEach(() => {
      Reflect.deleteProperty(document, "startViewTransition");
    });

    it("expands the new theme from the button when View Transitions exist", async () => {
      const start = stubViewTransition();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button"));
      await Promise.resolve();
      await Promise.resolve();

      expect(start).toHaveBeenCalledTimes(1);
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      const [keyframes, options] = (
        document.documentElement.animate as never as {
          mock: {
            calls: [{ clipPath: string[] }, { pseudoElement: string }][];
          };
        }
      ).mock.calls[0];
      expect(keyframes.clipPath[0]).toMatch(/^circle\(0px at /);
      expect(keyframes.clipPath[1]).toMatch(/^circle\([\d.]+px at /);
      expect(options.pseudoElement).toBe("::view-transition-new(root)");
    });

    it("skips the animation for people who prefer reduced motion", async () => {
      const start = stubViewTransition();
      vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
          ({
            matches: query.includes("prefers-reduced-motion"),
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
          }) as unknown as MediaQueryList
      );
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button"));

      expect(start).not.toHaveBeenCalled();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
