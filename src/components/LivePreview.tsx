"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";
import type { LinkPageContent, SiteSettings } from "@/lib/types";
import { CloseIcon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  page: LinkPageContent;
  settings: SiteSettings;
};

/** Phone-sized live preview of unsaved changes (updates as you type). */
export function LivePreview({ open, onClose, page, settings }: Props) {
  const isClient = useIsClient();
  const frame = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);

  const send = useCallback(() => {
    if (!ready.current) return;
    frame.current?.contentWindow?.postMessage(
      { type: "alma-preview", page, settings },
      window.location.origin,
    );
  }, [page, settings]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if ((e.data as { type?: string })?.type === "alma-preview-ready") {
        ready.current = true;
        send();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  // live update while typing (light debounce)
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(send, 250);
    return () => window.clearTimeout(t);
  }, [open, send]);

  useEffect(() => {
    if (!open) {
      ready.current = false;
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!isClient || !open) return null;

  return createPortal(
    <div className="live-preview" role="dialog" aria-modal="true" aria-label="پیش‌نمایش" onClick={onClose}>
      <div className="live-preview__panel" onClick={(e) => e.stopPropagation()}>
        <div className="live-preview__head">
          <div>
            <strong>پیش‌نمایش — هنوز ذخیره نشده</strong>
            <span>همان چیزی که مشتری روی گوشی می‌بیند؛ با هر تغییر به‌روز می‌شود.</span>
          </div>
          <button type="button" aria-label="بستن پیش‌نمایش" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="live-preview__phone">
          <iframe ref={frame} src="/admin/preview" title="پیش‌نمایش صفحه" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
