"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";
import { CloseIcon, PhoneIcon } from "./Icons";

type Props = {
  phone: string;
  garden?: boolean;
  className?: string;
  brand?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

const DIAL_DELAY_MS = 750;
const OVERLAY_MS = 3600;
const SPARKS = 14;

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function toFaDigits(value: string) {
  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Call button with a tactile ripple + a full-screen "connecting" moment
 * (expanding rings, spark burst, ringing phone) before the dialer opens.
 * A real tel: link is always present in the overlay as a fallback.
 */
export function CallButton({
  phone,
  garden = false,
  className = "",
  brand = "آتلیه آلما",
  children,
  ariaLabel,
}: Props) {
  const [calling, setCalling] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const timers = useRef<number[]>([]);
  const dialTimer = useRef<number | null>(null);
  const mounted = useIsClient();
  const ready = phone.trim().length > 0;
  const href = telHref(phone);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((t) => window.clearTimeout(t));
      if (dialTimer.current != null) window.clearTimeout(dialTimer.current);
    };
  }, []);

  const close = useCallback(() => {
    if (dialTimer.current != null) {
      window.clearTimeout(dialTimer.current);
      dialTimer.current = null;
    }
    setCalling(false);
  }, []);

  useEffect(() => {
    if (!calling) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [calling, close]);

  const addRipple = useCallback((e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    const t = window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 700);
    timers.current.push(t);
  }, []);

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (prefersReducedMotion()) return; // let the link dial immediately
      e.preventDefault();
      navigator.vibrate?.([14, 50, 14]);
      setCalling(true);
      dialTimer.current = window.setTimeout(() => {
        dialTimer.current = null;
        window.location.href = href;
      }, DIAL_DELAY_MS);
      timers.current.push(window.setTimeout(() => setCalling(false), OVERLAY_MS));
    },
    [href],
  );

  if (!ready) {
    return (
      <button
        type="button"
        className={`cta-btn call-btn is-disabled ${className}`.trim()}
        disabled
        title="شماره تماس هنوز ثبت نشده است"
      >
        <PhoneIcon size={18} />
        {children ?? <span>تماس</span>}
      </button>
    );
  }

  return (
    <>
      <a
        className={`cta-btn call-btn${garden ? " cta-btn--garden" : ""} ${className}`.trim()}
        href={href}
        onClick={onClick}
        onPointerDown={addRipple}
        aria-label={ariaLabel ?? `تماس با ${brand}`}
      >
        <span className="call-btn__halo" aria-hidden="true" />
        <span className="call-btn__icon" aria-hidden="true">
          <PhoneIcon size={18} />
        </span>
        {children ?? <span>تماس</span>}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="tap-ripple"
            style={{ left: r.x, top: r.y }}
            aria-hidden="true"
          />
        ))}
      </a>

      {mounted && calling
        ? createPortal(
            <div
              className={`call-overlay${garden ? " call-overlay--garden" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label="در حال برقراری تماس"
              onClick={close}
            >
              <button
                type="button"
                className="call-overlay__close"
                aria-label="بستن"
                onClick={close}
              >
                <CloseIcon />
              </button>

              <div className="call-overlay__stage" onClick={(e) => e.stopPropagation()}>
                <div className="call-orb">
                  <span className="call-orb__ring" />
                  <span className="call-orb__ring" />
                  <span className="call-orb__ring" />
                  <span className="call-orb__sparks" aria-hidden="true">
                    {Array.from({ length: SPARKS }, (_, i) => (
                      <i key={i} style={{ ["--a" as string]: `${(360 / SPARKS) * i}deg` }} />
                    ))}
                  </span>
                  <span className="call-orb__core">
                    <PhoneIcon size={38} className="call-orb__phone" />
                  </span>
                </div>

                <p className="call-overlay__title">در حال برقراری تماس…</p>
                <p className="call-overlay__brand">{brand}</p>
                <p className="call-overlay__number" dir="ltr">
                  {toFaDigits(phone.trim())}
                </p>

                <a className="call-overlay__fallback" href={href}>
                  اگر شماره‌گیر باز نشد، اینجا بزنید
                </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
