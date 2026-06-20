import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Validate environment variables at build time (throws if any are missing).
import "./src/env";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// ⚠️ STATIC-EXPORT BRANCH (FTP deploy via WinSCP) — do NOT merge into `main`.
// `next build` emits a fully static site into `out/` (no Node server needed).
//
// Trade-offs vs. the Vercel build on `main`:
//  - the next-intl middleware (`src/proxy.ts`) is removed — incompatible with
//    `output: export`; locale routing is handled by static `[locale]` segments
//    and the root redirect in `public/index.html`.
//  - the `[locale]/[...rest]` catch-all is removed — Next emits `404.html`
//    instead (wire it via `ErrorDocument` in `public/.htaccess`).
//  - security headers can't be served by a static export — they live in
//    `public/.htaccess` (Apache) instead of `headers()` here.
//  - `next/image` runs unoptimized (no image optimization server).
const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  // Emit `path/index.html` so Apache/Nginx serve clean URLs from directories.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
