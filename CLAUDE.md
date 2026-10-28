<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio — project guide

Personal portfolio built with Next.js 16 (App Router) + React 19. Production is a
**static export** deployed over FTP to OVH shared hosting (see `README.md`), so every
route must stay statically renderable — no request-time APIs in the `(site)` subtree.

## Stack

- **Package manager:** pnpm (always; never npm/yarn).
- **Lint & format:** Biome — NOT ESLint or Prettier. Run `pnpm lint` / `pnpm format`.
- **Tests:** Vitest (unit/component, `src/**/*.test.ts(x)`) + Playwright (E2E, `tests/e2e/`).
  Async Server Components can't be unit-tested with Vitest — cover them with Playwright.
- **Styling:** Tailwind CSS v4.
- **React Compiler** is enabled — no manual `useMemo`/`useCallback`/`memo`.
- **Env:** type-safe via `src/env.ts` (`@t3-oss/env-nextjs` + Zod). Add new vars there
  AND to `.env.example`. Client vars must be prefixed `NEXT_PUBLIC_`.
- **State:** none. No client-state, URL-state or toast library is installed — the site
  has no such need yet. Don't add one "for later"; add it with its first real usage.
- **i18n:** next-intl. Locales `fr` (default) + `en`; routes live under `app/[locale]/`,
  locale routing/detection in `src/proxy.ts` (Next 16 renamed `middleware`→`proxy`).
  UI strings go in `src/messages/{fr,en}.json`; config in `src/i18n/`.

## Project structure

Hybrid layout: `app/` is routing-only, shared UI lives in `components/`, and per-domain
code moves into `features/` as the app grows.

```
src/
  app/
    [locale]/     localized routes — routing only (root layout = html/body/<Providers>)
      (site)/     public-facing pages route group: its layout wraps Header + Footer
        (home)/   home page route group (page.tsx composes the section features)
        projets/  projets/page.tsx, projets/[id]/page.tsx
        graph/    graph/page.tsx (interactive skills graph)
      (admin)/    future back-office route group with its own layout + auth
      error/loading/not-found.tsx (apply to every locale route)
    [locale]/opengraph-image.tsx (generated OG image), sitemap.ts, robots.ts
  components/
    shadcn-ui/    shadcn/ui primitives (added via the CLI)
    magic-ui/     Magic UI components (e.g. marquee) — added via its registry
    controls/     reusable composed controls (theme-toggle, locale-switcher)
    layout/       global site chrome — header/ and footer/ subfolders (not a feature)
    shared/       shared composed components (section.tsx, social-icons.tsx, …)
  features/       per-domain modules — hero, about, skills, projects, trust, contact,
                  graph (see features/README.md for the anatomy)
  providers/      React context providers; composed in providers/index.tsx (<Providers>)
  i18n/           next-intl config (routing, navigation, request)
  messages/       translations (fr.json, en.json)
  styles/         global CSS (globals.css) + fonts (fonts.ts)
  config/         static site config / metadata (site.ts → siteConfig)
  lib/            framework-agnostic helpers (utils/cn.ts)
  proxy.ts        next-intl middleware (locale routing)
  env.ts          type-safe environment variables
tests/e2e/        Playwright end-to-end tests
```

- **Route groups:** parenthesized folders (`(site)`, `(admin)`) organize routes and let
  segments share a layout **without** adding a URL segment. Public pages live under
  `(site)/`; its `layout.tsx` mounts the Header/Footer. The home page sits in its own
  `(home)/` group so `/` stays visually separate from sibling sections — colocate
  page-only parts in that group's `_components/`.
- **Where a component goes:** promote to `components/shared/` only when used in ≥2 places;
  otherwise colocate it (in the route's `_components/`, or the owning
  `features/<name>/components/`). Keep `app/` routing-only. Global chrome (header, footer)
  goes in `components/layout/`; reusable theme/locale-style controls in `components/controls/`;
  per-domain UI in `features/`.
- **React types:** `@types/react` exposes the `React` namespace globally — use
  `React.ReactNode` etc. without importing React.
- **Route types stale after structure changes:** adding/moving/deleting a route makes
  `.next/types` stale and `pnpm typecheck` fail; regenerate with `pnpm exec next typegen`.
- **shadcn:** new components land in `@/components/shadcn-ui` and `cn` lives in
  `@/lib/utils/cn` (set in `components.json`). Don't hand-tweak those import paths.
  Components from other registries (e.g. Magic UI) go in `@/components/magic-ui`.
  The `shadcn` CLI is a **devDependency** — it drags 33 runtime packages (express,
  babel, MCP SDK) and their advisories into production otherwise. `globals.css`
  imports the vendored `src/styles/shadcn-variants.css`, never `shadcn/tailwind.css`;
  if `shadcn add` needs a new `@custom-variant`, copy it into that file. Nothing
  imports the package, so `knip.json` lists it under `ignoreDependencies` — it's
  a CLI, not a library.
- **Styling:** global CSS is `src/styles/globals.css`; use `cn()` (`@/lib/utils/cn`) for
  conditional/merged class names.
- **Future admin:** a back-office will live under an `app/(admin)/` route group with its own
  layout + auth, reading/writing a single data source (`src/lib/data/`). Don't scatter
  content in hard-coded literals — keep it consolidatable.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server (http://localhost:3000) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | Biome check (lint + format) |
| `pnpm format` | Biome auto-format |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (unit) |
| `pnpm test:e2e` | Playwright (E2E) |

## Conventions

- Imports use the `@/*` alias (→ `src/*`).
- Git hooks via Lefthook: pre-commit formats staged files; pre-push runs typecheck + tests.
- Security headers live in `next.config.ts` (and, for the static export served by
  Apache, in `public/.htaccess` — the `next.config.ts` `headers()` hook is inert once
  `output: "export"` is on).
- Production is deployed by FTP from the `static-export-ftp` branch; CI
  (`.github/workflows/ci.yml`) only runs quality checks.
