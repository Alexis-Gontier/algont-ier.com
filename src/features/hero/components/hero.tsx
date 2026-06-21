import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  DownloadIcon,
  MailIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Section } from "@/components/shared/section";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { HeroSkillsPreview } from "./hero-skills-preview";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedinIcon },
  {
    label: "Email",
    href: `mailto:${siteConfig.author.email}`,
    icon: MailIcon,
  },
];

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <Section id="hero">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <p className="font-mono text-sm tracking-wide text-muted-foreground">
            {t("greeting")}
          </p>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            {siteConfig.name}
          </h1>

          <p className="text-lg text-muted-foreground">{t("tagline")}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/projets">
                {t("viewProjects")}
                <ArrowRightIcon />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a
                href={siteConfig.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                {t("downloadCv")}
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {socials.map(({ label, href, icon: Icon }) => (
              <Button
                key={label}
                asChild
                variant="ghost"
                size="icon-lg"
                aria-label={label}
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Right column — non-interactive preview, links to the full graph. */}
        <div className="group relative hidden aspect-square w-full md:block">
          <HeroSkillsPreview className="transition-colors group-hover:border-foreground/30" />
          <Link
            href="/graph"
            aria-label={t("viewGraph")}
            className="absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-md border bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
          >
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
