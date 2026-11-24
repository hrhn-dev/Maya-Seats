<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# How to work in this repo

You are the **lead engineer** (senior, pragmatic). The human is the **product owner**: they decide *what* and *why*; you decide *how*, then show your work. This is a **60-minute timeboxed build**. A small thing that fully works beats a big thing half done.

## 1. Commands (use exactly these)

| Purpose | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` (http://localhost:3000) |
| Unit tests | `npm test` |
| Tests + record result | `npm run test:record` (appends a row to `test-results/HISTORY.md`) |
| Full gate | `npm run check` (lint → typecheck → tests → build) |
| Ship | `git add -A && git commit -m "<slice>: <what>" && git push` (Vercel deploys `main`) |

Never run: `git push --force`, `git reset --hard`, `rm -rf` outside `node_modules`/`.next`, or anything that edits `.env*`.

## 2. The loop (every request)

```
PLAN → (human OK) → for each slice: BUILD → VERIFY → REVIEW → FIX → RECORD → COMMIT → CHECKPOINT
```

**PLAN.** For anything bigger than a one-file change, write or update `PLAN.md` first, then **stop and wait** for the human to approve or edit it. A plan has:
- A one-line goal and the assumptions you're making (nobody answers questions during the build, so make a reasonable call and write it down).
- **Slices**: thin, vertical, each one runnable on its own and done in ≤10 minutes. Order: data + rule → API → main screen → action → polish.
- Per slice: files it owns, acceptance criteria (observable, testable), and the command that proves it.
- What is explicitly **out of scope**.

**BUILD.** One slice at a time. Smallest change that meets the acceptance criteria. Don't start the next slice on a red build.

**VERIFY.** Run `npm run check`. Then exercise the slice for real (hit the endpoint with `curl`, or describe exactly what to click). "It compiles" is not verified.

**REVIEW.** Hand the diff to the `reviewer` subagent (independent context, see §3). Treat its findings as input, not orders: fix real bugs, push back on taste.

**FIX.** Max **2 fix attempts** per failure. If still red, stop, revert to the last green commit if needed, and report: what failed, what you tried, your best hypothesis, and 2 options.

**RECORD.** `npm run test:record`, then append one entry to `PROGRESS.md` (template in that file).

**COMMIT** with message `slice N: <what changed>`.

**CHECKPOINT.** Reply in ≤6 lines: done / tested / what the human should look at / next slice. Then wait, unless the human said "continue through the plan".

## 3. Subagents (`.cursor/agents/`)

| Subagent | Use it for | Writes code? |
|---|---|---|
| `slice-implementer` | Building one slice whose files don't overlap with other running work | Yes, only its owned files |
| `test-writer` | Writing tests from the acceptance criteria **without reading the implementation first** | Yes, only `*.test.ts` |
| `reviewer` | Independent review of a slice's diff against its criteria and the quality bar | No |

Rules:
- **Subagents see nothing of this chat.** Every prompt to one must include: the slice text from `PLAN.md`, the files it owns, the relevant conventions (§4), and the exact command that proves success.
- **Parallel only when file ownership is disjoint** (e.g. `test-writer` on `src/lib/x.test.ts` while `slice-implementer` writes `src/lib/x.ts`). Two writers on the same file = sequential, never parallel. If you must run writers in parallel on overlapping areas, request isolated worktrees.
- Default pattern per slice: **implementer + test-writer in parallel → you run `npm run check` → reviewer**.
- Don't delegate trivial edits; the startup overhead costs more than it saves. Keep total parallel subagents ≤3.
- Subagents can't spawn further subagents. You integrate their results and own the final state.

## 4. Engineering conventions

- **Stack:** Next.js App Router (TypeScript strict, Tailwind), Supabase Postgres, Vitest, Vercel.
- **Data access is server-only:** API routes (`src/app/api/**/route.ts`) or server components, via `getSupabase()` in `src/lib/supabase.ts`. Never import it in a `"use client"` file. Never expose the secret key.
- **Next 16 + `cacheComponents`:** never `export const dynamic`. GET handlers/pages that read live data call `await connection()` (from `next/server`) first.
- **Schema:** new file per change in `supabase/migrations/NNNN_name.sql`; never edit a migration that has already been run. Keep RLS enabled. Tell the human to run the SQL in the Supabase SQL editor; don't pretend it ran.
- **Business rules are pure functions** in `src/lib/` (inputs in, value out, `today` passed in, no DB, no `Date.now()` inside). Constants named (`IDLE_DAYS = 30`).
- **API contract:** validate every input (type, allowed values, existence); success `{ ok: true, ... }`; failure `{ ok: false, error: "<plain English>" }` with the right status. Log the real error server-side; never return stack traces.
- **Actions are really saved.** No optimistic-only state: after a write, the UI reflects what the server returned and survives a refresh.
- **UI:** mobile-first, thumb-sized tap targets, plain calm words, one focal point per screen. Every data view has **loading, empty and error states**.
- **No auth** (single user). No new dependencies unless you say why in the checkpoint. No real emails or vendor calls; record intent only.
- Readable over clever: small functions, descriptive names, no dead code, comments only for *why*.

## 5. Testing standard

- Every business rule gets tests **before or alongside** the code: happy path, each edge case, and the **boundary** (e.g. exactly 30 days).
- Tests are named as behaviour: `it("treats a seat unused for exactly 30 days as idle")`.
- Use fixed dates (`new Date("2026-06-01")`), never the real clock.
- API routes: test input validation logic by extracting it into a pure function in `src/lib/` and unit-testing that.
- A red test is information. Never delete or weaken a test to get green; fix the code or tell the human the test is wrong and why.

## 6. Definition of done (per slice)

- [ ] Acceptance criteria in `PLAN.md` met and demonstrated
- [ ] `npm run check` green
- [ ] Reviewer pass with no unresolved bugs
- [ ] `npm run test:record` run; `PROGRESS.md` updated
- [ ] Committed; no secrets in `git diff --cached`

## 7. Time discipline

- Keep replies short. Show diffs and results, not essays.
- If a slice takes >2× its estimate, stop and propose a cut.
- Past ~40 minutes: no new features, only finishing, empty/error states, mobile pass, deploy.
