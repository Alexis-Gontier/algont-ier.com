import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

/** A single markdown line: number gutter + content. */
function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="w-6 shrink-0 select-none text-right text-muted-foreground/40">
        {n}
      </span>
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </div>
  );
}

/** "about.md" rendered as a faux code editor — a stylized bio. */
export function AboutEditor() {
  const t = useTranslations("About");

  return (
    <div className="overflow-hidden rounded-xl border bg-card font-mono text-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-muted-foreground/30" />
          <span className="size-3 rounded-full bg-muted-foreground/30" />
          <span className="size-3 rounded-full bg-muted-foreground/30" />
        </div>
        <span className="text-muted-foreground text-xs">
          [ {t("fileName")} ]
        </span>
      </div>

      <div className="flex flex-col gap-1.5 p-4 leading-relaxed">
        <Line n={1}>
          <span className="text-muted-foreground"># </span>
          <span className="font-semibold text-foreground">
            {siteConfig.name}
          </span>
        </Line>
        <Line n={2}>
          <span className="text-primary">{"> "}</span>
          <span className="text-foreground/80">{t("blockquote")}</span>
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
          <span className="text-foreground">{t("stack")}</span>
        </Line>
        <Line n={8}>
          <span className="text-primary">{t("formationLabel")}: </span>
          <span className="text-foreground">{t("formation")}</span>
        </Line>
        <Line n={9}>
          <span className="text-primary">{t("dispoLabel")}: </span>
          <span className="text-foreground">{t("dispo")}</span>
        </Line>
        <Line n={10}>
          <span className="text-muted-foreground/40">```</span>
        </Line>
      </div>
    </div>
  );
}
