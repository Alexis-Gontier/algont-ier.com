import { Geist_Mono, Inter } from "next/font/google";

/** Body / UI font (Vite-style). Exposed as the `--font-sans` CSS variable. */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/** Monospace font. Exposed as the `--font-geist-mono` CSS variable. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** All app fonts. Add one here and it's wired everywhere automatically. */
export const fonts = [inter, geistMono];

/** Every font's CSS variable class, ready to drop on `<html>`. */
export const fontVariables = fonts.map((font) => font.variable);
