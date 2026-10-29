# AlmaStudio — client links

آتلیه آلما — لینک‌های اختصاصی مشتریان.

## Start (localhost)

```bash
cd F:/reza/AlmaStudio
npm install
npx next dev -p 3000
```

## Public URL map

| Path | Page |
|------|------|
| `/` | Home |
| `/fazabaz` | شرایط فضای باز |
| `/amadegi-fazabaz` | آمادگی فضای باز |
| `/amadegi-atelier` | آمادگی جهت عکاسی |
| `/sharaet-alma` | شرایط آتلیه آلما |
| `/admin` | Admin (`admin` / env password) |

Legacy `/links/outdoor-conditions` (etc.) → redirects to short paths.  
`?shot=1` skips intro animation.

## Admin

- Login: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (defaults `admin` / `alma123` locally)
- Simple fields + hero **file upload** → `public/uploads/`
- Persistence: `data/content.json`

## Docker + Caddy (production)

See [deploy/DEPLOY.md](deploy/DEPLOY.md).

```bash
cp .env.example .env   # set ADMIN_PASSWORD, ADMIN_SESSION_SECRET
docker compose build && docker compose up -d
# Edge: PersonalWallet Caddy → alma-studio:3000 (see deploy/Caddyfile.alma.fragment)
```

Host: `alma.artepersia.com` → `78.39.51.105` (SSH port **2238**, user `cluadai`).
