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
| `/nemoone-kar` | نمونه‌کارها (بارداری · نوزاد · کودک) |
| `/admin` | Admin (`admin` / env password) |
| `/admin/settings` | نوار اطلاعیه، ساعات پذیرش، سوالات متداول |
| `/admin/gallery` | مدیریت نمونه‌کارها |
| `/admin/stats` | آمار بازدید و کلیک (بدون اطلاعات شخصی) |

Legacy `/links/outdoor-conditions` (etc.) → redirects to short paths.  
`?shot=1` skips intro animation.

## Admin

- Login: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (defaults `admin` / `alma123` locally)
- Simple fields + hero **file upload** → `public/uploads/`
- Persistence: `data/content.json` (pages + site settings), `data/stats.json` (anonymous daily counters)
- Uploaded files are served by `src/app/uploads/[name]/route.ts` (Next only serves `public/` files that existed at build time)
- Font: Vazirmatn is self-hosted (`src/app/fonts`, OFL) — builds work offline
- `SITE_URL` env sets the absolute address used in link previews (og:image)

## Docker + nginx (production)

See [deploy/DEPLOY.md](deploy/DEPLOY.md).

```bash
cp .env.example .env   # set ADMIN_PASSWORD, ADMIN_SESSION_SECRET
docker compose build && docker compose up -d
# nginx: deploy/nginx-alma.artepersia.com.conf → alma.artepersia.com → 127.0.0.1:3000
```

Host: `alma.artepersia.com` → `78.39.51.105`.
