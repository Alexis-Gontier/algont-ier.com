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
- **Static export**: every route under `(site)/` must render at build time. Dynamic segments
  (`projets/[id]`) need `generateStaticParams`; no `next/headers`, no ISR, no runtime proxy
  logic (the export drops `src/proxy.ts`). The guard hook blocks `next/headers` here.
- No `"use client"` on a page, layout or template (the hook refuses) — put it on the leaf.
- Page metadata: canonical + hreflang come from `localeAlternates()` (`@/lib/seo`).
- **Adding, moving or deleting a route** makes `.next/types` stale and `pnpm typecheck` fail:
  run `pnpm exec next typegen`. Update `src/app/sitemap.ts` too.
