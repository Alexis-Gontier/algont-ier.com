import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
    /*
     * The graph is the page: it fills the layout's column edge to edge and the
     * viewport under the sticky header (`h-20`) and the availability banner
     * above it (37px), so it fits the screen on arrival — like a full-screen
     * graph view. The footer stays below it, reached by scrolling the page.
     */
    <section className="relative h-[calc(100dvh-5rem-37px)] min-h-120 overflow-hidden border-b bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px]">
      <SkillsGraph />

      {/* Title in the one corner the graph's controls leave free. */}
      <div className="pointer-events-none absolute right-3 bottom-3 max-w-sm rounded-lg bg-background/70 px-3 py-2 text-right backdrop-blur-sm max-md:sr-only">
        <p className="font-mono text-primary text-xs">{t("label")}</p>
        <h1 className="font-bold text-2xl tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground text-xs">{t("subtitle")}</p>
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
    </section>
  );
}
