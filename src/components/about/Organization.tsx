import type { ReactNode } from "react";

export default function Organization({
  logo,
  name,
  place,
  span,
  children,
}: {
  logo?: string;
  name: string;
  place: string;
  span?: string;
  children: ReactNode;
}) {
  return (
    <article className="border-t border-line pt-8 md:pt-10">
      <div className="flex items-center gap-5">
        {logo && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center">
            <img
              src={logo}
              alt={`${name} logo`}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </span>
        )}
        <div>
          <h3 className="text-xl font-light text-fg">{name}</h3>
          <p className="mt-1 text-sm text-faint">{place}</p>
        </div>
        {span && <p className="eyebrow ml-auto hidden sm:block">{span}</p>}
      </div>

      <div className="mt-10 md:mt-12">{children}</div>
    </article>
  );
}
