"use client";

import { useRef } from "react";
import { gsap, motionQueries, useGSAP } from "@/lib/gsap";

/** Anything a visitor can act on makes the follower open into a ring. */
const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label";

/**
 * A discreet follower dot that trails the native cursor (which stays visible —
 * this decorates, it never replaces). It opens into a ring over interactive
 * elements and tightens on press.
 *
 * Fine pointers only: on touch there is no cursor to follow. Under reduced
 * motion it is not rendered at all; the native cursor is enough.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${motionQueries.full} and ${motionQueries.finePointer}`, () => {
      const el = ref.current;
      if (!el) return;

      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
        x(event.clientX);
        y(event.clientY);
        const hovering = (event.target as Element | null)?.closest(INTERACTIVE);
        el.dataset.state = hovering ? "hover" : "idle";
      };
      const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      const onDown = () => gsap.to(el, { scale: 0.7, duration: 0.2 });
      const onUp = () => gsap.to(el, { scale: 1, duration: 0.4 });

      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      data-state="idle"
      className="pointer-events-none invisible fixed top-0 left-0 z-100 hidden opacity-0 pointer-fine:block motion-reduce:hidden"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary transition-[width,height,background-color,border-color] duration-300 ease-(--ease-out-expo) in-data-[state=hover]:size-11 in-data-[state=hover]:border-2 in-data-[state=hover]:border-primary in-data-[state=hover]:bg-transparent" />
    </div>
  );
}
