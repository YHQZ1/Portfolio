import type { Role } from "../../data/about";

const nodeClass = (current?: boolean) =>
  `absolute size-3 transition-colors duration-300 ${
    current
      ? "bg-fg ring-4 ring-fg/15"
      : "border-2 border-faint bg-bg group-hover/role:border-fg"
  }`;

export default function RoleTimeline({ roles }: { roles: Role[] }) {
  const single = roles.length === 1;

  return (
    <>
      {/* Phones and tablets: vertical strip, newest first */}
      <ol className="lg:hidden">
        {roles.map((role) => (
          <li
            key={role.title}
            className="group/role relative pb-10 pl-10 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-5 -bottom-1 left-[5px] w-0.5 bg-line-strong group-last/role:hidden"
            />
            <span
              aria-hidden="true"
              className={`${nodeClass(role.current)} top-[3px] left-0`}
            />
            <p className="eyebrow mb-3">{role.period}</p>
            <h3 className="text-2xl leading-[1.3] font-extralight tracking-tight text-fg sm:text-3xl">
              {role.title}
            </h3>
            <p className="body-text mt-4 max-w-2xl">{role.body}</p>
          </li>
        ))}
      </ol>

      {/* Desktop: horizontal strip, oldest to newest */}
      <ol
        className="relative hidden lg:grid"
        style={{
          gridTemplateColumns: `repeat(${roles.length}, minmax(0, 1fr))`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[5px] h-0.5 bg-line-strong"
        />
        {[...roles].reverse().map((role) => (
          <li
            key={role.title}
            className="group/role relative pt-12 pr-12 last:pr-0"
          >
            <span
              aria-hidden="true"
              className={`${nodeClass(role.current)} top-0 left-0`}
            />
            <p className="eyebrow">{role.period}</p>
            <div
              className={
                single
                  ? "mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12"
                  : "mt-5"
              }
            >
              <h3
                className={`text-2xl leading-[1.3] font-extralight tracking-tight text-fg xl:text-3xl ${
                  single ? "" : "min-h-[2.6em]"
                }`}
              >
                {role.title}
              </h3>
              <p className={`body-text ${single ? "mt-1.5" : "mt-5"}`}>
                {role.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
