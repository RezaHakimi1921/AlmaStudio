import type { LinkSlug } from "./types";

/** Short public paths (Persian-friendly) → internal content slug */
export const PUBLIC_PATH_BY_SLUG: Record<LinkSlug, string> = {
  "outdoor-conditions": "fazabaz",
  "outdoor-prep": "amadegi-fazabaz",
  "studio-prep": "amadegi-atelier",
  "studio-conditions": "sharaet-alma",
};

export const SLUG_BY_PUBLIC_PATH: Record<string, LinkSlug> = Object.fromEntries(
  Object.entries(PUBLIC_PATH_BY_SLUG).map(([slug, path]) => [path, slug as LinkSlug]),
) as Record<string, LinkSlug>;

export function publicPathForSlug(slug: string): string {
  const path = PUBLIC_PATH_BY_SLUG[slug as LinkSlug];
  return path ? `/${path}` : `/links/${slug}`;
}

/** Paths we allow as «بازگشت» targets (no open redirects). */
const ALLOWED_BACK_HREFS = new Set<string>([
  "/",
  ...Object.values(PUBLIC_PATH_BY_SLUG).map((p) => `/${p}`),
  ...Object.keys(PUBLIC_PATH_BY_SLUG).map((s) => `/links/${s}`),
]);

/** Resolve `?from=` for gallery/decor back buttons; falls back to hub. */
export function safeBackHref(from: string | string[] | undefined | null, fallback = "/"): string {
  const raw = Array.isArray(from) ? from[0] : from;
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return fallback;
  }
  const path = trimmed.split(/[?#]/)[0] ?? "";
  return ALLOWED_BACK_HREFS.has(path) ? path : fallback;
}

/** Append `from` so nested pages can return to the originating link. */
export function withFromParam(href: string, from: string): string {
  const q = new URLSearchParams();
  q.set("from", from);
  return `${href}?${q.toString()}`;
}
