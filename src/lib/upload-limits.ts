/** Shared by the upload API and the admin UI so the message always matches the rule. */
export const MAX_UPLOAD_MB = 25;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export type UploadPurpose = "hero" | "gallery" | "decor";

/** Longest edge after optimisation — plenty for phone screens, tiny on mobile data. */
export const MAX_EDGE: Record<UploadPurpose, number> = {
  hero: 2400,
  gallery: 2000,
  decor: 1600,
};

export function faBytes(bytes: number) {
  const fa = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]).replace(".", "٫");
  if (bytes >= 1024 * 1024) return `${fa((bytes / 1024 / 1024).toFixed(1))} مگابایت`;
  return `${fa(String(Math.max(1, Math.round(bytes / 1024))))} کیلوبایت`;
}
