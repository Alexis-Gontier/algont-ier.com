import { setRequestLocale } from "next-intl/server";
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

  return (
    <div className="md:px-4">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col border-x">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
