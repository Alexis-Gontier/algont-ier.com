/// <reference types="react/canary" />

import type { routing } from "@/i18n/routing";
import type messages from "@/messages/fr.json";

/**
 * Makes next-intl aware of the message shape and the supported locales, so:
 * - `t("does.not.exist")` is a `tsc` error instead of a build-time
 *   `MISSING_MESSAGE` warning that ships a raw key to the page;
 * - `useLocale()` / `getLocale()` return `Locale` instead of `string`, which
 *   removes the `as Locale` casts around `Record<Locale, string>` lookups.
 *
 * `fr` is the reference locale — `messages.test.ts` asserts `en` matches it.
 */
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: (typeof routing.locales)[number];
  }
}
