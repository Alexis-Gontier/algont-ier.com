import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Link } from "@/i18n/navigation";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center border-b bg-background/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Algont<span className="text-primary">-</span>ier
          </Link>

          <div className="hidden md:block">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
