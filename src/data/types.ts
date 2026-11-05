import type { SkillTier } from "./skills";

export interface StackItem {
  name: string;
  logo: string;
  darkLogo?: string;
  meta?: string;
  tagsLabel?: string;
  tags?: string[];
  tier?: SkillTier;
}

export interface StackGroupData {
  label: string;
  items: StackItem[];
}
