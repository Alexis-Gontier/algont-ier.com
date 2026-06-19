import type { Locale } from "@/i18n/routing";

/**
 * Projects shown across the site. The home page renders the `featured` ones;
 * `/projets` will list them all and `/projets/[slug]` the detail. Placeholder
 * content — replace with real projects (later sourced from the admin data).
 */
export type Project = {
  /** URL segment for the detail route (`/projets/[slug]`). */
  slug: string;
  title: string;
  /** Localized description — one entry per locale. */
  description: Record<Locale, string>;
  tags: string[];
  /** Preview image, e.g. `/projects/portfolio.png` (file in `public/`). */
  image?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio",
    description: {
      fr: "Mon portfolio personnel, construit avec Next.js et Tailwind CSS.",
      en: "My personal portfolio, built with Next.js and Tailwind CSS.",
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    repoUrl: "https://github.com/Alexis-Gontier/algont-ier.com",
    featured: true,
  },
  {
    slug: "projet-2",
    title: "Projet 2",
    description: {
      fr: "Description courte du projet — à compléter.",
      en: "Short project description — to be completed.",
    },
    tags: ["React", "Node.js", "PostgreSQL"],
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    slug: "projet-3",
    title: "Projet 3",
    description: {
      fr: "Description courte du projet — à compléter.",
      en: "Short project description — to be completed.",
    },
    tags: ["Next.js", "Prisma", "tRPC"],
    demoUrl: "https://example.com",
    featured: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
