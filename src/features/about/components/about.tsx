import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";

export function About() {
  const t = useTranslations("About");

  return (
    <Section id="about" container={false} padded={false}>
      <div className="-mx-4 grid items-stretch gap-10 sm:-mx-8 md:grid-cols-2">
        {/* Portrait */}
        <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full">
          <Image
            alt={t("title")}
            className="object-cover"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            src="/pp.png"
          />
        </div>

        {/* Description — rendered as an about.md editor window */}
        <div className="flex h-full w-full flex-col border-border border-t pt-10 font-mono text-sm md:border-t-0 md:border-l md:pt-0">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div aria-hidden="true" className="flex gap-2">
              <span className="size-3 rounded-full border border-muted-foreground/40" />
              <span className="size-3 rounded-full border border-muted-foreground/40" />
              <span className="size-3 rounded-full border border-muted-foreground/40" />
            </div>
            <span className="text-muted-foreground text-xs">
              [ {t("fileName")} ]
            </span>
          </div>

          {/* Editor body */}
          <div className="flex flex-col gap-1 p-4 leading-relaxed">
            <Line n={1}>
              <span className="text-muted-foreground/50">{"# "}</span>
              <span className="font-medium text-foreground">
                {siteConfig.name}
              </span>
            </Line>
            <Line n={2}>
              <span className="text-muted-foreground/50">{"> "}</span>
              <span className="text-muted-foreground italic">
                {t("blockquote")}
              </span>
            </Line>
            <Line n={3}>
              <span className="text-muted-foreground">{t("p1")}</span>
            </Line>
            <Line n={4}>
              <span className="text-muted-foreground">{t("p2")}</span>
            </Line>
            <Line n={5}>
              <span className="text-muted-foreground/40">---</span>
            </Line>
            <Line n={6}>
              <span className="text-muted-foreground/40">```</span>
            </Line>
            <Line n={7}>
              <span className="text-primary">{t("stackLabel")}: </span>
              <span className="text-muted-foreground">{t("stack")}</span>
            </Line>
            <Line n={8}>
              <span className="text-primary">{t("formationLabel")}: </span>
              <span className="text-muted-foreground">{t("formation")}</span>
            </Line>
            <Line n={9}>
              <span className="text-primary">{t("dispoLabel")}: </span>
              <span className="text-muted-foreground">{t("dispo")}</span>
            </Line>
            <Line n={10}>
              <span className="text-muted-foreground/40">```</span>
            </Line>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="w-5 shrink-0 select-none text-right text-muted-foreground/40 tabular-nums">
        {n}
      </span>
      <p className="min-w-0 flex-1">{children}</p>
    </div>
  );
}
