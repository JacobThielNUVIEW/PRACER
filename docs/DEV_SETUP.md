# Development setup and cross-machine workflow

This document explains how to work on the `neverstop-app` across multiple machines (home PC, work laptop, etc.) while keeping local envs secure, synced, and ensuring you work on the latest code.

## Goals
- Quick local bootstrapping for new machines
- Keep secrets out of git, but available locally
- Ensure smooth sync of changes and safe backups
- Lightweight, auditable developer workflow

## Essentials
- GitHub repo with protected `main` branch and PR workflow
- Secrets stored in a secrets manager (1Password, Doppler, GitHub Secrets, or AWS Secrets Manager)
- Local `.env.local` used for development only; never commit it

## Quick start (new machine)
1. Clone the repo:
   ```bash
   git clone git@github.com:JacobThielNUVIEW/neverstop-app.git
   cd neverstop-app
   ```
2. Run the setup helper (creates `.env.local` from `.env.example`):
   ```bash
   bash scripts/setup_dev.sh
   ```
3. Populate `.env.local` with your local keys. Recommended options:
   - Use a local secrets manager (1Password CLI `op`, Doppler CLI) and inject values into `.env.local`.
   - Example with Doppler: `doppler run -- supabase start` (replace with your doppler project)
4. Install dependencies and run locally:
   ```bash
   npm install
   npm run dev
   ```

## Secure secrets synchronization (recommended)
- Use 1Password/Doppler/GitHub Secrets for production/CI secrets.
- For developer secrets, prefer a team vault (1Password) or Doppler project scoped to devs.
- DO NOT store `SUPABASE_SERVICE_ROLE_KEY` in the repo; only in CI or server envs.

### Example: Using 1Password CLI
1. Save secrets in a vault and share with the team.
2. On new machine:
   ```bash
   eval $(op signin my)
   op item get "racelay/dev/supabase" --fields label=NEXT_PUBLIC_SUPABASE_URL,label=NEXT_PUBLIC_SUPABASE_ANON_KEY > .env.local
   ```

## Working on multiple machines
- Always pull the latest code before starting:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feat/your-feature
  ```
- Commit frequently, use small PRs, and add descriptive commit messages.
- Use `git status` and `git log` to confirm you are on the latest commit.

## Backups and local sync
- Your `.env.local` is local-only. Back it up securely (e.g., encrypted backup, 1Password, or secure external drive) — we added `scripts/full_backup.sh` for app-level backup.
- Use the nightly GitHub Actions DB backups for database recovery.
- For full system images, we added `scripts/full_system_clone.sh` (dangerous) for offline clones — use only after reading the script and understanding the risks.

## Migrations & DB changes
- Keep SQL migrations under `scripts/` and run them via Supabase SQL Editor or CLI.
- Before applying migrations in production, test in a staging environment.

## CI and code quality
- PRs must pass build & lint checks (CI).
- Keep branch protections enabled for `main`.

## Quick troubleshooting
- App fails to start: check `.env.local` is present and valid.
- Auth issues: confirm `NEXT_PUBLIC_SUPABASE_URL` and keys are set in both local and production envs.

## Summary of commands
```bash
# One-time setup
bash scripts/setup_dev.sh
npm install
npm run dev

# Daily workflow
git pull origin main
git checkout -b feat/your-feature
# edit, test
git add -A && git commit -m "feat: ..."
git push origin feat/your-feature
# create PR in GitHub
```

---
If you want, I can add a small `scripts/sync_secrets.sh` that integrates with 1Password/Doppler and populates `.env.local` automatically (requires CLI tokens). Tell me which secret manager you prefer and I'll implement it.
