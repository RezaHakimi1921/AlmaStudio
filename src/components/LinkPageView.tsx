"use client";

import { useEffect, useState } from "react";
import type { LinkPageContent } from "@/lib/types";
import { IntroAnimation } from "./IntroAnimation";
import { CtaButtons } from "./CtaButtons";

export function LinkPageView({ page }: { page: LinkPageContent }) {
  const [skipIntro, setSkipIntro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skip =
      params.has("shot") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSkipIntro(skip);
    if (skip) setReady(true);
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
        className={`link-page${ready || skipIntro ? " link-page--ready" : ""}`}
        onAnimationEnd={() => setReady(true)}
      >
        <header className="link-hero">
          <div
            className="link-hero-media"
            style={{ backgroundImage: `url(${page.heroImageUrl})` }}
            role="img"
            aria-label={page.title}
          />
          <div className="link-hero-veil" />
          <div className="link-hero-copy">
            <p className="link-brand">{page.brandLabel}</p>
            <h1 className="link-title">{page.title}</h1>
            {page.subtitle ? <p className="link-subtitle">{page.subtitle}</p> : null}
          </div>
        </header>

        <div className="link-body">
          {page.greeting ? <p className="link-greeting">{page.greeting}</p> : null}

          <div className="link-blocks">
            {page.blocks.map((block, index) => (
              <section
                key={block.id}
                className={`link-block link-block--${block.type}`}
                style={{ animationDelay: `${0.08 + index * 0.05}s` }}
              >
                {block.title ? <h2>{block.title}</h2> : null}
                {block.body ? <p>{block.body}</p> : null}
                {block.price ? <p className="link-price">{block.price}</p> : null}
              </section>
            ))}
          </div>

          {page.address ? (
            <section className="link-address">
              {page.addressTitle ? <h2>{page.addressTitle}</h2> : null}
              <p>{page.address}</p>
            </section>
          ) : null}

          {page.closingMessage ? (
            <p className="link-closing">{page.closingMessage}</p>
          ) : null}

          <CtaButtons
            showInstagram={page.showInstagram}
            showMaps={page.showMaps}
            instagramUrl={page.instagramUrl}
            mapsUrl={page.mapsUrl}
          />
        </div>
      </main>
    </>
  );
}
