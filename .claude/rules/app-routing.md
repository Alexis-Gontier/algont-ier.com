---
paths:
  - "src/app/**"
---

# `src/app/` — routing only

- A file here is a Next convention (`page`, `layout`, `template`, `error`, `opengraph-image`…) or
  lives in a colocated private `_components/` / `_lib/`. Domain logic goes in
  `src/features/<name>/`, rendered by the route.
- **Route groups** (`(site)`, `(home)`, future `(admin)`) share a layout without adding a URL
  segment. `(site)/layout.tsx` mounts Header + Footer; `(site)/template.tsx` remounts on every
  navigation to play the page `<ViewTransition>` (styles in `globals.css`). `(home)/` keeps `/`
  apart from sibling sections — page-only parts go in its `_components/`.
- **SSG by default**: every route under `(site)/` is prerendered at build time; dynamic segments
  (`projets/[id]`) list their params in `generateStaticParams`. Reaching for `next/headers`,
  `cookies()` or ISR turns a page dynamic on Vercel — fine if a feature needs it, but decide it
  explicitly rather than by accident.
- No `"use client"` on a page, layout or template (the hook refuses) — put it on the leaf.
- Page metadata: canonical + hreflang come from `localeAlternates()` (`@/lib/seo`).
- **Adding, moving or deleting a route** makes `.next/types` stale and `pnpm typecheck` fail:
  run `pnpm exec next typegen`. Update `src/app/sitemap.ts` too.
