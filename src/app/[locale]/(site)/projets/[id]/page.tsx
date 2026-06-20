import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/shadcn-ui/button";
import { Section } from "@/components/shared/section";
import { GithubIcon } from "@/components/shared/social-icons";
import { getProjectBySlug, projects } from "@/features/projects";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const project = getProjectBySlug(id);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description[locale as Locale],
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  const project = getProjectBySlug(id);
  if (!project) notFound();

  const {
    title,
    description,
    longDescription,
    tags,
    image,
    year,
    demoUrl,
    repoUrl,
    inDevelopment,
  } = project;
  const body = (longDescription ?? description)[locale as Locale];

  return (
    <Section>
      <article className="flex flex-col gap-8">
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link href="/projets">
            <ArrowLeftIcon />
            {t("back")}
          </Link>
        </Button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            {year && (
              <span className="text-muted-foreground text-sm">{year}</span>
            )}
            {inDevelopment && (
              <span className="rounded-md border px-2 py-0.5 text-muted-foreground text-xs">
                {t("inDevelopment")}
              </span>
            )}
          </div>

          <ul className="flex flex-wrap gap-1.5">
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

        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="size-full bg-linear-to-br from-primary/20 via-muted to-muted" />
          )}
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground">{body}</p>

        <div className="flex flex-wrap gap-3">
          {demoUrl && (
            <Button asChild>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon />
                {t("viewDemo")}
              </a>
            </Button>
          )}
          {repoUrl && (
            <Button asChild variant="outline">
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <GithubIcon />
                {t("viewCode")}
              </a>
            </Button>
          )}
        </div>
      </article>
    </Section>
  );
}
