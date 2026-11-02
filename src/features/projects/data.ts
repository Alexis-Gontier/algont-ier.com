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
  /** Preview image, e.g. `/projets/portfolio-2026-11.webp` (file in `public/`). */
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
    image: "/projets/portfolio-2026-11.webp",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    year: 2025,
    demoUrl: "https://algont-ier.com",
    repoUrl: "https://github.com/Alexis-Gontier/algont-ier.com",
  },
  {
    slug: "better-list",
    title: "Better List",
    description: {
      fr: "Catalogue d'animes, mangas et webtoons adossé à l'API AniList, avec suivi, journal daté, collection physique et tier lists.",
      en: "Anime, manga and webtoon catalogue backed by the AniList API, with progress tracking, a dated log, a physical collection and tier lists.",
    },
    longDescription: {
      fr: "Catalogue d'œuvres japonaises et asiatiques — animes, mangas, webtoons, light novels — adossé à l'API GraphQL AniList et miroité en base. S'y greffent le suivi du visionnage, un journal daté de ce qu'on a vu et quand, le recensement de la collection physique et des listes réarrangeables en classements ou en tier lists. Pensé pour un cercle privé : inscription sur invitation et partage par lien non listé.",
      en: "A catalogue of Japanese and Asian works — anime, manga, webtoons, light novels — backed by the AniList GraphQL API and mirrored in the database. On top of it: progress tracking, a dated log of what you watched and when, a physical collection inventory and lists you can rearrange into rankings or tier lists. Built for a private circle: invite-only sign-up and sharing through unlisted links.",
    },
    image: "/projets/better-list-2026-11.webp",
    tags: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Better Auth",
      "GraphQL",
      "shadcn/ui",
      "Tailwind CSS",
    ],
    year: 2026,
    demoUrl: "https://better-list-gold.vercel.app",
    repoUrl: "https://github.com/Alexis-Gontier/better-list",
    inDevelopment: true,
    featured: true,
  },
  {
    slug: "better-lift",
    title: "Better Lift",
    description: {
      fr: "Tracker de musculation web et mobile : catalogue de 1 316 exercices, routines série par série, séance guidée et records.",
      en: "Web and mobile strength-training tracker: a 1,316-exercise catalogue, set-by-set routines, guided workouts and personal records.",
    },
    longDescription: {
      fr: "Tracker de musculation personnel, web et mobile, en français. Catalogue de 1 316 exercices, routines série par série, séance guidée sur mobile avec notification de repos, historique, records et page dédiée à chaque exercice. Monorepo TypeScript : SPA Vite + TanStack Router, app Expo, API Hono avec Better Auth et un client RPC typé partagé.",
      en: "A personal strength-training tracker for web and mobile, in French. A 1,316-exercise catalogue, set-by-set routines, guided mobile workouts with rest notifications, history, records and a page for every exercise. TypeScript monorepo: a Vite + TanStack Router SPA, an Expo app, a Hono API with Better Auth and a shared typed RPC client.",
    },
    image: "/projets/better-lift-2026-11.webp",
    tags: [
      "TypeScript",
      "React",
      "Expo",
      "Hono",
      "Prisma",
      "PostgreSQL",
      "Better Auth",
      "Vite.js",
      "shadcn/ui",
    ],
    year: 2026,
    demoUrl: "https://better-lift.vercel.app",
    repoUrl: "https://github.com/Alexis-Gontier/better-lift",
    inDevelopment: true,
    featured: true,
  },
  {
    slug: "webtoon-player",
    title: "Player — Traduction FR",
    description: {
      fr: "Traduction française du webtoon Player : moteur de lettrage (OCR, effacement par inpainting, relettrage) et lecteur EN / FR côte à côte.",
      en: "French translation of the Player webtoon: a lettering engine (OCR, inpainting-based erasing, relettering) and a side-by-side EN / FR reader.",
    },
    longDescription: {
      fr: "Traduction française non officielle du webtoon « Player » (chapitres 225 à 264). Le texte anglais est repéré par OCR, effacé bulle par bulle par inpainting (LaMa en ONNX), puis remplacé par le texte français avec des polices proches du lettrage d'origine. Les chapitres sont publiés sur un lecteur Astro + Svelte qui affiche l'anglais et le français côte à côte.",
      en: "An unofficial French translation of the « Player » webtoon (chapters 225 to 264). English text is located by OCR, erased bubble by bubble through inpainting (LaMa in ONNX), then replaced with French text in fonts close to the original lettering. Chapters are published on an Astro + Svelte reader showing English and French side by side.",
    },
    image: "/projets/webtoon-player-2026-11.webp",
    tags: ["Python", "OCR", "ONNX", "Astro", "Svelte", "TypeScript"],
    year: 2026,
    demoUrl: "https://player-fr.vercel.app",
    repoUrl: "https://github.com/Alexis-Gontier/webtoon-player",
  },
  {
    slug: "webtoon-dark-mode",
    title: "Webtoon Dark Mode",
    description: {
      fr: "Extension Chrome / Edge (Manifest V3) qui ajoute un mode sombre à webtoons.com sans altérer les couleurs des planches.",
      en: "Chrome / Edge extension (Manifest V3) that adds a dark mode to webtoons.com without altering the comic panels' colours.",
    },
    longDescription: {
      fr: "Extension Chrome / Edge / Brave (Manifest V3) qui ajoute un mode sombre à webtoons.com. La page est inversée puis les médias ré-inversés, si bien que les planches ressortent pixel pour pixel identiques ; les couleurs vives de l'interface gardent leur teinte. Palette de fonds au choix et bouton on/off appliqué en direct sur tous les onglets.",
      en: "A Chrome / Edge / Brave extension (Manifest V3) that adds a dark mode to webtoons.com. The page is inverted and media re-inverted, so panels come out pixel-for-pixel identical, while the interface's bright colours keep their hue. A choice of background palettes and an on/off toggle applied live across every tab.",
    },
    tags: ["Chrome Extension", "JavaScript", "CSS"],
    year: 2026,
    repoUrl: "https://github.com/Alexis-Gontier/webtoons-extention-dark-mode",
  },
  {
    slug: "flipgame",
    title: "FlipGame — Flipper 3D",
    description: {
      fr: "Jeu de flipper multijoueur en 3D pensé pour une installation physique à trois écrans. React Three Fiber, physique Rapier et synchronisation temps réel en WebSocket.",
      en: "Multiplayer 3D pinball game designed for a three-screen physical setup. React Three Fiber, Rapier physics and real-time WebSocket sync.",
    },
    longDescription: {
      fr: "Jeu de flipper multijoueur en 3D conçu pour une installation physique à trois écrans : le plateau 3D, l'afficheur de score (DMD) et l'écran du fronton. Les clients React/Three.js partagent design system, types et utilitaires dans un monorepo pnpm ; la physique est gérée par Rapier et la synchronisation temps réel passe par WebSocket. Projet d'équipe réalisé à HETIC, avec un back-end Rust et une partie IoT sur ESP32.",
      en: "Multiplayer 3D pinball game built for a three-screen physical setup: the 3D playfield, the score display (DMD) and the backglass screen. The React/Three.js clients share a design system, type definitions and utilities in a pnpm monorepo; physics is handled by Rapier and real-time sync runs over WebSocket. Team project built at HETIC, with a Rust back end and an ESP32 IoT side.",
    },
    tags: [
      "React",
      "TypeScript",
      "React Three Fiber",
      "Three.js",
      "WebSocket",
      "Vite.js",
      "Tailwind CSS",
    ],
    year: 2026,
    demoUrl: "https://pandormedia.github.io/fliphetic/",
    repoUrl: "https://github.com/FlipGame-Hetic/frontend",
    featured: true,
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
  },
  {
    slug: "parking-partage",
    title: "Parking Partage",
    description: {
      fr: "Plateforme de parking partagé : les propriétaires proposent leurs places inutilisées, les utilisateurs les recherchent, réservent et paient. Projet d'équipe à HETIC.",
      en: "Shared parking platform: owners list their unused spots, users search, book and pay for them. Team project at HETIC.",
    },
    longDescription: {
      fr: "Système de parking partagé permettant aux propriétaires de proposer leurs places inutilisées et aux utilisateurs de rechercher, réserver et payer une place de stationnement. Back-end PHP en Clean Architecture avec authentification JWT et tests PHPUnit, front-end React + TypeScript, le tout conteneurisé avec Docker. Projet d'équipe à quatre réalisé à HETIC.",
      en: "A shared parking system where owners list their unused spots and users search, book and pay for a parking space. A Clean Architecture PHP back end with JWT authentication and PHPUnit tests, a React + TypeScript front end, all containerised with Docker. Four-person team project built at HETIC.",
    },
    tags: [
      "PHP",
      "React",
      "TypeScript",
      "Vite.js",
      "PostgreSQL",
      "Docker",
      "PHPUnit",
    ],
    year: 2025,
  },
  {
    slug: "aittention",
    title: "Aittention",
    description: {
      fr: "Plateforme qui prédit, grâce à un modèle d'IA de saillance visuelle, les zones d'une image qui attirent le regard. Projet d'équipe à HETIC.",
      en: "Platform that uses a visual-saliency AI model to predict which areas of an image draw the eye. Team project at HETIC.",
    },
    longDescription: {
      fr: "Plateforme d'analyse visuelle : on dépose une image et un modèle d'IA de prédiction de saillance indique les zones qui captent l'attention. Front-end Next.js avec shadcn/ui, Three.js et tests Playwright ; back-end FastAPI et MongoDB ; infrastructure sur GCP provisionnée avec Terraform. Projet d'équipe réalisé à HETIC.",
      en: "A visual analysis platform: drop an image and a saliency-prediction AI model highlights the areas that capture attention. A Next.js front end with shadcn/ui, Three.js and Playwright tests; a FastAPI and MongoDB back end; infrastructure on GCP provisioned with Terraform. Team project built at HETIC.",
    },
    tags: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "MongoDB",
      "shadcn/ui",
      "Three.js",
      "Playwright",
      "Terraform",
    ],
    year: 2025,
  },
  {
    slug: "article-11",
    title: "Article 11 — Hackathon Europe",
    description: {
      fr: "PWA citoyenne sur l'Union européenne, développée en équipe lors du hackathon HETIC × Publicis 2025 — 1ʳᵉ place.",
      en: "Civic PWA about the European Union, built as a team during the 2025 HETIC × Publicis hackathon — 1st place.",
    },
    longDescription: {
      fr: "Application web progressive pensée pour impliquer les citoyens dans la vie de l'Union européenne : fil d'actions et de propositions, recherche et profil utilisateur. J'ai porté l'essentiel du front-end Next.js, au sein d'une équipe internationale franco-allemande qui travaillait en anglais. Projet d'équipe qui a remporté la 1ʳᵉ place du hackathon HETIC × Publicis 2025.",
      en: "A progressive web app designed to involve citizens in the life of the European Union: a feed of actions and proposals, search and a user profile. I built most of the Next.js front end, in an international French-German team working in English. Team project that won 1st place at the 2025 HETIC × Publicis hackathon.",
    },
    tags: [
      "Next.js",
      "TypeScript",
      "PWA",
      "shadcn/ui",
      "Tailwind CSS",
      "Firebase",
    ],
    year: 2025,
    repoUrl: "https://github.com/Alexis-Gontier/hackaton-europe-2025-frontend",
  },
  {
    slug: "roller-paper-tycoon",
    title: "Roller Paper Tycoon",
    description: {
      fr: "Jeu clicker en PWA adossé à la blockchain : on déroule du papier toilette pour gagner des tokens et acheter des skins. Projet d'équipe à HETIC.",
      en: "Blockchain-backed clicker game as a PWA: unroll toilet paper to earn tokens and buy skins. Team project at HETIC.",
    },
    longDescription: {
      fr: "Jeu clicker en PWA adossé à la blockchain : chaque clic déroule le rouleau, fait monter les points, et les tokens gagnés servent à acheter et équiper des skins. Smart contracts Solidity développés et déployés avec Hardhat, dApp Next.js connectée au portefeuille via wagmi et viem. Projet d'équipe à cinq réalisé à HETIC.",
      en: "A blockchain-backed clicker PWA: every click unrolls the paper and raises your score, and the tokens you earn buy and equip skins. Solidity smart contracts built and deployed with Hardhat, and a Next.js dApp wired to the wallet through wagmi and viem. Five-person team project built at HETIC.",
    },
    tags: [
      "Next.js",
      "TypeScript",
      "Solidity",
      "Hardhat",
      "wagmi",
      "Tailwind CSS",
    ],
    year: 2025,
    repoUrl: "https://github.com/Oomaxime/RollerPaperTycon",
  },
  {
    slug: "design-system",
    title: "Design System",
    description: {
      fr: "Design system construit de Figma au code, documenté dans Storybook et testé visuellement avec Chromatic. Projet d'équipe à HETIC.",
      en: "Design system built from Figma to code, documented in Storybook and visually tested with Chromatic. Team project at HETIC.",
    },
    longDescription: {
      fr: "Application de gestion d'utilisateurs (connexion, réinitialisation du mot de passe, profil) servant de terrain d'expérimentation pour un design system : maquettes Figma, composants React documentés dans Storybook et tests de régression visuelle avec Chromatic. Projet d'équipe réalisé à HETIC.",
      en: "A user management app (sign-in, password reset, profile) used as a testbed for a design system: Figma mockups, React components documented in Storybook and visual regression tests with Chromatic. Team project built at HETIC.",
    },
    tags: ["React", "Vite.js", "Storybook", "Chromatic", "Figma"],
    year: 2025,
    repoUrl: "https://github.com/Oomaxime/DesignSystem",
  },
  {
    slug: "condorcy",
    title: "Condorcy",
    description: {
      fr: "Plateforme de sondages au scrutin de Condorcet : création, vote et résultats. Flask, MongoDB et Docker. Projet d'équipe à HETIC.",
      en: "Condorcet-method survey platform: create, vote and see results. Flask, MongoDB and Docker. Team project at HETIC.",
    },
    longDescription: {
      fr: "Plateforme pour créer autant de sondages que l'on veut, voter et consulter les résultats calculés selon la méthode de Condorcet. Back-end Flask et MongoDB, front-end en HTML, CSS et JavaScript, l'ensemble lancé avec Docker Compose. Projet d'équipe réalisé à HETIC.",
      en: "A platform to create any number of surveys, vote and view results computed with the Condorcet method. A Flask and MongoDB back end, an HTML, CSS and JavaScript front end, all run with Docker Compose. Team project built at HETIC.",
    },
    tags: ["Python", "Flask", "MongoDB", "JavaScript", "Docker"],
    year: 2024,
    repoUrl: "https://github.com/Oomaxime/condorsy",
  },
  {
    slug: "dekuple",
    title: "Dekuple",
    description: {
      fr: "Application web conçue pour le client Dekuple, avec tableaux de bord et graphiques. Projet d'équipe à HETIC, côté front-end.",
      en: "Web application designed for the client Dekuple, with dashboards and charts. Team project at HETIC, on the front-end side.",
    },
    longDescription: {
      fr: "Conception et développement d'une application web pour le client Dekuple, avec des tableaux de bord et des graphiques réalisés avec Chart.js. J'y étais développeur front-end au sein d'une équipe de sept. Projet réalisé à HETIC.",
      en: "Design and development of a web application for the client Dekuple, with dashboards and charts built with Chart.js. I was a front-end developer in a team of seven. Project built at HETIC.",
    },
    tags: ["Next.js", "React", "TypeScript", "Chart.js", "Tailwind CSS"],
    year: 2024,
    repoUrl: "https://github.com/Kae134/dekuple_projet",
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
    image: "/projets/metiersdavenir-nucleaire-normandie-2026-11.webp",
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
    image: "/projets/centre-emilie-mottet-2026-11.webp",
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
    image: "/projets/refer-rythmo-2026-11.webp",
    tags: ["Drupal", "Twig", "PHP", "Sass", "JavaScript"],
    year: 2025,
    demoUrl: "https://www.refer-rythmo.fr",
  },
  {
    slug: "soulez-lariviere-avocats",
    title: "Soulez Larivière Avocats",
    description: {
      fr: "Site du cabinet d'avocats Soulez Larivière, spécialisé en défense pénale, aviation, conformité et contentieux de crise. Réalisé en alternance chez Plume SAS.",
      en: "Website for the Soulez Larivière law firm, specialising in criminal defence, aviation, compliance and crisis litigation. Built during my apprenticeship at Plume SAS.",
    },
    longDescription: {
      fr: "Site du cabinet Soulez Larivière Avocats, fondé en 1969 par Daniel Soulez Larivière. Cabinet pénaliste intervenant dans toutes les branches de la défense pénale, mais aussi en aviation, conformité et contentieux de crise. Site réalisé sous Drupal 11, en alternance chez Plume SAS.",
      en: "Website for the Soulez Larivière Avocats law firm, founded in 1969 by Daniel Soulez Larivière. A criminal-law firm working across every branch of criminal defence, as well as aviation, compliance and crisis litigation. Built on Drupal 11 during my apprenticeship at Plume SAS.",
    },
    image: "/projets/soulez-lariviere-2026-11.webp",
    tags: ["Drupal", "Twig", "PHP", "Sass", "JavaScript"],
    year: 2025,
    demoUrl: "https://www.soulezlariviere.com",
  },
  {
    slug: "among-legends",
    title: "Among Legends",
    description: {
      fr: "Jeu de déduction sociale en temps réel qui se greffe sur vos parties de League of Legends. Rôles secrets, votes entre les manches et synchronisation avec Convex.",
      en: "Real-time social-deduction game layered on top of your League of Legends matches. Secret roles, votes between rounds and sync powered by Convex.",
    },
    longDescription: {
      fr: "Jeu de déduction sociale qui se greffe sur vos parties de League of Legends — une recréation d'amonglegends.fr réalisée comme exercice. Chaque joueur reçoit un rôle secret et un objectif à tenir pendant la partie ; entre deux manches, tout le monde revient sur le site pour voter, marquer des points et découvrir qui trichait. Le moteur de jeu est testé avec Vitest et convex-test, et une partie complète à cinq navigateurs est rejouée avec Playwright.",
      en: "A social-deduction game layered on top of your League of Legends matches — a recreation of amonglegends.fr built as an exercise. Each player gets a secret role and an objective to hold during the match; between rounds everyone comes back to the site to vote, score and find out who was cheating. The game engine is tested with Vitest and convex-test, and a full five-browser game is replayed with Playwright.",
    },
    image: "/projets/among-legends-2026-11.webp",
    tags: [
      "Next.js",
      "TypeScript",
      "Convex",
      "Playwright",
      "shadcn/ui",
      "Tailwind CSS",
    ],
    year: 2025,
    demoUrl: "https://among-legends-app.vercel.app",
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
    image: "/projets/run-together-2026-11.webp",
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
  },
  {
    slug: "better-save",
    title: "Better Save",
    description: {
      fr: "Sauvegardez, organisez et retrouvez vos liens et contenus web. Dashboard Next.js et extension Chrome.",
      en: "Save, organize and find your links and web content again. Next.js dashboard and Chrome extension.",
    },
    image: "/projets/better-save-2026-11.webp",
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
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

/** Find a project by its `slug`, or `undefined` if none matches. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
