"use client";

import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import {
  ArrowUpRightIcon,
  CodeIcon,
  GlobeIcon,
  MaximizeIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { getProjectBySlug } from "@/features/projects";
import { toLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { motionQueries } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";
import {
  buildGraphData,
  type GraphData,
  type GraphNode,
} from "../lib/graph-data";
import {
  categoryDotClass,
  type TechCategory,
  techCategories,
  techCategory,
} from "../lib/tech-category";

/*
 * An Obsidian-style graph view: a live d3-force layout drawn on a canvas,
 * small circles sized by connections, labels that fade in as you zoom, and a
 * settings panel for filters, colour groups, display and forces.
 *
 * The canvas is decorative for assistive tech (`aria-hidden`): every node is
 * reachable through real controls — the search field, the category chips and
 * the detail panel's links — and the page renders the same relationships as
 * an `sr-only` list.
 */

type Settings = {
  /** Show technologies only one project uses. */
  showOneOff: boolean;
  /** Colour technologies by toolbox category. */
  colorGroups: boolean;
  nodeSize: number;
  linkThickness: number;
  /** Zoom level from which technology labels are fully shown. */
  textFade: number;
  centerForce: number;
  repelForce: number;
  linkForce: number;
  linkDistance: number;
};

const DEFAULT_SETTINGS: Settings = {
  showOneOff: true,
  colorGroups: true,
  nodeSize: 1,
  linkThickness: 1,
  textFade: 0.8,
  centerForce: 0.5,
  repelForce: 14,
  linkForce: 0.6,
  linkDistance: 70,
};

type SimNode = GraphNode &
  SimulationNodeDatum & { category: TechCategory | null; minor: boolean };
type SimLink = SimulationLinkDatum<SimNode> & {
  source: SimNode | string;
  target: SimNode | string;
};

type ViewState = {
  selected: string | null;
  category: TechCategory | null;
  query: string;
  settings: Settings;
};

type Engine = {
  update: (state: ViewState) => void;
  zoomBy: (factor: number) => void;
  fit: (ids?: Set<string>) => void;
  focus: (id: string) => void;
  refreshColors: () => void;
  destroy: () => void;
};

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;

function nodeRadius(node: SimNode, size: number): number {
  const base =
    node.kind === "project"
      ? 6 + Math.sqrt(node.degree) * 1.2
      : 3 + Math.sqrt(node.degree) * 1.5;
  return base * size;
}

/** Case- and accent-insensitive form of a label, for search. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Nodes lit by the current focus, category or search — `null` = none dimmed. */
function litNodes(
  data: GraphData,
  nodes: SimNode[],
  focus: string | null,
  state: ViewState,
): Set<string> | null {
  if (focus) return new Set([focus, ...(data.adjacency.get(focus) ?? [])]);
  if (state.category) {
    const lit = new Set<string>();
    for (const node of nodes) {
      if (node.category !== state.category) continue;
      lit.add(node.id);
      for (const project of data.adjacency.get(node.id) ?? []) lit.add(project);
    }
    return lit;
  }
  const query = normalize(state.query.trim());
  if (query) {
    return new Set(
      nodes.filter((n) => normalize(n.label).includes(query)).map((n) => n.id),
    );
  }
  return null;
}

/**
 * The canvas engine: simulation, drawing and pointer handling, kept out of
 * React so pointer moves and simulation ticks never re-render the page.
 */
function createEngine(
  canvas: HTMLCanvasElement,
  data: GraphData,
  initial: ViewState,
  onSelect: (id: string | null) => void,
): Engine {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const reduced = window.matchMedia(motionQueries.reduced).matches;

  const nodes: SimNode[] = data.nodes.map((node, i) => ({
    ...node,
    category: node.kind === "tech" ? techCategory(node.label) : null,
    minor: node.kind === "tech" && node.degree < 2,
    // Seed on a spiral so the first layout is deterministic.
    x: Math.cos(i * 2.4) * (20 + i * 4),
    y: Math.sin(i * 2.4) * (20 + i * 4),
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const allLinks: SimLink[] = data.links.map((link) => ({ ...link }));

  let state = initial;
  let hovered: string | null = null;
  let view = { x: 0, y: 0, k: 1 };
  let size = { width: 0, height: 0, dpr: 1 };
  let colors = readColors();

  const visible = () =>
    nodes.filter((node) => state.settings.showOneOff || !node.minor);
  const endpoint = (end: SimNode | string) =>
    typeof end === "string" ? (byId.get(end) as SimNode) : end;
  const visibleLinks = () =>
    allLinks.filter(
      (link) => state.settings.showOneOff || !endpoint(link.target).minor,
    );

  const radius = (node: SimNode) => nodeRadius(node, state.settings.nodeSize);

  const sim = forceSimulation<SimNode, SimLink>()
    .force(
      "link",
      forceLink<SimNode, SimLink>().id((node) => node.id),
    )
    .force("charge", forceManyBody<SimNode>())
    .force("x", forceX<SimNode>(0))
    .force("y", forceY<SimNode>(0))
    .force(
      "collide",
      forceCollide<SimNode>((node) => radius(node) + 4),
    )
    .on("tick", () => requestDraw())
    .stop();

  function applyForces() {
    const s = state.settings;
    sim.nodes(visible());
    sim
      .force<ReturnType<typeof forceLink<SimNode, SimLink>>>("link")
      ?.links(visibleLinks())
      .distance(s.linkDistance)
      .strength(s.linkForce);
    sim
      .force<ReturnType<typeof forceManyBody<SimNode>>>("charge")
      ?.strength(-s.repelForce * 25);
    // Weaker horizontally so the cloud takes the frame's landscape shape.
    const aspect = size.width && size.height ? size.height / size.width : 0.6;
    sim
      .force<ReturnType<typeof forceX<SimNode>>>("x")
      ?.strength(s.centerForce * 0.12 * aspect);
    sim
      .force<ReturnType<typeof forceY<SimNode>>>("y")
      ?.strength(s.centerForce * 0.12);
    sim
      .force<ReturnType<typeof forceCollide<SimNode>>>("collide")
      ?.radius((node) => radius(node) + 4);
  }

  /** Re-run the layout after a change; instant under reduced motion. */
  function reheat(alpha = 0.5) {
    if (reduced) {
      sim.alpha(alpha);
      for (let i = 0; i < 200; i++) sim.tick();
      requestDraw();
    } else {
      sim.alpha(alpha).restart();
    }
  }

  function readColors() {
    const style = getComputedStyle(canvas);
    const get = (name: string) => style.getPropertyValue(name).trim();
    return {
      primary: get("--primary"),
      foreground: get("--foreground"),
      muted: get("--muted-foreground"),
      border: get("--border"),
      card: get("--card"),
      category: {
        frontend: get("--chart-1"),
        backend: get("--chart-4"),
        database: get("--chart-5"),
        devops: get("--chart-2"),
        tools: get("--chart-3"),
        other: get("--muted-foreground"),
      } satisfies Record<TechCategory, string>,
      font: style.fontFamily,
    };
  }

  let frame = 0;
  function requestDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function draw() {
    frame = 0;
    const { width, height, dpr } = size;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(
      dpr * view.k,
      0,
      0,
      dpr * view.k,
      dpr * view.x,
      dpr * view.y,
    );

    const s = state.settings;
    const shown = visible();
    const focus = hovered ?? state.selected;
    const lit = litNodes(data, shown, focus, state);

    // Links: lit ones in the accent, the rest faint.
    for (const link of visibleLinks()) {
      const a = endpoint(link.source);
      const b = endpoint(link.target);
      const active = lit
        ? focus
          ? a.id === focus || b.id === focus
          : lit.has(a.id) && lit.has(b.id)
        : false;
      ctx.globalAlpha = active ? 0.9 : lit ? 0.12 : 0.45;
      ctx.strokeStyle = active ? colors.primary : colors.muted;
      ctx.lineWidth = s.linkThickness * (active ? 1.4 : 0.8);
      ctx.beginPath();
      ctx.moveTo(a.x ?? 0, a.y ?? 0);
      ctx.lineTo(b.x ?? 0, b.y ?? 0);
      ctx.stroke();
    }

    // Nodes.
    for (const node of shown) {
      const dim = !!lit && !lit.has(node.id);
      ctx.globalAlpha = dim ? 0.15 : 1;
      ctx.fillStyle =
        node.kind === "project"
          ? colors.primary
          : s.colorGroups && node.category
            ? colors.category[node.category]
            : colors.muted;
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, radius(node), 0, Math.PI * 2);
      ctx.fill();
      if (node.id === state.selected || node.id === hovered) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = colors.foreground;
        ctx.lineWidth = 2 / view.k;
        ctx.beginPath();
        ctx.arc(
          node.x ?? 0,
          node.y ?? 0,
          radius(node) + 3 / view.k,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }

    // Labels, drawn in screen space at a constant size. Projects stay
    // readable; technologies fade in past the threshold — Obsidian's "text
    // fade" — unless lit. Placed by priority (lit, then projects, then the
    // most connected), a label that would overlap one already placed is
    // skipped: zooming in makes room for it.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const pinned = new Set([hovered, state.selected]);
    const ranked = [...shown].sort((a, b) => {
      const score = (n: SimNode) =>
        (pinned.has(n.id) ? 1000 : 0) +
        (lit?.has(n.id) ? 500 : 0) +
        (n.kind === "project" ? 100 : 0) +
        n.degree;
      return score(b) - score(a);
    });
    const placed: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    }[] = [];
    for (const node of ranked) {
      const project = node.kind === "project";
      const isLit = !!lit?.has(node.id);
      // Project names always show (the overlap check keeps them apart);
      // only technology names follow the fade threshold.
      let alpha = project
        ? 1
        : Math.min(1, Math.max(0, (view.k - s.textFade) / 0.25));
      if (lit) alpha = isLit ? 1 : alpha * 0.15;
      if (alpha <= 0.02) continue;

      ctx.font = `${project ? 600 : 400} ${project ? 13 : 11}px ${colors.font}`;
      const textWidth = ctx.measureText(node.label).width;
      const sx = view.x + (node.x ?? 0) * view.k;
      const sy = view.y + ((node.y ?? 0) + radius(node)) * view.k + 4;
      const box = {
        left: sx - textWidth / 2 - 2,
        right: sx + textWidth / 2 + 2,
        top: sy,
        bottom: sy + (project ? 15 : 13),
      };
      const collides = placed.some(
        (other) =>
          box.left < other.right &&
          box.right > other.left &&
          box.top < other.bottom &&
          box.bottom > other.top,
      );
      if (collides && !pinned.has(node.id)) continue;
      placed.push(box);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = project ? colors.foreground : colors.muted;
      ctx.fillText(node.label, sx, sy);
    }
    ctx.globalAlpha = 1;
  }

  // ── View transform ────────────────────────────────────────────────────
  let tween = 0;
  function animateTo(target: { x: number; y: number; k: number }) {
    cancelAnimationFrame(tween);
    if (reduced) {
      view = target;
      requestDraw();
      return;
    }
    const from = { ...view };
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const e = 1 - (1 - t) ** 3;
      view = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        k: from.k + (target.k - from.k) * e,
      };
      draw();
      if (t < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  }

  function zoomAt(px: number, py: number, factor: number) {
    const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.k * factor));
    view = {
      x: px - ((px - view.x) * k) / view.k,
      y: py - ((py - view.y) * k) / view.k,
      k,
    };
    requestDraw();
  }

  function fitTarget(ids?: Set<string>) {
    const list = visible().filter((n) => !ids || ids.has(n.id));
    if (!list.length || !size.width) return view;
    const xs = list.map((n) => n.x ?? 0);
    const ys = list.map((n) => n.y ?? 0);
    const minX = Math.min(...xs) - 60;
    const maxX = Math.max(...xs) + 60;
    const minY = Math.min(...ys) - 30;
    const maxY = Math.max(...ys) + 40;
    // Leave room for the toolbar along the top.
    const top = size.width < 640 ? 110 : 120;
    const pad = 24;
    const k = Math.min(
      1.6,
      Math.max(
        MIN_ZOOM,
        Math.min(
          (size.width - pad * 2) / (maxX - minX),
          (size.height - top - pad) / (maxY - minY),
        ),
      ),
    );
    return {
      k,
      x: size.width / 2 - ((minX + maxX) / 2) * k,
      y: top + (size.height - top - pad) / 2 - ((minY + maxY) / 2) * k,
    };
  }

  // ── Pointer handling ─────────────────────────────────────────────────
  const toGraph = (px: number, py: number) => ({
    x: (px - view.x) / view.k,
    y: (py - view.y) / view.k,
  });
  const local = (event: PointerEvent | WheelEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const hit = (px: number, py: number) => {
    const p = toGraph(px, py);
    let best: SimNode | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const node of visible()) {
      const d = Math.hypot((node.x ?? 0) - p.x, (node.y ?? 0) - p.y);
      if (d <= radius(node) + 8 / view.k && d < bestDist) {
        best = node;
        bestDist = d;
      }
    }
    return best;
  };

  type Gesture =
    | {
        kind: "drag";
        node: SimNode;
        startX: number;
        startY: number;
        moved: boolean;
      }
    | {
        kind: "pan";
        startX: number;
        startY: number;
        vx: number;
        vy: number;
        moved: boolean;
      }
    | { kind: "tap"; startX: number; startY: number }
    | null;
  let gesture: Gesture = null;
  const touches = new Map<number, { x: number; y: number }>();
  let pinch: { dist: number; k: number } | null = null;

  const onPointerDown = (event: PointerEvent) => {
    const p = local(event);
    if (event.pointerType === "touch") {
      touches.set(event.pointerId, p);
      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
        if (gesture?.kind === "drag") {
          gesture.node.fx = null;
          gesture.node.fy = null;
        }
        gesture = null;
        return;
      }
    }
    const node = hit(p.x, p.y);
    if (node) {
      gesture = { kind: "drag", node, startX: p.x, startY: p.y, moved: false };
      node.fx = node.x;
      node.fy = node.y;
      canvas.setPointerCapture(event.pointerId);
    } else if (event.pointerType !== "touch") {
      gesture = {
        kind: "pan",
        startX: p.x,
        startY: p.y,
        vx: view.x,
        vy: view.y,
        moved: false,
      };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    } else {
      // A finger on empty canvas scrolls the page (touch-action: pan-y):
      // only a tap, to clear the selection, is ours.
      gesture = { kind: "tap", startX: p.x, startY: p.y };
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    const p = local(event);
    if (event.pointerType === "touch" && touches.has(event.pointerId)) {
      touches.set(event.pointerId, p);
      if (pinch && touches.size === 2) {
        const [a, b] = [...touches.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const target = (pinch.k * dist) / pinch.dist;
        zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, target / view.k);
        return;
      }
    }
    if (gesture?.kind === "drag") {
      if (Math.hypot(p.x - gesture.startX, p.y - gesture.startY) > 3) {
        if (!gesture.moved && !reduced) sim.alphaTarget(0.3).restart();
        gesture.moved = true;
      }
      if (gesture.moved) {
        const g = toGraph(p.x, p.y);
        gesture.node.fx = g.x;
        gesture.node.fy = g.y;
        if (reduced) {
          gesture.node.x = g.x;
          gesture.node.y = g.y;
          requestDraw();
        }
      }
      return;
    }
    if (gesture?.kind === "pan") {
      const dx = p.x - gesture.startX;
      const dy = p.y - gesture.startY;
      if (Math.hypot(dx, dy) > 3) gesture.moved = true;
      view = { ...view, x: gesture.vx + dx, y: gesture.vy + dy };
      requestDraw();
      return;
    }
    if (event.pointerType === "mouse") {
      const node = hit(p.x, p.y);
      const id = node?.id ?? null;
      canvas.style.cursor = node ? "pointer" : "grab";
      if (id !== hovered) {
        hovered = id;
        requestDraw();
      }
    }
  };

  const endGesture = (event: PointerEvent, cancelled = false) => {
    touches.delete(event.pointerId);
    if (touches.size < 2) pinch = null;
    const current = gesture;
    gesture = null;
    if (!current) return;
    if (current.kind === "drag") {
      current.node.fx = null;
      current.node.fy = null;
      sim.alphaTarget(0);
      if (!current.moved && !cancelled) {
        onSelect(state.selected === current.node.id ? null : current.node.id);
      }
    } else if (current.kind === "pan") {
      canvas.style.cursor = "grab";
      if (!current.moved) onSelect(null);
    } else if (current.kind === "tap" && !cancelled) {
      const p = local(event);
      if (Math.hypot(p.x - current.startX, p.y - current.startY) < 6) {
        onSelect(null);
      }
    }
  };
  const onPointerUp = (event: PointerEvent) => endGesture(event);
  const onPointerCancel = (event: PointerEvent) => endGesture(event, true);
  const onPointerLeave = () => {
    if (hovered && !gesture) {
      hovered = null;
      requestDraw();
    }
  };
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const p = local(event);
    zoomAt(p.x, p.y, Math.exp(-event.deltaY * 0.0015));
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.style.cursor = "grab";

  // ── Size ─────────────────────────────────────────────────────────────
  let first = true;
  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    const dpr = window.devicePixelRatio || 1;
    const center = toGraph(size.width / 2, size.height / 2);
    size = { width, height, dpr };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (first) {
      first = false;
      // Settle the layout before the first paint, then frame it.
      applyForces();
      sim.alpha(1);
      for (let i = 0; i < 300; i++) sim.tick();
      view = fitTarget();
    } else {
      // Keep the same graph point in the middle across resizes.
      view = {
        ...view,
        x: width / 2 - center.x * view.k,
        y: height / 2 - center.y * view.k,
      };
    }
    draw();
  });
  observer.observe(canvas);

  return {
    update(next) {
      const prev = state.settings;
      state = next;
      const s = next.settings;
      const layoutChanged =
        prev.showOneOff !== s.showOneOff ||
        prev.nodeSize !== s.nodeSize ||
        prev.centerForce !== s.centerForce ||
        prev.repelForce !== s.repelForce ||
        prev.linkForce !== s.linkForce ||
        prev.linkDistance !== s.linkDistance;
      if (layoutChanged) {
        applyForces();
        reheat(prev.showOneOff !== s.showOneOff ? 0.6 : 0.3);
      }
      requestDraw();
    },
    zoomBy(factor) {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.k * factor));
      const cx = size.width / 2;
      const cy = size.height / 2;
      animateTo({
        k,
        x: cx - ((cx - view.x) * k) / view.k,
        y: cy - ((cy - view.y) * k) / view.k,
      });
    },
    fit(ids) {
      animateTo(fitTarget(ids));
    },
    focus(id) {
      const node = byId.get(id);
      if (!node) return;
      const k = Math.max(view.k, 1.2);
      animateTo({
        k,
        x: size.width / 2 - (node.x ?? 0) * k,
        y: size.height / 2 - (node.y ?? 0) * k,
      });
    },
    refreshColors() {
      colors = readColors();
      requestDraw();
    },
    destroy() {
      sim.stop();
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(tween);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
    },
  };
}

type Translate = ReturnType<typeof useTranslations>;

function categoryLabel(
  category: TechCategory,
  t: Translate,
  tSkills: Translate,
) {
  return category === "other" ? t("categoryOther") : tSkills(category);
}

export function SkillsGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  // Lazy initial state: the graph data is built once.
  const [data] = useState(buildGraphData);

  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TechCategory | null>(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const t = useTranslations("Graph");
  const tSkills = useTranslations("Skills");
  const tProjects = useTranslations("Projects");
  const locale = toLocale(useLocale());

  // Latest view state, for the engine's first frame.
  const stateRef = useRef<ViewState>({ selected, category, query, settings });
  stateRef.current = { selected, category, query, settings };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = createEngine(canvas, data, stateRef.current, setSelected);
    engineRef.current = engine;
    // Deep link: `/graph#p:<slug>` (from a project page) opens that project.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (data.nodes.some((node) => node.id === id)) {
      setSelected(id);
      requestAnimationFrame(() => engine.focus(id));
    }
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [data]);

  useEffect(() => {
    engineRef.current?.update({ selected, category, query, settings });
  }, [selected, category, query, settings]);

  useEffect(() => {
    // The theme class lands on <html> before this runs; re-read the tokens.
    if (resolvedTheme) engineRef.current?.refreshColors();
  }, [resolvedTheme]);

  const searchHits = query.trim()
    ? data.nodes.filter((node) =>
        normalize(node.label).includes(normalize(query.trim())),
      )
    : [];
  const projectCount = data.nodes.filter((n) => n.kind === "project").length;

  const selectAndFocus = (id: string) => {
    setSelected(id);
    engineRef.current?.focus(id);
  };

  const labelOf = (id: string) =>
    data.nodes.find((node) => node.id === id)?.label ?? id;

  const iconButton =
    "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-pressed:bg-primary/15 aria-pressed:text-foreground";

  return (
    /*
     * `data-lenis-prevent`: the site's smooth scroll (Lenis) listens for the
     * wheel on the whole window and scrolled the page even though the canvas
     * cancels the event to zoom. It skips this subtree, so the wheel zooms the
     * graph and scrolls the panels without moving the page.
     */
    <div
      data-lenis-prevent
      className={cn("relative size-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 size-full touch-pan-y select-none"
      />

      <div className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)]">
        <Toolbar
          query={query}
          onQuery={setQuery}
          hits={searchHits.length}
          onSubmit={() => {
            const hit = searchHits[0];
            if (hit) selectAndFocus(hit.id);
          }}
          category={category}
          onCategory={(next) => {
            setSelected(null);
            const active = next === category ? null : next;
            setCategory(active);
            if (active) {
              const ids = new Set<string>();
              for (const node of data.nodes) {
                if (node.kind !== "tech" || techCategory(node.label) !== active)
                  continue;
                ids.add(node.id);
                for (const p of data.adjacency.get(node.id) ?? []) ids.add(p);
              }
              requestAnimationFrame(() => engineRef.current?.fit(ids));
            }
          }}
          projectCount={projectCount}
          techCount={data.nodes.length - projectCount}
          settingsOpen={settingsOpen}
          onSettings={() => setSettingsOpen((open) => !open)}
          t={t}
          tSkills={tSkills}
        />
      </div>

      {/* One side panel at a time: the settings, else the selection. */}
      {(settingsOpen || selected) && (
        <div className="absolute top-3 right-3 max-md:top-auto max-md:bottom-3 max-md:left-3">
          {settingsOpen ? (
            <SettingsPanel
              settings={settings}
              onChange={(patch) =>
                setSettings((current) => ({ ...current, ...patch }))
              }
              onReset={() => setSettings(DEFAULT_SETTINGS)}
              onClose={() => setSettingsOpen(false)}
              t={t}
            />
          ) : (
            selected && (
              <DetailPanel
                id={selected}
                adjacency={data.adjacency}
                labelOf={labelOf}
                onSelect={selectAndFocus}
                onClose={() => setSelected(null)}
                locale={locale}
                t={t}
                tSkills={tSkills}
                tProjects={tProjects}
              />
            )
          )}
        </div>
      )}

      <div
        className={cn(
          "absolute bottom-3 left-3 flex flex-col rounded-lg border bg-background/90 p-0.5 shadow-sm backdrop-blur-sm",
          (settingsOpen || selected) && "max-md:hidden",
        )}
      >
        <button
          type="button"
          onClick={() => engineRef.current?.zoomBy(1.4)}
          aria-label={t("zoomIn")}
          className={iconButton}
        >
          <PlusIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => engineRef.current?.zoomBy(1 / 1.4)}
          aria-label={t("zoomOut")}
          className={iconButton}
        >
          <MinusIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => engineRef.current?.fit()}
          aria-label={t("fitView")}
          className={iconButton}
        >
          <MaximizeIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Toolbar({
  query,
  onQuery,
  hits,
  onSubmit,
  category,
  onCategory,
  projectCount,
  techCount,
  settingsOpen,
  onSettings,
  t,
  tSkills,
}: {
  query: string;
  onQuery: (value: string) => void;
  hits: number;
  onSubmit: () => void;
  category: TechCategory | null;
  onCategory: (category: TechCategory) => void;
  projectCount: number;
  techCount: number;
  settingsOpen: boolean;
  onSettings: () => void;
  t: Translate;
  tSkills: Translate;
}) {
  const chip =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:text-foreground aria-pressed:border-primary aria-pressed:bg-primary/15 aria-pressed:text-foreground";

  return (
    <div className="flex max-w-xl flex-col gap-2 rounded-lg border bg-background/90 p-2.5 text-muted-foreground shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <search className="min-w-0 flex-1">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">{t("searchLabel")}</span>
              <SearchIcon
                aria-hidden
                className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && onQuery("")}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                className="h-8 w-full rounded-md border bg-card pr-2 pl-8 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </label>
            {/* The totals give way to the search field on phones; the result
                count, which answers the typing, always shows. */}
            <p
              aria-live="polite"
              className={cn(
                "shrink-0 text-xs tabular-nums",
                !query.trim() && "max-sm:hidden",
              )}
            >
              {query.trim()
                ? t("searchResults", { count: hits })
                : t("stats", { projects: projectCount, techs: techCount })}
            </p>
          </form>
        </search>
        <button
          type="button"
          onClick={onSettings}
          aria-pressed={settingsOpen}
          aria-label={t("settings")}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors hover:border-primary/50 hover:text-foreground aria-pressed:border-primary aria-pressed:bg-primary/15 aria-pressed:text-foreground"
        >
          <Settings2Icon className="size-4" />
        </button>
      </div>

      <fieldset className="-mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 pb-0.5 md:flex-wrap">
        <legend className="sr-only">{t("filterLabel")}</legend>
        {techCategories.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={category === key}
            onClick={() => onCategory(key)}
            className={chip}
          >
            <span
              aria-hidden
              className={cn("size-2 rounded-full", categoryDotClass[key])}
            />
            {categoryLabel(key, t, tSkills)}
          </button>
        ))}
      </fieldset>
    </div>
  );
}

/** Obsidian-style graph settings: filters, groups, display and forces. */
function SettingsPanel({
  settings,
  onChange,
  onReset,
  onClose,
  t,
}: {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onClose: () => void;
  t: Translate;
}) {
  const range = (
    key: keyof Settings,
    label: string,
    min: number,
    max: number,
    step: number,
  ) => (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-xs">
        {label}
        <span className="text-muted-foreground tabular-nums">
          {Number(settings[key]).toFixed(step < 1 ? 1 : 0)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number(settings[key])}
        onChange={(event) => onChange({ [key]: Number(event.target.value) })}
        className="w-full accent-primary"
      />
    </label>
  );
  const toggle = (key: "showOneOff" | "colorGroups", label: string) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs">
      {label}
      <input
        type="checkbox"
        checked={settings[key]}
        onChange={(event) => onChange({ [key]: event.target.checked })}
        className="size-4 accent-primary"
      />
    </label>
  );
  const section = "flex flex-col gap-2.5 border-t pt-3";
  const heading =
    "font-medium text-muted-foreground text-xs uppercase tracking-wide";

  return (
    <section
      aria-label={t("settings")}
      className="flex max-h-[min(34rem,60vh)] w-full flex-col gap-3 overflow-y-auto rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur-sm md:w-80"
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{t("settings")}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
          >
            {t("reset")}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </header>

      <div className={section}>
        <h3 className={heading}>{t("sectionFilters")}</h3>
        {toggle("showOneOff", t("oneOff"))}
      </div>
      <div className={section}>
        <h3 className={heading}>{t("sectionGroups")}</h3>
        {toggle("colorGroups", t("colorGroups"))}
      </div>
      <div className={section}>
        <h3 className={heading}>{t("sectionDisplay")}</h3>
        {range("textFade", t("textFade"), 0.2, 2, 0.1)}
        {range("nodeSize", t("nodeSize"), 0.5, 2.5, 0.1)}
        {range("linkThickness", t("linkThickness"), 0.2, 4, 0.1)}
      </div>
      <div className={section}>
        <h3 className={heading}>{t("sectionForces")}</h3>
        {range("centerForce", t("centerForce"), 0, 1.5, 0.1)}
        {range("repelForce", t("repelForce"), 0, 25, 1)}
        {range("linkForce", t("linkForce"), 0, 1, 0.1)}
        {range("linkDistance", t("linkDistance"), 20, 200, 5)}
      </div>
    </section>
  );
}

function DetailPanel({
  id,
  adjacency,
  labelOf,
  onSelect,
  onClose,
  locale,
  t,
  tSkills,
  tProjects,
}: {
  id: string;
  adjacency: Map<string, Set<string>>;
  labelOf: (id: string) => string;
  onSelect: (id: string) => void;
  onClose: () => void;
  locale: ReturnType<typeof toLocale>;
  t: Translate;
  tSkills: Translate;
  tProjects: Translate;
}) {
  const isProject = id.startsWith("p:");
  const project = isProject ? getProjectBySlug(id.slice(2)) : undefined;
  const neighbours = [...(adjacency.get(id) ?? [])];
  const title = project?.title ?? labelOf(id);
  const tag = isProject ? null : id.slice(2);

  const link =
    "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-sm transition-colors hover:bg-primary/10";

  return (
    <section
      aria-label={title}
      className="flex max-h-[min(28rem,55vh)] w-full flex-col gap-3 overflow-y-auto rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur-sm md:w-80"
    >
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
            {tag ? (
              <>
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    categoryDotClass[techCategory(tag)],
                  )}
                />
                {t("legendTech")} ·{" "}
                {categoryLabel(techCategory(tag), t, tSkills)}
              </>
            ) : (
              <>
                {t("legendProject")}
                {project?.year && ` · ${project.year}`}
              </>
            )}
          </p>
          <h2 className="font-semibold text-lg leading-tight">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-m-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      </header>

      {project ? (
        <>
          <p className="text-muted-foreground text-sm">
            {project.description[locale]}
          </p>
          <NeighbourList
            heading={tProjects("stack")}
            ids={neighbours}
            labelOf={labelOf}
            onSelect={onSelect}
          />
          <div className="-mx-2 flex flex-wrap gap-1 border-t pt-2">
            <Link
              href={`/projets/${project.slug}`}
              className={cn(link, "text-primary")}
            >
              {tProjects("viewProject")}
              <ArrowUpRightIcon aria-hidden className="size-3.5" />
            </Link>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                <GlobeIcon aria-hidden className="size-3.5" />
                {tProjects("viewDemo")}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                <CodeIcon aria-hidden className="size-3.5" />
                {tProjects("viewCode")}
              </a>
            )}
          </div>
        </>
      ) : (
        <NeighbourList
          heading={t("usedIn", { count: neighbours.length })}
          ids={neighbours}
          labelOf={labelOf}
          onSelect={onSelect}
        />
      )}
    </section>
  );
}

/** The selected node's neighbours, each one a button that selects it. */
function NeighbourList({
  heading,
  ids,
  labelOf,
  onSelect,
}: {
  heading: string;
  ids: string[];
  labelOf: (id: string) => string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {heading}
      </h3>
      <ul className="flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const tech = id.startsWith("t:");
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors hover:border-primary/60",
                  tech ? "bg-card" : "border-primary/40 bg-primary/10",
                )}
              >
                {tech && (
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      categoryDotClass[techCategory(id.slice(2))],
                    )}
                  />
                )}
                {labelOf(id)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
