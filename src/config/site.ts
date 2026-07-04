import { env } from "@/env";

/** Canonical site URL without a trailing slash. */
export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Build an absolute URL for a given path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}

/**
 * Primary navigation. `labelKey` resolves against the `Nav` namespace in
 * `src/messages/*` so links stay translatable; `href` points at a home anchor
 * (e.g. `/#about`) or a dedicated route (`/projets`).
 */
export const navLinks = [
  { labelKey: "home", href: "/" },
  { labelKey: "projects", href: "/projets" },
  { labelKey: "graph", href: "/graph" },
] as const;

export type NavLinkKey = (typeof navLinks)[number]["labelKey"];

/** External profiles — rendered as icon links in the footer (and contact). */
export const socialLinks = {
  github: "https://github.com/Alexis-Gontier",
  linkedin: "https://www.linkedin.com/in/alexis-gontier/",
} as const;

/**
 * Static site metadata — single source of truth for branding, navigation and
 * links. Grow this as the portfolio (and admin) need it: nav, social links,
 * default OG image, etc.
 */
export const siteConfig = {
  name: "Alexis Gontier",
  description:
    "Portfolio of Alexis Gontier — full-stack developer seeking a 2-year apprenticeship.",
  url: siteUrl,
  author: {
    name: "Alexis Gontier",
    email: "alexis.gontier03@gmail.com",
  },
  /** CV served from `public/` — drop the file at `public/cv.pdf`. */
  cvUrl: "/cv.pdf",
  nav: navLinks,
  socials: socialLinks,
} as const;
