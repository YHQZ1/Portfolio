import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

interface TextLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  className?: string;
}

const base =
  "group/link tap-area relative inline-flex items-center gap-1.5 text-sm text-fg";

const underline =
  "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 group-hover/link:after:w-full";

export default function TextLink({
  children,
  to,
  href,
  className = "",
}: TextLinkProps) {
  if (to) {
    return (
      <Link to={to} className={`${base} ${className}`}>
        <span className={underline}>{children}</span>
        <FiArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`}
    >
      <span className={underline}>{children}</span>
      <FiArrowUpRight className="text-xs transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </a>
  );
}
