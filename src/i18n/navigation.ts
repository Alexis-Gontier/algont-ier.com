import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation APIs — use these instead of next/link &
 * next/navigation, which would drop the `/fr` | `/en` prefix.
 *
 * `createNavigation` also returns `redirect` and `getPathname`; re-export them
 * here (never import them from `next/navigation`) when a first use appears.
 */
export const { Link, usePathname, useRouter } = createNavigation(routing);
