import Image from "next/image";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils/cn";
import type { Project } from "../data";

/**
 * A project's picture, shared by its card and its page. Named as a view
 * transition, so opening a project morphs the card's visual into the page's.
 *
 * Projects without a screenshot get a generated cover instead of an empty
 * gradient: a dark panel with the title and the stack, in the site's colours
 * (`dark` scopes the dark tokens, so it reads the same on both themes).
 */
export function ProjectVisual({
  project,
  sizes,
  priority = false,
  className,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const { slug, title, image, tags } = project;

  return (
    <ViewTransition name={`project-visual-${slug}`} share="morph">
      <div
        className={cn(
          "@container relative overflow-hidden bg-muted",
          !image && "dark bg-background text-foreground",
          className,
        )}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover object-top transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col justify-end gap-3 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[18px_18px] p-[8%] transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_60%)]" />
            <p className="relative font-mono text-primary text-xs">
              ~/projets/{slug}
            </p>
            <p className="relative font-bold text-[clamp(1.5rem,4cqi,3rem)] leading-tight tracking-[-0.03em]">
              {title}
            </p>
            <p className="relative font-mono text-muted-foreground text-xs">
              {tags.join(" · ")}
            </p>
          </div>
        )}
      </div>
    </ViewTransition>
  );
}
