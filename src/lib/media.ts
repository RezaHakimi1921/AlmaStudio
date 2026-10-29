/**
 * Normalize stored / pasted media paths so upload, preview, and public pages agree.
 * Fixes trailing slashes, backslashes, duplicate slashes, and accidental whitespace.
 */
export function normalizeMediaUrl(raw: string): string {
  let s = (raw ?? "").trim().replace(/^['"]+|['"]+$/g, "");
  if (!s) return "";

  s = s.replace(/\\/g, "/");

  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      let path = u.pathname.replace(/\/{2,}/g, "/");
      if (path.length > 1) path = path.replace(/\/+$/, "");
      u.pathname = path || "/";
      return u.toString();
    } catch {
      return s.replace(/\/+$/, "");
    }
  }

  if (s.startsWith("data:")) return s;

  // site-relative path
  s = s.replace(/^\/+/, "/");
  if (!s.startsWith("/")) s = `/${s}`;
  s = s.replace(/\/{2,}/g, "/");
  if (s.length > 1) s = s.replace(/\/+$/, "");
  return s;
}

/** Preview URL; optional bust so a replaced upload shows immediately. */
export function mediaPreviewSrc(url: string, bust?: number | string): string {
  const clean = normalizeMediaUrl(url);
  if (!clean || clean.startsWith("data:") || !bust) return clean;
  const join = clean.includes("?") ? "&" : "?";
  return `${clean}${join}v=${encodeURIComponent(String(bust))}`;
}
