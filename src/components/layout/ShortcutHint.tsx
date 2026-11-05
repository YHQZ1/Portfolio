import { useEffect, useState } from "react";

export default function ShortcutHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(false), 1200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed bottom-6 left-6 z-40 hidden border border-line bg-bg/90 px-2.5 py-1.5 text-xs whitespace-nowrap text-muted backdrop-blur-md transition-opacity duration-300 sm:block ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ⌘K / Ctrl+K to search
    </div>
  );
}
