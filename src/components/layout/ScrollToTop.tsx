import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Where each history entry was last scrolled to, so going back lands exactly
// where the visitor left instead of jumping to the top.
const positions = new Map<string, number>();

export default function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);

  // Assigned while rendering, i.e. before the new page replaces the old DOM, so
  // the scroll jump caused by the swap is never recorded against the old entry.
  const currentKey = useRef(key);
  currentKey.current = key;

  useEffect(() => {
    // We restore positions ourselves; the browser's own restoration would
    // otherwise race with ours and win with a stale position.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const record = () => positions.set(currentKey.current, window.scrollY);

    window.addEventListener("scroll", record, { passive: true });
    return () => {
      window.removeEventListener("scroll", record);
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;

    if (navigationType === "POP") {
      window.scrollTo({ top: positions.get(key) ?? 0, behavior: "instant" });
      return;
    }

    if (changedPage) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, key, navigationType]);

  return null;
}
