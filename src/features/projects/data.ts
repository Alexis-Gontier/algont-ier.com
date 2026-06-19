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
    slug: "taskflow",
    title: "TaskFlow",
    description: {
      fr: "Gestionnaire de tâches collaboratif en temps réel avec tableaux Kanban, étiquettes et notifications.",
      en: "Real-time collaborative task manager with Kanban boards, labels and notifications.",
    },
    tags: ["Next.js", "tRPC", "Prisma", "PostgreSQL"],
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    slug: "shopwave",
    title: "ShopWave",
    description: {
      fr: "Boutique e-commerce avec panier, paiement Stripe et back-office de gestion des produits.",
      en: "E-commerce store with cart, Stripe checkout and a product management back-office.",
    },
    tags: ["Next.js", "Stripe", "Tailwind CSS", "Zustand"],
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    slug: "devconnect",
    title: "DevConnect",
    description: {
      fr: "Réseau social pour développeurs : profils, fil d'actualité et messagerie instantanée.",
      en: "Social network for developers: profiles, activity feed and instant messaging.",
    },
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
  },
  {
    slug: "weather-now",
    title: "Weather Now",
    description: {
      fr: "Application météo avec géolocalisation, prévisions sur 7 jours et cartes interactives.",
      en: "Weather app with geolocation, 7-day forecasts and interactive maps.",
    },
    tags: ["React", "TypeScript", "REST API"],
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
  },
  {
    slug: "markdown-notes",
    title: "Markdown Notes",
    description: {
      fr: "Éditeur de notes en Markdown avec prévisualisation live, recherche et synchronisation locale.",
      en: "Markdown notes editor with live preview, search and local sync.",
    },
    tags: ["Next.js", "TypeScript", "Zustand"],
    repoUrl: "https://github.com",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

/** Find a project by its `slug`, or `undefined` if none matches. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
