Contributing: env handling

Policy
- Do not commit any `.env` or `.env.*` files containing secrets.
- Use `.env.example` to document required variables (no secrets).
- Keep local secrets in `.env.local` (ignored) or `env-archive/`.

How to untrack an env file if accidentally added
1. git rm --cached .env.local
2. git commit -m "chore: untrack local env"
3. rotate any keys that were pushed upstream (if applicable)

Hooks
- Husky pre-commit will block staged `.env` files.
- Husky pre-push will block pushing if any `.env` files are tracked.
- CI workflow will fail PRs that include tracked env files.
