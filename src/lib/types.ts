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
  /** Optional packages / pricing plain text (line breaks OK) — legacy, used when packageFilter is "none" */
  packagesText: string;
  /** Show structured package cards from the catalogue */
  packageFilter: PackageFilter;
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
  /** show the address card (address comes from the page, or the studio info when empty) */
  showAddress: boolean;
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

/** A studio set-up the visitor can pick by its number ("دکور ۱۲") */
export type Decor = {
  id: string;
  number: number;
  name: string;
  category: GalleryCategory;
  imageUrl: string;
  note: string;
  visible: boolean;
};

/** A priced package card (replaces the old free-text packages list) */
export type StudioPackage = {
  id: string;
  name: string;
  /** Toman */
  price: number;
  /** Toman — optional "before discount" price, shown struck through */
  oldPrice: number;
  /** e.g. "پیشنهاد ما" — highlights the card */
  badge: string;
  description: string;
  features: string[];
  category: GalleryCategory;
  visible: boolean;
};

/** which structured packages a link page shows */
export type PackageFilter = "none" | "all" | GalleryCategory;

/**
 * Studio contact details, entered once. Each link page uses these unless it
 * fills its own value (e.g. the garden address on the outdoor pages).
 */
export type StudioInfo = {
  phone: string;
  addressTitle: string;
  address: string;
  instagramUrl: string;
  mapsUrl: string;
  neshanUrl: string;
  baleUrl: string;
};

export const STUDIO_FIELDS = [
  "phone",
  "addressTitle",
  "address",
  "instagramUrl",
  "mapsUrl",
  "neshanUrl",
  "baleUrl",
] as const satisfies readonly (keyof StudioInfo & keyof LinkPageContent)[];

export type SiteSettings = {
  studio: StudioInfo;
  hub: HubSettings;
  announcement: Announcement;
  hours: WorkingHours;
  faq: { enabled: boolean; items: FaqItem[] };
  gallery: { enabled: boolean; images: GalleryImage[] };
  decors: { enabled: boolean; items: Decor[] };
  packages: { items: StudioPackage[] };
};

export type TrackEvent =
  | "view"
  | "call"
  | "map_google"
  | "map_neshan"
  | "instagram"
  | "bale"
  | "share"
  | "gallery"
  | "decor"
  | "decor_pick";

export const TRACK_EVENTS: readonly TrackEvent[] = [
  "view",
  "call",
  "map_google",
  "map_neshan",
  "instagram",
  "bale",
  "share",
  "gallery",
  "decor",
  "decor_pick",
];
