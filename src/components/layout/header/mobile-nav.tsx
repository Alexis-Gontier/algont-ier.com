"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Button } from "@/components/shadcn-ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";
import { MainNav } from "./main-nav";

export function MobileNav() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={t("openMenu")}
          className="md:hidden"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{t("menu")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("menuDescription")}
          </SheetDescription>
        </SheetHeader>
        <div className="px-2">
          <MainNav orientation="vertical" onNavigate={() => setOpen(false)} />
        </div>
        <SheetFooter className="flex-row items-center gap-1 border-t">
          <LocaleSwitcher />
          <ThemeToggle />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
