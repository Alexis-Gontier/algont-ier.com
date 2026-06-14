import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <section>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
      <Link href="/projets">{t("cta.projects")}</Link>
    </section>
  );
}
