import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { type Locale, routing } from "./routing";

/**
 * Narrows a raw `[locale]` route param to `Locale`.
 *
 * Route params are `string` at the type level — Next.js generates them that way
 * and its route validator rejects a narrower signature — so every page has to
 * cross that boundary somewhere. Doing it with `as Locale` type-checks but lies:
 * an unknown segment would index `Record<Locale, string>` content maps and yield
 * `undefined` at runtime with no error. This checks first and 404s instead.
 *
 * Kept out of `routing.ts` on purpose: that module is imported by the proxy and
 * by client components, which must not pull in `next/navigation`'s server APIs.
 */
export function toLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) {
    notFound();
  }
  return value;
}
