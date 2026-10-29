#!/usr/bin/env bash
# Daily backup of AlmaStudio data: page content + settings, stats and all uploaded photos.
#
#   sudo bash deploy/backup.sh                 # make a backup now
#   sudo bash deploy/backup.sh --install-cron  # run it every night at 03:30 (server time)
#
# Backups land in $BACKUP_DIR (default /opt/alma-backups), named with the شمسی date,
# e.g. alma-1405-08-08_0330.tar.gz. The last $KEEP_DAYS days are kept.
# Restore: sudo bash deploy/restore.sh /opt/alma-backups/alma-….tar.gz
set -euo pipefail

CONTAINER="${CONTAINER:-alma-studio}"
BACKUP_DIR="${BACKUP_DIR:-/opt/alma-backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
SCRIPT="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"

if [[ "${1:-}" == "--install-cron" ]]; then
  LINE="30 3 * * * bash ${SCRIPT} >> /var/log/alma-backup.log 2>&1"
  ( crontab -l 2>/dev/null | grep -v "deploy/backup.sh" ; echo "$LINE" ) | crontab -
  echo "✓ Nightly backup installed (03:30 server time). Log: /var/log/alma-backup.log"
  exit 0
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# شمسی date for the file name (the container's Node has the Persian calendar)
STAMP="$(docker exec "$CONTAINER" node -e '
  const p = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn",{timeZone:"Asia/Tehran",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  process.stdout.write(`${g("year").split(" ")[0]}-${g("month")}-${g("day")}_${g("hour")}${g("minute")}`);
')"
FILE="${BACKUP_DIR}/alma-${STAMP}.tar.gz"

# Stream a tar straight out of the running container (no volume names needed)
docker exec "$CONTAINER" tar -czf - -C /app data public/uploads > "${FILE}.part"
mv "${FILE}.part" "$FILE"

# sanity check: archive must be readable and contain content.json
tar -tzf "$FILE" | grep -q "data/content.json" || { echo "✗ backup looks broken: $FILE" >&2; exit 1; }

find "$BACKUP_DIR" -name 'alma-*.tar.gz' -mtime +"$KEEP_DAYS" -delete
echo "✓ $(date '+%F %T') backup: $FILE ($(du -h "$FILE" | cut -f1))"
