"use client";

import { useCallback, useEffect, useState } from "react";
import { useClientValue } from "@/lib/client";
import { markIntroSeen, shouldSkipIntro } from "@/lib/intro";

/** shortest time the loader is shown (the apple needs ~2.3 s to fill) */
const MIN_MS = 3400;
/** never wait longer than this for the page photo */
const PHOTO_MAX_MS = 4500;
const EXIT_MS = 700;

/** Same apple as the brand mark, drawn once per layer (neutral base + coloured fill). */
function Apple({ coloured }: { coloured: boolean }) {
  const ink = coloured ? "#A83232" : "rgba(42, 26, 26, 0.1)";
  const stem = coloured ? "#5B3A29" : "rgba(42, 26, 26, 0.16)";
  const leaf = coloured ? "#58745A" : "rgba(42, 26, 26, 0.12)";
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <path
        d="M32 21C27 14 11 15 7.5 32 4.5 47 15.5 61 25.5 60.5 29 60.3 30.5 58.8 32 58.8S35 60.3 38.5 60.5C48.5 61 59.5 47 56.5 32 53 15 37 14 32 21Z"
        fill={ink}
      />
      {coloured ? (
        <path d="M16 31C16.5 25 20 21.5 24.5 20.5" fill="none" stroke="#F8F3ED" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      ) : null}
      <path d="M32 22C32.5 15 34.5 10 38 6" fill="none" stroke={stem} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M35.5 14.5C37 8 44 5 51 6.5 49.5 13 43 17 35.5 14.5Z" fill={leaf} />
    </svg>
  );
}

/**
 * Opening of the main page (`/`) — a calm apple loader:
 * a grey apple fills with colour from the bottom up (like a progress bar), pops once,
 * «آتلیه آلما» is revealed, and the frame lifts as soon as the page photo is ready.
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
            <div className="hub-intro__layer hub-intro__layer--base">
              <Apple coloured={false} />
            </div>
            <div className="hub-intro__layer hub-intro__layer--fill">
              <Apple coloured />
            </div>
          </div>
        </div>
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
