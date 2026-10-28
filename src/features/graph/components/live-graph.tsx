"use client";

import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { motionQueries } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";
import { buildGraphData, type GraphNode } from "../lib/graph-data";

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode> & { key: string };

/** Below this width the graph keeps only projects and shared technologies. */
const COMPACT_WIDTH = 480;
/** How close (px) the pointer must be to a project dot to light it up. */
const HIT_RADIUS = 36;

function dotRadius(node: GraphNode): number {
  return node.kind === "project" ? 6 : Math.min(2 + node.degree * 0.7, 6);
}

/** Gap between a dot and its label. */
const LABEL_GAP = 7;

/**
 * Rough rendered width of a label (Inter at 15px semibold / 13px regular),
 * so collisions and the frame's edges account for the text, not just the dot.
 */
function labelWidth(node: GraphNode, compact = false): number {
  const perChar = node.kind === "project" ? 9 : 7.2;
  // Compact labels are set at 13/12px instead of 15/13px.
  return node.label.length * perChar * (compact ? 0.86 : 1);
}

/** Box a node occupies: its dot plus the label hanging to its right. */
function nodeBox(node: SimNode, padding: number, compact: boolean) {
  const r = dotRadius(node);
  const half = node.kind === "project" ? 11 : 9;
  const x = node.x ?? 0;
  const y = node.y ?? 0;
  return {
    left: x - r - padding,
    right: x + r + LABEL_GAP + labelWidth(node, compact) + padding,
    top: y - half - padding,
    bottom: y + half + padding,
  };
}

/**
 * Collision on label boxes rather than circles: a dot's label hangs to one
 * side, so circles either overlap the text or waste space. Overlapping boxes
 * are pushed apart along their shallower axis. Pairwise, but the graph has
 * ~45 nodes, so ~1000 cheap checks per tick.
 */
function labelCollide(nodes: SimNode[], padding: number, compact: boolean) {
  return () => {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const boxA = nodeBox(a, padding, compact);
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const boxB = nodeBox(b, padding, compact);
        const overlapX =
          Math.min(boxA.right, boxB.right) - Math.max(boxA.left, boxB.left);
        const overlapY =
          Math.min(boxA.bottom, boxB.bottom) - Math.max(boxA.top, boxB.top);
        if (overlapX <= 0 || overlapY <= 0) continue;
        if (overlapX < overlapY) {
          const dir = boxA.left + boxA.right < boxB.left + boxB.right ? -1 : 1;
          a.vx = (a.vx ?? 0) + dir * overlapX * 0.5;
          b.vx = (b.vx ?? 0) - dir * overlapX * 0.5;
        } else {
          const dir = (a.y ?? 0) < (b.y ?? 0) ? -1 : 1;
          a.vy = (a.vy ?? 0) + dir * overlapY * 0.5;
          b.vy = (b.vy ?? 0) - dir * overlapY * 0.5;
        }
      }
    }
  };
}

/**
 * The skills graph as a living field: projects and the technologies they use,
 * laid out by d3-force and kept gently in motion. A slow vortex turns the whole
 * cloud, the pointer pushes nodes aside, and pointing at a project lights up
 * its technologies. Clicking a project opens its page.
 *
 * Plain SVG updated imperatively on each tick — no React Flow, no re-renders —
 * so it stays cheap enough to sit behind the hero on every device.
 *
 * Decorative: it's `aria-hidden` and not focusable. The same relationships are
 * reachable as real links (project pages, /graph and its text list).
 *
 * - Phone: fewer nodes (no one-off technologies), tighter forces; a tap lights
 *   up the nearest project instead of hovering.
 * - Reduced motion: the layout is computed up front and stays still; pointing
 *   still lights up connections, with no travel.
 */
export function LiveGraph({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [graph] = useState(buildGraphData);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  // Measure once on mount and on real resizes (not on every scroll-driven
  // scale of a parent, which ResizeObserver ignores: it reports layout size).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev &&
        Math.abs(prev.width - width) < 2 &&
        Math.abs(prev.height - height) < 2
          ? prev
          : { width: Math.round(width), height: Math.round(height) },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const compact = (size?.width ?? 0) < COMPACT_WIDTH;
  const visibleIds = new Set(
    graph.nodes
      .filter((n) => !compact || n.kind === "project" || n.degree >= 3)
      .map((n) => n.id),
  );
  const nodes = graph.nodes.filter((n) => visibleIds.has(n.id));
  const links = graph.links.filter(
    (l) => visibleIds.has(l.source) && visibleIds.has(l.target),
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !size) return;
    const { width, height } = size;
    const reduced = window.matchMedia(motionQueries.reduced).matches;
    const finePointer = window.matchMedia(motionQueries.finePointer).matches;

    const nodeEls = new Map<string, SVGGElement>();
    for (const el of svg.querySelectorAll<SVGGElement>("[data-node]")) {
      nodeEls.set(el.dataset.node ?? "", el);
    }
    const linkEls = new Map<string, SVGLineElement>();
    for (const el of svg.querySelectorAll<SVGLineElement>("[data-link]")) {
      linkEls.set(el.dataset.link ?? "", el);
    }

    // Start as a tight knot at the centre: the first second of simulation —
    // the cloud unfolding — is the graph's entrance.
    const simNodes: SimNode[] = nodes.map((node, i) => ({
      ...node,
      x: Math.cos(i) * 12,
      y: Math.sin(i) * 12,
    }));
    const simLinks: SimLink[] = links.map((link) => ({
      ...link,
      key: `${link.source}->${link.target}`,
    }));

    const halfW = width / 2 - 16;
    const halfH = height / 2 - 16;
    const pointer = { x: 0, y: 0, active: false };

    const sim: Simulation<SimNode, SimLink> = forceSimulation(simNodes)
      .force("charge", forceManyBody<SimNode>().strength(compact ? -150 : -340))
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(compact ? 64 : 92)
          .strength(0.6),
      )
      // Elliptical pull so the cloud takes the frame's proportions.
      .force("x", forceX<SimNode>(0).strength(0.04 * (height / width) * 1.6))
      .force("y", forceY<SimNode>(0).strength(compact ? 0.025 : 0.06))
      .force("collide", labelCollide(simNodes, compact ? 3 : 6, compact))
      .velocityDecay(0.35)
      .stop();

    // Vortex: a slow turn of the whole cloud (labels stay upright, unlike a
    // CSS rotation), plus a soft push away from the pointer.
    const vortex = () => {
      for (const n of simNodes) {
        n.vx = (n.vx ?? 0) - (n.y ?? 0) * 0.00035;
        n.vy = (n.vy ?? 0) + (n.x ?? 0) * 0.00035;
        if (pointer.active) {
          const dx = (n.x ?? 0) - pointer.x;
          const dy = (n.y ?? 0) - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 140) {
            const push = ((140 - dist) / 140) * 0.9;
            n.vx += (dx / dist) * push;
            n.vy += (dy / dist) * push;
          }
        }
      }
    };

    // Keep every dot and its label inside the frame. A force, not a step of
    // `draw`, so it also holds while the layout is pre-computed (reduced
    // motion) — clamping only at the end piles the nodes onto the edges.
    const bounds = () => {
      for (const n of simNodes) {
        const r = dotRadius(n);
        const minX = -halfW + r;
        const maxX = halfW - r - LABEL_GAP - labelWidth(n, compact);
        // Position only: keeping the velocity lets a collision still slide a
        // node along the edge instead of pinning two labels on top of each other.
        n.x = Math.min(Math.max(n.x ?? 0, minX), Math.max(minX, maxX));
        n.y = Math.min(Math.max(n.y ?? 0, -halfH), halfH);
      }
    };
    sim.force("bounds", bounds);

    const draw = () => {
      for (const n of simNodes) {
        nodeEls
          .get(n.id)
          ?.setAttribute("transform", `translate(${n.x} ${n.y})`);
      }
      for (const l of simLinks) {
        const el = linkEls.get(l.key);
        const s = l.source as SimNode;
        const t = l.target as SimNode;
        if (!el) continue;
        el.setAttribute("x1", String(s.x));
        el.setAttribute("y1", String(s.y));
        el.setAttribute("x2", String(t.x));
        el.setAttribute("y2", String(t.y));
      }
    };

    if (reduced) {
      sim.tick(320);
      draw();
    } else {
      sim.force("vortex", vortex).alphaTarget(0.02).on("tick", draw).restart();
    }

    // Light a project and its neighbours.
    const neighbours = graph.adjacency;
    let lit: string | null = null;
    const setLit = (id: string | null) => {
      if (id === lit) return;
      lit = id;
      svg.toggleAttribute("data-active", id !== null);
      for (const [nodeId, el] of nodeEls) {
        el.toggleAttribute(
          "data-lit",
          id !== null && (nodeId === id || !!neighbours.get(id)?.has(nodeId)),
        );
      }
      for (const [key, el] of linkEls) {
        el.toggleAttribute(
          "data-lit",
          id !== null && key.startsWith(`${id}->`),
        );
      }
    };

    const toGraph = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      // The SVG may be scaled by a scroll scene: map through its real box.
      return {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * width,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * height,
      };
    };
    const nearestProject = (p: { x: number; y: number }) => {
      let best: SimNode | null = null;
      let bestDist = HIT_RADIUS;
      for (const n of simNodes) {
        if (n.kind !== "project") continue;
        const d = Math.hypot((n.x ?? 0) - p.x, (n.y ?? 0) - p.y);
        if (d < bestDist) [best, bestDist] = [n, d];
      }
      return best;
    };

    const onMove = (event: PointerEvent) => {
      const p = toGraph(event);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = finePointer && !reduced;
      const hit = nearestProject(p);
      setLit(hit?.id ?? null);
      svg.style.cursor = hit ? "pointer" : "";
    };
    const onLeave = () => {
      pointer.active = false;
      if (finePointer) setLit(null);
    };
    const onClick = (event: PointerEvent) => {
      const hit = nearestProject(toGraph(event));
      // Touch: first tap lights the project, a second tap on it opens it.
      if (hit?.slug && (finePointer || lit === hit.id)) {
        router.push(`/projets/${hit.slug}`);
      } else {
        setLit(hit?.id ?? null);
      }
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    svg.addEventListener("click", onClick as EventListener);

    // Only simulate while the graph is on screen and the tab is visible.
    let onScreen = true;
    const sync = () => {
      if (reduced) return;
      if (onScreen && !document.hidden) sim.restart();
      else sim.stop();
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(svg);
    document.addEventListener("visibilitychange", sync);

    return () => {
      sim.stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
      svg.removeEventListener("click", onClick as EventListener);
    };
    // `nodes`/`links` are memoized by the React Compiler on `graph` + `compact`.
  }, [size, router, graph, nodes, links, compact]);

  return (
    <div ref={containerRef} className={cn("relative size-full", className)}>
      {size && (
        <svg
          ref={svgRef}
          aria-hidden="true"
          focusable="false"
          width={size.width}
          height={size.height}
          viewBox={`${-size.width / 2} ${-size.height / 2} ${size.width} ${size.height}`}
          className="group/graph absolute inset-0 size-full touch-pan-y select-none overflow-visible motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000"
        >
          <g>
            {links.map((link) => (
              <line
                key={`${link.source}->${link.target}`}
                data-link={`${link.source}->${link.target}`}
                className="stroke-foreground/15 transition-[stroke,opacity] duration-300 group-data-active/graph:opacity-30 data-lit:stroke-primary data-lit:opacity-100!"
                strokeWidth={1}
              />
            ))}
          </g>
          <g>
            {nodes.map((node) => (
              <g
                key={node.id}
                data-node={node.id}
                className="group/node transition-opacity duration-300 group-data-active/graph:opacity-25 data-lit:opacity-100!"
              >
                <circle
                  r={dotRadius(node)}
                  className={cn(
                    node.kind === "project"
                      ? "fill-primary"
                      : "fill-muted-foreground",
                  )}
                />
                <text
                  x={dotRadius(node) + LABEL_GAP}
                  y={node.kind === "project" ? 5 : 4.5}
                  className={cn(
                    "transition-opacity duration-300",
                    node.kind === "project"
                      ? cn(
                          "fill-foreground font-semibold",
                          compact ? "text-[13px]" : "text-[15px]",
                        )
                      : cn(
                          "fill-muted-foreground",
                          compact ? "text-[12px]" : "text-[13px]",
                        ),
                    // One-off technologies only name themselves when lit.
                    node.kind === "tech" &&
                      node.degree < 2 &&
                      "opacity-0 group-data-lit/node:opacity-100",
                  )}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
