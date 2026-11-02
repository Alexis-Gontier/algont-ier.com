import { type SkillCategory, skillCategories } from "@/features/skills";

export type TechCategory = SkillCategory["labelKey"] | "other";

/** Every category, in toolbox order, with `other` last. */
export const techCategories: TechCategory[] = [
  ...skillCategories.map((category) => category.labelKey),
  "other",
];

/** Project tags spelled differently from the toolbox entry. */
const tagAliases: Record<string, string> = { "Vite.js": "Vite" };

const categoryBySkill = new Map(
  skillCategories.flatMap((category) =>
    category.skills.map((skill) => [skill, category.labelKey] as const),
  ),
);

/**
 * The toolbox category a project tag belongs to — the skills section and the
 * graph share one classification. Tags the toolbox doesn't list (CLI, OCR,
 * ESP32…) fall under `other`.
 */
export function techCategory(tag: string): TechCategory {
  return categoryBySkill.get(tagAliases[tag] ?? tag) ?? "other";
}

/** Colour of each category's dot (graph pills, filter chips). */
export const categoryDotClass: Record<TechCategory, string> = {
  frontend: "bg-chart-1",
  backend: "bg-chart-4",
  database: "bg-chart-5",
  devops: "bg-chart-2",
  tools: "bg-chart-3",
  other: "bg-muted-foreground",
};
