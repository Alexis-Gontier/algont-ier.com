import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe environment variables, validated at build time and runtime.
 *
 * - Add server-only secrets under `server` (never exposed to the browser).
 * - Add browser-exposed variables under `client` — they MUST be prefixed
 *   with `NEXT_PUBLIC_`.
 * - Map every variable in `runtimeEnv` (Next.js does not inline `process.env`
 *   dynamically on the server, so each one must be listed explicitly).
 *
 * Importing this file (see `next.config.ts`) makes the build fail when a
 * required variable is missing — instead of crashing in production.
 */
export const env = createEnv({
  server: {
    // Example — uncomment and adapt when you add server secrets:
    // RESEND_API_KEY: z.string().min(1),
  },
  client: {
    /** Public base URL of the site, used by sitemap.ts / robots.ts. */
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  /** Skip validation on lint/format-only runs and in CI when desired. */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /** Treat empty strings ("") as undefined so defaults kick in. */
  emptyStringAsUndefined: true,
});
