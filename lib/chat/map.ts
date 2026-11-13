import type { Project } from "@/lib/content";

/** The three kinds of work the map colours by. */
export type Category = "cloud" | "product" | "ai";

export const CATEGORIES: readonly Category[] = ["cloud", "product", "ai"];

const CATEGORY: Record<string, Category> = {
  "gitops-eks-platform": "cloud",
  "devops-observability-platform": "cloud",
  cityvoice: "cloud",
  "verdustry-social": "product",
  carnova: "product",
  sabeel: "product",
  readdly: "product",
  dawrek: "ai",
  "automotive-ml": "ai",
};

export function categoryOf(slug: string): Category {
  return CATEGORY[slug] ?? "product";
}

/** Shorter names for the projects whose full name would not fit beside a point. */
const SHORT_LABEL: Record<string, string> = {
  "gitops-eks-platform": "GitOps EKS",
  "devops-observability-platform": "Observability",
};

export function mapLabel(project: Project): string {
  return SHORT_LABEL[project.slug] ?? project.name;
}

/** The tools on the outer ring, in the order they are drawn. */
export const MAP_TOOLS = [
  "AWS",
  "Terraform",
  "Argo CD",
  "Kubernetes",
  "Prometheus",
  "Grafana",
  "Jenkins",
  "OpenStack",
  "Spring Boot",
  "Angular",
  "PostgreSQL",
  "Docker",
  "FastAPI",
  "Python",
  "Symfony",
  "GitHub Actions",
] as const;

/** Other spellings in a project's stack that mean the same ring tool. */
const TOOL_ALIASES: Record<string, string[]> = { Kubernetes: ["eks"] };

/** The ring tools a project is linked to, read from its own stack list. */
export function toolsOf(project: Project): string[] {
  const stack = project.stack.map((entry) => entry.toLowerCase());
  return MAP_TOOLS.filter((tool) =>
    [tool, ...(TOOL_ALIASES[tool] ?? [])].some((name) =>
      stack.some((entry) => entry.includes(name.toLowerCase())),
    ),
  );
}

/** The ring tool a matched word such as "kubernetes" or "spring" refers to, if any. */
export function ringTool(label: string): string | undefined {
  const wanted = label.toLowerCase();
  return (
    MAP_TOOLS.find((tool) => tool.toLowerCase() === wanted) ??
    MAP_TOOLS.find((tool) => tool.toLowerCase().split(" ").includes(wanted))
  );
}
