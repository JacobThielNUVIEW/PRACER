++ Begin Patch
# PRACER / RACELAY — Project Overview, Phases & Ownership Transfer

This README provides a single, authoritative source of truth for the project: architecture, how things work end-to-end, UI mapping, a detailed Phase 1 breakdown (what each UI shows), and a precise ownership-transfer checklist.

If you need this file adjusted (tone, more diagrams, exported DB schema, or a CONVERTED Google Sheet of steps), tell me and I will update it.

---

## Short summary

PRACER (RACELAY) is an adaptive running platform built with Next.js (app router), Supabase (DB + Edge Functions), and n8n automations that call OpenAI to generate short coaching notes for opt-in users. The design enforces an "air-gap" privacy model: the system only sends minimal, sanitized signals to OpenAI (no GPS, HR, or PII).

This document contains:
- Phase 1: Full breakdown and UI mapping (what each UI shows and where the code lives)
- Repo ownership transition checklist focused on migrating control from the company account to your personal account while preserving CI, Vercel deploys, and GitHub Actions

---

## Phase 1 — Full breakdown

Goal: Launch a privacy-first, opt-in AI coaching feature and validate the end-to-end flow while keeping production secrets safe.

1) Frontend — Hosted on Vercel
- Primary stack: Next.js (app router) deployed to Vercel
- Pages & locations (code):
  - App layout & globals: `src/app/layout.tsx`, `src/app/globals.css`
  - Auth flows: `src/app/auth/*` (sign-in pages, callback routes, session handlers)
  - Dashboard: `src/app/dashboard/*` (dashboard page, client dashboard components, activity list)
  - Settings: `src/app/dashboard/settings/page.tsx` (contains the `AiToggle` component)
  - Error handling: `src/app/error.tsx`, `src/app/_global-error/page.tsx`

Description: The frontend presents the settings (toggle), dashboard with activities & coach notes, and auth flows. Interactive parts are `use client` and call Supabase client functions.

2) Backend — Supabase (SQL + Edge Functions)
- DB: SQL (Supabase-managed)
  - Key tables: `profiles` (contains `ai_coaching_enabled`), `activities` (contains `ai_coach_notes`)
  - Sample SQL tasks: add `ai_coaching_enabled` boolean to `profiles`; add `ai_coach_notes` text column to `activities`.
- Edge Functions & shared helpers: `supabase/functions/*` and `supabase/functions/_shared/ai-guard.ts`

Description: Server-side logic reads `ai_coaching_enabled` and, if allowed, enqueues jobs or responds to webhooks that n8n consumes.

3) Admin / Firebase (Admin Page)
- NOTE: This repository is Supabase-centric; if you maintain an admin portal in Firebase, treat Firebase as an optional admin UI provider. Document any Firebase-specific admin pages in `docs/ADMIN.md`.

4) n8n automation
- Workflow definition: `racelay-ai-coach-workflow.json`
- Runner scripts: `scripts/deploy_n8n.ps1`, `launch_n8n.ps1` (these run n8n in Docker with environment vars)

Description: n8n workflows read recent activities for opt-in users, run a prompt through OpenAI, then write `ai_coach_notes` back into Supabase if `ai-guard` approves.

5) Assets & Branding
- Logos and partner assets: `public/assets/images/*`
- Partner logo helper / mapping: `src/components/PartnerLogo.tsx` (or `src/components/PartnerLogo`) + `src/lib/constants.ts` mapping

6) Schema (quick)
- `profiles` — id (uuid), email, display_name, ai_coaching_enabled (boolean), vdot (float)
- `activities` — id, profile_id, start_time, duration, distance, vdot_score, ai_coach_notes (text)

7) Phase 1 success criteria
- Users can toggle AI coach ON/OFF in the Settings page
- n8n workflow produces short (one-sentence) coach notes and writes them into `activities.ai_coach_notes` for opt-in users
- No PII, GPS traces, or raw Strava data is sent to OpenAI; `ai-guard` sanitizes inputs

---

## UI mapping — what each screen shows (developer reference)

- Settings (`/dashboard/settings`) — `src/app/dashboard/settings/page.tsx`
  - Shows: `AiToggle` component, privacy bullets, brief explanation of what is sent to AI
  - Actions: toggles `ai_coaching_enabled` on the profile via Supabase client

- Dashboard (`/dashboard`) — `src/app/dashboard/*`
  - Shows: list of recent activities, for each activity: summary, VDOT, and `ai_coach_notes` (if present)
  - Actions: expand activity to view full coach note and metadata (no raw PII)

- Auth pages (`/auth`) — `src/app/auth/*`
  - Shows: login options, debug auth pages, callback route handling

---

## Ownership-Transfer checklist (precise steps)

You requested a complete and unbreakable repo ownership transition so `Jacobqtqt` (jqthiel@gmail.com) has identical rights as the company account `JacobThielNUVIEW`.

Important: Some steps require organization or repo administration access. The assistant can run local Git operations and verify remotes, but cannot add collaborators or transfer Vercel project ownership via the web UI.

Follow this exact ordered checklist. Mark steps done only after confirmation.

Automatable (local) steps — I can run these if you confirm:
1) Verify current remote URL (must be JacobThielNUVIEW/racelay or your chosen remote)
   - Run: `git remote -v`
2) Change git user config to use `Jacobqtqt` globally on this machine
   - Exact commands:
     - `git config --global user.name "Jacobqtqt"`
     - `git config --global user.email "jqthiel@gmail.com"`
   - Note: this changes local commit author metadata. GitHub authentication for pushes depends on credentials (SSH key or HTTPS token) configured in your environment.
3) Create a test commit to prove pushes and set author metadata
   - Create `ownership-transfer-test.txt`, commit, and push to `origin`.

Manual (GitHub / Vercel UI) steps — must be performed in the web UI by an admin:
4) Add `JacobThielNUVIEW` as a repository collaborator with Admin rights
   - GitHub → Repo → Settings → Manage access → Invite collaborator `JacobThielNUVIEW` → Role: Admin
5) Confirm both accounts appear as Owner/Admin in repo settings (GitHub web UI)
6) Update Vercel project ownership or add `Jacobqtqt` as owner
   - Vercel → Project → Settings → General → Transfer Project OR add user to team with Owner role
7) Reinstall/verify GitHub App (Vercel) for the new account if necessary

Validation steps (after UI changes):
8) Test push from `Jacobqtqt` account: commit and push a short change; verify commit author and that it appears in the repo
9) Confirm Vercel auto-deploys: check Vercel deployment log for the commit hash and a successful build
10) Confirm n8n & Supabase envs in Vercel are intact (Vercel project settings → Environment Variables)

Final status table (fill after execution):

| Step                  | Status | Notes |
|-----------------------|--------|-------|
| Git user changed      | ⬜️     |       |
| Admin rights granted  | ⬜️     | Manual: GitHub UI |
| Vercel ownership      | ⬜️     | Manual: Vercel UI |
| Test push success     | ⬜️     |       |
| Deploy triggered      | ⬜️     | Manual: Vercel check |

---

## I can run the local automatable steps now (confirmation required)

If you confirm, I will execute the following locally from this workspace in order:
- `git remote -v` (show remotes)
- `git config --global user.name "Jacobqtqt"`
- `git config --global user.email "jqthiel@gmail.com"`
- create `ownership-transfer-test.txt`, commit with message `chore: test ownership transfer - commit by Jacobqtqt` and push to `origin`

I will **not** perform GitHub or Vercel UI actions — those require human admin access. I will report results and update the status table for the automatable steps. After that, I'll provide exact UI steps and the minimal screenshots/text you should paste into the GitHub and Vercel flows.

---

If you'd like me to proceed with the local automatable flow, reply: `PROCEED LOCAL`. If you want only the README or other docs edited, reply: `EDIT README ONLY` and list changes.

If you want me to proceed, confirm now and I'll run the local commands and report back with the results and updated status table.
++ Begin Bin
```markdown
# RACELAY — Adaptive running & coaching platform

RACELAY is a modern web application combining a Next.js front-end, Supabase backend (DB + Edge Functions), and n8n automations that connect to OpenAI for a privacy-first AI-coaching experience.

---

📌 Quick links
- Repo: https://github.com/Jacobqtqt/PRACER (origin)
- Issue tracker: GitHub Issues (same repository)

---

## Table of contents
- Project overview
- Architecture & key components
- Local development (quick start)
- Configuration & environment variables
- Running n8n & importing the AI Coach workflow
- Tests & CI
- Deployment (Vercel & Docker)
- Security, privacy, and secrets
- Troubleshooting & Next.js gotchas
- Contributing guidelines

---

## Project overview

RACELAY is an adaptive running platform that stores user profiles and activities in Supabase and enriches the experience with optional AI-generated coaching notes. The product design emphasizes privacy and an "air-gap" approach — only small, non-identifying, sanitized-derived signals (like a VDOT score) are sent to AI.

Key properties
- Air-gap safeguards for AI: `ai_coaching_enabled` toggles per-user which activities can be processed.
- Privacy-first: GPS, raw run names, heart-rate and PII are never forwarded to OpenAI.
- Automation: n8n enqueues workflows that use OpenAI to generate short, contextual coach notes.
- Modern stack: Next.js (app router), Supabase, n8n, and OpenAI.

---

## Architecture & key components

- Next.js (app router) — `src/app/*`
  - Layout & global UI components: `src/app/layout.tsx`, `src/components/*`
  - Settings & AI toggle: `src/app/dashboard/settings/page.tsx`, `src/components/AiToggle.tsx`
  - Error & fallback routes: `src/app/error.tsx`, `src/app/_global-error/page.tsx`

- Supabase
  - Database: `profiles`, `activities`, etc.
  - Edge Functions & shared helpers: `supabase/functions/*` (Deno)
  - `src/lib/supabase/server.ts` — server-side client wrapper (use for server-side code)
  - `src/lib/supabase/client.ts` — client-side supabase instance (use for client components)

- n8n
  - Workflow JSON: `racelay-ai-coach-workflow.json`
  - Local dev: `scripts/deploy_n8n.ps1`, `launch_n8n.ps1` to run n8n with environment variables injected

- OpenAI Integration
  - Workflow nodes in `racelay-ai-coach-workflow.json` call OpenAI to generate coach notes
  - Stored result flows back into Supabase as `ai_coach_notes` into `activities` (if allowed by guard)

---

## Local development (quick start)

Prerequisites
- Node.js LTS, npm or pnpm
- Docker + Docker Desktop (for n8n in local dev)
- `supabase` CLI (optional, for running local Supabase)

Local setup
1. Clone and install packages
```powershell
cd C:\Users\Jacob\racelay
npm ci
```

2. Copy env template
```powershell
cp .env.example .env.local
# Fill in the values in .env.local
```

3. (Optional) Launch n8n locally for AI Coach workflow
```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/deploy_n8n.ps1
# open: http://localhost:5678
```

4. Run the dev server
```powershell
npm run dev
# App runs: http://localhost:3000
```

Helpful commands
- `npm run build` — create a production build
- `npm test` — run unit/integration tests (project uses Vitest)
- `npm run lint` — run ESLint

---

## Environment & configuration

This project keeps secrets out of the repo. Copy `.env.example` to `.env.local` and add values. DO NOT commit `.env.local`.

Essential environment variables (examples)
```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
OPENAI_API_KEY_DEV=
OPENAI_API_KEY_PROD=
```

Security note: The Supabase Service Role Key should only be used server-side in Edge functions or server-side calls (never expose it to client code or public environment variables). Keep it as a secret in GitHub Actions or deployment secrets and never commit it.

---

## n8n automation & importing the AI Coach workflow

1. Launch local n8n via `scripts/deploy_n8n.ps1` (will read `.env.local` to set keys)
2. Create credentials in the n8n editor (Admin > Credentials):
   - `RACELAY OpenAI` → OpenAI key (from env)
   - `RACELAY Supabase` → Supabase url + service role key (server-only keys)
3. Import workflow: `racelay-ai-coach-workflow.json` from the repo via n8n Editor or via REST
4. For workflow nodes using Supabase and OpenAI, set the credential reference to the credentials created in step 2
5. Test the workflow: toggle `ai_coaching_enabled=true` on a test profile and run the workflow

Notes & air-gap safety
- The `ai-guard` function in `supabase/functions/_shared/ai-guard.ts` strips personally identifying data and ensures only aggregated or minimal inputs (like VDOT) go to OpenAI.

---

## Tests & CI

- Unit & integration tests: vitest config is in `vitest.config.ts` and tests live under `tests/`
- Pre-commit checks: Husky hooks prevent committing `.env` files and run linters
- GitHub Actions are present for nightly DB backups and commit author enforcement

---

## Deployment

Vercel is the recommended hosting provider for the Next.js app. Key deployment steps:
1. Connect your GitHub repository to Vercel (user or org)
2. Add environment variables (production & preview) to Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` (public)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — mark as secret)
   - `OPENAI_API_KEY_PROD` (server-only)
3. Confirm that the Vercel-connected GitHub account is in the allowed commit authors list (see `/.github/workflows` commit author check)

Docker
- n8n is run in Docker locally or in self-hosted environments. Use the provided `scripts/` utilities to run, inject env vars, or scale.

---

## Security & privacy — MUST READ

- Always keep `.env.local` out of Git (it is in `.gitignore`).
- If a secret was ever committed, rotate it immediately and scrub the repository history.
- Sensitive variables: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY_*`, `STRIPE_SECRET_KEY`, `GOOGLE_CLIENT_SECRET`, etc.
- Do not expose server-only keys to the client-side bundle. Prefer server routes and Edge functions for secret usage.

---

## Common Next.js & migration gotchas (Recent work)

- When migrating to Next 15+, you may see pre-render errors around client-only hooks and `useContext`.
  - Fix: Ensure `use client` components are not imported into server-only components. Use client-only wrapper components inside `app` files when needed.
  - Fix: Use `export const dynamic = 'force-dynamic'` on pages/layouts that require runtime cookies/requests.
- `cookies()` API changed: use `await cookies()` for runtime compatibility in server code.
- Case-sensitivity issues on Windows: make sure imports respect file casing if targeting case-sensitive CI or Linux production environments.

---

## Troubleshooting

- Build prerender errors: check your server vs client imports. Audit server-side files for `use client` components, and shift interactivity to client components.
- `useContext` null on prerender: caused by client hooks being executed in server contexts — audit imports and re-classify components as `use client`.
- Mixed `app` and `pages` routers: ensure `src/pages/` is empty or consistent. Either stick to the `app` router or the `pages` router — mixing causes build issues. We removed fallback pages for app-only setups.

---

## Contributing

We welcome contributions. Follow the contribution checklist:
1. Fork the repo, create a feature branch
2. Run linters & tests locally
3. Use `husky` (pre-commit/pre-push) hooks to ensure you didn't commit `.env` files
4. Create a PR, reference the relevant issue, and request a review

Developer tips
- `npm run dev` — development server (hot reload)
- `npm run build && npm start` — production start
- `npm run test` — run tests

---

## Notes & roadmap

- The repo and workflows are in an active migration: Next.js upgrades to v15.5.7+ were applied to mitigate security CVE-2025-55182 and to align with Vercel's allowed build targets.
- After this upgrade, we had to audit server/client boundaries and ensure cookie usage and pre-rendering are properly set.

---

## Contact & support

- Primary maintainer: Jacob (GitHub: `Jacobqtqt`) — invite additional personal or org combos to the repo.
- For urgent incidents (leaked key, CVE remediations) — rotate keys, update Vercel and GitHub secrets, and re-run CI.

---

## License

This repo is currently private; add licensing details if/when you publish the project publicly.

---

Thank you for contributing to RACELAY. We prioritize privacy, security, and open, well-documented practices. If anything in this README is unclear, or you want a different layout or extra detail somewhere, tell me and I’ll refine it further.
```

++ End Bin# REACELAY – Adaptive running platform

## Color tokens and linting

This project centralizes UI color tokens under `src/styles/tokens`. Use `npm run check:colors` to scan for inline color literals or legacy Tailwind classes across the codebase — the script will exit non-zero if it finds a match that should be tokenized. Prefer using the CSS variables in `src/styles/tokens/colors.css` or the `cssVar()` helper in `src/styles/tokens/colors.ts` when adding colors.


### <PartnerLogo />

Usage:
```tsx
// resolve via brand mapping defined in src/lib/constants.ts
<PartnerLogo brand="strava" size={28} className="opacity-90" />

// explicit source
<PartnerLogo src="/assets/images/strava-logo.webp" size={36} />
### Notes & References
```

Props:
- brand: "strava" | (other keys from `IMAGES.logos`)
- src: string (optional) — explicit image path overrides `brand`
- size: number | string (px or CSS value)
- className: string (optional)

Additional props:
- dark: boolean — when true, PartnerLogo prefers the `<brand>Dark` asset if present.
- invert: boolean — when true, applies a CSS invert filter (useful if no dark asset exists).

Notes:
- `size` can be a number (px) or a css size like `"100%"` when used as a background.
- `PartnerLogo` uses Next.js `Image` under the hood; add external domains to `next.config.js` if needed.

Utility scripts
---------------

There are helper scripts in `scripts/`:

- `scripts/sanitize_env_for_github.sh` - back up `.env.local` to `env-archive` and produce `.env.public` with REDACTED placeholders suitable for committing.
- `scripts/hard_clone_to_path.sh` - copy the repo (including `.git`) to an absolute local path. The script excludes `node_modules` and `.env.local` by default.

Run the scripts from the repo root, e.g.:

```zsh
./scripts/sanitize_env_for_github.sh
./scripts/hard_clone_to_path.sh /Volumes/MyBackup/racelay
```

## Project TODO & Checklist ✅

Below are the current project tasks, status, and recommended next steps. Use this checklist for manual or automated deployment and for running end-to-end tests.

### Status summary

- ✅ Repo rename & branding to RACELAY
- ✅ Air-gap guard function (`supabase/functions/_shared/ai-guard.ts`) implemented
- ✅ `ai_coaching_enabled` column added to `profiles` and UI toggle component built (`src/components/AiToggle.tsx`)
- ✅ `launch_n8n.ps1` + `scripts/deploy_n8n.ps1` created and improved for reliable env injection
- ✅ Dashboard displays `ai_coach_notes` when present (`src/app/dashboard/*`)
- ✅ GitHub Action added to restrict commit authors
- ✅ n8n container running locally when launched via script
- ☐ n8n credentials created (OpenAI + Supabase service role) in the running n8n instance
- ☐ Import `racelay-ai-coach-workflow.json` into n8n and confirm credentials map correctly
- ☐ Run E2E test: enable `ai_coaching_enabled` on a profile and confirm `ai_coach_notes` generation
- ☐ Deploy settings page and push to Vercel (confirm environment variables & secrets)
- ☐ Confirm Vercel project is connected to the correct GitHub account and runs using the permitted author

### Quick checklist (actionable)

1. Local developer sanity checks
	- [ ] Start Docker Desktop
	- [ ] Run: `powershell -ExecutionPolicy Bypass -File ./scripts/deploy_n8n.ps1`
	- [ ] Navigate to the n8n editor: `http://localhost:5678` (or the `WEBHOOK_URL` set in `.env.local`)

2. n8n configuration & workflow import
	- [ ] Create credentials in n8n (Admin > Credentials)
	  - Name: `RACELAY OpenAI`, Type: `OpenAI` (or `openAiApi`), API Key: `OPENAI_API_KEY_PROD` (or DEV if testing)
	  - Name: `RACELAY Supabase`, Type: `Supabase`, URL: `NEXT_PUBLIC_SUPABASE_URL`, Service Role Key: `SUPABASE_SERVICE_ROLE_KEY`
	- [ ] Import `racelay-ai-coach-workflow.json` using n8n Editor -> Import (or via REST)
	- [ ] For each Supabase node in the workflow, set `RACELAY Supabase` credential
	- [ ] For the OpenAI chat node, set `RACELAY OpenAI` credential

3. Test the workflow locally
	- [ ] In a sample profile record, set `ai_coaching_enabled=true` via Supabase UI or SQL console
	- [ ] In n8n editor, manually run the workflow or create a one-off test trigger
	- [ ] Validate the workflow call to OpenAI returns a short coach note (1 sentence) and Supabase node updates the `activities` `ai_coach_notes` field

4. Prepare Vercel production deploy
	- [ ] Add `OPENAI_API_KEY_PROD` to Vercel project env vars (production) and `OPENAI_API_KEY_DEV` to the preview env
	- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel as `SUPABASE_SERVICE_ROLE_KEY` (server-only)
	- [ ] Confirm the GitHub account connected to Vercel is one of the allowed commit authors (see GitHub Action)
	- [ ] Trigger a Vercel deployment (push to `main` or use Vercel's preview/production pipeline)

5. Final E2E validation
	- [ ] With production API keys present and Vercel deployed, check the `settings` page in the app and ensure the toggle reads/updates correctly against Supabase
	- [ ] Perform an E2E run and verify `ai_coach_notes` appear on activities and accordion cards in `src/app/dashboard/*`
	- [ ] Confirm no PII, GPS traces, or private Strava data are sent to OpenAI — confirm the `ai-guard` logic sanitizes data

6. Housekeeping & security
	- [ ] Ensure `.env.local` is never committed (should be in `.gitignore`)
	- [ ] Remove or add `n8n-logs.txt` and `cookies.txt` to `.gitignore` as needed
	- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI` keys are rotated if they were leaked during testing

### Notes & References
- n8n REST API tips: Use Basic Auth or session cookie to import or update credentials programmatically; the workflow JSON may require credential `id` values to be present (edit each node in the editor and assign credentials).
- Air-gap: Confirm `supabase/functions/_shared/ai-guard.ts` is used to sanitize the data; any changes to activities, notes, or VDOT logic should be carefully validated.

#   T e s t   c o m m i t   t o   v e r i f y   c o r r e c t   G i t H u b   a c c o u n t 
 
 