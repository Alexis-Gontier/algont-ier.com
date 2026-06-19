/**
 * Skills grouped by category. `labelKey` resolves against the `Skills`
 * namespace in `src/messages/*`. Edit the lists to match your real stack.
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
      "i18n",
    ],
  },
  {
    labelKey: "backend",
    skills: [
      "Node.js",
      "Python",
      "FastAPI",
      "Express",
      "tRPC",
      "REST API",
      "GraphQL",
      "Socket.io",
      "Resend",
      "Better Auth",
      "Drupal",
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
