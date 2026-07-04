"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { navLinks } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

/** Strip the hash so `/#about` is compared as `/`. */
function isActive(href: string, pathname: string): boolean {
  const path = href.split("#")[0] || "/";
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

type MainNavProps = {
  /** Stack vertically (mobile sheet) instead of inline (desktop bar). */
  orientation?: "horizontal" | "vertical";
  /** Called after a link is clicked — used to close the mobile sheet. */
  onNavigate?: () => void;
};

export function MainNav({
  orientation = "horizontal",
  onNavigate,
}: MainNavProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("mainNavLabel")}
      className={cn(
        "flex gap-1 text-sm font-medium",
        orientation === "vertical" && "flex-col",
      )}
    >
      {navLinks.map(({ labelKey, href }) => {
        const active = isActive(href, pathname);
        return (
          <Button
            key={href}
            asChild
            variant={active ? "secondary" : "ghost"}
            size="default"
            className={cn(
              !active && "text-muted-foreground",
              orientation === "vertical" && "w-full justify-start",
            )}
          >
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
            >
              {t(labelKey)}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
