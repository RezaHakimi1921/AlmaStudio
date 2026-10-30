import type { LinkPageContent, StudioInfo } from "./types";
import { STUDIO_FIELDS } from "./types";

/** A link page with every empty contact field filled from the studio info. */
export function withStudio(page: LinkPageContent, studio: StudioInfo): LinkPageContent {
  const out = { ...page };
  for (const f of STUDIO_FIELDS) {
    if (!out[f].trim()) out[f] = studio[f];
  }
  if (!out.showAddress) out.address = "";
  return out;
}

export type MapLink = { key: string; label: string; href: string };

/** Map buttons for pages that are not link pages (gallery, decor). */
export function studioMaps(studio: StudioInfo): MapLink[] {
  return [
    studio.neshanUrl ? { key: "neshan", label: "نشان", href: studio.neshanUrl } : null,
    studio.mapsUrl ? { key: "google", label: "گوگل‌مپ", href: studio.mapsUrl } : null,
  ].filter((m): m is MapLink => m !== null);
}
