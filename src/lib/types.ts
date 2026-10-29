export type IntroTheme =
  | "outdoor-conditions"
  | "outdoor-prep"
  | "studio-prep"
  | "studio-conditions";

/** Simplified page model — no block builder */
export type LinkPageContent = {
  slug: string;
  title: string;
  subtitle: string;
  moodTag: string;
  brandLabel: string;
  heroImageUrl: string;
  introTheme: IntroTheme;
  introLabel: string;
  phone: string;
  /** Main rich body — HTML with optional <b>/<strong>/<br>/<p> */
  bodyHtml: string;
  /** Optional packages / pricing plain text (line breaks OK) */
  packagesText: string;
  /** Optional notes / rules plain text */
  notesText: string;
  closingMessage: string;
  addressTitle: string;
  address: string;
  instagramUrl: string;
  mapsUrl: string;
  /** Neshan map link (e.g. https://nshn.ir/…) — optional */
  neshanUrl: string;
  /** Bale messenger link (e.g. https://ble.ir/username) — optional */
  baleUrl: string;
  showInstagram: boolean;
  showMaps: boolean;
  showNeshan: boolean;
  showBale: boolean;
  published: boolean;
};

export type SiteContent = {
  pages: LinkPageContent[];
};

export const LINK_SLUGS = [
  "outdoor-conditions",
  "outdoor-prep",
  "studio-prep",
  "studio-conditions",
] as const;

export type LinkSlug = (typeof LINK_SLUGS)[number];
