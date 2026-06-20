"use client";

import {
  Background,
  Controls,
  type Edge,
  Handle,
  MiniMap,
  type Node,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/features/projects";
import { cn } from "@/lib/utils/cn";

type Kind = "project" | "tech";
type GraphNodeData = {
  label: string;
  kind: Kind;
  degree: number;
  faded: boolean;
};

const hiddenHandle =
  "!size-0 !min-w-0 !min-h-0 !border-0 !bg-transparent !left-1/2 !top-1/2";

/** Bigger tech pills for more-connected technologies (hubs stand out). */
function techSizeClass(degree: number): string {
  if (degree >= 4) return "px-4 py-1.5 text-lg font-semibold";
  if (degree >= 2) return "px-3.5 py-1 text-base font-medium";
  return "px-3 py-1 text-sm";
}

/**
 * Estimate a node's collision radius from its rendered width so labels never
 * overlap. Pill widths track the same size tiers as `techSizeClass`/the project
 * style: roughly (chars × per-char px) + horizontal padding.
 */
function collideRadius(kind: Kind, label: string, degree: number): number {
  // [perChar, horizontalPadding] mirroring the Tailwind size classes above.
  let perChar = 8;
  let padding = 32;
  if (kind === "tech") {
    if (degree >= 4) [perChar, padding] = [10, 32];
    else if (degree >= 2) [perChar, padding] = [9, 28];
    else [perChar, padding] = [7.5, 24];
  }
  const width = label.length * perChar + padding;
  // Half-width as the radius, plus breathing room between neighbours.
  return width / 2 + 14;
}

function GraphNode({ data }: { data: GraphNodeData }) {
  return (
    <div
      className={cn(
        "rounded-full border text-center transition-opacity",
        data.kind === "project" &&
          "border-transparent bg-primary px-4 py-2 font-semibold text-primary-foreground",
        data.kind === "tech" &&
          cn("bg-card text-muted-foreground", techSizeClass(data.degree)),
        data.faded && "opacity-20",
      )}
    >
      <Handle type="target" position={Position.Top} className={hiddenHandle} />
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        className={hiddenHandle}
      />
    </div>
  );
}

const nodeTypes = { graphNode: GraphNode };

type SimNode = {
  id: string;
  label: string;
  kind: Kind;
  x?: number;
  y?: number;
};
type LinkPair = { source: string; target: string };

/** Build a project↔technology graph and run a force layout (Obsidian-style). */
function buildLayout() {
  const simNodes: SimNode[] = [];
  const linkPairs: LinkPair[] = [];
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
    simNodes.push({ id: projectId, label: project.title, kind: "project" });

    for (const tag of project.tags) {
      const techId = `t:${tag}`;
      if (!techSeen.has(tag)) {
        techSeen.add(tag);
        simNodes.push({ id: techId, label: tag, kind: "tech" });
      }
      linkPairs.push({ source: projectId, target: techId });
      connect(projectId, techId);
    }
  }

  // d3-force mutates the link objects it receives (replacing source/target
  // with node refs), so feed it copies and keep `linkPairs` as plain strings.
  const degreeOf = (id: string) => adjacency.get(id)?.size ?? 0;

  forceSimulation(simNodes as never)
    .force("charge", forceManyBody().strength(-600))
    .force(
      "link",
      forceLink(linkPairs.map((link) => ({ ...link })) as never)
        .id((d) => (d as unknown as SimNode).id)
        .distance(110),
    )
    .force("center", forceCenter(0, 0))
    // Pull every node gently toward the origin so disconnected projects/clusters
    // stay grouped instead of drifting far apart under charge repulsion.
    .force("x", forceX(0).strength(0.08))
    .force("y", forceY(0).strength(0.08))
    .force(
      "collide",
      forceCollide<SimNode>((node) =>
        collideRadius(node.kind, node.label, degreeOf(node.id)),
      ),
    )
    .stop()
    .tick(400);

  const nodes: Node[] = simNodes.map((node) => ({
    id: node.id,
    type: "graphNode",
    position: { x: node.x ?? 0, y: node.y ?? 0 },
    data: {
      label: node.label,
      kind: node.kind,
      degree: adjacency.get(node.id)?.size ?? 0,
      faded: false,
    },
  }));

  const edges: Edge[] = linkPairs.map((link) => ({
    id: `${link.source}->${link.target}`,
    source: link.source,
    target: link.target,
  }));

  return { nodes, edges, adjacency };
}

type SkillsGraphProps = {
  className?: string;
  /** Full pan/zoom/drag + controls. Disable for a static preview (e.g. hero). */
  interactive?: boolean;
};

export function SkillsGraph({
  className,
  interactive = true,
}: SkillsGraphProps) {
  const layout = useMemo(buildLayout, []);
  const [nodes, , onNodesChange] = useNodesState(layout.nodes);
  const [edges, , onEdgesChange] = useEdgesState(layout.edges);
  const { adjacency } = layout;
  const [hovered, setHovered] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const t = useTranslations("Graph");
  const legend = { project: t("legendProject"), tech: t("legendTech") };
  // React Flow measures the DOM, so render it only on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActive = (id: string) =>
    !hovered || id === hovered || !!adjacency.get(hovered)?.has(id);

  const displayNodes = nodes.map((node) => ({
    ...node,
    data: { ...node.data, faded: hovered ? !isActive(node.id) : false },
  }));

  const displayEdges = edges.map((edge) => {
    const active =
      !hovered || edge.source === hovered || edge.target === hovered;
    return {
      ...edge,
      style: {
        stroke: active ? "rgb(148 163 184 / 0.7)" : "rgb(148 163 184 / 0.12)",
      },
    };
  });

  return (
    <div
      className={cn(
        "size-full overflow-hidden rounded-xl border bg-muted/20",
        className,
      )}
    >
      {mounted && (
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          nodesConnectable={false}
          edgesFocusable={false}
          panOnDrag
          zoomOnPinch
          zoomOnDoubleClick
          // Move nodes only on the full page; the preview is pan/zoom only.
          nodesDraggable={interactive}
          // Wheel zoom only on the full page; elsewhere the wheel scrolls the page.
          zoomOnScroll={interactive}
          preventScrolling={interactive}
          defaultEdgeOptions={{ type: "straight" }}
          onNodeMouseEnter={(_, node) => setHovered(node.id)}
          onNodeMouseLeave={() => setHovered(null)}
        >
          <Background gap={24} className="text-border" />
          {interactive && (
            <>
              <Controls showInteractive={false} />
              <MiniMap
                pannable
                zoomable
                nodeColor={(node) =>
                  (node.data as GraphNodeData).kind === "project"
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)"
                }
                className="bg-card!"
              />
            </>
          )}
          {interactive && (
            <Panel
              position="top-left"
              className="flex gap-4 rounded-lg border bg-card/80 px-3 py-2 text-xs backdrop-blur-sm"
            >
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                {legend.project}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border bg-card" />
                {legend.tech}
              </span>
            </Panel>
          )}
        </ReactFlow>
      )}
    </div>
  );
}
