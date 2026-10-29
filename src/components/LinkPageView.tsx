"use client";

import { useEffect, useState } from "react";
import type { LinkPageContent } from "@/lib/types";
import { PAGE_THEMES } from "@/lib/themes";
import { IntroAnimation } from "./IntroAnimation";
import { HeroSection } from "./HeroSection";
import { CtaButtons } from "./CtaButtons";
import { ContactBar } from "./ContactBar";
import { GlassCard } from "./GlassCard";

function readSkipIntro() {
  if (typeof window === "undefined") return true;
  return (
    new URLSearchParams(window.location.search).has("shot") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function linesToParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function LinkPageView({ page }: { page: LinkPageContent }) {
  const [skipIntro, setSkipIntro] = useState(true);
  const [introArmed, setIntroArmed] = useState(false);
  const theme = PAGE_THEMES[page.introTheme];
  const garden = page.introTheme.startsWith("outdoor");

  useEffect(() => {
    const skip = readSkipIntro();
    setSkipIntro(skip);
    setIntroArmed(!skip);
  }, []);

  const packages = linesToParagraphs(page.packagesText || "");
  const notes = linesToParagraphs(page.notesText || "");

  return (
    <>
      {introArmed && !skipIntro ? (
        <IntroAnimation
          theme={page.introTheme}
          brand={page.brandLabel}
          label={page.introLabel}
          heroImageUrl={page.heroImageUrl}
        />
      ) : null}

      <main
        className={`link-shell link-shell--ready theme-${garden ? "garden" : "studio"}`}
      >
        <HeroSection
          title={page.title}
          subtitle={page.subtitle}
          brandLabel={page.brandLabel}
          moodTag={page.moodTag || theme.mood}
          heroImageUrl={page.heroImageUrl}
          overlay={theme.heroOverlay}
        />

        <div
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
            <GlassCard className="rich-body glass">
              <div
                className="rich-body__html"
                dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
              />
            </GlassCard>
          ) : null}

          {packages.length ? (
            <GlassCard className="section-card glass">
              <h2>پکیج‌ها و قیمت</h2>
              <ul className="plain-list">
                {packages.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </GlassCard>
          ) : null}

          {notes.length ? (
            <div className="solid-card cream-surface section-card">
              <h2>نکات مهم</h2>
              <ul className="plain-list">
                {notes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {page.address ? (
            <GlassCard className="link-address" solid>
              {page.addressTitle ? <h2>{page.addressTitle}</h2> : null}
              <p>{page.address}</p>
            </GlassCard>
          ) : null}

          {page.closingMessage ? (
            <p className="link-closing">{page.closingMessage}</p>
          ) : null}

          <CtaButtons
            showInstagram={page.showInstagram}
            showMaps={page.showMaps}
            instagramUrl={page.instagramUrl}
            mapsUrl={page.mapsUrl}
            garden={garden}
          />
        </div>
      </main>

      <ContactBar
        phone={page.phone}
        showMaps={page.showMaps}
        mapsUrl={page.mapsUrl}
        garden={garden}
      />
    </>
  );
}
