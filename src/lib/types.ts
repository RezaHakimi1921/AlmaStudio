export type IntroTheme =
  | "outdoor-conditions"
  | "outdoor-prep"
  | "studio-prep"
  | "studio-conditions";

export type BlockType = "text" | "note" | "price" | "image" | "contact";

export type ContentBlock = {
  id: string;
  type: BlockType;
  title?: string;
  body?: string;
  price?: string;
  imageUrl?: string;
  imageAlt?: string;
  phone?: string;
  bold?: boolean;
};

export type LinkPageContent = {
  slug: string;
  title: string;
  subtitle?: string;
  moodTag: string;
  brandLabel: string;
  greeting?: string;
  heroImageUrl: string;
  introTheme: IntroTheme;
  introLabel: string;
  phone: string;
  blocks: ContentBlock[];
  closingMessage?: string;
  addressTitle?: string;
  address?: string;
  instagramUrl: string;
  mapsUrl: string;
  showInstagram: boolean;
  showMaps: boolean;
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

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  text: "متن",
  note: "نکته",
  price: "قیمت",
  image: "تصویر",
  contact: "تماس",
};
