import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <section>
      <h1>{id}</h1>
    </section>
  );
}
