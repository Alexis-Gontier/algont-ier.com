import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * Single registration point: every animated component imports gsap from here,
 * so plugins are registered once and tree-shaking keeps only what's used.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

gsap.defaults({ ease: "expo.out", duration: 1 });

/**
 * Breakpoint conditions for `gsap.matchMedia()`. Every animation is written
 * against these so the calm (reduced-motion) and phone variants live next to
 * the full one instead of being bolted on later.
 */
export const motionQueries = {
  full: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  finePointer: "(pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
