import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`w-full px-5 pt-24 pb-20 sm:px-8 sm:pt-28 md:pt-32 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}
