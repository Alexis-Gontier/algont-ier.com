# Features

Per-domain modules. Each feature is a self-contained mini-app: its UI, data access, and
types live together so a whole domain can be added or removed as one folder.

Create a feature here when a part of the site grows beyond a single component — e.g.
`hero/`, `projects/`, `contact/`, and later the `admin/` editing screens.

## Anatomy

```
features/<name>/
  components/        feature UI (Server + Client components)
  data.ts            data access for this feature (today: static; later: src/lib/data / DB)
  types.ts           feature-local types
  schema.ts          Zod schemas (shared by public display and the admin form)
  index.ts           public surface — re-export what other parts may import
```

Keep all of these optional: start with `components/` and grow as needed.

## Rules

- Import a feature only through its `index.ts`, not deep paths.
- Promote a component to `src/components/` only when a **second** feature needs it.
- Routing stays in `app/` — a route renders a feature, it doesn't contain its logic.
- A feature owns both its public view and (later) its admin editor, sharing `schema.ts`
  and `data.ts` so validation and content have a single source of truth.
