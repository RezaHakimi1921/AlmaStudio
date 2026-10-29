#!/usr/bin/env bash
# Restore an AlmaStudio backup into the running container.
#   sudo bash deploy/restore.sh /opt/alma-backups/alma-1405-08-08_0330.tar.gz
# A safety backup of the current state is taken first.
set -euo pipefail

CONTAINER="${CONTAINER:-alma-studio}"
ARCHIVE="${1:-}"
if [[ -z "$ARCHIVE" || ! -f "$ARCHIVE" ]]; then
  echo "Usage: sudo bash deploy/restore.sh <backup.tar.gz>" >&2
  exit 1
fi
tar -tzf "$ARCHIVE" | grep -q "data/content.json" || { echo "✗ not an Alma backup: $ARCHIVE" >&2; exit 1; }

echo "▸ Safety backup of the current state…"
bash "$(dirname "$0")/backup.sh"

echo "▸ Restoring $ARCHIVE …"
docker exec -i "$CONTAINER" sh -c 'rm -rf /app/data/* /app/public/uploads/* && tar -xzf - -C /app' < "$ARCHIVE"
docker restart "$CONTAINER" >/dev/null
echo "✓ Restored and restarted $CONTAINER"
