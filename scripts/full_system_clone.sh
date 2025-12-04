#!/usr/bin/env bash
# Full system clone script (dangerous) — use with extreme care.
# This will create an encrypted tarball of `/` and optionally include mounted volumes.
# WARNING: This will include secrets (.env.local, key files) if present. Ensure you encrypt the backup and store it securely.

set -euo pipefail

usage() {
  cat <<EOF
Usage: sudo ./scripts/full_system_clone.sh <TARGET_MOUNT> [--include-mounts]

This script creates an encrypted tarball of / and writes it to the TARGET_MOUNT.
It will explicitly exclude virtual filesystems (/proc,/sys,/dev,/run,/tmp) and the TARGET_MOUNT path to avoid recursion.

You must run this as root (sudo) so file permissions and owners are preserved.
Type the exact confirmation string when prompted to proceed.

Example:
  sudo ./scripts/full_system_clone.sh /Volumes/BackupDrive --include-mounts

EOF
}

if [[ "${1:-}" == "" ]]; then
  usage
  exit 1
fi

TARGET_MOUNT="$1"
INCLUDE_MOUNTS=false
if [[ "${2:-}" == "--include-mounts" ]]; then
  INCLUDE_MOUNTS=true
fi

if [[ "$EUID" -ne 0 ]]; then
  echo "This script must be run as root (sudo)." >&2
  exit 1
fi

if [ ! -d "$TARGET_MOUNT" ]; then
  echo "Target mount $TARGET_MOUNT does not exist. Mount the device first." >&2
  exit 1
fi

if [ ! -w "$TARGET_MOUNT" ]; then
  echo "Target mount $TARGET_MOUNT is not writable. Ensure it's mounted read/write." >&2
  exit 1
fi

TS=$(date -u +%Y%m%dT%H%M%SZ)
OUTFILE="$TARGET_MOUNT/full-system-backup-$TS.tar.enc"

echo "*** WARNING ***"
echo "This operation will create a full archive of / (root) and may include sensitive secrets and keys (for example: /etc, /root, your home directories, and any .env.local files)."
echo "The resulting archive will be encrypted with AES-256 (password-based). Keep the password safe; without it the backup is unrecoverable."
echo
echo "Target: $OUTFILE"
echo "Include mounted volumes: $INCLUDE_MOUNTS"
echo
read -p "Type EXACTLY the following to confirm: I UNDERSTAND THIS BACKUP CONTAINS SECRETS AND I WILL STORE THEM SECURELY: " confirm
if [[ "$confirm" != "I UNDERSTAND THIS BACKUP CONTAINS SECRETS AND I WILL STORE THEM SECURELY" ]]; then
  echo "Confirmation mismatch. Aborting." >&2
  exit 1
fi

echo "Estimating source size (this may take a while)..."
# Exclude the target mount so we don't recurse into destination
EXCLUDES=("$TARGET_MOUNT" "/proc" "/sys" "/dev" "/run" "/tmp")
if ! $INCLUDE_MOUNTS; then
  # Also exclude /Volumes to avoid copying other attached volumes
  EXCLUDES+=("/Volumes")
fi

DU_EXCLUDE_ARGS=()
for e in "${EXCLUDES[@]}"; do
  DU_EXCLUDE_ARGS+=(--exclude="$e")
done

# Compute approximate size in bytes (du -sx gives KB)
source_kb=$(du -skx / "${EXCLUDES[@]}" 2>/dev/null | head -n1 | awk '{print $1}' || true)
if [[ -z "$source_kb" ]]; then
  echo "Failed to estimate source size. Proceeding but ensure target has enough space.";
else
  source_bytes=$((source_kb * 1024))
  avail_kb=$(df -k "$TARGET_MOUNT" | tail -1 | awk '{print $4}')
  avail_bytes=$((avail_kb * 1024))
  echo "Estimated source bytes: $source_bytes, target available bytes: $avail_bytes"
  if [ "$avail_bytes" -lt "$source_bytes" ]; then
    echo "Target does not appear to have enough space. Free space or choose another device." >&2
    read -p "Proceed anyway? [y/N] " proceed
    if [[ ! "$proceed" =~ ^[Yy]$ ]]; then
      echo "Aborted."; exit 1
    fi
  fi
fi

echo "Choose an encryption passphrase. Keep it secure."
read -s -p "Passphrase: " PASSPHRASE
echo
read -s -p "Confirm passphrase: " PASSPHRASE2
echo
if [[ "$PASSPHRASE" != "$PASSPHRASE2" ]]; then
  echo "Passphrases do not match. Aborting." >&2; exit 1
fi

echo "Starting backup and encryption. This may take a long time."

# Build tar exclude args
TAR_EXCLUDE_ARGS=()
for e in "${EXCLUDES[@]}"; do
  TAR_EXCLUDE_ARGS+=(--exclude="$e")
done

# Run tar and encrypt via OpenSSL AES-256-CBC with PBKDF2
set -o pipefail
tar --preserve-permissions --one-file-system=false -cpPf - / "${TAR_EXCLUDE_ARGS[@]}" 2>/dev/null \
  | openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 -pass pass:"$PASSPHRASE" -out "$OUTFILE"

chmod 600 "$OUTFILE"

echo "Backup complete: $OUTFILE"
echo "IMPORTANT: Verify and store passphrase securely. Consider moving this archive to an encrypted cloud bucket (S3) and rotate keys regularly."
