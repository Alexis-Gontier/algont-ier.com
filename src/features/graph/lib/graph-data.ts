import { projects } from "@/features/projects";

export type GraphKind = "project" | "tech";

export type GraphNode = {
  /** `p:<slug>` for projects, `t:<tag>` for technologies. */
  id: string;
  label: string;
  kind: GraphKind;
  /** Number of neighbours — hubs (TypeScript, Next.js…) score high. */
  degree: number;
  /** Project slug, for linking to `/projets/[slug]`. */
  slug?: string;
};

type GraphLink = { source: string; target: string };

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
  adjacency: Map<string, Set<string>>;
};

/**
 * The project↔technology graph, derived from `features/projects` data. Shared
 * by the hero's live graph and the interactive `/graph` page so both always
 * show the same relationships.
 */
export function buildGraphData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const techSeen = new Set<string>();
  const adjacency = new Map<string, Set<string>>();

  const connect = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)?.add(b);
    adjacency.get(b)?.add(a);
  };

  for (const project of projects) {
    const projectId = `p:${project.slug}`;
    nodes.push({
      id: projectId,
      label: project.title,
      kind: "project",
      degree: 0,
      slug: project.slug,
    });

    for (const tag of project.tags) {
      const techId = `t:${tag}`;
      if (!techSeen.has(tag)) {
        techSeen.add(tag);
        nodes.push({ id: techId, label: tag, kind: "tech", degree: 0 });
      }
      links.push({ source: projectId, target: techId });
      connect(projectId, techId);
    }
  }

  for (const node of nodes) node.degree = adjacency.get(node.id)?.size ?? 0;

  return { nodes, links, adjacency };
}
