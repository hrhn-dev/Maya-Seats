<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions (read before writing code)

- Stack: Next.js App Router (TypeScript, Tailwind), Supabase Postgres, Vitest, deployed on Vercel.
- **All database access goes through server code** (`src/app/api/**/route.ts` or server components) using `getSupabase()` from `src/lib/supabase.ts`. Never import it in a `"use client"` file. Never expose the secret key to the browser.
- No authentication. There is a single user (Maya).
- Schema changes go in `supabase/migrations/NNNN_name.sql` and are run in the Supabase SQL editor. Keep RLS enabled; server routes use the secret key.
- Business rules (e.g. how a seat counts as "unused") live in plain functions under `src/lib/` with a Vitest test next to them (`*.test.ts`). Run `npm test`.
- API routes validate input and return `{ ok: false, error }` with a friendly message on failure. Never send stack traces to the client.
- Mobile-first UI. Plain, calm language. One clear focal point per screen.
- Commit after every working slice.
- Next 16 with `cacheComponents: true`: do **not** use `export const dynamic`. In GET route handlers or pages that read live DB data, call `await connection()` (from `next/server`) first so they are never prerendered with stale data.
