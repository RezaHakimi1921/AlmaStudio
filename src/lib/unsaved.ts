"use client";

import { useEffect } from "react";

const MESSAGE = "تغییرات ذخیره نشده‌اند. بدون ذخیره خارج می‌شوید؟";

/** Warn before closing/reloading the tab while there are unsaved changes. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBefore = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = MESSAGE;
      return MESSAGE;
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);
}

/** For in-app links/buttons: ask before leaving with unsaved changes. */
export function confirmLeave(dirty: boolean) {
  return !dirty || window.confirm(MESSAGE);
}
