import { useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";

export function About() {
  const t = useTranslations("About");

  return (
    <Section id="about">
      <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr]">
        {/* Portrait — drop a photo at public/about.jpg and swap for <Image>. */}
        <div className="aspect-square w-full rounded-xl border bg-linear-to-br from-primary/20 via-muted to-muted" />

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("p1")}</p>
          <p className="text-lg text-muted-foreground">{t("p2")}</p>
        </div>
      </div>
    </Section>
  );
}
