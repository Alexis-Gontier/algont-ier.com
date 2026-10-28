import { useTranslations } from "next-intl";
import { Marquee } from "@/components/magic-ui/marquee";
import { Section } from "@/components/shared/section";
import { trustedCompanies } from "../data";

export function Trust() {
  const t = useTranslations("Trust");

  return (
    <Section id="trust" padded={false}>
      <div className="grid items-stretch gap-8 py-12 md:grid-cols-[35%_65%]">
        <h2 className="flex max-w-xs items-center text-xl font-bold tracking-tight sm:text-2xl">
          {t("title")}
        </h2>

        {/* `min-w-0` + `overflow-hidden`: a grid item defaults to `min-width: auto`,
            so it refuses to shrink below the marquee's duplicated content and pushes
            the whole document wider than the viewport on mobile. */}
        <div className="relative flex min-w-0 flex-col justify-center overflow-hidden border-border border-t pt-8 md:-my-12 md:border-t-0 md:border-l md:py-12 md:pl-8">
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
                  className="px-6 font-semibold text-xl text-muted-foreground transition-colors hover:text-foreground"
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
