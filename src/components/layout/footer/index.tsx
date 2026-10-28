import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { navLinks, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const tFooter = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  const socials = [
    {
      key: "github",
      href: siteConfig.socials.github,
      label: tFooter("github"),
      Icon: GithubIcon,
    },
    {
      key: "linkedin",
      href: siteConfig.socials.linkedin,
      label: tFooter("linkedin"),
      Icon: LinkedinIcon,
    },
    {
      key: "email",
      href: `mailto:${siteConfig.author.email}`,
      label: tFooter("email"),
      Icon: Mail,
    },
  ];

  return (
    <footer className="border-t">
      {/* Top box — large */}
      <div className="relative overflow-hidden">
        {/* subtle glow */}
        <div
          aria-hidden
          className="-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-px w-2/3 bg-linear-to-r from-transparent via-primary/60 to-transparent"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div className="flex flex-col gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight">
              Algont<span className="text-primary">-</span>ier
            </span>
          </div>

          <nav
            aria-label={tNav("menu")}
            className="flex flex-col gap-3 text-sm"
          >
            <span className="font-semibold text-foreground/90 text-xs uppercase tracking-wider">
              {tNav("menu")}
            </span>
            {/*
             * `-my-1 py-1` grows the hit area to 28px for WCAG 2.5.8 without
             * changing the rhythm: the negative margin cancels the padding, so
             * the box gets taller while the gap looks identical. These are
             * standalone navigation links, so the criterion's inline-text
             * exception doesn't cover them.
             */}
            {navLinks.map(({ labelKey, href }) => (
              <Link
                key={href}
                href={href}
                className="-my-1 flex min-h-6 w-fit items-center py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {tNav(labelKey)}
              </Link>
            ))}
          </nav>

          <nav
            aria-label={tNav("contact")}
            className="flex flex-col gap-3 text-sm"
          >
            <span className="font-semibold text-foreground/90 text-xs uppercase tracking-wider">
              {tNav("contact")}
            </span>
            {socials.map(({ key, href, label, Icon }) => (
              <a
                key={key}
                href={href}
                target={key === "email" ? undefined : "_blank"}
                rel={key === "email" ? undefined : "noreferrer"}
                className="-my-1 flex min-h-6 w-fit items-center gap-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom box — like before */}
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-muted-foreground text-sm sm:flex-row sm:px-8">
          <p>
            © {year} Algont-ier. {tFooter("rights")}
          </p>
          <Link
            href="/mentions-legales"
            className="-my-1 flex min-h-6 items-center py-1 transition-colors hover:text-foreground"
          >
            {tFooter("legal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
