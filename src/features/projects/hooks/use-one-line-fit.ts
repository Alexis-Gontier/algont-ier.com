"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures how many of `itemCount` items fit on a single line, reserving room
 * for a trailing "+N" overflow indicator when they don't all fit. Re-measures
 * on container resize.
 *
 * Rendering contract:
 * - Attach `wrapperRef` to the element whose width is the available space.
 * - Attach `measureRef` to a hidden, single-line element that renders **every**
 *   item in order, followed by the overflow indicator as its last child. It
 *   stays mounted with all items so measurements never feed back into layout.
 *
 * Returns `visibleCount` — how many leading items to show. When it is less than
 * `itemCount`, render a "+N" badge for the remainder.
 */
export function useOneLineFit(itemCount: number) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [visibleCount, setVisibleCount] = useState(itemCount);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (!wrapper || !measure) return;

    const compute = () => {
      const children = Array.from(measure.children) as HTMLElement[];
      // children = [...items, badge]; bail if the layer isn't rendered yet.
      if (children.length <= 1) return;

      const badgeWidth =
        children[children.length - 1].getBoundingClientRect().width;
      const itemWidths = children
        .slice(0, itemCount)
        .map((el) => el.getBoundingClientRect().width);
      const gap = Number.parseFloat(getComputedStyle(measure).columnGap) || 0;
      const available = wrapper.clientWidth;

      // Greedily fit items on the line, ignoring the badge for now.
      let used = 0;
      let count = 0;
      for (const width of itemWidths) {
        const next = used + (count > 0 ? gap : 0) + width;
        if (next > available) break;
        used = next;
        count += 1;
      }

      // If some items overflow, the "+N" badge must also fit on the line, so
      // drop items until the visible ones plus the badge fit.
      if (count < itemCount) {
        while (count > 0) {
          const itemsWidth =
            itemWidths.slice(0, count).reduce((a, b) => a + b, 0) +
            gap * (count - 1);
          if (itemsWidth + gap + badgeWidth <= available) break;
          count -= 1;
        }
      }

      setVisibleCount(count);
    };

    const observer = new ResizeObserver(compute);
    observer.observe(wrapper);
    compute();
    return () => observer.disconnect();
  }, [itemCount]);

  return { wrapperRef, measureRef, visibleCount };
}
