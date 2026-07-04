import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OpengraphImage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0b0b10",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 128,
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        <span>Algont</span>
        <span style={{ color: "#646cff" }}>-</span>
        <span>ier</span>
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 40,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {t("ogTagline")}
      </div>
    </div>,
    size,
  );
}
