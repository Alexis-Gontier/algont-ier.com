import { projects } from "@/features/projects";

/**
 * Skills grouped by category. `labelKey` resolves against the `Skills`
 * namespace in `src/messages/*`.
 */
export type SkillCategory = {
  labelKey: "frontend" | "backend" | "database" | "devops" | "tools";
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    labelKey: "frontend",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Sass",
      "Motion",
      "GSAP",
      "Radix UI",
      "shadcn/ui",
      "Zustand",
      "TanStack Query",
      "TanStack Table",
      "React Hook Form",
      "Three.js",
      "Vite",
      "Expo",
      "Astro",
      "Svelte",
      "i18n",
    ],
  },
  {
    labelKey: "backend",
    skills: [
      "Node.js",
      "Python",
      "PHP",
      "Rust",
      "FastAPI",
      "Flask",
      "Hono",
      "Express",
      "tRPC",
      "REST API",
      "GraphQL",
      "WebSocket",
      "Socket.io",
      "Convex",
      "Resend",
      "Better Auth",
      "Drupal",
      "Solidity",
    ],
  },
  {
    labelKey: "database",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "Prisma",
      "Drizzle ORM",
      "Neon",
    ],
  },
  {
    labelKey: "devops",
    skills: [
      "Git",
      "Docker",
      "Vercel",
      "GitHub Actions",
      "CI/CD",
      "Linux",
      "Turborepo",
      "Terraform",
    ],
  },
  {
    labelKey: "tools",
    skills: [
      "Zod",
      "Vitest",
      "Playwright",
      "Biome",
      "Lefthook",
      "Prettier",
      "husky",
      "Figma",
      "VSCode",
      "pnpm",
      "Storybook",
      "Claude Code",
    ],
  },
];

/** Skills listed under another name in project tags. */
const tagAliases: Record<string, string> = { Vite: "Vite.js" };

/**
 * How many of the site's projects use each skill — derived from the project
 * tags, so the toolbox and the skills graph never disagree.
 */
export const projectCountBySkill = new Map(
  skillCategories
    .flatMap((category) => category.skills)
    .map((skill) => {
      const tag = tagAliases[skill] ?? skill;
      return [skill, projects.filter((p) => p.tags.includes(tag)).length];
    }),
);
