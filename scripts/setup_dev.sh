#!/usr/bin/env bash
# Setup development environment helper
# - Copies .env.example to .env.local if missing
# - Prints next steps for connecting secrets and running the app

set -euo pipefail
PROJECT_ROOT="$(cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"
ENV_LOCAL="$PROJECT_ROOT/.env.local"

if [ ! -f "$ENV_EXAMPLE" ]; then
  echo ".env.example not found. Create one with required variables." >&2
  exit 1
fi

if [ -f "$ENV_LOCAL" ]; then
  echo ".env.local already exists. Leaving it intact." 
else
  echo "Copying .env.example -> .env.local"
  cp "$ENV_EXAMPLE" "$ENV_LOCAL"
  echo "Please edit .env.local and fill in real values (Supabase URL, anon key, service role key)."
fi

echo "Next steps:"
echo "1) Open .env.local and add your SUPABASE keys and any local-only secrets."
echo "2) Use a secure secret manager (1Password, Doppler, GitHub Secrets) for production values."
echo "3) Run 'npm run dev' to start the app locally."
echo "4) If you need to sync DB or run migrations, use the Supabase Dashboard or supabase CLI with your service role key."

echo "Dev setup helper complete."
