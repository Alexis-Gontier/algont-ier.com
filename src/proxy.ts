import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed `middleware` to `proxy`. This wires next-intl locale
// detection & routing for every page request.
export default createMiddleware(routing);

export const config = {
  // `icon` is the root metadata route (`app/icon.tsx`); without this exclusion the
  // locale proxy redirects `/icon` into `[locale]`, breaking the favicon.
  matcher: "/((?!api|_next|_vercel|icon|.*\\..*).*)",
};
