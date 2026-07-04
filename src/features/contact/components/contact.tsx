import { MailIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Section } from "@/components/shared/section";
import { GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedinIcon },
];

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <Section id="contact" className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="/contact-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrim: a solid dark floor keeps white text above AA over any region of
            the image; the centered radial vignette deepens contrast behind the
            text block toward AAA without flattening the whole photo. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-radial from-black/45 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <p className="max-w-xl text-lg text-white/80">{t("subtitle")}</p>

        <Button
          asChild
          size="lg"
          className="bg-white text-black hover:bg-white/90"
        >
          <a href={`mailto:${siteConfig.author.email}`}>
            <MailIcon />
            {t("cta")}
          </a>
        </Button>

        <div className="flex items-center gap-1">
          {socials.map(({ label, href, icon: Icon }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon-lg"
              aria-label={label}
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
