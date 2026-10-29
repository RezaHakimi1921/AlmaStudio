"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasShotParam, useClientValue } from "@/lib/client";
import { markIntroSeen, shouldSkipIntro } from "@/lib/intro";
import { track } from "@/lib/track";
import { TrackProvider } from "@/lib/track-context";
import type { LinkPageContent, SiteSettings } from "@/lib/types";
import { PAGE_THEMES } from "@/lib/themes";
import { IntroAnimation } from "./IntroAnimation";
import { HeroSection } from "./HeroSection";
import { CtaButtons } from "./CtaButtons";
import { ContactBar } from "./ContactBar";
import { AddressCard } from "./AddressCard";
import { AnnouncementBar } from "./AnnouncementBar";
import { HoursCard } from "./HoursCard";
import { FaqSection } from "./FaqSection";
import { ShareCard } from "./ShareCard";
import { GalleryTeaser } from "./GalleryTeaser";
import { CheckIcon, InfoIcon, SparkIcon, TagIcon } from "./Icons";

function linesToParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

type Props = {
  page: LinkPageContent;
  settings: SiteSettings;
  /** computed on the server: announcement on + inside its date window */
  announcementLive: boolean;
};

export function LinkPageView({ page, settings, announcementLive }: Props) {
  const skipIntro = useClientValue(shouldSkipIntro);
  const [introDone, setIntroDone] = useState(false);
  const entered = skipIntro === true || introDone;
  const shellRef = useRef<HTMLElement>(null);
  const theme = PAGE_THEMES[page.introTheme];
  const garden = page.introTheme.startsWith("outdoor");

  const onIntroDone = useCallback(() => {
    markIntroSeen();
    setIntroDone(true);
  }, []);

  // anonymous page-view counter (once per mount)
  useEffect(() => {
    track(page.slug, "view");
  }, [page.slug]);

  // Scroll-reveal for cards
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !entered) return;
    const items = Array.from(shell.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window) || hasShotParam()) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    shell.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    items.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i, 3) * 70}ms`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, [entered]);

  const packages = linesToParagraphs(page.packagesText || "");
  const notes = linesToParagraphs(page.notesText || "");
  const mapLinks = [
    page.showNeshan && page.neshanUrl.trim()
      ? { key: "neshan", label: "نشان", href: page.neshanUrl.trim() }
      : null,
    page.showMaps && page.mapsUrl.trim()
      ? { key: "google", label: "گوگل‌مپ", href: page.mapsUrl.trim() }
      : null,
  ].filter((m): m is { key: string; label: string; href: string } => m !== null);

  const { hours, faq, gallery } = settings;
  const showGallery = gallery.enabled && gallery.images.length > 0;

  return (
    <TrackProvider page={page.slug}>
      {skipIntro !== true ? (
        <IntroAnimation
          theme={page.introTheme}
          brand={page.brandLabel}
          label={page.introLabel}
          heroImageUrl={page.heroImageUrl}
          onDone={onIntroDone}
        />
      ) : null}

      <main
        ref={shellRef}
        className={`link-shell theme-${garden ? "garden" : "studio"}${entered ? " is-entered" : ""}`}
      >
        {announcementLive ? <AnnouncementBar announcement={settings.announcement} /> : null}

        <HeroSection
          title={page.title}
          subtitle={page.subtitle}
          brandLabel={page.brandLabel}
          moodTag={page.moodTag || theme.mood}
          heroImageUrl={page.heroImageUrl}
          overlay={theme.heroOverlay}
        />

        <div
          id="content"
          className="link-body link-body--on-photo"
          style={{ ["--page-hero" as string]: `url(${page.heroImageUrl})` }}
        >
          <div className="link-body-photo" aria-hidden="true" />

          {!page.published ? (
            <p className="draft-badge" style={{ marginBottom: "1rem" }}>
              پیش‌نویس
            </p>
          ) : null}

          {page.bodyHtml ? (
            <section className="glass rich-body" data-reveal>
              <h2 className="card-title">
                <span className="card-title__icon">
                  <SparkIcon />
                </span>
                خوش آمدید
              </h2>
              <div
                className="rich-body__html"
                dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
              />
            </section>
          ) : null}

          {packages.length ? (
            <section className="glass section-card" data-reveal>
              <h2 className="card-title">
                <span className="card-title__icon">
                  <TagIcon />
                </span>
                پکیج‌ها و قیمت
              </h2>
              <ul className="check-list">
                {packages.map((line) => (
                  <li key={line}>
                    <span className="check-list__dot">
                      <CheckIcon size={12} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {notes.length ? (
            <section className="solid-card cream-surface section-card section-card--notes" data-reveal>
              <h2 className="card-title">
                <span className="card-title__icon">
                  <InfoIcon />
                </span>
                نکات مهم
              </h2>
              <ol className="step-list">
                {notes.map((line, i) => (
                  <li key={line}>
                    <span className="step-list__num">{(i + 1).toLocaleString("fa-IR")}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {showGallery ? <GalleryTeaser images={gallery.images} /> : null}

          {hours.enabled ? <HoursCard hours={hours} /> : null}

          {page.address ? (
            <AddressCard title={page.addressTitle} address={page.address} />
          ) : null}

          {faq.enabled ? <FaqSection items={faq.items} /> : null}

          <ShareCard title={page.title} garden={garden} />

          {page.closingMessage ? (
            <p className="link-closing" data-reveal>
              <span className="link-closing__mark" aria-hidden="true">❦</span>
              {page.closingMessage}
            </p>
          ) : null}

          <CtaButtons
            showInstagram={page.showInstagram}
            instagramUrl={page.instagramUrl}
            showBale={page.showBale}
            baleUrl={page.baleUrl}
            garden={garden}
          />
        </div>
      </main>

      <ContactBar
        phone={page.phone}
        maps={mapLinks}
        garden={garden}
        brand={page.brandLabel}
        visible={entered}
      />
    </TrackProvider>
  );
}
