---
name: alma-design
description: AlmaStudio visual and content system for client links and admin. Use for any AlmaStudio UI, link page, or admin editor work.
---

# AlmaStudio design skill

## Brand

- Name: آتلیه آلما (Alma Studio). Alma = apple.
- Logo/favicon: apple-inspired mark only — never generic N / Next.js badge.
- Palette: Alma red `#A83232`, warm cream `#F8F3ED`, garden green `#58745A`.
- Feel: warm, welcoming, professional-intimate. RTL Persian.
- Visual bar: premium photography-studio vibe (reference feel — not copy — of Studio Sky / Artepersia soft cinematic splash).

## Layout system

- One shared shell; four themed experiences.
- **Heroes:** full-bleed **real photography** (stock OK if modest / hijab-preferring; no cartoon, stick figures, geometric people, or low-fi SVG landscapes).
- **Intro:** short cinematic motion on the hero photo (Ken Burns / soft veil / brand reveal) then content — intentional, premium; respect `prefers-reduced-motion` and `?shot=1`.
- Liquid glass on hero title card, floating CTAs, soft content cards — not on dense legal/rule text (cream solid `#F8F3ED`, high contrast).
- Fully responsive public + admin. Vazirmatn.

## Four links

1. `outdoor-conditions` — طبیعت و اعتماد — garden family photography
2. `outdoor-prep` — آرامش و راهنمایی — garden path / morning light
3. `studio-prep` — حرفه‌ای و صمیمی — studio atmosphere
4. `studio-conditions` — شفافیت و اعتبار — newborn / maternity sets + booking rules

## Imagery

- All hero images admin-replaceable (URL).
- No nude/revealing women; prefer hijab / head covering when women appear.
- Prefer real Alma photos when provided.

## Content & CTAs

- **Simple page fields** (no block-builder): title, subtitle, mood, hero URL, phone, Instagram, maps, rich body (HTML + bold), optional packages text, optional notes text, address, closing.
- Per-link phone; Call uses `tel:` — empty phone shows disabled placeholder UI.
- Instagram / Maps CTAs where relevant.

## Admin

- Login: `admin` / `alma123` (local default).
- Simple form — one rich textarea with Bold helper; plain packages/notes fields. Not many block types to assemble.
- Draft/publish toggle OK.

## Anti-patterns

- Empty large red gradient heroes without photography
- Cartoon / stick-figure / geometric people intros
- Glass blur that makes rule text unreadable
- Complex block builders for editors
- Hardcoded images that cannot be swapped in admin
- Next.js floating “N” badge in review screenshots
