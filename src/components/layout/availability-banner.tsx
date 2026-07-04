import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Full-width availability announcement shown above the sticky header. It is
 * not sticky itself, so it scrolls out of view while the header stays pinned.
 */
export function AvailabilityBanner() {
  const t = useTranslations("AvailabilityBanner");

  return (
    <Link
      href="/#contact"
      className="flex items-center justify-center gap-2 border-b bg-emerald-500/10 px-4 py-2 text-center font-medium text-sm transition-colors hover:bg-emerald-500/15"
    >
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span>{t("text")}</span>
      <span className="hidden items-center gap-1 text-muted-foreground sm:inline-flex">
        {t("cta")}
        <ArrowRightIcon className="size-3.5" />
      </span>
    </Link>
  );
}
