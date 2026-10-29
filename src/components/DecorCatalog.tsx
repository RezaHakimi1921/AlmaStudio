"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";
import { getPicksSnapshot, parsePicks, setPicks, subscribePicks } from "@/lib/decor-picks";
import { GALLERY_THEMES } from "@/lib/gallery";
import { toFaDigits } from "@/lib/tehran";
import { track } from "@/lib/track";
import { TrackProvider } from "@/lib/track-context";
import type { Announcement, Decor, GalleryCategory } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";
import { AnnouncementBar } from "./AnnouncementBar";
import { ContactBar } from "./ContactBar";
import { ArrowRightIcon, CheckIcon, CloseIcon, CopyIcon, ShareIcon } from "./Icons";

type Props = {
  items: Decor[];
  phone: string;
  maps: { key: string; label: string; href: string }[];
  announcement: Announcement | null;
};

type Filter = "all" | GalleryCategory;

const faList = (nums: number[]) => nums.map((n) => toFaDigits(n)).join("، ");

export function DecorCatalog({ items, phone, maps, announcement }: Props) {
  const isClient = useIsClient();
  const picksRaw = useSyncExternalStore(subscribePicks, getPicksSnapshot, () => "");
  const valid = useMemo(() => new Set(items.map((d) => d.number)), [items]);
  const picks = parsePicks(picksRaw).filter((n) => valid.has(n));
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Decor | null>(null);
  const [copied, setCopied] = useState(false);

  const cats = GALLERY_CATEGORIES.filter((c) => items.some((d) => d.category === c));
  const list = filter === "all" ? items : items.filter((d) => d.category === filter);

  useEffect(() => {
    track("decor", "view");
  }, []);

  function toggle(n: number) {
    const has = picks.includes(n);
    if (!has) {
      track("decor", "decor_pick");
      navigator.vibrate?.(10);
    }
    setPicks(has ? picks.filter((x) => x !== n) : [...picks, n]);
  }

  const message = `سلام، دکورهای انتخابی من در آتلیه آلما: ${picks
    .map((n) => `شماره ${toFaDigits(n)}`)
    .join("، ")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("این متن را کپی کنید:", message);
    }
  }

  async function share() {
    track("decor", "share");
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    await copy();
  }

  return (
    <TrackProvider page="decor">
      <main className={`decor-shell${picks.length ? " has-picks" : ""}`}>
        {announcement ? <AnnouncementBar announcement={announcement} /> : null}

        <header className="gallery-head decor-head">
          <Link href="/" className="gallery-head__back" aria-label="بازگشت">
            <ArrowRightIcon />
          </Link>
          <AlmaAppleLogo size={44} />
          <p className="gallery-head__kicker">آتلیه آلما</p>
          <h1 className="gallery-head__title">دکورهای آتلیه</h1>
          <p className="decor-head__hint">
            روی ♡ هر دکور بزنید تا انتخاب شود؛ هنگام رزرو شماره‌ها را بگویید یا بفرستید.
          </p>
        </header>

        {cats.length > 1 ? (
          <div className="decor-filters" role="tablist" aria-label="دسته‌بندی دکورها">
            {(["all", ...cats] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? "is-active" : undefined}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "همه" : GALLERY_THEMES[f].label}
              </button>
            ))}
          </div>
        ) : null}

        {list.length ? (
          <div key={filter} className="decor-grid">
            {list.map((d, i) => {
              const picked = picks.includes(d.number);
              return (
                <article
                  key={d.id}
                  className={`decor-card${picked ? " is-picked" : ""}`}
                  style={{ ["--n" as string]: Math.min(i, 10) }}
                >
                  <button
                    type="button"
                    className="decor-card__img"
                    onClick={() => setOpen(d)}
                    aria-label={`نمایش بزرگ دکور ${toFaDigits(d.number)}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.imageUrl} alt={d.name} loading={i < 4 ? "eager" : "lazy"} />
                    <span className="decor-card__num">{toFaDigits(d.number)}</span>
                  </button>
                  <div className="decor-card__body">
                    <div>
                      <strong>{d.name || `دکور ${toFaDigits(d.number)}`}</strong>
                      <span>{GALLERY_THEMES[d.category].label}</span>
                    </div>
                    <button
                      type="button"
                      className="decor-pick"
                      aria-pressed={picked}
                      aria-label={picked ? `حذف دکور ${toFaDigits(d.number)} از انتخاب‌ها` : `انتخاب دکور ${toFaDigits(d.number)}`}
                      onClick={() => toggle(d.number)}
                    >
                      {picked ? "♥" : "♡"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="gallery-empty">
            <p>به‌زودی دکورهای آتلیه را اینجا می‌بینید</p>
          </div>
        )}
      </main>

      {picks.length ? (
        <div className="decor-tray glass-strong" role="region" aria-label="دکورهای انتخابی">
          <div className="decor-tray__info">
            <span>انتخاب‌های شما</span>
            <strong>{faList(picks)}</strong>
          </div>
          <div className="decor-tray__actions">
            <button type="button" className="chip-btn" onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "کپی شد" : "کپی"}</span>
            </button>
            <button type="button" className="chip-btn chip-btn--solid" onClick={share}>
              <ShareIcon size={16} />
              <span>ارسال</span>
            </button>
            <button
              type="button"
              className="decor-tray__clear"
              aria-label="پاک کردن انتخاب‌ها"
              onClick={() => setPicks([])}
            >
              <CloseIcon size={14} />
            </button>
          </div>
        </div>
      ) : null}

      <ContactBar phone={phone} maps={maps} />

      {isClient && open
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
              <button type="button" className="lightbox__close" aria-label="بستن" onClick={() => setOpen(null)}>
                <CloseIcon />
              </button>
              <div className="lightbox__stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={open.imageUrl} alt={open.name} onClick={(e) => e.stopPropagation()} />
              </div>
              <div className="lightbox__meta decor-lightbox__meta" onClick={(e) => e.stopPropagation()}>
                <p>
                  دکور {toFaDigits(open.number)}
                  {open.name ? ` — ${open.name}` : ""}
                </p>
                {open.note ? <span>{open.note}</span> : null}
                <button
                  type="button"
                  className={`decor-lightbox__pick${picks.includes(open.number) ? " is-picked" : ""}`}
                  onClick={() => toggle(open.number)}
                >
                  {picks.includes(open.number) ? "♥ انتخاب شد" : "♡ انتخاب این دکور"}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </TrackProvider>
  );
}
