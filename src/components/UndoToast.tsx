"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";

type Pending = { id: number; label: string; restore: () => void };

const SHOW_MS = 7000;

/**
 * Delete right away, offer «بازگردانی» for a few seconds — instead of
 * "are you sure?" dialogs. Nothing is saved to the server until «ذخیره».
 */
export function useUndo() {
  const [pending, setPending] = useState<Pending | null>(null);
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setPending(null);
  }, []);

  const offer = useCallback(
    (label: string, restore: () => void) => {
      if (timer.current) window.clearTimeout(timer.current);
      setPending({ id: Date.now(), label, restore });
      timer.current = window.setTimeout(clear, SHOW_MS);
    },
    [clear],
  );

  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  const toast = <UndoToast pending={pending} onUndo={() => { pending?.restore(); clear(); }} onClose={clear} />;
  return { offer, toast };
}

function UndoToast({
  pending,
  onUndo,
  onClose,
}: {
  pending: Pending | null;
  onUndo: () => void;
  onClose: () => void;
}) {
  const isClient = useIsClient();
  if (!isClient || !pending) return null;
  return createPortal(
    <div key={pending.id} className="undo-toast" role="status" aria-live="polite">
      <span>{pending.label}</span>
      <button type="button" className="undo-toast__undo" onClick={onUndo}>
        بازگردانی
      </button>
      <button type="button" className="undo-toast__close" aria-label="بستن" onClick={onClose}>
        ✕
      </button>
      <i className="undo-toast__timer" style={{ animationDuration: `${SHOW_MS}ms` }} />
    </div>,
    document.body,
  );
}
