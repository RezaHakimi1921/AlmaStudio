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

## Compose how-to (on server)

```bash
cd /opt
git clone https://github.com/RezaHakimi1921/AlmaStudio.git
cd AlmaStudio
git checkout cursor/client-links-localhost-eb59   # or main after merge

cp .env.example .env
nano .env   # set ADMIN_PASSWORD + ADMIN_SESSION_SECRET

docker compose build
docker compose up -d

cp deploy/nginx-alma.artepersia.com.conf /etc/nginx/sites-available/alma.artepersia.com
ln -sf /etc/nginx/sites-available/alma.artepersia.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# After DNS A record:
certbot --nginx -d alma.artepersia.com
```

```bash
# updates
cd /opt/AlmaStudio && git pull && docker compose build && docker compose up -d
```

Volumes `alma_data` / `alma_uploads` persist content and uploads.
