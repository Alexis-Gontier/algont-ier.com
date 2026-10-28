import { ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/shared/reveal";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { projectCountBySkill, skillCategories } from "../data";

/**
 * The toolbox: the heading holds the left column (sticky on desktop) while the
 * categories scroll past on the right. Each skill used in a featured-on-site
 * project carries that count, tying the list to the projects and the graph.
 */
export function Skills() {
  const t = useTranslations("Skills");

  return (
    <Section id="skills">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <div className="flex flex-col gap-6 md:sticky md:top-28">
            <SectionHeader
              label={t("label")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <div data-reveal-item>
              <Link
                href="/graph"
                className="group inline-flex items-center gap-1.5 font-medium text-primary"
              >
                <RollText>{t("viewGraph")}</RollText>
                <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-10 md:col-span-7">
          {skillCategories.map((category) => (
            <Reveal
              key={category.labelKey}
              stagger={0.025}
              className="flex flex-col gap-4"
            >
              <h3
                data-reveal-item
                className="flex items-center gap-3 font-mono text-primary text-sm"
              >
                {t(category.labelKey)}
                <span aria-hidden className="h-px flex-1 bg-border" />
              </h3>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const count = projectCountBySkill.get(skill) ?? 0;
                  return (
                    <li
                      key={skill}
                      data-reveal-item
                      className={cn(
                        "flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm transition-[border-color,background-color,translate] duration-300 hover:-translate-y-0.5 hover:border-primary/50",
                        count > 0 && "border-primary/25",
                      )}
                    >
                      {skill}
                      {count > 0 && (
                        <>
                          <span
                            aria-hidden
                            className="rounded-sm bg-primary/12 px-1.5 font-mono text-primary text-xs tabular-nums"
                          >
                            {count}
                          </span>
                          <span className="sr-only">
                            ({t("usedIn", { count })})
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
