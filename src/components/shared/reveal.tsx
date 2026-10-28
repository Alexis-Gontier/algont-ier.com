"use client";

import { useRef } from "react";
import { gsap, motionQueries, useGSAP } from "@/lib/gsap";

/**
 * Scroll reveal for a block's parts: every descendant marked
 * `data-reveal-item` (or, without any, the direct children) rises and fades in
 * one after another the first time the block enters the viewport.
 *
 * Reduced motion keeps a short fade without travel. Without JavaScript nothing
 * is hidden: the start state is only applied by the animation itself. Opacity
 * only, never `visibility`: content waiting to be revealed must stay in the
 * accessibility tree for screen readers and find-in-page.
 *
 * Don't mark shadcn `Button`s directly — their `transition-all` fights the
 * per-frame inline styles; mark a wrapper instead.
 */
export function Reveal({
  children,
  stagger = 0.08,
  ...props
}: React.ComponentProps<"div"> & { stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const marked = el.querySelectorAll("[data-reveal-item]");
      const targets = marked.length > 0 ? marked : el.children;
      const scrollTrigger = { trigger: el, start: "top 85%", once: true };

      const mm = gsap.matchMedia();
      mm.add(motionQueries.full, () => {
        gsap.from(targets, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger,
          scrollTrigger,
        });
      });
      mm.add(motionQueries.reduced, () => {
        gsap.from(targets, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
          stagger: stagger / 2,
          scrollTrigger,
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
