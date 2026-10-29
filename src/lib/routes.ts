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
