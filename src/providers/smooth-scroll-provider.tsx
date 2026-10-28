"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, motionQueries, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scenes and
 * the scroll position update in the same frame.
 *
 * Skipped entirely under `prefers-reduced-motion`: the page keeps native
 * scrolling (and native anchor jumps). Touch keeps native scrolling too —
 * Lenis' default `syncTouch: false` — so phones get their own momentum.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia(motionQueries.reduced).matches) return;

    const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.11 });
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
