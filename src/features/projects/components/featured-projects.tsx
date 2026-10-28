import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Reveal } from "@/components/shared/reveal";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Link } from "@/i18n/navigation";
import { featuredProjects } from "../data";
import { ProjectCard } from "./project-card";

/** Home selection: a wide lead case, then the others two by two. */
export function FeaturedProjects() {
  const t = useTranslations("Projects");

  return (
    <Section id="projects">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHeader
            label={t("label")}
            title={t("featuredTitle")}
            subtitle={t("featuredSubtitle")}
            action={
              <Button asChild variant="outline" size="xl" className="group">
                <Link href="/projets">
                  <RollText>{t("viewAll")}</RollText>
                  <ArrowRightIcon
                    data-icon="inline-end"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>
            }
          />
        </Reveal>

        <Reveal stagger={0.12} className="grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              wide={index === 0}
            />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
