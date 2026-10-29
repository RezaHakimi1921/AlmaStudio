---
name: alma-design
description: AlmaStudio visual and content system for client links and admin. Use for any AlmaStudio UI, link page, or admin editor work.
---

# AlmaStudio design skill

## Brand

- Name: آتلیه آلما (Alma Studio). Alma = apple.
- Logo/favicon: apple-inspired mark only — never generic N.
- Palette: Alma red `#A83232`, warm cream `#F8F3ED`, garden green `#58745A`.
- Feel: warm, welcoming, professional-intimate. RTL Persian.

## Layout system

- One shared shell; four themed experiences (not four unrelated sites).
- Liquid glass on hero photos, info cards, floating CTAs — not on dense legal/rule text (keep high contrast).
- Fully responsive public pages and admin (phone-usable).
- Soft corners, consistent spacing, readable Persian type (e.g. Vazirmatn).

## Four links

1. `outdoor-conditions` — طبیعت و اعتماد — garden family photography, green + gold + Alma red, glass rule cards.
2. `outdoor-prep` — آرامش و راهنمایی — garden path / morning light, checklist, punctuality.
3. `studio-prep` — حرفه‌ای و صمیمی — studio entry/lights, practical guide.
4. `studio-conditions` — شفافیت و اعتبار — Alma apple + red; maternity/newborn sets; booking/payment rules.

## Imagery

- All hero/block images admin-replaceable (URL or upload).
- Placeholder images OK now; must follow: no nude/revealing women; prefer hijab/head covering on women.
- Prefer real Alma photos when provided later.

## Content & CTAs

- Structured blocks in data (text, note, price, image, contact) — never raw `paragraph | |` syntax for editors.
- Per-link editable phone; Call button uses `tel:` — empty phone hides or shows placeholder until set.
- Instagram / Maps CTAs where relevant.

## Admin

- Login: `admin` / `alma123` (local default).
- Visual block editor: add/reorder/edit/delete; simple bold; draft/publish if feasible.
- Per page: slug, title, hero image, phone, blocks.

## Build order

1. شرایط آتلیه آلما as template
2. Shared components (header, hero, glass card, price, contact, footer)
3. آمادگی آتلیه
4. Two outdoor pages
5. Wire admin + mobile/desktop QA + localhost screenshots

## Anti-patterns

- Empty large red gradient heroes without photography
- Glass blur that makes rule text unreadable
- Non-responsive admin
- Hardcoded images that cannot be swapped in admin
