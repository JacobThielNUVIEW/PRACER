#!/usr/bin/env bash
# Hard clone the repository to a local absolute path (keeps .git).
# This performs a filesystem copy; use with care. It will not overwrite unless you confirm.
set -euo pipefail
cd "$(dirname "$0")/.."

# Usage: hard_clone_to_path.sh [--include-env] /absolute/path/to/target_dir
INCLUDE_ENV=0
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 [--include-env] /absolute/path/to/target_dir" >&2
  exit 1
fi

if [ "$1" = "--include-env" ]; then
  INCLUDE_ENV=1
  shift
fi

TARGET="$1"

if [[ "$TARGET" != /* ]]; then
  echo "Target must be an absolute path" >&2
  exit 1
fi

if [ -e "$TARGET" ]; then
  echo "Target $TARGET already exists." >&2
  read -p "Do you want to overwrite it? Type YES to proceed: " conf
  if [ "$conf" != "YES" ]; then
    echo "Aborting."; exit 1
  else
    echo "Removing existing target...";
    rm -rf "$TARGET"
  fi
fi

echo "Creating target directory $TARGET"
mkdir -p "$TARGET"

echo "Copying files (this may take a while)..."
EXCLUDES=(--exclude 'node_modules' --exclude 'env-archive' --exclude '*.log')
if [ "$INCLUDE_ENV" -eq 0 ]; then
  EXCLUDES+=(--exclude '.env.local')
fi

rsync -a --info=progress2 "${EXCLUDES[@]}" ./ "$TARGET/"

if [ "$INCLUDE_ENV" -eq 1 ]; then
  echo ".env.local was included in the copy per --include-env flag. Ensure the target is secure."
else
  echo "Repository copied to $TARGET. Note: .env.local was excluded. Use scripts/sanitize_env_for_github.sh to create .env.public for commit if needed." 
fi

exit 0
