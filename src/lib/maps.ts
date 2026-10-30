export type MapAppKey = "balad" | "waze" | "google" | "neshan";

export type MapLink = { key: MapAppKey; label: string; href: string; logo: string };

export type MapSource = {
  mapsUrl: string;
  neshanUrl: string;
  baladUrl: string;
  wazeUrl: string;
  mapCoords: string;
};

type Coords = { lat: number; lng: number };

const valid = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

/** Persian/Arabic digits → ASCII so owners can type coordinates on a Persian keyboard. */
function asciiDigits(s: string) {
  return s
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[٫]/g, ".")
    .replace(/[،]/g, ",");
}

/**
 * Finds coordinates in "35.7, 51.4" or inside a pasted map link
 * (Google `@lat,lng` / `!3d..!4d..` / `q=lat,lng`, Neshan/Balad/Waze `lat=..&lng=..`).
 */
export function parseCoords(input: string): Coords | null {
  const s = asciiDigits(input || "").trim();
  if (!s) return null;
  const tries: RegExp[] = [
    /^(-?\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)$/,
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,
    /[?&](?:q|ll|query|destination|center)=(-?\d{1,3}\.\d+)(?:,|%2C)(-?\d{1,3}\.\d+)/i,
    /[?&](?:lat|latitude)=(-?\d{1,3}(?:\.\d+)?)&(?:lng|lon|longitude)=(-?\d{1,3}(?:\.\d+)?)/i,
  ];
  for (const re of tries) {
    const m = s.match(re);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (valid(lat, lng)) return { lat, lng };
    }
  }
  return null;
}

export const MAP_APPS: { key: MapAppKey; label: string; logo: string }[] = [
  { key: "balad", label: "بلد", logo: "/maps/balad.svg" },
  { key: "waze", label: "ویز", logo: "/maps/waze.svg" },
  { key: "google", label: "گوگل‌مپ", logo: "/maps/google-maps.svg" },
  { key: "neshan", label: "نشان", logo: "/maps/neshan.svg" },
];

const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());

/**
 * The four direction links for one destination. A link typed for an app wins;
 * otherwise it is built from the coordinates (typed, or found in any pasted link).
 */
export function buildMapLinks(src: MapSource): MapLink[] {
  const c =
    parseCoords(src.mapCoords) ??
    parseCoords(src.mapsUrl) ??
    parseCoords(src.neshanUrl) ??
    parseCoords(src.baladUrl) ??
    parseCoords(src.wazeUrl);
  const generated: Record<MapAppKey, string> = c
    ? {
        balad: `https://balad.ir/location?latitude=${c.lat}&longitude=${c.lng}&zoom=16`,
        waze: `https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`,
        google: `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`,
        neshan: `https://nshn.ir/?lat=${c.lat}&lng=${c.lng}`,
      }
    : { balad: "", waze: "", google: "", neshan: "" };
  const typed: Record<MapAppKey, string> = {
    balad: src.baladUrl,
    waze: src.wazeUrl,
    google: src.mapsUrl,
    neshan: src.neshanUrl,
  };
  return MAP_APPS.flatMap((app) => {
    const own = typed[app.key].trim();
    const href = isUrl(own) ? own : generated[app.key];
    return href ? [{ ...app, href }] : [];
  });
}

export const mapEvent = (key: MapAppKey) =>
  (({ balad: "map_balad", waze: "map_waze", google: "map_google", neshan: "map_neshan" }) as const)[key];
