import { useState, useEffect } from "react";

export interface Command {
  label: string;
  id: string;
}

interface CommandPaletteProps {
  commands: Command[];
}

export default function CommandPalette({ commands }: CommandPaletteProps) {
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
    const handler = (e: KeyboardEvent) => {
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

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 pt-40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a section"
        className="w-11/12 border border-line-strong bg-bg text-fg shadow-lg sm:w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          aria-label="Search sections"
          placeholder="Search sections..."
          className="w-full border-b border-line bg-transparent px-4 py-3 text-fg outline-none placeholder:text-faint"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto">
          {filtered.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => goToSection(cmd.id)}
              className={`w-full cursor-pointer px-4 py-3 text-left transition-colors duration-150 hover:bg-surface hover:text-fg ${
                index === activeIndex ? "bg-surface text-fg" : "text-muted"
              }`}
            >
              {cmd.label}
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-faint">No matching section.</p>
          )}
        </div>
      </div>
    </div>
  );
}
