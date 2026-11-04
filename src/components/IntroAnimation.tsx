"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IntroTheme } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

type Props = {
  theme: IntroTheme;
  brand: string;
  label: string;
  heroImageUrl: string;
  onDone?: () => void;
};

/** longest we wait for the photo before starting anyway (slow mobile data) */
const READY_TIMEOUT_MS = 1400;
/** timeline length, counted from the moment the photo is ready */
const DURATION_MS = 3600;
const EXIT_MS = 800;
const PARTICLES = 14;

/**
 * Cinematic opening — shown once per visitor (see lib/intro.ts):
 * 1. dark frame → waits until the hero photo is decoded (never opens on a blank frame)
 * 2. camera iris opens on the photo
 * 3. apple mark blooms with light rings
 * 4. brand + label wipe in, a light sweep crosses the type
 * 5. floating petals (studio) / leaves (garden) drift up
 * 6. the frame lifts away to reveal the page.
 * Skippable any time: tap anywhere, the «ورود» button, Enter or Escape.
 */
export function IntroAnimation({ theme, brand, label, heroImageUrl, onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const [ready, setReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const garden = theme.startsWith("outdoor");

  const finish = useCallback(() => {
    setReady(true);
    setPhase((p) => (p === "in" ? "out" : p));
  }, []);

  // 1) start the timeline once the photo is decoded (or after a short grace period)
  useEffect(() => {
    let alive = true;
    const go = () => {
      if (alive) setReady(true);
    };
    const timeout = window.setTimeout(go, READY_TIMEOUT_MS);
    imgRef.current?.decode().then(go, go);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, []);

  // 2) leave automatically
  useEffect(() => {
    if (!ready) return;
    const leave = window.setTimeout(finish, DURATION_MS - EXIT_MS);
    return () => window.clearTimeout(leave);
  }, [ready, finish]);

  // 3) hand over to the page
  useEffect(() => {
    if (phase !== "out") return;
    onDone?.();
    const t = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase, onDone]);

  // keyboard skip + no scrolling behind the overlay — only while it is actually playing
  // (this component stays mounted after it fades out, so the lock must follow `phase`)
  useEffect(() => {
    if (phase !== "in") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, finish]);

  if (phase === "gone") return null;

  return (
    <div
      className={`cinema-intro cinema-intro--${phase}${ready ? " is-ready" : ""}${garden ? " cinema-intro--garden" : ""}`}
      onClick={finish}
      role="presentation"
    >
      <div className="cinema-intro__photo-wrap" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          className="cinema-intro__photo"
          src={heroImageUrl}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="cinema-intro__veil" />
        <div className="cinema-intro__leak" />
        <div className="cinema-intro__grain" />
      </div>

      <div className="cinema-intro__blades" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="cinema-intro__particles" aria-hidden="true">
        {Array.from({ length: PARTICLES }, (_, i) => (
          <span
            key={i}
            style={{
              ["--x" as string]: `${(i * 71) % 100}%`,
              ["--d" as string]: `${0.4 + ((i * 37) % 17) / 10}s`,
              ["--s" as string]: `${0.6 + ((i * 13) % 7) / 10}`,
              ["--r" as string]: `${(i * 53) % 360}deg`,
            }}
          />
        ))}
      </div>

      <div className="cinema-intro__copy" aria-hidden="true">
        <div className="cinema-intro__mark">
          <span className="cinema-intro__ring" />
          <span className="cinema-intro__ring" />
          <AlmaAppleLogo size={54} className="alma-logo--on-dark" />
        </div>
        <p className="cinema-intro__brand">
          <span className="cinema-intro__brand-text">{brand}</span>
        </p>
        <p className="cinema-intro__label">{label}</p>
        <span className="cinema-intro__line" />
      </div>

      <button type="button" className="cinema-intro__skip">
        ورود
      </button>
      <span className="cinema-intro__progress" aria-hidden="true" />
    </div>
  );
}
