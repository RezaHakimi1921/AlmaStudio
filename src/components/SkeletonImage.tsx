"use client";

import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError">;

/**
 * <img> that fades in once it has really loaded.
 * It exposes `data-state="loading | loaded | error"`; the wrapper paints the
 * shimmer with `:has(> .skel-img[data-state="loading"])` — see `.skel` in
 * globals.css. Pictures already cached before hydration are detected through
 * `complete`, because their onLoad never fires.
 */
export function SkeletonImage({ className = "", alt = "", ...rest }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={alt}
      className={`skel-img ${className}`.trim()}
      data-state={state}
      decoding="async"
      ref={(el) => {
        // failures are left to onError — a not-yet-started lazy image must not read as broken
        if (el && state === "loading" && el.complete && el.naturalWidth > 0) {
          setState("loaded");
        }
      }}
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
    />
  );
}
