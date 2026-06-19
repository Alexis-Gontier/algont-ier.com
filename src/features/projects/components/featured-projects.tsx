import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/section";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@/i18n/navigation";
import { featuredProjects } from "../data";
import { ProjectCard } from "./project-card";

export function FeaturedProjects() {
  const t = useTranslations("Projects");

  return (
    <Section id="projects">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("featuredTitle")}
          </h2>
          <p className="text-muted-foreground">{t("featuredSubtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="flex justify-end">
          <Button asChild variant="link">
            <Link href="/projets">
              {t("viewAll")}
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
