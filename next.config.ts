import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Validate environment variables at build time (throws if any are missing).
import "./src/env";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Security headers applied to every route. */
const securityHeaders = [
  // Prevent MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow the site from being embedded in iframes (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Limit referrer information sent to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Opt out of powerful browser features the site does not use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Force HTTPS for 2 years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
