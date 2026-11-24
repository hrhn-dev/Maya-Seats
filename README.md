# [App name]

> One line: what this does for Maya.

**Live:** [Vercel URL] · **Product note:** [PRODUCT_NOTE.md](./PRODUCT_NOTE.md) · **Prompts:** [PROMPTS.md](./PROMPTS.md)

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your Supabase URL and secret key
npm run dev                  # http://localhost:3000
npm test                     # runs the rule tests
npm run check                # lint, typecheck, tests, build
```

## Database

Run the SQL files in `supabase/migrations/` in order in the Supabase SQL editor.

## How "unused" is decided

[One or two lines + where the rule lives, e.g. `src/lib/unused.ts`, tested in `src/lib/unused.test.ts`.]

## How this was built

Planned and built in thin slices with an AI coding agent. See [PLAN.md](./PLAN.md) for the slices, [PROGRESS.md](./PROGRESS.md) for what happened in each, and [test-results/HISTORY.md](./test-results/HISTORY.md) for every recorded test run. Agent rules live in [AGENTS.md](./AGENTS.md) and `.cursor/agents/`.

## Stack

Next.js (App Router, TypeScript, Tailwind) · Supabase Postgres · Vitest · Vercel
