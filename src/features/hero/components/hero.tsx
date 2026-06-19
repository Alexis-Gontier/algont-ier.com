import { ArrowRightIcon, DownloadIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/section";
import { Button } from "@/components/shadcn-ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/social-icons";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

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

        {/* Right column — graph placeholder, to be built later. */}
        <div
          className="hidden aspect-square w-full rounded-xl border border-dashed md:block"
          aria-hidden="true"
        />
      </div>
    </Section>
  );
}
