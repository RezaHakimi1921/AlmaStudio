<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules — آتلیه آلما

### Calendar & numbers (تقویم و اعداد)
- **Every date a person sees or picks is شمسی (Jalali) and in Persian** — public pages *and* admin.
  Never show a Gregorian date, an English month name, or a browser `<input type="date">` / `<input type="time">`
  (those render in the browser's locale, e.g. `mm/dd/yyyy`, `AM/PM`).
- Use `JalaliDatePicker` / `PersianTimeSelect` (`src/components/JalaliDatePicker.tsx`) for input,
  and `faJalali()`, `faTime()`, `toFaDigits()` (`src/lib/tehran.ts`) for display.
- Week starts on **شنبه**; day index `0 = شنبه … 6 = جمعه`. Times are 24h, Tehran time (`Asia/Tehran`).
- Storage stays machine-friendly: dates are saved as Gregorian ISO `YYYY-MM-DD` (Tehran day) so they sort
  and compare simply; conversion lives in `src/lib/jalali.ts` (tested against `Intl` persian calendar).
- All user-facing digits are Persian (۰۱۲۳۴۵۶۷۸۹); prices use `٬` thousands separators and «تومان».

### Language & direction
- UI copy is Persian, `dir="rtl"`. Phone numbers, URLs and code stay `dir="ltr"`.

### Privacy
- Click stats are anonymous counters only — no IP, cookie or personal data is stored.
