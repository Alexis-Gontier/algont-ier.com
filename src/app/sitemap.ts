import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { projects } from "@/features/projects";
import { routing } from "@/i18n/routing";

/** Locale-relative paths to index ("" = home) with their crawl priority. */
const paths: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/projets", priority: 0.8 },
  { path: "/graph", priority: 0.7 },
  { path: "/mentions-legales", priority: 0.3 },
  ...projects.map((project) => ({
    path: `/projets/${project.slug}`,
    priority: 0.6,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, priority }) => {
    // Cross-link every locale of a page via hreflang alternates.
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          absoluteUrl(`/${locale}${path}`),
        ]),
      ),
      "x-default": absoluteUrl(`/${routing.defaultLocale}${path}`),
    };

    // No `lastModified`: a per-build timestamp is fake freshness, and search
    // engines only trust lastmod when it reflects real content changes.
    return routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
