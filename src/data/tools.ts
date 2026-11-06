export interface Tool {
  name: string;
  group: string;
  logo: string;
  darkLogo?: string;
  category: string[];
}

export const toolsAndWorkflow: Tool[] = [
  {
    name: "VS Code",
    group: "Editors & IDEs",
    logo: "/skills/vscode.webp",
    category: ["Code Editing", "Extension Ecosystem", "Remote Development"],
  },
  {
    name: "Claude Code",
    group: "AI Coding",
    logo: "/skills/claude-code.webp",
    category: ["Agentic Coding", "CLI Workflow", "MCP & Subagents"],
  },
  {
    name: "Codex",
    group: "AI Coding",
    logo: "/skills/codex.webp",
    category: ["Agentic Coding", "Cloud Sandbox", "Parallel Tasks"],
  },
  {
    name: "Hermes Agent",
    group: "AI Coding",
    logo: "/skills/hermes-light.webp",
    darkLogo: "/skills/hermes-dark.webp",
    category: ["Agentic Coding", "Self-hosted Agent", "Tool Use"],
  },
  {
    name: "WebStorm",
    group: "Editors & IDEs",
    logo: "/skills/webstorm.webp",
    category: [
      "JS/TS Development",
      "Framework-aware Editing",
      "Integrated Debugging",
    ],
  },
  {
    name: "GoLand",
    group: "Editors & IDEs",
    logo: "/skills/goland.webp",
    category: ["Go Development", "Refactoring Tools", "Profiling & Debugging"],
  },
  {
    name: "IntelliJ IDEA",
    group: "Editors & IDEs",
    logo: "/skills/intellij.webp",
    category: [
      "JVM Development",
      "Smart Code Completion",
      "Build Tool Integration",
    ],
  },
  {
    name: "Jupyter Notebook",
    group: "Editors & IDEs",
    logo: "https://cdn.simpleicons.org/jupyter/F37626",
    category: [
      "Interactive Computing",
      "Data Exploration",
      "ML Experimentation",
    ],
  },
  {
    name: "Postman",
    group: "API & Databases",
    logo: "https://cdn.simpleicons.org/postman/FF6C37",
    category: [
      "API Testing",
      "Collections & Environments",
      "API Documentation",
    ],
  },
  {
    name: "Insomnia",
    group: "API & Databases",
    logo: "https://cdn.simpleicons.org/insomnia/4000BF",
    category: [
      "gRPC & GraphQL Client",
      "Request Debugging",
      "Lightweight API Client",
    ],
  },
  {
    name: "cURL",
    group: "API & Databases",
    logo: "https://cdn.simpleicons.org/curl/073551",
    darkLogo: "https://cdn.simpleicons.org/curl/FFFFFF",
    category: ["HTTP Requests", "Network Debugging", "Command-line Tooling"],
  },
  {
    name: "DBeaver",
    group: "API & Databases",
    logo: "/skills/dbeaver.webp",
    category: ["Database GUI", "Query Execution", "Schema Visualization"],
  },
  {
    name: "Swagger UI",
    group: "API & Databases",
    logo: "https://cdn.simpleicons.org/swagger/60B812",
    darkLogo: "https://cdn.simpleicons.org/swagger/85EA2D",
    category: [
      "API Documentation",
      "Interactive API Explorer",
      "OpenAPI Visualization",
    ],
  },
  {
    name: "Yarn",
    group: "Packaging & Build",
    logo: "https://cdn.simpleicons.org/yarn/2C8EBB",
    category: ["Package Management", "Lockfile Determinism", "Workspaces"],
  },
  {
    name: "Maven",
    group: "Packaging & Build",
    logo: "https://cdn.simpleicons.org/apachemaven/C71A36",
    category: ["Dependency Management", "Build Lifecycle", "Java Projects"],
  },
  {
    name: "pnpm",
    group: "Packaging & Build",
    logo: "/skills/pnpm.webp",
    category: [
      "Disk-efficient Installs",
      "Strict Dependency Isolation",
      "Monorepo Support",
    ],
  },
  {
    name: "Turborepo",
    group: "Packaging & Build",
    logo: "/skills/turborepo.webp",
    category: [
      "Monorepo Architecture",
      "Task Orchestration",
      "Remote Build Caching",
    ],
  },
  {
    name: "GitHub",
    group: "Collaboration",
    logo: "https://cdn.simpleicons.org/github/181717",
    darkLogo: "https://cdn.simpleicons.org/github/FFFFFF",
    category: [
      "Pull Request Workflow",
      "Code Review",
      "Open Source Collaboration",
    ],
  },
  {
    name: "Bitbucket",
    group: "Collaboration",
    logo: "/skills/bitbucket.webp",
    category: [
      "Version Control Hosting",
      "Bitbucket Pipelines",
      "Jira Integration",
    ],
  },
  {
    name: "Jira",
    group: "Collaboration",
    logo: "https://cdn.simpleicons.org/jira/0052CC",
    category: ["Issue Tracking", "Sprint Planning", "Agile Workflows"],
  },
  {
    name: "Confluence",
    group: "Collaboration",
    logo: "/skills/confluence.webp",
    category: ["Team Documentation", "Knowledge Base", "Technical Specs"],
  },
  {
    name: "Slack",
    group: "Collaboration",
    logo: "/skills/slack.webp",
    category: ["Team Communication", "Collaboration", "Developer Workflows"],
  },
  {
    name: "Obsidian",
    group: "Collaboration",
    logo: "https://cdn.simpleicons.org/obsidian/7C3AED",
    category: ["Knowledge Management", "Note-taking", "Personal Wiki"],
  },
  {
    name: "Notion",
    group: "Collaboration",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    category: ["Documentation", "Project Planning", "Team Wikis"],
  },
];
