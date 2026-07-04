import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a locale-relative `path` ("" = home).
 * Relative URLs resolve against `metadataBase` (set in the root layout).
 */
export function localeAlternates(
  locale: string,
  path = "",
): Metadata["alternates"] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}

/**
 * Page-level metadata: title/description plus this page's own canonical,
 * hreflang and Open Graph URL. Without these, `alternates` is inherited from
 * the root layout and every page declares itself a duplicate of the home page.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  /** Locale-relative path, e.g. "/projets". */
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "website",
      url: `/${locale}${path}`,
      title,
      description,
    },
  };
}
