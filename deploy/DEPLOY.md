# Deploy AlmaStudio → alma.artepersia.com (78.39.51.105)

## Public URL map

| Path | Page |
|------|------|
| `https://alma.artepersia.com/` | Home (list of links) |
| `https://alma.artepersia.com/fazabaz` | شرایط فضای باز |
| `https://alma.artepersia.com/amadegi-fazabaz` | آمادگی فضای باز |
| `https://alma.artepersia.com/amadegi-atelier` | آمادگی جهت عکاسی |
| `https://alma.artepersia.com/sharaet-alma` | شرایط آتلیه آلما |
| `https://alma.artepersia.com/admin` | Admin |

Legacy `/links/...` redirects to the short paths.

## SSH

```bash
ssh -p 2238 -i ~/.ssh/arte_service_deploy -o IdentitiesOnly=yes cluadai@78.39.51.105
```

Port **2238** (not 22). Edge reverse proxy is **Caddy** (`personalwallet-caddy-1`), not host nginx.
The Alma container joins Docker network `personalwallet_default` as alias `alma-studio`.

## Compose how-to (on server)

```bash
cd ~
git clone https://github.com/RezaHakimi1921/AlmaStudio.git alma-studio
cd alma-studio
git checkout cursor/alma-caddy-deploy-eb59   # or main after merge

cp .env.example .env
# set ADMIN_PASSWORD + ADMIN_SESSION_SECRET (openssl rand -hex 32)

docker compose build
docker compose up -d

# Edge Caddy — append fragment once
grep -q 'alma.artepersia.com' /home/personalwallet/personalwallet/Caddyfile \
  || cat deploy/Caddyfile.alma.fragment >> /home/personalwallet/personalwallet/Caddyfile
docker exec personalwallet-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```

```bash
# updates
cd ~/alma-studio && git pull && docker compose build && docker compose up -d
```

Volumes `alma_data` / `alma_uploads` persist content and uploads.

## Notes

- DNS A record `alma.artepersia.com` → `78.39.51.105` (already live).
- `deploy/nginx-alma.artepersia.com.conf` is optional/legacy; this host uses Caddy.
- Root key `alma_deploy_ed25519` is not required when using `cluadai` + `arte_service_deploy`.
