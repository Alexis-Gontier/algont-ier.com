import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export function Header() {
  const t = useTranslations("Nav");

  return (
    <header>
      <Link href="/">{siteConfig.name}</Link>
      <nav>
        <Link href="/">{t("home")}</Link>
        <Link href="/projets">{t("projects")}</Link>
      </nav>
    </header>
  );
}
