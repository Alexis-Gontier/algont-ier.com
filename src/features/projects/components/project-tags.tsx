"use client";

import { cn } from "@/lib/utils/cn";
import { useOneLineFit } from "../hooks/use-one-line-fit";

const tagClass =
  "whitespace-nowrap rounded-md border px-2 py-0.5 text-muted-foreground text-xs";

/**
 * Project tech tags kept to a single line: as many as fit are shown, the rest
 * collapse into a "+N" badge (count measured by `useOneLineFit`). A visually
 * hidden list keeps every tag available to assistive tech.
 */
export function ProjectTags({ tags }: { tags: readonly string[] }) {
  const { wrapperRef, measureRef, visibleCount } = useOneLineFit(tags.length);
  const hiddenCount = tags.length - visibleCount;

  return (
    <div ref={wrapperRef} className="relative mt-1">
      {/* Visible single-line row (decorative; real list is the sr-only one). */}
      <ul aria-hidden className="flex gap-1.5 overflow-hidden">
        {tags.slice(0, visibleCount).map((tag) => (
          <li key={tag} className={tagClass}>
            {tag}
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className={cn(tagClass, "shrink-0")}>+{hiddenCount}</li>
        )}
      </ul>

      {/* Off-screen measurement row: every tag plus a worst-case "+N" badge. */}
      <ul
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex gap-1.5"
      >
        {tags.map((tag) => (
          <li key={tag} className={tagClass}>
            {tag}
          </li>
        ))}
        <li className={tagClass}>+{tags.length}</li>
      </ul>

      {/* Accessible: all tags, read once by screen readers. */}
      <ul className="sr-only">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}
