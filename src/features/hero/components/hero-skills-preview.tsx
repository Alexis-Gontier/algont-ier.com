"use client";

import { useEffect, useState } from "react";
import { SkillsGraph } from "@/features/graph";

/**
 * Mounts the (heavy) skills graph only on md+ viewports. The Hero preview is
 * already `hidden` below md via CSS, but without this gate React still mounts
 * React Flow and runs the d3 force simulation on mobile, where it's never seen.
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
