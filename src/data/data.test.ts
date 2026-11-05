import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getLogo } from "./logos";
import { projects } from "./projects";
import { skills } from "./skills";
import { toolsAndWorkflow } from "./tools";
import { skillGroups, toolGroups } from "./stackGroups";

const PUBLIC_DIR = join(process.cwd(), "public");

const localPaths = (values: (string | undefined)[]) =>
  values.filter((value): value is string => Boolean(value?.startsWith("/")));

describe("projects", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every selected project a logo, highlights and a diagram", () => {
    for (const project of projects.filter((p) => p.category === "selected")) {
      expect(project.logo, `${project.slug} logo`).toBeTruthy();
      expect(
        project.highlights?.length,
        `${project.slug} highlights`
      ).toBeGreaterThan(0);
      expect(project.architecture, `${project.slug} architecture`).toBeTruthy();
    }
  });

  it("links every project to a GitHub repository", () => {
    for (const project of projects) {
      expect(project.github, project.slug).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("builds architecture diagrams that are internally consistent", () => {
    for (const project of projects) {
      const architecture = project.architecture;
      if (!architecture) continue;

      const ids = new Set(architecture.nodes.map((node) => node.id));
      expect(ids.size, `${project.slug} node ids`).toBe(
        architecture.nodes.length
      );

      for (const node of architecture.nodes) {
        expect(
          node.col,
          `${project.slug}/${node.id} col`
        ).toBeGreaterThanOrEqual(0);
        expect(node.col, `${project.slug}/${node.id} col`).toBeLessThan(
          architecture.stages.length
        );
      }

      for (const edge of architecture.edges) {
        expect(
          ids.has(edge.from),
          `${project.slug} edge from ${edge.from}`
        ).toBe(true);
        expect(ids.has(edge.to), `${project.slug} edge to ${edge.to}`).toBe(
          true
        );
      }
    }
  });

  it("only references diagram icons that have a logo", () => {
    for (const project of projects) {
      for (const node of project.architecture?.nodes ?? []) {
        for (const icon of node.icons ?? []) {
          expect(
            getLogo(icon),
            `${project.slug}/${node.id} icon "${icon}"`
          ).toBeTruthy();
        }
      }
    }
  });
});

describe("logo files", () => {
  it("exist on disk for every local project, skill and tool logo", () => {
    const paths = localPaths([
      ...projects.flatMap((p) => [p.logo?.light, p.logo?.dark]),
      ...skills.flatMap((s) => [s.logo, s.darkLogo]),
      ...toolsAndWorkflow.flatMap((t) => [t.logo, t.darkLogo]),
    ]);

    expect(paths.length).toBeGreaterThan(0);

    const missing = paths.filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });
});

describe("skills and tools", () => {
  it("has no duplicate skill or tool names", () => {
    for (const list of [skills, toolsAndWorkflow]) {
      const names = list.map((entry) => entry.name.toLowerCase());
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it("puts every skill and tool into a group", () => {
    const skillCount = skillGroups.reduce((sum, g) => sum + g.items.length, 0);
    const toolCount = toolGroups.reduce((sum, g) => sum + g.items.length, 0);

    expect(skillCount).toBe(skills.length);
    expect(toolCount).toBe(toolsAndWorkflow.length);
  });
});
