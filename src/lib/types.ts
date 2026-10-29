export type IntroTheme =
  | "outdoor-conditions"
  | "outdoor-prep"
  | "studio-prep"
  | "studio-conditions";

export type ContentBlock = {
  id: string;
  type: "heading" | "paragraph" | "price" | "note";
  title?: string;
  body: string;
  price?: string;
};

export type LinkPageContent = {
  slug: string;
  title: string;
  subtitle?: string;
  brandLabel: string;
  greeting?: string;
  heroImageUrl: string;
  introTheme: IntroTheme;
  introLabel: string;
  blocks: ContentBlock[];
  closingMessage?: string;
  addressTitle?: string;
  address?: string;
  instagramUrl: string;
  mapsUrl: string;
  showInstagram: boolean;
  showMaps: boolean;
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
