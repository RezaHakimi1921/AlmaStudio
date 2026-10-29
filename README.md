# AlmaStudio — client links

آتلیه آلما — لینک‌های اختصاصی مشتریان با سیستم طراحی یکپارچه (liquid glass + Alma red).

## Start (localhost)

```bash
cd F:/reza/AlmaStudio
npm install
npx next dev -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

### Public links

- `/links/studio-conditions` — شرایط آتلیه آلما (شفافیت و اعتبار)
- `/links/studio-prep` — آمادگی جهت عکاسی (حرفه‌ای و صمیمی)
- `/links/outdoor-conditions` — شرایط فضای باز (طبیعت و اعتماد)
- `/links/outdoor-prep` — آمادگی فضای باز (آرامش و راهنمایی)

Append `?shot=1` to skip intro animation.

### Admin

- URL: `/admin`
- Login: `admin` / `alma123`
- Visual blocks: text / note / price / image / contact (reorder, bold, draft/publish)
- Per-page phone for `tel:` Call button (empty = disabled structure)
- Persistence: `data/content.json`

### Design

- Tokens: Alma red `#A83232`, cream `#F8F3ED`, garden `#58745A`
- Skill: `.cursor/skills/alma-design/SKILL.md`

### Hero upload (admin)

In `/admin/[slug]`, use **آپلود از دستگاه** to save into `public/uploads/` (path written into `heroImageUrl`). URL/path field remains as fallback. Requires login.

### Docker (ready — do not deploy until SSH keys set)

```bash
docker compose build
docker compose up -d
```

Later host: `alma.artepersia.com` → `78.39.51.105`. Volumes persist `data/` and `public/uploads/`.
