#!/usr/bin/env bash
# Produce a sanitized .env.public from .env.local by replacing values with placeholders
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=.env.local
OUT=.env.public
BACKUP_DIR=env-archive
mkdir -p "$BACKUP_DIR"

if [ ! -f "$SRC" ]; then
  echo "No $SRC found in repo root. Create .env.local first." >&2
  exit 1
fi

ts=$(date -u +%Y%m%dT%H%M%SZ)
cp "$SRC" "$BACKUP_DIR/.env.local.$ts"
echo "Backed up $SRC to $BACKUP_DIR/.env.local.$ts"

echo "Generating $OUT with placeholders..."
awk -F= '/^[A-Za-z0-9_]+=/{ key=$1; gsub(/"/, "", key); print key "=REDACTED" }' "$SRC" > "$OUT"
echo "Wrote $OUT (suitable for committing). Review before committing."
echo "Tip: keep sensitive keys only in .env.local which is gitignored."

exit 0
