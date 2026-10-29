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
  showInstagram: boolean;
  showMaps: boolean;
  published: boolean;
};

/** Home hub (`/`) — hero + glass title/subtitle, admin-editable */
export type HubContent = {
  title: string;
  subtitle: string;
  heroImageUrl: string;
};

export type SiteContent = {
  hub: HubContent;
  pages: LinkPageContent[];
};

export const LINK_SLUGS = [
  "outdoor-conditions",
  "outdoor-prep",
  "studio-prep",
  "studio-conditions",
] as const;

export type LinkSlug = (typeof LINK_SLUGS)[number];
