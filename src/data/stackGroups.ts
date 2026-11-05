import { skills, type FilterKey, type Skill, type SkillTier } from "./skills";
import { toolsAndWorkflow, type Tool } from "./tools";
import type { StackGroupData, StackItem } from "./types";

const SKILL_GROUP: Record<FilterKey, string> = {
  languages: "Languages",
  backend: "Backend & Real-time",
  "real-time": "Backend & Real-time",
  "low-level": "Backend & Real-time",
  frontend: "Frontend",
  database: "Data Stores",
  cloud: "Cloud & DevOps",
  devops: "Cloud & DevOps",
  observability: "Cloud & DevOps",
  "big-data": "Big Data",
  "ai-ml": "AI & Data Science",
  "data-science": "AI & Data Science",
  testing: "Testing",
};

const SKILL_GROUP_ORDER = [
  "Languages",
  "Backend & Real-time",
  "Frontend",
  "Data Stores",
  "Cloud & DevOps",
  "Big Data",
  "AI & Data Science",
  "Testing",
];

const TIER_ORDER: Record<SkillTier, number> = {
  core: 0,
  applied: 1,
  exploration: 2,
};

const toSkillItem = (skill: Skill): StackItem => ({
  name: skill.name,
  logo: skill.logo,
  darkLogo: skill.darkLogo,
  meta: `${skill.level} · ${skill.experience}`,
  tagsLabel: "Used in",
  tags: skill.category,
  tier: skill.tier,
});

const toToolItem = (tool: Tool): StackItem => ({
  name: tool.name,
  logo: tool.logo,
  darkLogo: tool.darkLogo,
  tagsLabel: "Used for",
  tags: tool.category,
});

export const skillGroups: StackGroupData[] = SKILL_GROUP_ORDER.map((label) => ({
  label,
  items: skills
    .filter((skill) => SKILL_GROUP[skill.filterCategories[0]] === label)
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
    .map(toSkillItem),
})).filter((group) => group.items.length > 0);

export const toolGroups: StackGroupData[] = [
  ...new Set(toolsAndWorkflow.map((tool) => tool.group)),
].map((label) => ({
  label,
  items: toolsAndWorkflow
    .filter((tool) => tool.group === label)
    .map(toToolItem),
}));
