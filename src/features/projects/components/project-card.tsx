import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { GithubIcon } from "@/components/social-icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "../data";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const { slug, title, description, tags, image, demoUrl, repoUrl } = project;

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
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-primary/20 via-muted to-muted" />
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

        <p className="text-sm text-muted-foreground">{description[locale]}</p>

        <ul className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border px-2 py-0.5 text-muted-foreground text-xs"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
