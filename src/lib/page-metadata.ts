import type { Metadata } from "next";
import { getPage } from "./content";
import { publicPathForSlug } from "./routes";

/**
 * Rich link previews (Telegram, Bale, WhatsApp…) for each public page:
 * title, short description and the page's own hero photo.
 */
export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) return {};
  const title = `${page.title} | ${page.brandLabel}`;
  const description = page.subtitle || page.moodTag || "آتلیه عکاسی نوزاد و بارداری آلما";
  return {
    title,
    description,
    alternates: { canonical: publicPathForSlug(slug) },
    openGraph: {
      title,
      description,
      url: publicPathForSlug(slug),
      images: page.heroImageUrl ? [{ url: page.heroImageUrl, alt: page.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: page.heroImageUrl ? [page.heroImageUrl] : undefined,
    },
  };
}
