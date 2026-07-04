import type { Locale } from "@/i18n/routing";

/**
 * Projects shown across the site. The home page renders the `featured` ones;
 * `/projets` lists them all and `/projets/[slug]` shows the detail.
 * (Later sourced from the admin data source.)
 */
export type Project = {
  /** URL segment for the detail route (`/projets/[slug]`). */
  slug: string;
  title: string;
  /** Localized short description (cards, metadata) — one entry per locale. */
  description: Record<Locale, string>;
  /** Localized long description shown on the detail page (falls back to `description`). */
  longDescription?: Record<Locale, string>;
  tags: string[];
  /** Preview image, e.g. `/projets/portfolio.webp` (file in `public/`). */
  image?: string;
  /** Year the project was built/shipped. */
  year?: number;
  demoUrl?: string;
  repoUrl?: string;
  /** Still a work in progress — surfaces an "in development" badge. */
  inDevelopment?: boolean;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio",
    description: {
      fr: "Mon portfolio personnel construit avec Next.js, Tailwind CSS et shadcn/ui.",
      en: "My personal portfolio built with Next.js, Tailwind CSS and shadcn/ui.",
    },
    longDescription: {
      fr: "Un portfolio conçu pour présenter mes projets et compétences de manière claire et élégante. Construit avec Next.js 16 App Router, Tailwind CSS v4 et shadcn/ui, il intègre des animations fluides, un mode sombre par défaut et une génération d'images OG dynamiques.",
      en: "A portfolio designed to showcase my projects and skills in a clear, elegant way. Built with Next.js 16 App Router, Tailwind CSS v4 and shadcn/ui, it features smooth animations, a default dark mode and dynamic OG image generation.",
    },
    image: "/projets/portfolio.webp",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    year: 2025,
    demoUrl: "https://algont-ier.com",
    repoUrl: "https://github.com/Alexis-Gontier/algont-ier.com",
  },
  {
    slug: "station-meteo-iot",
    title: "Station Météo IoT",
    description: {
      fr: "Station météo connectée pilotée par un ESP32 et un capteur DHT22. Données publiées via MQTT, relayées par Node.js et affichées en temps réel via WebSocket.",
      en: "Connected weather station powered by an ESP32 and a DHT22 sensor. Data published over MQTT, relayed by Node.js and displayed in real time via WebSocket.",
    },
    longDescription: {
      fr: "Station météo connectée pilotée par un ESP32 et un capteur DHT22. Les données de température et d'humidité sont publiées via MQTT, relayées par un serveur Node.js et affichées en temps réel via WebSocket. Inclut un schéma de câblage 3D réalisé avec Three.js.",
      en: "Connected weather station powered by an ESP32 and a DHT22 sensor. Temperature and humidity readings are published over MQTT, relayed by a Node.js server and displayed in real time via WebSocket. Includes a 3D wiring diagram built with Three.js.",
    },
    tags: ["ESP32", "Node.js", "MQTT", "WebSocket", "Three.js"],
    year: 2025,
    repoUrl: "https://github.com/ArthurJenck/Hetic_IoTStationMeteo",
  },
  {
    slug: "guts",
    title: "Guts — Git from Scratch",
    description: {
      fr: "Réimplémentation de Git from scratch en Rust, couvrant les commandes plumbing et porcelaine. CLI via Clap et TUI interactive avec Ratatui.",
      en: "A from-scratch reimplementation of Git in Rust, covering plumbing and porcelain commands. CLI with Clap and an interactive TUI with Ratatui.",
    },
    longDescription: {
      fr: "Réimplémentation de Git from scratch en Rust, couvrant les commandes plumbing et porcelaine (init, add, commit…). Dispose d'une CLI via Clap et d'une TUI interactive avec Ratatui, installable sur Windows et macOS.",
      en: "A from-scratch reimplementation of Git in Rust, covering plumbing and porcelain commands (init, add, commit…). It ships a CLI built with Clap and an interactive TUI with Ratatui, installable on Windows and macOS.",
    },
    tags: ["Rust", "CLI", "TUI", "Ratatui", "Clap"],
    year: 2025,
    repoUrl: "https://github.com/Jeck0v/Guts",
    featured: true,
  },
  {
    slug: "3nc-normandie-nucleaire",
    title: "3NC — Normandie Nucléaire",
    description: {
      fr: "Site vitrine pour l'initiative 3NC (Normandie Nucléaire, Nouvelles Compétences), promouvant les formations et métiers du nucléaire en Normandie. Réalisé en alternance chez Plume SAS.",
      en: "Showcase site for the 3NC initiative (Normandie Nucléaire, Nouvelles Compétences), promoting nuclear-sector training and careers in Normandy. Built during my apprenticeship at Plume SAS.",
    },
    longDescription: {
      fr: "Site vitrine pour l'initiative régionale 3NC (Normandie Nucléaire, Nouvelles Compétences), qui promeut les formations et métiers du secteur nucléaire en Normandie. Réalisé en alternance chez Plume SAS.",
      en: "Showcase site for the regional 3NC initiative (Normandie Nucléaire, Nouvelles Compétences), which promotes training and careers in the nuclear sector across Normandy. Built during my apprenticeship at Plume SAS.",
    },
    image: "/projets/metiersdavenir-nucleaire-normandie.webp",
    tags: ["Drupal", "Twig", "PHP", "Sass", "JavaScript"],
    year: 2025,
    demoUrl: "https://www.metiersdavenir-nucleaire-normandie.fr",
  },
  {
    slug: "centre-emilie-mottet",
    title: "Centre Emilie Mottet",
    description: {
      fr: "Site institutionnel du Centre Emilie Mottet, dédié à l'égalité femmes-hommes en Bourgogne-Franche-Comté. Réalisé en alternance chez Plume SAS.",
      en: "Institutional site for the Centre Emilie Mottet, dedicated to gender equality in the Bourgogne-Franche-Comté region. Built during my apprenticeship at Plume SAS.",
    },
    longDescription: {
      fr: "Site institutionnel du Centre Emilie Mottet, centre régional de Bourgogne-Franche-Comté dédié à l'égalité femmes-hommes et à la lutte contre les discriminations de genre. Réalisé en alternance chez Plume SAS.",
      en: "Institutional site for the Centre Emilie Mottet, a Bourgogne-Franche-Comté regional centre dedicated to gender equality and the fight against gender-based discrimination. Built during my apprenticeship at Plume SAS.",
    },
    image: "/projets/centre-emilie-mottet.webp",
    tags: ["Drupal", "Twig", "PHP", "Sass", "JavaScript"],
    year: 2025,
    demoUrl: "https://www.centre-emilie-mottet.fr",
  },
  {
    slug: "refer-rythmo",
    title: "REFER Rythmo",
    description: {
      fr: "Site du Réseau Français en Rythmologie Interventionnelle, fédérant des centres cliniques experts en cardiologie. Réalisé en alternance chez Plume SAS.",
      en: "Website for the French Interventional Rhythmology Network, bringing together expert clinical centres in cardiology. Built during my apprenticeship at Plume SAS.",
    },
    longDescription: {
      fr: "Site du Réseau Français en Rythmologie Interventionnelle, fédérant des centres cliniques experts qui accompagnent les entreprises de dispositifs médicaux en cardiologie, du développement pré-clinique au suivi post-marché. Réalisé en alternance chez Plume SAS.",
      en: "Website for the French Interventional Rhythmology Network, bringing together expert clinical centres that support medical-device companies in cardiology, from pre-clinical development to post-market follow-up. Built during my apprenticeship at Plume SAS.",
    },
    image: "/projets/refer-rythmo.webp",
    tags: ["Drupal", "Twig", "PHP", "Sass", "JavaScript"],
    year: 2025,
    demoUrl: "https://www.refer-rythmo.fr",
  },
  {
    slug: "among-legends",
    title: "Among Legends",
    description: {
      fr: "Jeu de déduction sociale multijoueur en temps réel, inspiré d'Among Us. Rooms via code d'invitation, rôles aléatoires et phases synchronisées avec Convex.",
      en: "Real-time multiplayer social-deduction game inspired by Among Us. Invite-code rooms, random roles and phases synchronized with Convex.",
    },
    longDescription: {
      fr: "Jeu de déduction sociale multijoueur en temps réel, inspiré d'Among Us. Les joueurs rejoignent une room via un code d'invitation, les rôles (innocent / imposteur) sont distribués aléatoirement et chaque phase de jeu se synchronise instantanément grâce à Convex.",
      en: "Real-time multiplayer social-deduction game inspired by Among Us. Players join a room with an invite code, roles (crewmate / impostor) are assigned at random and every game phase syncs instantly thanks to Convex.",
    },
    image: "/projets/among-legends.webp",
    tags: [
      "Next.js",
      "TypeScript",
      "Convex",
      "Zustand",
      "shadcn/ui",
      "Tailwind CSS",
    ],
    year: 2025,
    demoUrl: "https://among-legends-seven.vercel.app",
    repoUrl: "https://github.com/Alexis-Gontier/among-legends",
  },
  {
    slug: "run-together",
    title: "Run Together",
    description: {
      fr: "Application de suivi de course à pied pour un groupe privé. Sorties, IMC, objectifs mensuels et classement commun.",
      en: "Running tracker for a private group. Runs, BMI, monthly goals and a shared leaderboard.",
    },
    longDescription: {
      fr: "Application de suivi de course à pied pour un groupe privé. Chaque membre enregistre ses sorties, suit son IMC, se fixe des objectifs mensuels et participe à un classement commun. Des pages de comparaison et de défis renforcent la dynamique de groupe.",
      en: "Running tracker for a private group. Each member logs their runs, tracks their BMI, sets monthly goals and competes on a shared leaderboard. Comparison and challenge pages strengthen the group dynamic.",
    },
    image: "/projets/run-together.webp",
    tags: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Better Auth",
      "TanStack Query",
      "Resend",
      "Tailwind CSS",
    ],
    year: 2025,
    demoUrl: "https://run-together.app",
    repoUrl: "https://github.com/Alexis-Gontier/run-together",
    featured: true,
  },
  {
    slug: "better-save",
    title: "Better Save",
    description: {
      fr: "Sauvegardez, organisez et retrouvez vos liens et contenus web. Dashboard Next.js et extension Chrome.",
      en: "Save, organize and find your links and web content again. Next.js dashboard and Chrome extension.",
    },
    image: "/projets/better-save.webp",
    tags: [
      "Chrome Extension",
      "TypeScript",
      "Next.js",
      "Prisma",
      "Tailwind CSS",
      "Vite.js",
      "Turborepo",
      "shadcn/ui",
      "Better Auth",
    ],
    year: 2025,
    demoUrl: "https://better-save.vercel.app",
    repoUrl: "https://github.com/Alexis-Gontier/better-save",
    inDevelopment: true,
    featured: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

/** Find a project by its `slug`, or `undefined` if none matches. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
