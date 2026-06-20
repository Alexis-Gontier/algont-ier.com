import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Separator } from "@/components/shadcn-ui/separator";
import { Section } from "@/components/shared/section";
import { Link } from "@/i18n/navigation";
import { featuredProjects } from "../data";
import { ProjectCard } from "./project-card";

export function FeaturedProjects() {
  const t = useTranslations("Projects");

  return (
    <Section id="projects" padded={false}>
      <div className="flex items-stretch">
        <Separator orientation="vertical" />

        <div className="flex flex-1 flex-col gap-10 py-8">
          <div className="flex flex-col gap-2 px-4 sm:px-8">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("featuredTitle")}
            </h2>
            <p className="text-muted-foreground">{t("featuredSubtitle")}</p>
          </div>

          <Separator />

          <div className="grid gap-6 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={index < 3}
              />
            ))}
          </div>

          <Separator />

          <div className="flex justify-end px-4 sm:px-8">
            <Button asChild variant="link" className="h-auto px-0">
              <Link href="/projets">
                {t("viewAll")}
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </div>

        <Separator orientation="vertical" />
      </div>
    </Section>
  );
}
