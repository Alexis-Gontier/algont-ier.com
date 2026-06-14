import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  // Cross-link every locale of a page via hreflang alternates.
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(`/${locale}`)]),
  );

  return routing.locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
