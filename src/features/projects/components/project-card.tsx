import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { GithubIcon } from "@/components/shared/social-icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "../data";
import { ProjectTags } from "./project-tags";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  /** Eagerly load the preview image — set on above-the-fold cards for LCP. */
  priority?: boolean;
}) {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const { slug, title, description, tags, image, demoUrl, repoUrl } = project;
  const inDevelopment = project.inDevelopment;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card outline-2 outline-transparent transition-colors hover:outline-ring">
      <Link
        href={`/projets/${slug}`}
        className="relative block aspect-video overflow-hidden border-b bg-muted"
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-primary/20 via-muted to-muted" />
        )}
        {inDevelopment && (
          <span className="absolute top-2 left-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {t("inDevelopment")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">
            <Link
              href={`/projets/${slug}`}
              className="transition-colors hover:text-primary"
            >
              {title}
            </Link>
          </h3>

          <div className="flex shrink-0 items-center gap-1">
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

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description[locale]}
        </p>

        <ProjectTags tags={tags} />
      </div>
    </article>
  );
}
