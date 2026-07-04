import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/shared/section";
import { SkillsGraph } from "@/features/graph";
import { projects } from "@/features/projects";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Graph" });

  return pageMetadata({
    locale,
    path: "/graph",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function GraphPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Graph" });

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="h-[70vh] min-h-120">
          <SkillsGraph />
        </div>

        {/* Text alternative to the visual graph — read once by screen readers. */}
        <div className="sr-only">
          <h2>{t("srListTitle")}</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.slug}>
                {project.title} — {project.tags.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
