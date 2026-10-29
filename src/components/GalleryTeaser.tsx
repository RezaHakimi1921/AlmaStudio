"use client";

import Link from "next/link";
import { useTrack } from "@/lib/track-context";
import { GALLERY_PATH, GALLERY_THEMES } from "@/lib/gallery";
import type { GalleryImage } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { ArrowLeftIcon, ImagesIcon } from "./Icons";

/** Inviting card that leads to the full gallery ("نمونه‌کارها"). */
export function GalleryTeaser({ images }: { images: GalleryImage[] }) {
  const trackEvent = useTrack();
  const covers = GALLERY_CATEGORIES.map((c) => images.find((i) => i.category === c)).filter(
    (i): i is GalleryImage => Boolean(i),
  );
  const thumbs = covers.length >= 3 ? covers : images.slice(0, 3);
  if (!thumbs.length) return null;

  return (
    <Link
      href={GALLERY_PATH}
      className="gallery-teaser"
      data-reveal
      onClick={() => trackEvent("gallery")}
    >
      <div className="gallery-teaser__stack" aria-hidden="true">
        {thumbs.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={img.id} src={img.url} alt="" loading="lazy" style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <div className="gallery-teaser__copy">
        <span className="gallery-teaser__kicker">
          <ImagesIcon size={16} /> نمونه‌کارهای آلما
        </span>
        <strong>لحظه‌هایی که ثبت کرده‌ایم</strong>
        <span className="gallery-teaser__cats">
          {GALLERY_CATEGORIES.map((c) => GALLERY_THEMES[c].label).join(" · ")}
        </span>
      </div>
      <span className="gallery-teaser__go" aria-hidden="true">
        <ArrowLeftIcon />
      </span>
    </Link>
  );
}
