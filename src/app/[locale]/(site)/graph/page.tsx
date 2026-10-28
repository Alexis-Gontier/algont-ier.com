import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/shared/section";
import { SkillsGraph } from "@/features/graph";
import { projects } from "@/features/projects";
import { toLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Graph" });

  return pageMetadata({
    locale,
    path: "/graph",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function GraphPage({ params }: Props) {
  const locale = toLocale((await params).locale);
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

        {/* Shorter on phones: at 70vh the canvas left only a thin strip of page
            to scroll past it. */}
        <div className="h-[50vh] min-h-80 md:h-[70vh] md:min-h-120">
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
