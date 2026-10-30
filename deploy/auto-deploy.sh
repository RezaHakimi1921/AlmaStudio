#!/usr/bin/env bash
# Pull-based auto deploy for AlmaStudio.
#
# The server checks GitHub every 2 minutes; when the `main` branch has a new
# commit it backs up, rebuilds and restarts the container. If the new version
# does not become healthy, it rolls back to the previous commit automatically.
# Nobody needs SSH access to the server, and no secrets leave it.
#
#   sudo bash deploy/auto-deploy.sh --install   # one time: install the systemd timer
#   sudo bash deploy/auto-deploy.sh             # check & deploy now (what the timer runs)
#   sudo bash deploy/auto-deploy.sh --status    # last deploys + timer state
#   sudo bash deploy/auto-deploy.sh --uninstall
#
# Settings (env or /etc/default/alma-deploy): BRANCH (main), REPO_DIR (this repo).
set -euo pipefail

[[ -f /etc/default/alma-deploy ]] && source /etc/default/alma-deploy
BRANCH="${BRANCH:-main}"
REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
LOG="${LOG:-/var/log/alma-deploy.log}"
LOCK="${LOCK:-/run/alma-deploy.lock}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/api/health}"

log() { echo "$(date '+%F %T') $*" | tee -a "$LOG"; }

case "${1:-}" in
  --install)
    [[ $EUID -eq 0 ]] || { echo "Run as root (sudo)." >&2; exit 1; }
    cat > /etc/systemd/system/alma-deploy.service <<UNIT
[Unit]
Description=AlmaStudio auto deploy (pull ${BRANCH} from GitHub)
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/env bash ${REPO_DIR}/deploy/auto-deploy.sh
UNIT
    cat > /etc/systemd/system/alma-deploy.timer <<UNIT
[Unit]
Description=Check GitHub for AlmaStudio updates every 2 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=2min
RandomizedDelaySec=15s

[Install]
WantedBy=timers.target
UNIT
    systemctl daemon-reload
    systemctl enable --now alma-deploy.timer
    echo "✓ Auto deploy installed: every 2 min, branch '${BRANCH}', repo ${REPO_DIR}"
    echo "  Log: ${LOG}   Status: sudo bash deploy/auto-deploy.sh --status"
    exit 0
    ;;
  --uninstall)
    systemctl disable --now alma-deploy.timer 2>/dev/null || true
    rm -f /etc/systemd/system/alma-deploy.{service,timer}
    systemctl daemon-reload
    echo "✓ Auto deploy removed"
    exit 0
    ;;
  --status)
    systemctl list-timers alma-deploy.timer --no-pager 2>/dev/null || true
    echo "--- deployed: $(git -C "$REPO_DIR" log -1 --format='%h %s (%cr)')"
    echo "--- health:   $(curl -fsS -m 5 "$HEALTH_URL" 2>/dev/null || echo 'not responding')"
    echo "--- last log lines:"
    tail -n 15 "$LOG" 2>/dev/null || echo "(no log yet)"
    exit 0
    ;;
esac

exec 9>"$LOCK"
flock -n 9 || exit 0 # a deploy is already running

cd "$REPO_DIR"
git config --global --get-all safe.directory 2>/dev/null | grep -qxF "$REPO_DIR" \
  || git config --global --add safe.directory "$REPO_DIR" 2>/dev/null || true

if ! git fetch --quiet origin "$BRANCH" 2>>"$LOG"; then
  log "⚠ could not reach GitHub — will retry"
  exit 0
fi

CURRENT="$(git rev-parse HEAD)"
TARGET="$(git rev-parse "origin/${BRANCH}")"
[[ "$CURRENT" == "$TARGET" ]] && exit 0
# a commit that already failed is skipped until a newer one is pushed
[[ "$(git rev-parse -q --verify refs/alma/bad || true)" == "$TARGET" ]] && exit 0

log "▸ new version ${TARGET:0:7} ($(git log -1 --format=%s "$TARGET")) — current ${CURRENT:0:7}"

# safety backup of content + photos before anything changes
bash deploy/backup.sh >>"$LOG" 2>&1 || log "⚠ backup failed — continuing"

build_and_start() {
  export GIT_SHA
  GIT_SHA="$(git rev-parse --short HEAD)"
  # 9>&- : long-running children must not inherit (and hold) the deploy lock
  docker compose build >>"$LOG" 2>&1 9>&- && docker compose up -d >>"$LOG" 2>&1 9>&-
}

# new version: /api/health must report the new commit
healthy() {
  for _ in $(seq 1 "${HEALTH_TRIES:-30}"); do
    if curl -fsS -m 4 "$HEALTH_URL" 2>/dev/null | grep -Eq "\"sha\": ?\"$(git rev-parse --short HEAD)\""; then
      return 0
    fi
    sleep "${HEALTH_WAIT:-4}"
  done
  return 1
}

# rollback: older versions may not have /api/health — the home page answering is enough
alive() {
  for _ in $(seq 1 "${HEALTH_TRIES:-30}"); do
    curl -fsS -m 4 -o /dev/null http://127.0.0.1:3000/ 2>/dev/null && return 0
    sleep "${HEALTH_WAIT:-4}"
  done
  return 1
}

# hand-made edits to tracked files on the server would block the update: park them
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  git stash push --quiet -m "auto-deploy $(date +%F_%T): local server edits" \
    && log "⚠ local edits on the server were stashed (see: git stash list)"
fi

git checkout --quiet -f -B "$BRANCH" "$TARGET"
if build_and_start && healthy; then
  log "✓ deployed ${TARGET:0:7}"
  docker image prune -f >/dev/null 2>&1 || true
  exit 0
fi

log "✗ ${TARGET:0:7} failed (build or health check) — rolling back to ${CURRENT:0:7}"
git checkout --quiet -f -B "$BRANCH" "$CURRENT"
if build_and_start && alive; then
  log "↩ rolled back to ${CURRENT:0:7}; will not retry ${TARGET:0:7} until a newer commit arrives"
else
  log "✗✗ rollback also failed — check: docker compose logs --tail=100"
fi
# remember the bad commit so the timer doesn't rebuild it every 2 minutes
git update-ref refs/alma/bad "$TARGET"
exit 1
