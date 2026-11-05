import { FaGithub } from "react-icons/fa";

interface CodeLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export default function CodeLink({
  href,
  label = "Source code on GitHub",
  className = "",
}: CodeLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group/code tap-area inline-flex items-center gap-2 text-sm text-fg ${className}`}
    >
      <FaGithub className="text-base" />
      <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 group-hover/code:after:w-full">
        Code
      </span>
    </a>
  );
}
