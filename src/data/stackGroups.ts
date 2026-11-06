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

const BLURBS: Record<string, string> = {
  Languages: "What I write systems, services and tooling in.",
  "Backend & Real-time":
    "Frameworks, protocols and messaging for services that stay fast under load.",
  Frontend: "Enough UI to ship the interfaces my backends need.",
  "Data Stores":
    "Relational, document, cache and analytical stores, and the layers on top.",
  "Cloud & DevOps":
    "Delivery, infrastructure and the observability that keeps it honest.",
  "Big Data": "Batch and distributed processing for larger datasets.",
  "AI & Data Science":
    "Applied ML, LLM tooling and the data libraries around them.",
  Testing: "Unit, integration, end-to-end and load testing.",
  "AI Coding": "Assistants I build with day to day.",
  "API & Databases": "Exploring and debugging services and data.",
  Collaboration: "Planning, docs and communication.",
  "Editors & IDEs": "Where the code gets written.",
  "Packaging & Build": "Dependency management and monorepo builds.",
};

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
  blurb: BLURBS[label],
  items: skills
    .filter((skill) => SKILL_GROUP[skill.filterCategories[0]] === label)
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
    .map(toSkillItem),
})).filter((group) => group.items.length > 0);

export const toolGroups: StackGroupData[] = [
  ...new Set(toolsAndWorkflow.map((tool) => tool.group)),
].map((label) => ({
  label,
  blurb: BLURBS[label],
  items: toolsAndWorkflow
    .filter((tool) => tool.group === label)
    .map(toToolItem),
}));
