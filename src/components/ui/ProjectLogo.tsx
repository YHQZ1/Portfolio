import type { ProjectLogo as ProjectLogoSources } from "../../data/projects";
import ThemedImage from "./ThemedImage";

interface ProjectLogoProps {
  logo: ProjectLogoSources;
  alt: string;
  className?: string;
}

export default function ProjectLogo({
  logo,
  alt,
  className = "",
}: ProjectLogoProps) {
  return (
    <ThemedImage
      light={logo.light}
      dark={logo.dark}
      alt={alt}
      className={className}
    />
  );
}
