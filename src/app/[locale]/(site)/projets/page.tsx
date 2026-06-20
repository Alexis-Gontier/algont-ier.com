import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Separator } from "@/components/shadcn-ui/separator";
import { Section } from "@/components/shared/section";
import { ProjectCard, projects } from "@/features/projects";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });

  return { title: t("title"), description: t("subtitle") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
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
    <Section padded={false}>
      <div className="flex items-stretch">
        <Separator orientation="vertical" />

        <div className="flex flex-1 flex-col gap-10 py-8">
          <div className="flex flex-col gap-2 px-4 sm:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>

          <Separator />

          <div className="grid gap-6 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={eagerSlugs.has(project.slug)}
              />
            ))}
          </div>

          <Separator />

          {/* Espace réservé, symétrique du bouton « voir tout » de la home. */}
          <div aria-hidden className="h-5 px-4 sm:px-8" />
        </div>

        <Separator orientation="vertical" />
      </div>
    </Section>
  );
}
