"use client";

import { useRef } from "react";
import { gsap, motionQueries, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Directs the hero's motion over server-rendered markup, found by data
 * attributes:
 *
 * - `data-hero-type`  the mono greeting, typed out character by character
 *   behind a blinking caret.
 * - `data-hero-name`  the name: letters rise out of a line mask, staggered.
 * - `data-hero-lines` the tagline, revealed line by line.
 * - `data-hero-fade`  actions and links, rising in.
 * - `data-hero-graph` the graph card: settles in, then drifts slower than the
 *   page as it scrolls away (desktop parallax).
 *
 * Reduced motion: a short cross-fade, no travel, no parallax. Every target
 * carries `data-reveal`, so nothing flashes before this runs and nothing stays
 * hidden if it doesn't (see globals.css).
 */
export function HeroScene({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);
      const mm = gsap.matchMedia();

      mm.add(motionQueries.reduced, () => {
        gsap.fromTo(
          q("[data-reveal]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: "power1.out", stagger: 0.05 },
        );
      });

      mm.add(
        { full: motionQueries.full, desktop: motionQueries.desktop },
        (context) => {
          const { full, desktop } = context.conditions as Record<
            string,
            boolean
          >;
          if (!full) return;

          const [greeting] = q("[data-hero-type]");
          const [name] = q("[data-hero-name]");
          const [graph] = q("[data-hero-graph]");
          gsap.set(q("[data-reveal]"), { visibility: "inherit" });

          // Lines keep the text intact, so it reads as-is: no aria-label
          // (prohibited on <p>), no aria-hidden copies.
          const typed = SplitText.create(greeting, {
            type: "chars",
            aria: "none",
          });
          const lines = SplitText.create(q("[data-hero-lines]"), {
            type: "lines",
            mask: "lines",
            aria: "none",
          });
          const letters = SplitText.create(name, {
            type: "lines,chars",
            mask: "lines",
          });

          // Typing caret: a block that follows the last typed character.
          const caret = document.createElement("span");
          caret.setAttribute("aria-hidden", "true");
          caret.className =
            "ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-primary motion-safe:animate-pulse";
          greeting.append(caret);

          const tl = gsap.timeline({ delay: 0.1 });
          tl.from(typed.chars, {
            autoAlpha: 0,
            duration: 0.01,
            stagger: 0.045,
            ease: "none",
          })
            .from(
              letters.chars,
              { yPercent: 110, duration: 1.1, stagger: 0.03 },
              "-=0.35",
            )
            .from(
              lines.lines,
              { yPercent: 105, duration: 1, stagger: 0.07 },
              "-=0.85",
            )
            .from(
              q("[data-hero-fade]"),
              { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08 },
              "-=0.75",
            )
            .from(
              graph,
              { y: 40, scale: 0.96, autoAlpha: 0, duration: 1.4 },
              0.3,
            )
            // The caret has done its job once the name is in.
            .to(caret, { autoAlpha: 0, duration: 0.4 }, "+=1.2");

          if (desktop) {
            gsap.to(graph, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: scope.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          return () => caret.remove();
        },
      );
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
