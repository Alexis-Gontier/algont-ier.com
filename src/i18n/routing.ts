import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // Always land on the default locale at `/` instead of honoring the visitor's
  // `Accept-Language` header — otherwise an `en` browser/CI agent redirects `/` to `/en`.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
