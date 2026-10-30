import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
import { isAnnouncementLive } from "@/lib/announcement";
import { GalleryView } from "@/components/GalleryView";
import { safeBackHref } from "@/lib/routes";
import { GALLERY_CATEGORIES } from "@/lib/types";
import type { GalleryCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "نمونه‌کارها | آتلیه آلما",
  description: "نمونه‌کارهای آتلیه آلما — عکاسی بارداری، نوزاد و کودک",
  openGraph: {
    title: "نمونه‌کارهای آتلیه آلما",
    description: "عکاسی بارداری، نوزاد و کودک",
    locale: "fa_IR",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ c?: string; from?: string }> };

export default async function GalleryPage({ searchParams }: Props) {
  const [{ c, from }, content] = await Promise.all([searchParams, readContent()]);
  const { gallery, announcement } = content.settings;
  if (!gallery.enabled) notFound();

  const initial: GalleryCategory = (GALLERY_CATEGORIES as readonly string[]).includes(c ?? "")
    ? (c as GalleryCategory)
    : (GALLERY_CATEGORIES.find((cat) => gallery.images.some((i) => i.category === cat)) ??
      "newborn");

  // contact details for the floating bar: first page that has them
  const withPhone = content.pages.find((p) => p.phone.trim());
  const withMaps = content.pages.find((p) => p.showMaps && p.mapsUrl.trim());
  const withNeshan = content.pages.find((p) => p.showNeshan && p.neshanUrl.trim());
  const maps = [
    withNeshan ? { key: "neshan", label: "نشان", href: withNeshan.neshanUrl.trim() } : null,
    withMaps ? { key: "google", label: "گوگل‌مپ", href: withMaps.mapsUrl.trim() } : null,
  ].filter((m): m is { key: string; label: string; href: string } => m !== null);

  return (
    <GalleryView
      images={gallery.images}
      initial={initial}
      phone={withPhone?.phone ?? ""}
      maps={maps}
      announcement={isAnnouncementLive(announcement) ? announcement : null}
      backHref={safeBackHref(from)}
    />
  );
}
