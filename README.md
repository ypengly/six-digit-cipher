# The Six-Digit Cipher: 100 Levels of IQ

A full-stack puzzle game. You are trapped in a digital vault; every door is guarded by a **six-digit passcode** hidden inside a reasoning puzzle. 100 original, hand-authored levels in five chapters, each with a verified unique answer, a written solution, and three progressive hints.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide · Zod · Zustand · Prisma + SQLite · Vitest · Playwright.

> **Honest status note.** This project was written and its game logic verified in an offline sandbox with no package registry access. What *was* executed there: the full level validator (all 100 levels proven to have exactly one solution), the daily-challenge generator, scoring/progression/engine tests, a full Level 1-100 engine playthrough, a strict TypeScript check of the pure-logic modules, and the SQL migration against SQLite. What was **not** possible there: `npm install`, `next build`, Prisma client generation, Vitest and Playwright runs. Run `npm install && npm run typecheck && npm test && npm run build` first; if the compiler reports a small typing nit in the UI or API layer, it will point at the exact line.

## Contents
1. [Prerequisites](#prerequisites) · 2. [Install and run](#install-and-run) · 3. [The 100 levels](#the-100-levels) · 4. [How scoring works](#scoring) · 5. [Architecture](#architecture) · 6. [Security](#security-and-answer-protection) · 7. [Admin](#admin-dashboard) · 8. [Daily challenge](#daily-challenge) · 9. [Tests](#tests-and-validation) · 10. [Deployment](#deployment) · 11. [Troubleshooting](#troubleshooting)

## Prerequisites
- **Node.js 20.9+** (22 LTS recommended) and **npm 10+**
- Windows, macOS or Linux. No external services; the game works offline once installed.

## Install and run

**Windows (PowerShell)**
```powershell
cd six-digit-cipher
npm install
Copy-Item .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # paste into AUTH_SECRET in .env (repeat for DAILY_SALT)
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```
**macOS / Linux**
```bash
cd six-digit-cipher
npm install
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # paste into AUTH_SECRET in .env (repeat for DAILY_SALT)
npx prisma generate && npx prisma migrate deploy && npm run db:seed
npm run dev
```
Open <http://localhost:3000>. Shortcut for the three DB steps: `npm run setup`.

**First administrator:** `npm run admin:create` asks for an email, display name and a password (12+ characters) and creates or promotes that user. No default credentials exist anywhere. Sign in at `/admin/login`.

**Reset local data:** `npm run db:reset` (drops, re-migrates, re-seeds), or delete `prisma/dev.db*` and run the three DB commands again.

## The 100 levels
| Chapter | Levels | Difficulty | Mechanics |
|---|---|---|---|
| 1 Initiation | 1-20 | Beginner to Intermediate | sequences, counting, riddles, digit sums, palindromes, magic grids, word problems |
| 2 The Analyst | 21-40 | Intermediate | primes, reversals, modular arithmetic, calendars, clocks, letter codes, conditionals, ordering, Latin squares |
| 3 The Deceiver | 41-60 | Advanced | red herrings, cryptograms, base conversion, truth-tellers and liars, symbol substitution, sudoku, code-breaking deduction |
| 4 The Mind Labyrinth | 61-80 | Expert | Boolean logic, multi-stage decoding, invariants, spatial reasoning, CRT, Gray code, self-reference, optimisation, game theory |
| 5 The Final Cipher | 81-100 | Master | layered ciphers, cross-referenced clues, multi-panel visuals, hidden rules, alphametics, knowledge logic, a four-chamber finale |

**How the answers are guaranteed correct.** No answer was typed by hand. Each clue exists in two forms: the text the player reads and a formal predicate. `scripts/levels/*.mjs` hold the sources; the solver brute-forces all 1,000,000 codes against every predicate and a level is only built if **exactly one** code survives. That code becomes the answer. Level explanations are built from the same computed values. `npm run validate` repeats the proof and compares it with the JSON in `src/data/levels/`.

*Red herrings* (levels 41, 60, and others) are always labelled `[UNVERIFIED]` in the clue text, shown struck through, and the instructions say to ignore them, so they are fair.

*Editing the campaign:* change a level in `scripts/levels/chN.mjs`, run `npm run levels:build` then `npm run validate`, then re-seed (or use the admin dashboard on a live database).

## Scoring
- **3 stars:** no hints and solved within the level's target time.
- **2 stars:** some hints used (fewer than 3) or the target time exceeded.
- **1 star:** all 3 hints used. (The optional "reveal answer" feature is deliberately not implemented: hint 3 is a near-solution that still lets you enter the code yourself.)
- **Points:** 1000, minus 150 per hint, minus 20 per wrong attempt, minus 1 per 3 seconds over target, minimum 100. Replays never lower your best.
- Hints are revealed strictly in order; the server enforces this for signed-in players.

## Architecture
```
prisma/            schema, hand-checked initial migration, seed
scripts/           level sources + solver, validator, variant generator, importer, admin creator
src/app/           pages (public, admin) and API routes
src/components/    layout, game, levels, achievements, admin, ui
src/lib/           game engine, scoring, progression, validation, rate limit, daily generator, auth, db
src/data/          the 100 levels (JSON) and achievements
src/store/         Zustand store (guest progress cache, settings)
src/tests/         unit, integration, e2e
```
- **Codes are strings everywhere** (UI, API, database), so `004281` never becomes `4281`.
- **Guest play:** progress, notes and settings are cached in `localStorage`. **Accounts** (optional): progress, attempts, hints and achievements are stored in SQLite, and the server enforces unlocks and hint order.
- SQLite has no enums or JSON column type, so enum-like fields are validated strings and structured data is JSON text.
- The submitted guess is **not** stored in `LevelAttempt` (only correct/incorrect and time), so the table cannot become a guess log.

## Security and answer protection
- Answers, explanations, steps and hint text never reach the browser before they are earned: the play page and `/api/levels/[n]` return a sanitised public level; hints come one at a time from `/api/hints`; the explanation is returned only with a correct submission.
- All validation happens on the server (Zod). Wrong answers return a generic message that never contains code details.
- Answer submissions are rate-limited (burst + hourly) per user or IP; login, registration, hints and admin routes have their own limits. The limiter is in-memory: **use a shared store (Redis) if you run multiple server instances.**
- Passwords: bcrypt (cost 12). Sessions: signed JWT in an `httpOnly`, `SameSite=Lax`, `Secure` (in production) cookie. State-changing routes also check the `Origin` header.
- Admin: every admin API route and the `/admin` pages re-check the admin role **on the server** per request; the role is re-read from the database, not trusted from the token.
- Security headers are set in `next.config.ts`. Environment variables are server-only (no `NEXT_PUBLIC_` secrets).
- **Known limitation (guest mode):** guest progress lives in the browser, so a determined player can edit local storage to unlock levels or fake hint/attempt counts. Answers still cannot be read from the client. For cheat-resistant progress use accounts. A fully offline build would have to ship answers to the browser and would not be cheat-resistant at all.
- Add a Content-Security-Policy suited to your hosting before going public (Next.js inline scripts need a nonce-based policy).

## Admin dashboard
`/admin/dashboard`, `/admin/levels`, `/admin/levels/new`, `/admin/levels/[id]`, `/admin/challenges`.
Create, edit, publish, archive (never hard-delete) and reorder levels; edit titles, clues, hints, solutions and difficulty; define answers; preview the player view; import/export JSON; see completion rates and average attempts; manage daily challenges; view per-level change history.
Admin validation checks structure, leaks and the level's test cases. **Proof of unique solvability is only produced for the authored campaign** (`npm run validate`); the admin screen says so.
Reordering renumbers levels, and progress follows level numbers, so reorder carefully on a live game.

## Daily challenge
`/play/daily`. Seeded by the UTC date (plus `DAILY_SALT`), generated from a validated clue library: random true clues are added only while they shrink the candidate set, and the result is rejected unless exactly one code remains. The instance id records the seed (`daily-2026-11-01-s337226316`). The first request of the day stores it in the database, so everyone gets the same puzzle; admins can override a date. `npm run variants` previews upcoming days.

## Tests and validation
```
npm run validate     # exhaustive proof for all 100 levels, reports the exact failing level
npm test             # Vitest: levels, engine, scoring, progression, daily, rate limit, full 1-100 playthrough
npm run test:e2e     # Playwright (needs: npx playwright install chromium, and a seeded database)
npm run typecheck
```
Covered: 100 levels exist, unique ids/numbers, six-digit string answers, leading zeros, complete clues/hints/explanations, answers unique and matching, reproducible seeds, locked levels, unlock on solve, wrong answers never leak, hint tracking, star rules, unauthorised admin API rejection, keyboard and keypad entry, progress surviving a refresh, and a complete Level 1 to 100 playthrough at engine level.

## Deployment
1. Use a persistent server (Node) or container. SQLite is fine for a single instance; for serverless or multiple instances switch Prisma to PostgreSQL (change the provider and `DATABASE_URL`, regenerate migrations; enums/JSON can then become native types).
2. Set `DATABASE_URL`, `AUTH_SECRET` (32+ random chars), `DAILY_SALT`. Never commit `.env`.
3. `npm ci && npx prisma migrate deploy && npm run db:seed && npm run build && npm start`.
4. Create the admin with `npm run admin:create` on the server. Serve over HTTPS (cookies are `Secure` in production).
5. Put a shared rate limiter (Redis, or your proxy/CDN) in front if you scale out; configure a CSP; back up the database file.

## Troubleshooting
See `run.txt` for the short list (missing `AUTH_SECRET`, missing `DATABASE_URL`, empty level list, Prisma client not generated, busy port, PowerShell execution policy).
