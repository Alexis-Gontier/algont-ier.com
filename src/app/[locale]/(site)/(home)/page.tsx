import { setRequestLocale } from "next-intl/server";
import { About } from "@/features/about";
import { Contact } from "@/features/contact";
import { Hero } from "@/features/hero";
import { FeaturedProjects } from "@/features/projects";
import { Skills } from "@/features/skills";
import { Trust } from "@/features/trust";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="divide-y divide-border">
      <Hero />
      <Trust />
      <About />
      <Skills />
      <FeaturedProjects />
      <Contact />
    </div>
  );
}
