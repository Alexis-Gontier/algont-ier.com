import { getTranslations, setRequestLocale } from "next-intl/server";
import { AvailabilityBanner } from "@/components/layout/availability-banner";
import { Cursor } from "@/components/layout/cursor";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { toLocale } from "@/i18n/locale";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);

  /*
   * Required, not optional: without it next-intl resolves the locale through
   * dynamic APIs (`headers()`), which opts this layout — and therefore every
   * page nested under it — out of static rendering, even for pages that call
   * `setRequestLocale` themselves.
   */
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <>
      {/* Keyboard users can bypass the banner + header nav (WCAG 2.4.1). */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:border focus:bg-background focus:px-4 focus:py-2 focus:font-medium"
      >
        {t("skipToContent")}
      </a>
      <AvailabilityBanner />
      <div className="md:px-4">
        <div className="mx-auto flex min-h-dvh max-w-7xl flex-col border-x">
          <Header />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <Cursor />
    </>
  );
}
