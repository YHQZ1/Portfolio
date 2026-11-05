import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

interface BaseProps {
  label: string;
  hint?: string;
  hideHintOnMobile?: boolean;
  icon?: ReactNode;
}

type LinkRowProps = BaseProps &
  (
    | { to: string; href?: never; onClick?: never }
    | { href: string; to?: never; onClick?: never }
    | { onClick: () => void; to?: never; href?: never }
  );

const rowClass =
  "group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-line py-5 text-left text-2xl font-extralight tracking-tight text-fg";

const iconClass = "shrink-0 text-lg transition-transform duration-300";

export default function LinkRow({
  label,
  hint,
  hideHintOnMobile = false,
  icon,
  to,
  href,
  onClick,
}: LinkRowProps) {
  const content = (
    <>
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {label}
      </span>
      {hint && (
        <span
          className={`ml-auto truncate text-sm font-normal tracking-normal text-faint ${
            hideHintOnMobile ? "hidden sm:block" : ""
          }`}
        >
          {hint}
        </span>
      )}
      {icon ??
        (href ? (
          <FiArrowUpRight
            className={`${iconClass} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
          />
        ) : (
          <FiArrowRight className={`${iconClass} group-hover:translate-x-1`} />
        ))}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={rowClass}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClass}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {content}
    </button>
  );
}
