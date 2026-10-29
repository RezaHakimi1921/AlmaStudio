/** Traffic sources ("?src=insta") — which channel brought the visit. */
export const SOURCE_RE = /^[a-z0-9_-]{1,24}$/;

export const KNOWN_SOURCES: Record<string, string> = {
  insta: "اینستاگرام",
  bale: "بله",
  sms: "پیامک",
  whatsapp: "واتس‌اپ",
  telegram: "تلگرام",
  eitaa: "ایتا",
  rubika: "روبیکا",
  hamrah: "ارسال برای همراه",
  card: "کارت ویزیت / چاپی",
  direct: "مستقیم / نامشخص",
  other: "سایر",
};

export function normalizeSource(value: unknown): string {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return "direct";
  return SOURCE_RE.test(v) ? v : "other";
}

export function sourceLabel(src: string) {
  return KNOWN_SOURCES[src] ?? src;
}
