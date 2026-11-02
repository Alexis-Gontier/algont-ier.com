<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio — project guide

Personal portfolio built with Next.js 16 (App Router) + React 19. Production is a
**static export** deployed over FTP to OVH shared hosting (see `README.md`), so every
route must stay statically renderable — no request-time APIs in the `(site)` subtree.

**Branches:** `main` is the source of truth (no `output: "export"`; `vercel.json` deploys
it to Vercel). `static-export-ftp` = `main` + the export config (`output: "export"`,
`images.unoptimized`, `public/.htaccess`, FTP deploy workflow). Keep them separate and
never touch `static-export-ftp` unless asked.

## Stack

- **Package manager:** pnpm (always; never npm/yarn).
- **Lint & format:** Biome — NOT ESLint or Prettier. Run `pnpm lint` / `pnpm format`.
- **Tests:** Vitest (unit/component, `src/**/*.test.ts(x)`) + Playwright (E2E, `tests/e2e/`).
  Async Server Components can't be unit-tested with Vitest — cover them with Playwright.
- **Styling:** Tailwind CSS v4.
- **React Compiler** is enabled — no manual `useMemo`/`useCallback`/`memo`.
- **Motion:** GSAP (+ ScrollTrigger, SplitText) and Lenis smooth scroll. Always import
  `gsap`/`useGSAP` from `@/lib/gsap` (single plugin-registration point) and write
  animations against its `motionQueries` via `gsap.matchMedia()` so reduced-motion and
  phone variants exist from the start. Page transitions use React `<ViewTransition>`
  (`experimental.viewTransition`) in `(site)/template.tsx`, styles in `globals.css`.
- **Env:** type-safe via `src/env.ts` (`@t3-oss/env-nextjs` + Zod). Add new vars there
  AND to `.env.example`. Client vars must be prefixed `NEXT_PUBLIC_`. CI sets
  `SKIP_ENV_VALIDATION`, which also skips Zod `.default()`s — pass public vars explicitly.
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
      (site)/     public-facing pages route group: layout wraps Header + Footer,
                  template.tsx plays the page ViewTransition
        (home)/   home page route group (page.tsx composes the section features)
        projets/  projets/page.tsx, projets/[id]/page.tsx
        graph/    graph/page.tsx (interactive skills graph, d3-force)
        mentions-legales/  legal notice
      (admin)/    future back-office route group (not created yet)
      error/loading/not-found.tsx, opengraph-image.tsx (apply to every locale route)
    sitemap.ts, robots.ts, icon.tsx (app root, outside [locale])
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
  lib/            helpers: utils/cn.ts, gsap.ts (GSAP setup + motionQueries),
                  seo.ts (localeAlternates → canonical/hreflang for page metadata)
  proxy.ts        next-intl middleware (locale routing)
  env.ts          type-safe environment variables
tests/e2e/        Playwright end-to-end tests (incl. a11y.spec.ts with axe)
docs/             dated audits (e.g. audit-2026-07-27.md)
```

- **Zone rules load with their files** from `.claude/rules/`: `app-routing` (route groups,
  static export, typegen), `components` (where a component lives, shadcn devDependency),
  `i18n` (message parity, locale-aware navigation).
- **Placement in one line:** `app/` routes, `features/<name>/` owns domain UI + data (imported
  through its `index.ts`), `components/shared/` only from the second real caller.
- **React types:** `@types/react` exposes the `React` namespace globally — use
  `React.ReactNode` etc. without importing React.
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
| `pnpm test` / `pnpm test:watch` | Vitest (unit) |
| `pnpm test:e2e` | Playwright (E2E) |
| `pnpm knip` | Unused files, deps & exports |
| `pnpm exec next typegen` | Regenerate route types after moving routes |

**Before calling work done**, run what CI runs: `pnpm biome ci`, `pnpm typecheck`,
`pnpm knip`, `pnpm test`, `pnpm build` (+ `pnpm test:e2e` for UI changes). Lefthook's
pre-push only covers typecheck + tests, so knip/build failures otherwise surface in CI.
A visual change is done only once seen running in the browser at 1440 and 390 px, in
both themes and with reduced motion.

## Conventions

- Imports use the `@/*` alias (→ `src/*`).
- Git hooks via Lefthook: pre-commit formats staged files; pre-push runs typecheck + tests.
- Security headers live in `next.config.ts` (live on `main`/Vercel) and, on
  `static-export-ftp`, in `public/.htaccess` — `headers()` is inert under
  `output: "export"`, so a header change must be made in both places.
- Production is deployed by FTP from the `static-export-ftp` branch; CI
  (`.github/workflows/ci.yml`) only runs quality checks.

## Claude Code tooling

- **Hooks** (`.claude/settings.json`): `conventions-guard.mjs` runs before every Edit/Write
  and refuses the regex-checkable rules (`process.env` outside `src/env.ts`, manual memo,
  `gsap` not from `@/lib/gsap`, `next/link`, `next/headers` in `app/`, deep feature imports,
  `"use client"` on page/layout, `../../`). If it blocks, fix the code, not the hook.
  `format.mjs` runs Biome `check --write` after every edit — no manual formatting.
- **Agents:** `next-docs` answers Next 16 questions from `node_modules/next/dist/docs/`
  (use it instead of memory); `convention-reviewer` checks a diff against these rules
  before a PR. For other libraries, Context7 rather than memory.
- Project skills are vendored in `.claude/skills/` and pinned in `skills-lock.json`
  (installed with the `skills` CLI) — don't hand-edit them; Biome and knip ignore them.
- `.mcp.json` exposes the shadcn MCP from the pinned devDependency.
- Browser/design tooling writes to `.taste-skill/`, `.playwright-cli/`, `.playwright-mcp/`
  (all gitignored).
