import { getTranslations, setRequestLocale } from "next-intl/server";
import { AvailabilityBanner } from "@/components/layout/availability-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Enable static rendering for the whole subtree (Header/Footer use translations).
  const { locale } = await params;
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
    </>
  );
}
