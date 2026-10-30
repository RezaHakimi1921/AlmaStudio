"use client";

import type { MapLink } from "@/lib/maps";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";
import { GALLERY_THEMES } from "@/lib/gallery";
import { toFaDigits } from "@/lib/tehran";
import { track } from "@/lib/track";
import { TrackProvider } from "@/lib/track-context";
import type { Announcement, GalleryCategory, GalleryImage } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";
import { AnnouncementBar } from "./AnnouncementBar";
import { ContactBar } from "./ContactBar";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ImagesIcon } from "./Icons";

type Props = {
  images: GalleryImage[];
  initial: GalleryCategory;
  phone: string;
  maps: MapLink[];
  announcement: Announcement | null;
  /** Link page (or hub) to return to via the back button */
  backHref?: string;
};

export function GalleryView({
  images,
  initial,
  phone,
  maps,
  announcement,
  backHref = "/",
}: Props) {
  const [cat, setCat] = useState<GalleryCategory>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const isClient = useIsClient();
  const theme = GALLERY_THEMES[cat];
  const list = useMemo(() => images.filter((i) => i.category === cat), [images, cat]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        GALLERY_CATEGORIES.map((c) => [c, images.filter((i) => i.category === c).length]),
      ) as Record<GalleryCategory, number>,
    [images],
  );

  useEffect(() => {
    track("gallery", "view");
  }, []);

  function choose(next: GalleryCategory) {
    setCat(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("c", next);
      window.history.replaceState(null, "", url);
    } catch {
      /* ignore */
    }
  }

  const style = {
    "--g-accent": theme.accent,
    "--g-deep": theme.deep,
    "--g-tint": theme.tint,
    "--g-glow": theme.glow,
  } as CSSProperties;

  return (
    <TrackProvider page="gallery">
      <main className={`gallery-shell gallery-shell--${cat}`} style={style}>
        {announcement ? <AnnouncementBar announcement={announcement} /> : null}

        <header className="gallery-head">
          <Link href={backHref} className="gallery-head__back" aria-label="بازگشت">
            <ArrowRightIcon />
          </Link>
          <AlmaAppleLogo size={44} />
          <p className="gallery-head__kicker">آتلیه آلما</p>
          <h1 className="gallery-head__title">نمونه‌کارها</h1>
          <p key={cat} className="gallery-head__tagline">
            {theme.tagline}
          </p>
        </header>

        <div className="gallery-tabs" role="tablist" aria-label="دسته‌بندی نمونه‌کارها">
          <span
            className="gallery-tabs__pill"
            style={{ ["--idx" as string]: GALLERY_CATEGORIES.indexOf(cat) }}
            aria-hidden="true"
          />
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === cat}
              className={c === cat ? "is-active" : undefined}
              onClick={() => choose(c)}
            >
              {GALLERY_THEMES[c].label}
              <small>{toFaDigits(counts[c])}</small>
            </button>
          ))}
        </div>

        {list.length ? (
          <div key={cat} className="gallery-grid">
            {list.map((img, i) => (
              <GalleryTile key={img.id} img={img} index={i} onOpen={() => setOpen(i)} />
            ))}
          </div>
        ) : (
          <div key={cat} className="gallery-empty">
            <span className="gallery-empty__icon">
              <ImagesIcon size={28} />
            </span>
            <p>به‌زودی نمونه‌کارهای {theme.label} را اینجا می‌بینید</p>
          </div>
        )}
      </main>

      <ContactBar phone={phone} maps={maps} garden={cat === "kids"} />

      {isClient && open !== null && list[open]
        ? createPortal(
            <Lightbox list={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />,
            document.body,
          )
        : null}
    </TrackProvider>
  );
}

function GalleryTile({
  img,
  index,
  onOpen,
}: {
  img: GalleryImage;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="gallery-tile"
      style={{ ["--n" as string]: Math.min(index, 10) }}
      onClick={onOpen}
      aria-label={img.caption || "نمایش تصویر"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.caption}
        loading={index < 4 ? "eager" : "lazy"}
        decoding="async"
      />
      {img.caption ? <span className="gallery-tile__cap">{img.caption}</span> : null}
    </button>
  );
}

function Lightbox({
  list,
  index,
  onIndex,
  onClose,
}: {
  list: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [dx, setDx] = useState(0);
  const img = list[index];

  // RTL: "next" sits on the left
  const next = useCallback(() => onIndex((index + 1) % list.length), [index, list.length, onIndex]);
  const prev = useCallback(
    () => onIndex((index - 1 + list.length) % list.length),
    [index, list.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [next, prev, onClose]);

  function onDown(e: PointerEvent) {
    start.current = { x: e.clientX, y: e.clientY };
  }
  function onMove(e: PointerEvent) {
    if (!start.current) return;
    setDx(e.clientX - start.current.x);
  }
  function onUp(e: PointerEvent) {
    if (!start.current) return;
    const moved = e.clientX - start.current.x;
    const vertical = Math.abs(e.clientY - start.current.y);
    start.current = null;
    setDx(0);
    if (vertical > 120 && Math.abs(moved) < 60) return onClose();
    if (moved < -50) next(); // swipe left → next (RTL reading order)
    else if (moved > 50) prev();
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="نمایش تصویر"
      onClick={onClose}
    >
      <button type="button" className="lightbox__close" aria-label="بستن" onClick={onClose}>
        <CloseIcon />
      </button>

      <div
        className="lightbox__stage"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => {
          start.current = null;
          setDx(0);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={img.id}
          src={img.url}
          alt={img.caption}
          draggable={false}
          style={{ transform: dx ? `translateX(${dx}px)` : undefined }}
        />
      </div>

      {list.length > 1 ? (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="قبلی"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ArrowRightIcon />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="بعدی"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ArrowLeftIcon />
          </button>
        </>
      ) : null}

      <div className="lightbox__meta" onClick={(e) => e.stopPropagation()}>
        {img.caption ? <p>{img.caption}</p> : null}
        <span>
          {toFaDigits(index + 1)} از {toFaDigits(list.length)}
        </span>
      </div>
    </div>
  );
}
