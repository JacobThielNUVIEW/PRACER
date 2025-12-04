#!/usr/bin/env bash
set -euo pipefail

TARGET_MOUNT="/Volumes/BackupDrive" # update if different
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_MOUNT"

if [ ! -d "$TARGET_MOUNT" ]; then
  echo "Target mount $TARGET_MOUNT does not exist. Please mount the device and re-run." >&2
  exit 1
fi

# Check writability
if [ ! -w "$TARGET_MOUNT" ]; then
  echo "Target $TARGET_MOUNT is not writable. Mount with write permissions or run as a user with access." >&2
  exit 1
fi

# Check available space
avail_kb=$(df -k "$TARGET_MOUNT" | tail -1 | awk '{print $4}')
avail_bytes=$((avail_kb * 1024))
echo "Available bytes on target: $avail_bytes"

# Check source size
source_kb=$(du -sk "$SOURCE_DIR" | awk '{print $1}')
source_bytes=$((source_kb * 1024))
echo "Source size bytes: $source_bytes"

if [ "$avail_bytes" -lt "$source_bytes" ]; then
  echo "Not enough space on target. Free space or choose another device." >&2
  exit 1
fi

read -p "This will rsync the repository to $TARGET_MOUNT (preserve permissions, exclude node_modules). Proceed? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborted by user."; exit 0
fi

DEST="$TARGET_MOUNT/racelay-backup-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST"

echo "Starting rsync..."
rsync -aAX --exclude='node_modules' --exclude='.git' --exclude='supabase/.temp' --delete "$SOURCE_DIR/" "$DEST/"

echo "Clone complete: $DEST"
