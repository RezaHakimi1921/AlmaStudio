#!/usr/bin/env bash
# One-time HTTPS setup for alma.artepersia.com (Ubuntu/Debian + nginx).
# Run on the server as root from the repo folder:
#   sudo bash deploy/setup-https.sh you@example.com
#
# What it does:
#   1. installs certbot
#   2. serves a temporary HTTP-only site so Let's Encrypt can verify the domain
#   3. gets the certificate (webroot method — no downtime)
#   4. installs the final HTTPS nginx config (deploy/nginx-alma.artepersia.com.conf)
#   5. makes renewals reload nginx automatically (certbot's timer renews every ~60 days)
set -euo pipefail

DOMAIN="alma.artepersia.com"
EMAIL="${1:-}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE="/etc/nginx/sites-available/${DOMAIN}"
WEBROOT="/var/www/certbot"

if [[ $EUID -ne 0 ]]; then echo "Run as root (sudo)." >&2; exit 1; fi
if [[ -z "$EMAIL" ]]; then echo "Usage: sudo bash deploy/setup-https.sh you@example.com" >&2; exit 1; fi

echo "▸ Installing certbot…"
apt-get update -y
apt-get install -y certbot

mkdir -p "$WEBROOT"

if [[ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
  echo "▸ Temporary HTTP config for domain verification…"
  cat > "$SITE" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    location ^~ /.well-known/acme-challenge/ { root ${WEBROOT}; default_type "text/plain"; }
    location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host \$host; }
}
NGINX
  ln -sf "$SITE" "/etc/nginx/sites-enabled/${DOMAIN}"
  nginx -t && systemctl reload nginx

  echo "▸ Requesting certificate…"
  certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email -n
else
  echo "▸ Certificate already exists — skipping request."
fi

echo "▸ Installing final HTTPS config…"
cp "${REPO_DIR}/deploy/nginx-alma.artepersia.com.conf" "$SITE"
ln -sf "$SITE" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t && systemctl reload nginx

echo "▸ Auto-reload nginx after each renewal…"
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'HOOK'
#!/bin/sh
systemctl reload nginx
HOOK
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo "▸ Testing renewal (dry run)…"
certbot renew --dry-run || echo "⚠ dry-run failed — check port 80 is reachable from outside"

echo "✓ Done: https://${DOMAIN}"
