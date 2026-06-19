import { useTranslations } from "next-intl";
import { Marquee } from "@/components/magic-ui/marquee";
import { Section } from "@/components/section";
import { trustedCompanies } from "../data";

export function Trust() {
  const t = useTranslations("Trust");

  return (
    <Section id="trust">
      <div className="grid items-center gap-8 md:grid-cols-[35%_65%]">
        <h2 className="max-w-xs text-xl font-bold tracking-tight sm:text-2xl">
          {t("title")}
        </h2>

        <div className="relative">
          {/* Decorative, duplicated marquee — hidden from assistive tech. */}
          <div aria-hidden="true">
            <Marquee pauseOnHover className="[--duration:15s]">
              {trustedCompanies.map((company) => (
                <a
                  key={company.name}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  className="px-6 font-semibold text-xl text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  {company.name}
                </a>
              ))}
            </Marquee>
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l from-background" />

          {/* Real, accessible list — read once by screen readers. */}
          <ul className="sr-only">
            {trustedCompanies.map((company) => (
              <li key={company.name}>
                <a href={company.url} target="_blank" rel="noopener noreferrer">
                  {company.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
