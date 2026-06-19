import { useTranslations } from "next-intl";
import { Section } from "@/components/section";
import { skillCategories } from "../data";

export function Skills() {
  const t = useTranslations("Skills");

  return (
    <Section id="skills">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col gap-8">
          {skillCategories.map((category) => (
            <div key={category.labelKey} className="flex flex-col gap-3">
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                {t(category.labelKey)}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-foreground/30 hover:bg-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
