import { useState, useEffect } from "react";

export default function CommandPalette({ darkMode, commands }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (!open) return;

      if (e.key === "Escape") setOpen(false);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 >= 0 ? prev - 1 : filtered.length - 1
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) goToSection(cmd.id);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, activeIndex]);

  const goToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-40 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className={`w-11/12 sm:w-[500px] rounded-md shadow-lg border ${
          darkMode
            ? "bg-[#111] border-[#222] text-[#f5f5f5]"
            : "bg-white border-[#ddd] text-[#111]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          placeholder="Search sections..."
          className={`w-full px-4 py-3 border-b outline-none ${
            darkMode
              ? "bg-[#111] border-[#222] text-[#f5f5f5]"
              : "bg-white border-[#eee] text-[#111]"
          }`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto">
          {filtered.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => goToSection(cmd.id)}
              className={`
                w-full text-left px-4 py-3 transition-all duration-150
                ${
                  index === activeIndex
                    ? darkMode
                      ? "bg-[#1e1e1e]"
                      : "bg-[#eaeaea]"
                    : darkMode
                      ? "hover:bg-[#1a1a1a]"
                      : "hover:bg-[#f0f0f0]"
                }
              `}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
