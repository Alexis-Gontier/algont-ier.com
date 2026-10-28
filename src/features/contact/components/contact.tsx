import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Reveal } from "@/components/shared/reveal";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";
import { CopyEmailButton } from "./copy-email-button";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedinIcon },
];

/**
 * The closing call to action, on a dark violet-lit panel in both themes
 * (`dark` scopes the dark tokens): the address itself is the headline link,
 * with a one-click copy for visitors whose mail client isn't set up.
 */
export function Contact() {
  const t = useTranslations("Contact");
  const { email } = siteConfig.author;

  return (
    <Section
      id="contact"
      className="dark relative overflow-hidden bg-background text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="-translate-x-1/2 pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <Reveal className="relative flex flex-col items-center gap-6 py-8 text-center">
        <p data-reveal-item className="font-mono text-primary text-sm">
          {t("label")}
        </p>
        <h2
          data-reveal-item
          className="text-balance font-bold text-4xl leading-[1.05] tracking-[-0.03em] sm:text-6xl"
        >
          {t("title")}
        </h2>

        <p
          data-reveal-item
          className="max-w-xl text-lg text-muted-foreground leading-relaxed"
        >
          {t("subtitle")}
        </p>

        <a
          data-reveal-item
          href={`mailto:${email}`}
          className="group relative max-w-full break-all font-semibold text-2xl tracking-tight sm:text-4xl"
        >
          <RollText>{email}</RollText>
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100"
          />
        </a>

        <div
          data-reveal-item
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="xl">
            <a href={`mailto:${email}`}>
              <MailIcon />
              {t("cta")}
            </a>
          </Button>
          <CopyEmailButton email={email} />
        </div>

        <ul data-reveal-item className="flex items-center gap-1">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Button
                asChild
                variant="ghost"
                size="icon-lg"
                aria-label={label}
                className="hover:-translate-y-0.5 hover:text-primary"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
