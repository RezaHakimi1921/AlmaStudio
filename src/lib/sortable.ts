"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

/** Move one item inside an array (returns a new array). */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Drag-to-reorder that works with mouse AND touch (pointer events, no
 * library). Put `handleProps(i)` on a grip button and `itemProps(i)` on the
 * item. Keyboard: focus the grip and use the arrow keys.
 */
export function useSortable(count: number, onMove: (from: number, to: number) => void) {
  const group = useId();
  const dragging = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  function end() {
    dragging.current = null;
    setActive(null);
  }

  function handleProps(index: number) {
    return {
      type: "button" as const,
      "aria-label": "برای جابه‌جایی بکشید (یا با کلیدهای جهت)",
      title: "بکشید تا جابه‌جا شود",
      className: "sort-handle",
      style: { touchAction: "none" as const },
      onPointerDown: (e: PointerEvent<HTMLElement>) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = index;
        setActive(index);
        navigator.vibrate?.(8);
      },
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        const from = dragging.current;
        if (from === null) return;
        // keep scrolling while dragging near the top/bottom edge (phones)
        if (e.clientY < 70) window.scrollBy(0, -12);
        else if (e.clientY > window.innerHeight - 110) window.scrollBy(0, 12);
        const target = document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest<HTMLElement>(`[data-sort-group="${group}"]`);
        if (!target) return;
        const to = Number(target.dataset.sortIndex);
        if (Number.isInteger(to) && to !== from) {
          onMove(from, to);
          dragging.current = to;
          setActive(to);
        }
      },
      onPointerUp: end,
      onPointerCancel: end,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        // RTL: right = earlier, left = later
        const delta =
          e.key === "ArrowUp" || e.key === "ArrowRight" ? -1 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? 1 : 0;
        if (!delta) return;
        e.preventDefault();
        const to = index + delta;
        if (to >= 0 && to < count) onMove(index, to);
      },
    };
  }

  function itemProps(index: number) {
    return {
      "data-sort-group": group,
      "data-sort-index": index,
      "data-dragging": active === index ? "true" : undefined,
    };
  }

  return { handleProps, itemProps, active };
}
