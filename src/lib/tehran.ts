import { FA_MONTHS, isoToJalali } from "./jalali";

/** Date helpers pinned to Tehran time (works the same on server and client). */
const TZ = "Asia/Tehran";

export function tehranDateKey(date = new Date()): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sat: 0,
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
};

/** day index 0 = شنبه … 6 = جمعه, and minutes since midnight, in Tehran */
export function tehranNow(date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: WEEKDAY_TO_INDEX[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export const FA_DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export function toFaDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** "10:00" → "۱۰ صبح", "17:30" → "۵:۳۰ عصر" */
export function faTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const part = h < 12 ? "صبح" : h < 16 ? "ظهر" : h < 19 ? "عصر" : "شب";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${toFaDigits(h12)}${m ? `:${toFaDigits(String(m).padStart(2, "0"))}` : ""} ${part}`;
}

/** Gregorian YYYY-MM-DD → "۸ آبان ۱۴۰۵" (Jalali, Persian digits) */
export function faJalali(dateKey: string, withYear = true) {
  const j = isoToJalali(dateKey);
  if (!j) return "";
  return toFaDigits(`${j.jd} ${FA_MONTHS[j.jm - 1]}${withYear ? ` ${j.jy}` : ""}`);
}

/** "۱۲٬۵۰۰" / "١٢,٥٠٠" / "12500" → 12500 (NaN if no digits) */
export function parseFaNumber(value: string) {
  const latin = value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d]/g, "");
  return latin ? Number(latin) : NaN;
}

/** 4500000 → "۴٬۵۰۰٬۰۰۰" */
export function faMoney(n: number) {
  return toFaDigits(Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "٬"));
}
