import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { ProjectCard, projects } from "@/features/projects";
import { toLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  return pageMetadata({
    locale,
    path: "/projets",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProjectsPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  // Eagerly load the first few preview images (skipping image-less projects) so
  // the LCP candidate above the fold isn't lazy-loaded.
  const eagerSlugs = new Set(
    projects
      .filter((project) => project.image)
      .slice(0, 3)
      .map((project) => project.slug),
  );

  return (
    <Section>
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHeader
            as="h1"
            label={t("label")}
            title={t("title")}
            subtitle={t("subtitle")}
            action={
              <p className="font-mono text-muted-foreground text-sm">
                {t("count", { count: projects.length })}
              </p>
            }
          />
        </Reveal>

        <Reveal stagger={0.1} className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={eagerSlugs.has(project.slug)}
              wide={index === 0}
            />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
