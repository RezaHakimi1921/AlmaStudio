"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> & {
  /** keep the placeholder even after this photo arrived — used to reveal a group at once */
  hold?: boolean;
  /** fires once, when this photo has loaded (or failed) */
  onSettled?: () => void;
};

/**
 * <img> that fades in once it has really loaded.
 * It exposes `data-state="loading | loaded | error"`; the wrapper paints the
 * shimmer with `:has(> .skel-img[data-state="loading"])` — see `.skel` in
 * globals.css. Pictures already cached before hydration are detected through
 * `complete`, because their onLoad never fires.
 */
export function SkeletonImage({ className = "", alt = "", hold = false, onSettled, ...rest }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const reported = useRef(false);

  function settle(next: "loaded" | "error") {
    setState(next);
    if (!reported.current) {
      reported.current = true;
      onSettled?.();
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={alt}
      className={`skel-img ${className}`.trim()}
      data-state={hold ? "loading" : state}
      decoding="async"
      ref={(el) => {
        // failures are left to onError — a not-yet-started lazy image must not read as broken
        if (el && state === "loading" && el.complete && el.naturalWidth > 0) settle("loaded");
      }}
      onLoad={() => settle("loaded")}
      onError={() => settle("error")}
    />
  );
}

/**
 * Reveal a set of photos together instead of one by one:
 * pass `hold={!ready}` and `onSettled` to every image of the group.
 * A slow / failed photo never blocks the page — after `timeoutMs` the group shows anyway.
 */
export function useImageGroup(total: number, timeoutMs = 8000) {
  const [settled, setSettled] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (total === 0) return;
    const t = window.setTimeout(() => setTimedOut(true), timeoutMs);
    return () => window.clearTimeout(t);
  }, [total, timeoutMs]);

  const onSettled = useCallback(() => setSettled((n) => n + 1), []);
  return { ready: total === 0 || settled >= total || timedOut, onSettled };
}
