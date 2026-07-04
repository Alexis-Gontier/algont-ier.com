import { getTranslations, setRequestLocale } from "next-intl/server";
import { absoluteUrl, siteConfig } from "@/config/site";
import { About } from "@/features/about";
import { Contact } from "@/features/contact";
import { Hero } from "@/features/hero";
import { FeaturedProjects } from "@/features/projects";
import { Skills } from "@/features/skills";
import { Trust } from "@/features/trust";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  // schema.org Person — helps search engines link the portfolio to its author
  // and surface the GitHub/LinkedIn profiles as the same entity.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: absoluteUrl(`/${locale}`),
    jobTitle: t("jobTitle"),
    sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from static site config, no user input reaches it
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="divide-y divide-border">
        <Hero />
        <Trust />
        <About />
        <Skills />
        <FeaturedProjects />
        <Contact />
      </div>
    </>
  );
}
