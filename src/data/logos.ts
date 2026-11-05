import { skills } from "./skills";
import { toolsAndWorkflow } from "./tools";

export interface LogoSource {
  logo: string;
  darkLogo?: string;
}

const registry = new Map<string, LogoSource>();

for (const entry of [...skills, ...toolsAndWorkflow]) {
  registry.set(entry.name.toLowerCase(), {
    logo: entry.logo,
    darkLogo: entry.darkLogo,
  });
}

export const getLogo = (name: string): LogoSource | undefined =>
  registry.get(name.toLowerCase());
