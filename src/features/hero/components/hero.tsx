import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  DownloadIcon,
  MailIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";
import { GraphCard } from "@/features/graph";
import { Link } from "@/i18n/navigation";
import { HeroGraph } from "./hero-graph";
import { HeroScene } from "./hero-scene";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedinIcon },
  {
    label: "Email",
    href: `mailto:${siteConfig.author.email}`,
    icon: MailIcon,
  },
];

/**
 * Who I am, what I do and how to reach me on the left; the live skills graph
 * on the right (below the text on phones). Markup is server-rendered —
 * `HeroScene` only animates it through the `data-hero-*` attributes.
 */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    <HeroScene>
      <Section id="hero">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <p
              data-reveal
              data-hero-type
              className="font-mono text-primary text-sm tracking-wide"
            >
              {t("greeting")}
            </p>

            <h1
              data-reveal
              data-hero-name
              className="font-extrabold text-6xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl"
            >
              {siteConfig.name}
            </h1>

            <p
              data-reveal
              data-hero-lines
              className="max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              {t("tagline")}
            </p>

            {/* Animated as a group: the buttons' own `transition-all` would
                fight GSAP's per-frame inline styles. */}
            <div
              data-reveal
              data-hero-fade
              className="flex flex-wrap items-center gap-3"
            >
              <Button asChild size="xl" className="group">
                <Link href="/projets">
                  <RollText>{t("viewProjects")}</RollText>
                  <ArrowRightIcon
                    data-icon="inline-end"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>

              <Button asChild variant="outline" size="xl" className="group">
                <a
                  href={siteConfig.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon
                    data-icon="inline-start"
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                  <RollText>{t("downloadCv")}</RollText>
                </a>
              </Button>
            </div>

            <ul data-reveal data-hero-fade className="flex items-center gap-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-lg"
                    aria-label={label}
                    className="hover:-translate-y-0.5 hover:text-primary"
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon />
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* The live skills graph, in the original framed card. */}
          <GraphCard data-reveal data-hero-graph className="aspect-square">
            <HeroGraph />
            <Link
              href="/graph"
              className="group absolute top-3 right-3 z-10 inline-flex h-9 items-center gap-1.5 rounded-md border bg-background/80 px-3 font-medium text-sm backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:text-primary"
            >
              <RollText>{t("viewGraph")}</RollText>
              <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </GraphCard>
        </div>
      </Section>
    </HeroScene>
  );
}
