import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Server-side tests run in a plain Node environment with no browser APIs.
if (typeof window !== "undefined") {
  // jsdom does not implement these browser APIs that the site relies on.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });
}
