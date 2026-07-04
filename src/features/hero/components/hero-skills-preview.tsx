"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Loaded on demand: React Flow + d3-force are heavy and only needed once the
// preview actually renders, so they stay out of the home page bundle.
const SkillsGraph = dynamic(
  () => import("@/features/graph").then((m) => m.SkillsGraph),
  {
    ssr: false,
    // Same frame as the graph container, so the swap-in is seamless.
    loading: () => <div className="size-full rounded-xl border bg-muted/20" />,
  },
);

/**
 * Mounts the (heavy) skills graph only on md+ viewports. The Hero preview is
 * already `hidden` below md via CSS, but without this gate React still mounts
 * React Flow and runs the d3 force simulation on mobile, where it's never seen.
 * Rendering also triggers the dynamic import, so mobile never downloads it.
 */
export function HeroSkillsPreview({ className }: { className?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!show) return null;
  return <SkillsGraph interactive={false} className={className} />;
}
