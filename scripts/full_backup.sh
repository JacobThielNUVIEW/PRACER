#!/usr/bin/env bash
# Full backup script
# Backs up the project and (optionally) the database dump to a local folder.

set -euo pipefail

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_DIR="/Users/JThiel/Documents/Backup"
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ARCHIVE_NAME="pracer-full-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating project archive $ARCHIVE_NAME in $BACKUP_DIR"
tar --exclude-vcs --exclude='./node_modules' --exclude='./supabase/.temp' -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$PROJECT_ROOT" .

# Optionally include DB dump if SUPABASE_DB_URL env var is set
if [[ -n "${SUPABASE_DB_URL:-}" ]]; then
  echo "Creating database dump..."
  DUMP_NAME="db-dump-$TIMESTAMP.dump"
  pg_dump "$SUPABASE_DB_URL" -Fc -f "$BACKUP_DIR/$DUMP_NAME" || echo "pg_dump failed; skipping DB dump"
fi

echo "Backup complete: $BACKUP_DIR/$ARCHIVE_NAME"
