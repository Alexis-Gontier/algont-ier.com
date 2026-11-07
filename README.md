# Portfolio

[![CI](https://github.com/Alexis-Gontier/algont-ier.com/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexis-Gontier/algont-ier.com/actions/workflows/ci.yml)

Personal portfolio built with **Next.js 16** (App Router) and **React 19**, deployed on
**Vercel** at [algont-ier.com](https://algont-ier.com).

## Stack

- [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) (React Compiler enabled)
- [TypeScript](https://www.typescriptlang.org) (strict)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives — the CLI is a dev dependency only)
- [next-themes](https://github.com/pacocoursey/next-themes) — dark mode
- [next-intl](https://next-intl.dev) — i18n (FR default + EN, routes under `app/[locale]`)
- [React Flow](https://reactflow.dev) + [d3-force](https://d3js.org/d3-force) — interactive skills graph
- [Biome](https://biomejs.dev) — lint & format (replaces ESLint + Prettier)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit/component tests
- [Playwright](https://playwright.dev) — end-to-end tests
- [Lefthook](https://lefthook.dev) — git hooks
- [@t3-oss/env-nextjs](https://env.t3.gg) — type-safe environment variables

## Requirements

- [Node.js](https://nodejs.org) 22+
- [pnpm](https://pnpm.io) 11+ (pinned via `packageManager` in [`package.json`](package.json))

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Biome check (lint + format) |
| `pnpm format` | Auto-format with Biome |
| `pnpm typecheck` | Type-check with `tsc` |
| `pnpm knip` | Find unused files, dependencies and exports |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright) |

> First time running E2E tests: `pnpm exec playwright install chromium`.

## Environment variables

Environment variables are validated at build & runtime in [`src/env.ts`](src/env.ts).
Add new variables there **and** to [`.env.example`](.env.example). Browser-exposed
variables must be prefixed with `NEXT_PUBLIC_`.

## Project structure

```
src/
  app/
    [locale]/     localized routes (layout, page, …)
      (site)/     public pages — (home), projets/[id], graph
    sitemap.ts, robots.ts, [locale]/opengraph-image.tsx (non-localized / generated)
  components/
    shadcn-ui/    shadcn/ui primitives (via the CLI)
    magic-ui/     Magic UI components (e.g. marquee)
    controls/     reusable controls (theme-toggle, locale-switcher)
    layout/       global site chrome (header/, footer/)
    shared/       shared composed components (section, social-icons)
  features/       per-domain modules: hero, about, skills, projects, trust, contact, graph
  providers/      React context providers (composed in providers/index.tsx)
  i18n/           next-intl config (routing, navigation, request)
  messages/       translations (fr.json, en.json)
  styles/         global CSS (globals.css) + fonts (fonts.ts)
  config/         static site config / metadata (site.ts)
  lib/            framework-agnostic helpers (utils/cn.ts)
  proxy.ts        next-intl middleware (locale routing)
  env.ts          type-safe environment variables
tests/e2e/        Playwright end-to-end tests
```

A component is promoted to `components/shared/` only when used in two or more places;
otherwise it is colocated with its route or owning feature. `app/` stays routing-only.

## Pages

- **`/`** — home: hero (with a skills-graph preview), about, skills, featured projects,
  a "trusted by" marquee, and contact.
- **`/projets`** + **`/projets/[id]`** — project list and detail (shared `features/projects` data).
- **`/graph`** — interactive skills graph (projects linked to the technologies they use),
  built with React Flow + d3-force.

## Internationalization

Powered by [next-intl](https://next-intl.dev). Supported locales: **`fr`** (default) and
**`en`**, with the locale in the URL (`/fr`, `/en`). Visiting `/` redirects to the detected
or default locale.

- UI strings live in [`src/messages/fr.json`](src/messages/fr.json) and
  [`src/messages/en.json`](src/messages/en.json) — add a key to **both** to add a string.
- To add a locale: extend `locales` in [`src/i18n/routing.ts`](src/i18n/routing.ts) and add a
  matching `messages/<locale>.json`.
- Locale routing/detection lives in [`src/proxy.ts`](src/proxy.ts) (Next.js 16 renamed
  `middleware` → `proxy`).

## Deployment

Production runs on **Vercel** through its GitHub integration ([`vercel.json`](vercel.json)):

- every push to `main` deploys production on [algont-ier.com](https://algont-ier.com)
  (`www` 308-redirects to the apex);
- every other branch and PR gets a preview deployment.

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs lint, type-check, knip,
  unit and E2E tests and a build on every push and PR. It doesn't deploy.

Pages are prerendered at build time (SSG); the i18n proxy ([`src/proxy.ts`](src/proxy.ts)) and
the security headers in [`next.config.ts`](next.config.ts) run on Vercel. Set
`NEXT_PUBLIC_SITE_URL=https://algont-ier.com` in the Vercel project's environment variables so
absolute URLs in the sitemap, robots and Open Graph tags are correct.
