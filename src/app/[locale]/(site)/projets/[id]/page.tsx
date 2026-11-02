import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/shadcn-ui/button";
import { Reveal } from "@/components/shared/reveal";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { GithubIcon } from "@/components/shared/social-icons";
import { getProjectBySlug, ProjectVisual, projects } from "@/features/projects";
import { toLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils/cn";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.slug }));
}

/*
 * Every project is known at build time, so an id outside `generateStaticParams`
 * is a 404 — not something to render on demand. Without this, Next renders the
 * segment, caches the `notFound()` output and serves it with HTTP 200: a soft
 * 404 that search engines index as a real page. Also required by
 * `output: "export"`, which cannot render unknown params at all.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = toLocale(rawLocale);
  const project = getProjectBySlug(id);

  if (!project) return {};

  return pageMetadata({
    locale,
    path: `/projets/${project.slug}`,
    title: project.title,
    description: project.description[locale],
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  const locale = toLocale(rawLocale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  const project = getProjectBySlug(id);
  if (!project) notFound();

  const { slug, title, description, longDescription, tags, year } = project;
  const { demoUrl, repoUrl, inDevelopment } = project;

  // Neighbours in list order (newest first), wrapping around the ends.
  const index = projects.findIndex((p) => p.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <Section>
      <article className="flex flex-col gap-12">
        <Reveal className="flex flex-col gap-8">
          <div data-reveal-item>
            <Button asChild variant="ghost" className="group -ml-2.5">
              <Link href="/projets">
                <ArrowLeftIcon className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                {t("back")}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            <p
              data-reveal-item
              className="flex flex-wrap items-center gap-3 font-mono text-primary text-sm"
            >
              ~/projets/{slug}
              {inDevelopment && (
                <span className="rounded-md border px-2 py-0.5 font-sans text-muted-foreground text-xs">
                  {t("inDevelopment")}
                </span>
              )}
            </p>
            <h1
              data-reveal-item
              className="max-w-4xl text-balance font-extrabold text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl"
            >
              {title}
            </h1>
            <p
              data-reveal-item
              className="max-w-2xl text-muted-foreground text-xl leading-relaxed"
            >
              {description[locale]}
            </p>
          </div>

          {/* Fact sheet: year, stack, links. */}
          <dl
            data-reveal-item
            className="grid gap-6 border-y py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-12"
          >
            {year && (
              <div className="flex flex-col gap-2">
                <dt className="font-mono text-muted-foreground text-xs">
                  {t("year")}
                </dt>
                <dd className="font-semibold text-lg tabular-nums">{year}</dd>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-muted-foreground text-xs">
                {t("stack")}
              </dt>
              <dd>
                <ul translate="no" className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border bg-card px-2.5 py-1 text-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            {(demoUrl || repoUrl) && (
              <div className="flex flex-col gap-2">
                <dt className="font-mono text-muted-foreground text-xs">
                  {t("links")}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {demoUrl && (
                    <Button asChild>
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLinkIcon />
                        {t("viewDemo")}
                      </a>
                    </Button>
                  )}
                  {repoUrl && (
                    <Button asChild variant="outline">
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon />
                        {t("viewCode")}
                      </a>
                    </Button>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        {/* The visual, morphed in from the card the visitor clicked. */}
        <div className="relative">
          <div
            aria-hidden
            className="-inset-y-8 -inset-x-3 md:-inset-8 pointer-events-none absolute rounded-full bg-primary/12 blur-3xl"
          />
          <ProjectVisual
            project={project}
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="relative aspect-video rounded-xl border"
          />
        </div>

        {longDescription && (
          <Reveal className="grid gap-6 md:grid-cols-12">
            <h2
              data-reveal-item
              className="font-mono text-primary text-sm md:col-span-4"
            >
              {t("overview")}
            </h2>
            <p
              data-reveal-item
              className="text-xl leading-relaxed md:col-span-8"
            >
              {longDescription[locale]}
            </p>
          </Reveal>
        )}

        <div>
          <Link
            href={`/graph#p:${slug}`}
            className="group inline-flex items-center gap-1.5 font-medium text-primary"
          >
            <RollText>{t("inGraph")}</RollText>
            <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Previous / next project. */}
        <nav
          aria-label={t("title")}
          className="grid gap-4 border-t pt-8 sm:grid-cols-2"
        >
          {[
            { target: previous, label: t("previous"), forward: false },
            { target: next, label: t("next"), forward: true },
          ].map(({ target, label, forward }) => (
            <Link
              key={label}
              href={`/projets/${target.slug}`}
              className={cn(
                "group flex flex-col gap-2 rounded-xl border bg-card p-6 transition-colors hover:border-primary/50",
                forward && "sm:items-end sm:text-right",
              )}
            >
              <span className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs">
                {!forward && (
                  <ArrowLeftIcon className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                )}
                {label}
                {forward && (
                  <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                )}
              </span>
              <span className="font-semibold text-2xl tracking-tight transition-colors group-hover:text-primary">
                {target.title}
              </span>
            </Link>
          ))}
        </nav>
      </article>
    </Section>
  );
}
