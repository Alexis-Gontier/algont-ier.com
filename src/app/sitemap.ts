import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { projects } from "@/features/projects";
import { routing } from "@/i18n/routing";

// Required for `output: export` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

/** Locale-relative paths to index ("" = home) with their crawl priority. */
const paths: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/projets", priority: 0.8 },
  { path: "/graph", priority: 0.7 },
  ...projects.map((project) => ({
    path: `/projets/${project.slug}`,
    priority: 0.6,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, priority }) => {
    // Cross-link every locale of a page via hreflang alternates.
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(`/${locale}${path}`),
      ]),
    );

    return routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
