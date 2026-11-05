import type { ReactNode } from "react";

interface CollapseProps {
  open: boolean;
  id?: string;
  children: ReactNode;
}

export default function Collapse({ open, id, children }: CollapseProps) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
