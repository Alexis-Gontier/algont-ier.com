import { ImageResponse } from "next/og";

// Required for `output: export` — pre-render this generated image at build time.
export const dynamic = "force-static";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b10",
        color: "white",
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        fontFamily: "sans-serif",
      }}
    >
      <span>A</span>
      <span style={{ color: "#646cff" }}>-</span>
    </div>,
    size,
  );
}
