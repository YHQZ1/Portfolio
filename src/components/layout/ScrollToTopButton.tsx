import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-4 bottom-4 z-40 flex size-10 sm:right-6 sm:bottom-6 sm:size-11 cursor-pointer items-center justify-center border border-line-strong bg-bg/90 text-fg backdrop-blur-md transition-colors duration-200 hover:bg-fg hover:text-bg"
    >
      <FiArrowUp />
    </button>
  );
}
