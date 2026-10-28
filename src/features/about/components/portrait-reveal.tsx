"use client";

import { useRef } from "react";
import { gsap, motionQueries, useGSAP } from "@/lib/gsap";

/**
 * Reveals the ASCII portrait like a scan: the image is uncovered top to bottom
 * while a violet scan line travels down its edge. Reduced motion: a fade.
 */
export function PortraitReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const [image, line] = gsap.utils.toArray<HTMLElement>(
        "[data-scan-image], [data-scan-line]",
        el,
      );
      const scrollTrigger = { trigger: el, start: "top 75%", once: true };

      const mm = gsap.matchMedia();
      mm.add(motionQueries.full, () => {
        gsap
          .timeline({ scrollTrigger, defaults: { ease: "power2.inOut" } })
          .fromTo(
            image,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 },
          )
          .fromTo(
            line,
            { top: "0%", autoAlpha: 1 },
            { top: "100%", duration: 1.6 },
            0,
          )
          .to(line, { autoAlpha: 0, duration: 0.3 });
      });
      mm.add(motionQueries.reduced, () => {
        gsap.from(image, { autoAlpha: 0, duration: 0.6, scrollTrigger });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="absolute inset-0">
      <div data-scan-image className="absolute inset-0">
        {children}
      </div>
      <div
        data-scan-line
        aria-hidden
        className="invisible absolute inset-x-0 h-px bg-primary shadow-[0_0_24px_4px_var(--primary)]"
      />
    </div>
  );
}
