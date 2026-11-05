import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  title: string;
  count?: number;
  children?: ReactNode;
}

export default function SectionHeading({
  id,
  title,
  count,
  children,
}: SectionHeadingProps) {
  return (
    <div id={id} className="mb-10 scroll-mt-28 sm:mb-12">
      <h2 className="group relative mb-3 inline-block text-3xl leading-[1.2] font-extralight tracking-tight text-fg sm:text-4xl md:text-5xl">
        {title}
        {count !== undefined && (
          <sup className="ml-3 align-super text-sm font-normal tracking-widest text-faint">
            {String(count).padStart(2, "0")}
          </sup>
        )}
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full" />
      </h2>
      {children && (
        <p className="max-w-3xl text-sm leading-[1.7] text-muted">{children}</p>
      )}
    </div>
  );
}
