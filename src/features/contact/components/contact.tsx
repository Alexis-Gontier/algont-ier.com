import { MailIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Reveal } from "@/components/shared/reveal";
import { RollText } from "@/components/shared/roll-text";
import { Section } from "@/components/shared/section";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedinIcon },
];

/**
 * The closing call to action, over a darkened photo in both themes
 * (`dark` scopes the dark tokens).
 */
export function Contact() {
  const t = useTranslations("Contact");
  const { email } = siteConfig.author;

  return (
    <Section
      id="contact"
      className="dark relative overflow-hidden bg-background text-foreground"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/contact-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrim: a solid dark floor keeps the light text above AA over any
            region of the image; the radial vignette deepens contrast behind
            the text block without flattening the whole photo. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-radial from-black/45 to-transparent" />
      </div>

      <Reveal className="relative flex flex-col items-center gap-6 py-4 text-center">
        <p data-reveal-item className="font-mono text-primary text-sm">
          {t("label")}
        </p>
        <h2
          data-reveal-item
          className="text-balance font-bold text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl"
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
          className="group relative max-w-full break-all font-medium text-xl tracking-tight sm:text-2xl"
        >
          <RollText>{email}</RollText>
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100"
          />
        </a>

        {/* Wrapped: the button's own `transition-all` would fight the
            reveal's per-frame inline styles. */}
        <div data-reveal-item>
          <Button asChild size="lg">
            <a href={`mailto:${email}`}>
              <MailIcon />
              {t("cta")}
            </a>
          </Button>
        </div>

        <ul data-reveal-item className="flex items-center gap-1">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Button
                asChild
                variant="ghost"
                size="icon-lg"
                aria-label={label}
                className="hover:text-primary"
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
