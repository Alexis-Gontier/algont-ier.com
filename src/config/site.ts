import { env } from "@/env";

/** Canonical site URL without a trailing slash. */
export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Build an absolute URL for a given path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}

/**
 * Static site metadata — single source of truth for branding, navigation and
 * links. Grow this as the portfolio (and admin) need it: nav, social links,
 * default OG image, etc.
 */
export const siteConfig = {
  name: "Alexis Gontier",
  description: "My personal portfolio.",
  url: siteUrl,
  author: {
    name: "Alexis Gontier",
    email: "alexis.gontier03@gmail.com",
  },
} as const;
