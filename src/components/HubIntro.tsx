"use client";

import { useCallback, useEffect, useState } from "react";
import { useClientValue } from "@/lib/client";
import { markIntroSeen, shouldSkipIntro } from "@/lib/intro";

/** shortest time the loader is shown (the apple turn + name need ~2.3 s) */
const MIN_MS = 2800;
/** never wait longer than this for the page photo */
const PHOTO_MAX_MS = 4500;
const EXIT_MS = 700;

/** The brand apple with baked-in lighting (radial shading + highlight) so it reads as a solid 3D object. */
function Apple() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="hub-apple-body" cx="36%" cy="34%" r="78%">
          <stop offset="0" stopColor="#E0605A" />
          <stop offset="0.45" stopColor="#B83A38" />
          <stop offset="1" stopColor="#6E1A1E" />
        </radialGradient>
        <radialGradient id="hub-apple-rim" cx="72%" cy="82%" r="55%">
          <stop offset="0" stopColor="#FF8C7A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FF8C7A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hub-apple-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FA07F" />
          <stop offset="1" stopColor="#3E5A42" />
        </linearGradient>
      </defs>
      <path
        d="M32 21C27 14 11 15 7.5 32 4.5 47 15.5 61 25.5 60.5 29 60.3 30.5 58.8 32 58.8S35 60.3 38.5 60.5C48.5 61 59.5 47 56.5 32 53 15 37 14 32 21Z"
        fill="url(#hub-apple-body)"
      />
      <path
        d="M32 21C27 14 11 15 7.5 32 4.5 47 15.5 61 25.5 60.5 29 60.3 30.5 58.8 32 58.8S35 60.3 38.5 60.5C48.5 61 59.5 47 56.5 32 53 15 37 14 32 21Z"
        fill="url(#hub-apple-rim)"
      />
      <path d="M15 31C15.5 25 19 21 24 20" fill="none" stroke="#FFF4EE" strokeWidth="3.4" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="21" cy="25" rx="2.2" ry="1.3" fill="#fff" opacity="0.5" transform="rotate(-35 21 25)" />
      <path d="M32 22C32.5 15 34.5 10 38 6" fill="none" stroke="#4A2E20" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M35.5 14.5C37 8 44 5 51 6.5 49.5 13 43 17 35.5 14.5Z" fill="url(#hub-apple-leaf)" />
    </svg>
  );
}

/**
 * Opening of the main page (`/`) — a 3D apple loader:
 * a red apple turns into view out of the depth and sways, «آتلیه آلما» rises with thickness, and the frame lifts as soon as the page photo is ready.
 * Only the apple carries colour; everything else is neutral.
 * Plays once per visitor (24 h), never for reduced-motion, skippable by tap, the
 * «ورود» button, Enter or Escape. `?intro=1` forces it for testing.
 */
export function HubIntro() {
  const stored = useClientValue(shouldSkipIntro);
  // latch the first real answer (marking it "seen" flips the live value)
  const [skip, setSkip] = useState<boolean | null>(null);
  if (skip === null && stored !== null) setSkip(stored);
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const [minDone, setMinDone] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  // leave when the animation had its time AND the page photo is ready (derived — no effect needed)
  const current = phase === "in" && skip === false && minDone && photoReady ? "out" : phase;
  const playing = skip === false && current === "in";

  const finish = useCallback(() => setPhase((p) => (p === "in" ? "out" : p)), []);

  useEffect(() => {
    if (skip === false) markIntroSeen();
  }, [skip]);

  // the page behind the loader: wait for its hero photo (max 4.5 s), so the reveal is complete
  useEffect(() => {
    if (!playing) return;
    let alive = true;
    const ok = () => {
      if (alive) setPhotoReady(true);
    };
    const timeout = window.setTimeout(ok, PHOTO_MAX_MS);
    const img = document.querySelector<HTMLImageElement>(".hub-hero__photo");
    if (img) img.decode().then(ok, ok);
    else window.setTimeout(ok, 0);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setMinDone(true), MIN_MS - EXIT_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, finish]);

  useEffect(() => {
    if (current !== "out") return;
    const t = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [current]);

  if (skip === true || current === "gone") return null;

  return (
    <div
      className={`hub-intro hub-intro--${current}${skip === false ? " is-ready" : ""}`}
      onClick={finish}
      role="presentation"
    >
      <span className="hub-intro__glow" aria-hidden="true" />
      <div className="hub-intro__center" aria-hidden="true">
        <div className="hub-intro__apple">
          <span className="hub-intro__ring" />
          <div className="hub-intro__apple-art">
            <Apple />
          </div>
        </div>
        <span className="hub-intro__floor" />
        <p className="hub-intro__name">
          <span className="hub-intro__name-text">آتلیه آلما</span>
        </p>
      </div>
      <button type="button" className="hub-intro__skip">
        ورود
      </button>
    </div>
  );
}
