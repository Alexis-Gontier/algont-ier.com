import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });

  return pageMetadata({
    locale,
    path: "/mentions-legales",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal" });

  const values = {
    name: siteConfig.author.name,
    email: siteConfig.author.email,
  };

  const sections = [
    { title: t("editorTitle"), paragraphs: [t("editorText", values)] },
    { title: t("hostTitle"), paragraphs: [t("hostText")] },
    {
      title: t("privacyTitle"),
      paragraphs: [
        t("privacyIntro"),
        t("privacyAnalytics"),
        t("privacyTheme"),
        t("privacyLogs"),
        t("privacyContact"),
      ],
    },
    { title: t("rightsTitle"), paragraphs: [t("rightsText", values)] },
  ];

  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>

        {sections.map(({ title, paragraphs }) => (
          <section key={title} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Section>
  );
}
