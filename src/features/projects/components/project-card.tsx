import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { GithubIcon } from "@/components/shared/social-icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import type { Project } from "../data";
import { ProjectTags } from "./project-tags";
import { ProjectVisual } from "./project-visual";

export function ProjectCard({
  project,
  priority = false,
  wide = false,
}: {
  project: Project;
  /** Eagerly load the preview image — set on above-the-fold cards for LCP. */
  priority?: boolean;
  /** Lead card: visual and text side by side on large screens. */
  wide?: boolean;
}) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const { slug, title, description, tags, year, demoUrl, repoUrl } = project;

  return (
    /*
     * One link per card, stretched over the whole surface via `after:inset-0`.
     * The media used to be a second link to the same page: it had no text and
     * no `alt` on image-less projects — a nameless link, WCAG 2.4.4 / 4.1.2
     * level A — and on the others it just doubled the tab stops with a name
     * identical to the title. The media is now decorative, and the title
     * carries the accessible name for the whole card.
     */
    <article
      data-reveal-item
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card outline-2 outline-transparent transition-[border-color,outline-color] duration-300 focus-within:outline-ring hover:border-primary/50",
        wide && "lg:col-span-2 lg:grid lg:grid-cols-12",
      )}
    >
      <div
        className={cn(
          "relative border-b",
          wide && "lg:col-span-7 lg:border-r lg:border-b-0",
        )}
      >
        <ProjectVisual
          project={project}
          priority={priority}
          sizes={
            wide
              ? "(min-width: 1024px) 40rem, 100vw"
              : "(min-width: 1024px) 34rem, (min-width: 640px) 50vw, 100vw"
          }
          className={cn("aspect-video", wide && "lg:aspect-auto lg:h-full")}
        />
        {project.inDevelopment && (
          <span className="absolute top-3 left-3 rounded-md border bg-background/90 px-2 py-0.5 font-medium text-xs backdrop-blur-sm">
            {t("inDevelopment")}
          </span>
        )}
        {/* Hover cue over the visual — the whole card is the link. */}
        <span
          aria-hidden
          className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-sm opacity-0 shadow-lg transition-[opacity,translate] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0"
        >
          {t("viewProject")}
          <ArrowRightIcon className="size-4" />
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-6",
          wide && "lg:col-span-5 lg:justify-center lg:gap-4 lg:p-10",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {year && (
              <span className="font-mono text-muted-foreground text-xs tabular-nums">
                {year}
              </span>
            )}
            <h3
              className={cn(
                "font-semibold text-xl tracking-tight",
                wide && "lg:text-3xl",
              )}
            >
              <Link
                href={`/projets/${slug}`}
                className="transition-colors after:absolute after:inset-0 group-hover:text-primary"
              >
                {title}
              </Link>
            </h3>
          </div>

          {/* Above the stretched link, so the repo/demo buttons stay clickable. */}
          <div className="relative z-10 flex shrink-0 items-center gap-1">
            {repoUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                aria-label={t("viewCode")}
              >
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon />
                </a>
              </Button>
            )}
            {demoUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                aria-label={t("viewDemo")}
              >
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon />
                </a>
              </Button>
            )}
          </div>
        </div>

        <p
          className={cn(
            "line-clamp-2 text-muted-foreground",
            wide && "lg:line-clamp-4 lg:text-lg",
          )}
        >
          {description[locale]}
        </p>

        <ProjectTags tags={tags} />
      </div>
    </article>
  );
}
