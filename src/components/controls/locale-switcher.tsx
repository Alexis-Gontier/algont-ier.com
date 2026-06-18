"use client";

import FR from "country-flag-icons/react/3x2/FR";
import GB from "country-flag-icons/react/3x2/GB";
import { ChevronDownIcon, LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";

const LOCALE_META: Record<Locale, { label: string; Flag: typeof FR }> = {
  fr: { label: "Français", Flag: FR },
  en: { label: "English", Flag: GB },
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          aria-label={t("switchLanguage")}
          disabled={isPending}
        >
          <LanguagesIcon />
          <ChevronDownIcon className="text-muted-foreground transition-transform group-aria-expanded/button:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((locale) => {
          const { label, Flag } = LOCALE_META[locale];
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchTo(locale)}
              disabled={locale === activeLocale}
              className="cursor-pointer"
            >
              <Flag className="h-3.5 w-5 rounded-xs" aria-hidden="true" />
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
