import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
import { studioMaps } from "@/lib/studio";
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

  const { studio } = content.settings;

  return (
    <GalleryView
      images={gallery.images}
      initial={initial}
      phone={studio.phone}
      maps={studioMaps(studio)}
      announcement={isAnnouncementLive(announcement) ? announcement : null}
      backHref={safeBackHref(from)}
    />
  );
}
