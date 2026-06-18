import { useTranslations } from "next-intl";

export function Footer() {
  const tFooter = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t px-4 py-4 text-sm text-muted-foreground sm:px-8">
      <p>
        © {year} Algont-ier. {tFooter("rights")}
      </p>
    </footer>
  );
}
