import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { PortraitReveal } from "./portrait-reveal";

export function About() {
  const t = useTranslations("About");

  return (
    <Section id="about" container={false} padded={false}>
      <h2 className="sr-only">{t("title")}</h2>
      <div className="-mx-4 grid items-stretch sm:-mx-8 md:grid-cols-2">
        {/*
         * Portrait — always on a dark panel (`dark` scopes the dark tokens to
         * this block): the ASCII art is light characters on transparency and
         * vanished on the light theme's white ground.
         */}
        <div className="dark relative aspect-square w-full overflow-hidden bg-background md:aspect-auto md:min-h-120">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_65%)]"
          />
          <PortraitReveal>
            <Image
              alt={t("portraitAlt")}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              src="/pp.png"
            />
          </PortraitReveal>
        </div>

        {/* Description — rendered as an about.md editor window */}
        <div className="flex h-full w-full flex-col border-t font-mono text-sm md:border-t-0 md:border-l">
          {/* Window chrome: traffic lights and the open file's tab. */}
          <div className="flex items-stretch justify-between border-b pl-4">
            <div aria-hidden="true" className="flex items-center gap-2 py-3">
              <span className="size-3 rounded-full border border-muted-foreground/40" />
              <span className="size-3 rounded-full border border-muted-foreground/40" />
              <span className="size-3 rounded-full border border-muted-foreground/40" />
            </div>
            <span className="flex items-center border-l bg-card px-4 text-foreground text-xs">
              {t("fileName")}
            </span>
          </div>

          {/* Editor body: lines come in one by one, like a file being written. */}
          <Reveal stagger={0.06} className="flex flex-col py-4 leading-relaxed">
            <Line n={1}>
              <span className="text-muted-foreground">{"# "}</span>
              <span className="font-semibold text-foreground">
                {siteConfig.name}
              </span>
            </Line>
            <Line n={2}>
              <span className="text-muted-foreground">{"> "}</span>
              <span className="text-primary italic">{t("blockquote")}</span>
            </Line>
            <Line n={3}>
              <span className="text-foreground/85">{t("p1")}</span>
            </Line>
            <Line n={4}>
              <span className="text-foreground/85">{t("p2")}</span>
            </Line>
            <Line n={5}>
              <span className="text-muted-foreground">---</span>
            </Line>
            <Line n={6}>
              <span className="text-muted-foreground">```yaml</span>
            </Line>
            <Line n={7}>
              <span className="text-primary">{t("formationLabel")}: </span>
              <span className="text-foreground/85">{t("formation")}</span>
            </Line>
            <Line n={8}>
              <span className="text-primary">{t("rechercheLabel")}: </span>
              <span className="text-foreground/85">{t("recherche")}</span>
            </Line>
            <Line n={9}>
              <span className="text-primary">{t("dispoLabel")}: </span>
              <span className="text-foreground/85">{t("dispo")}</span>
            </Line>
            <Line n={10}>
              <span className="text-muted-foreground">```</span>
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-primary motion-safe:animate-pulse motion-safe:[animation-iteration-count:2]"
              />
            </Line>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div
      data-reveal-item
      className="flex gap-4 px-4 py-0.5 transition-colors hover:bg-muted/60"
    >
      {/* Editor gutter: pure decoration, and never read out with the prose. */}
      <span
        aria-hidden
        className="w-5 shrink-0 select-none text-right text-muted-foreground tabular-nums"
      >
        {n}
      </span>
      <p className="min-w-0 flex-1">{children}</p>
    </div>
  );
}
