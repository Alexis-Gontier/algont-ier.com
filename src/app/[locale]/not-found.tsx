import { getTranslations } from "next-intl/server";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Button asChild>
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </main>
  );
}
