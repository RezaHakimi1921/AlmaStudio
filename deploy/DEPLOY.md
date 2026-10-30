# Deploy AlmaStudio → alma.artepersia.com (78.39.51.105)

## Public URL map

| Path | Page |
|------|------|
| `https://alma.artepersia.com/` | Home (list of links) |
| `https://alma.artepersia.com/fazabaz` | شرایط فضای باز |
| `https://alma.artepersia.com/amadegi-fazabaz` | آمادگی فضای باز |
| `https://alma.artepersia.com/amadegi-atelier` | آمادگی جهت عکاسی |
| `https://alma.artepersia.com/sharaet-alma` | شرایط آتلیه آلما |
| `https://alma.artepersia.com/nemoone-kar` | نمونه‌کارها |
| `https://alma.artepersia.com/dekor` | دکورهای آتلیه |
| `https://alma.artepersia.com/admin` | Admin |

Legacy `/links/...` redirects to the short paths.

## 1. App (Docker)

```bash
cd /opt
git clone https://github.com/RezaHakimi1921/AlmaStudio.git
cd AlmaStudio
git checkout design            # or main after merge

cp .env.example .env
nano .env   # ADMIN_PASSWORD (strong!), ADMIN_SESSION_SECRET (long random), SITE_URL

docker compose build
docker compose up -d
```

## Auto deploy (push to `main` → live in ~2 minutes)

One time, on the server:

```bash
cd /opt/AlmaStudio
git fetch origin && git checkout -f -B main origin/main
sudo bash deploy/auto-deploy.sh --install
```

From then on the server checks GitHub every 2 minutes. When `main` has a new commit it:

1. takes a backup (`deploy/backup.sh`),
2. checks out the new commit and runs `docker compose build && docker compose up -d`,
3. waits until `/api/health` reports the new commit,
4. **rolls back automatically** to the previous commit if the build or the health check fails
   (that broken commit is then skipped until a newer one is pushed).

Nobody needs SSH access and no secrets leave the server (it only *pulls* from GitHub).
`.env` and the Docker volumes (content, photos, stats) are never touched.

```bash
sudo bash deploy/auto-deploy.sh --status     # timer, deployed commit, health, last log lines
sudo bash deploy/auto-deploy.sh              # deploy right now instead of waiting
tail -f /var/log/alma-deploy.log
sudo bash deploy/auto-deploy.sh --uninstall
```

The running version is shown at the bottom of the admin panel («نسخه abc1234») and at `/api/health`.

> Don't edit tracked files directly on the server — the next deploy parks such edits in `git stash`
> (logged as a warning). Change them in the repo instead.

## 2. HTTPS (one time)

DNS A record `alma.artepersia.com → 78.39.51.105` must exist and port 80/443 must be open.

```bash
sudo bash deploy/setup-https.sh you@example.com
```

The script installs certbot, verifies the domain over HTTP, gets a Let's Encrypt certificate, installs
`deploy/nginx-alma.artepersia.com.conf` (HTTP → HTTPS redirect, HSTS, 30 MB upload limit) and makes
renewals reload nginx automatically.

> **Why it matters:** the admin login cookie is `Secure` in production, so **the admin panel only
> works over HTTPS**. Phones' share sheet («ارسال برای همراه») also needs HTTPS.
>
> If Let's Encrypt cannot reach the server (international traffic to Iranian IPs is sometimes
> filtered), use a DNS challenge instead: `certbot certonly --manual --preferred-challenges dns -d alma.artepersia.com`,
> then run the script again — it skips the request when a certificate already exists.

## 3. Backups

```bash
sudo bash deploy/backup.sh                 # backup now → /opt/alma-backups/alma-1405-08-08_0330.tar.gz
sudo bash deploy/backup.sh --install-cron  # every night 03:30, keeps 14 days
sudo bash deploy/restore.sh /opt/alma-backups/alma-….tar.gz   # restore (takes a safety backup first)
```

A backup contains `data/` (pages, settings, packages, decors, FAQ, stats) and `public/uploads/` (all photos).
Admins can also download one any time from the panel: **«دانلود پشتیبان»**.
Copy a backup off the server now and then (e.g. weekly download from the panel).

## SSH

```bash
ssh -p 2238 -i ~/.ssh/arte_service_deploy -o IdentitiesOnly=yes cluadai@78.39.51.105
```

Port **2238** (not 22). App lives in `~/alma-studio`. Edge reverse proxy is **Caddy**
(`personalwallet-caddy-1`); the Alma container must stay on Docker network `personalwallet_default`
(see `docker-compose.yml` `networks.edge`).

## Updates

```bash
cd ~/alma-studio && git pull origin main && docker compose build && docker compose up -d
```

Volumes `alma_data` / `alma_uploads` persist content and uploads across rebuilds.
