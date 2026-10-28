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
import { LiveGraph } from "@/features/graph";
import { Link } from "@/i18n/navigation";
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
  const tGraph = useTranslations("Graph");

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
          <div data-reveal data-hero-graph className="relative">
            {/* Violet halo behind the card — the identity's one glow. */}
            <div
              aria-hidden
              className="-inset-10 pointer-events-none absolute rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
            />
            <div className="group relative aspect-square overflow-hidden rounded-xl border bg-card/60 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] transition-colors duration-500 hover:border-primary/40">
              {/* Kept clear of the graph link (top) and the legend (bottom). */}
              <div className="absolute inset-x-3 top-14 bottom-14">
                <LiveGraph />
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 flex gap-4 rounded-lg border bg-background/80 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  {tGraph("legendProject")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground" />
                  {tGraph("legendTech")}
                </span>
              </div>

              <Link
                href="/graph"
                aria-label={t("viewGraph")}
                className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-md border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:text-primary"
              >
                <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </HeroScene>
  );
}
