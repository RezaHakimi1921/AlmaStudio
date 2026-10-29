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
  settings: SiteSettings;
};

export const LINK_SLUGS = [
  "outdoor-conditions",
  "outdoor-prep",
  "studio-prep",
  "studio-conditions",
] as const;

export type LinkSlug = (typeof LINK_SLUGS)[number];

/* ---------- Site-wide settings (shared by every link page) ---------- */

export type Announcement = {
  enabled: boolean;
  /** "festival" = sparkly campaign ribbon, "info" = calm notice */
  tone: "festival" | "info";
  text: string;
  linkLabel: string;
  linkUrl: string;
  /** YYYY-MM-DD (Gregorian, Tehran day). Empty = no limit */
  startDate: string;
  endDate: string;
};

/** day: 0 = شنبه … 6 = جمعه */
export type DayHours = {
  day: number;
  open: boolean;
  from: string; // "10:00"
  to: string; // "20:00"
};

export type WorkingHours = {
  enabled: boolean;
  days: DayHours[];
  /** e.g. "پذیرش فقط با هماهنگی قبلی" */
  note: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
};

export const GALLERY_CATEGORIES = ["pregnancy", "newborn", "kids"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  category: GalleryCategory;
};

/** Home hub (`/`) hero — admin-editable banner */
export type HubSettings = {
  title: string;
  subtitle: string;
  heroImageUrl: string;
};

export type SiteSettings = {
  hub: HubSettings;
  announcement: Announcement;
  hours: WorkingHours;
  faq: { enabled: boolean; items: FaqItem[] };
  gallery: { enabled: boolean; images: GalleryImage[] };
};

export type TrackEvent =
  | "view"
  | "call"
  | "map_google"
  | "map_neshan"
  | "instagram"
  | "bale"
  | "share"
  | "gallery";

export const TRACK_EVENTS: readonly TrackEvent[] = [
  "view",
  "call",
  "map_google",
  "map_neshan",
  "instagram",
  "bale",
  "share",
  "gallery",
];
