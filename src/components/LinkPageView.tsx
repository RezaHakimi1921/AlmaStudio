"use client";

import { useEffect, useState } from "react";
import type { LinkPageContent } from "@/lib/types";
import { PAGE_THEMES } from "@/lib/themes";
import { AlmaAppleLogo } from "./AlmaAppleLogo";
import { IntroAnimation } from "./IntroAnimation";
import { BlockRenderer } from "./BlockRenderer";
import { CtaButtons } from "./CtaButtons";
import { ContactBar } from "./ContactBar";
import { GlassCard } from "./GlassCard";

export function LinkPageView({ page }: { page: LinkPageContent }) {
  const [skipIntro, setSkipIntro] = useState(false);
  const theme = PAGE_THEMES[page.introTheme];
  const garden = page.introTheme.startsWith("outdoor");

  useEffect(() => {
    const skip =
      new URLSearchParams(window.location.search).has("shot") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSkipIntro(skip);
  }, []);

  return (
    <>
      {!skipIntro ? (
        <IntroAnimation
          theme={page.introTheme}
          brand={page.brandLabel}
          label={page.introLabel}
        />
      ) : null}

      <main
        className={`link-shell${skipIntro ? " link-shell--ready" : ""} theme-${garden ? "garden" : "studio"}`}
      >
        <header className="hero">
          <div
            className="hero-media"
            style={{ backgroundImage: `url(${page.heroImageUrl})` }}
            role="img"
            aria-label={page.title}
          />
          <div className="hero-veil" style={{ background: theme.heroOverlay }} />
          <div className="hero-copy">
            <div className="hero-glass">
              <p className="mood-pill">{page.moodTag || theme.mood}</p>
              <div className="hero-brand-row">
                <AlmaAppleLogo size={34} />
                <p className="hero-brand">{page.brandLabel}</p>
              </div>
              <h1 className="hero-title">{page.title}</h1>
              {page.subtitle ? <p className="hero-sub">{page.subtitle}</p> : null}
            </div>
          </div>
        </header>

        <div className="link-body">
          {!page.published ? (
            <p className="draft-badge" style={{ marginBottom: "1rem" }}>
              پیش‌نویس
            </p>
          ) : null}

          {page.greeting ? <p className="link-greeting">{page.greeting}</p> : null}

          <div className="blocks">
            {page.blocks.map((block, index) => (
              <BlockRenderer
                key={block.id}
                block={block}
                pagePhone={page.phone}
                accentGarden={garden}
                index={index}
              />
            ))}
          </div>

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
