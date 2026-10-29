"use client";

import type { RefObject } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
};

function wrapSelection(
  el: HTMLTextAreaElement,
  value: string,
  openTag: string,
  closeTag: string,
  fallback: string,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = value.slice(start, end) || fallback;
  const already =
    value.slice(start - openTag.length, start) === openTag &&
    value.slice(end, end + closeTag.length) === closeTag;

  let next: string;
  let selStart: number;
  let selEnd: number;

  if (already) {
    next =
      value.slice(0, start - openTag.length) +
      selected +
      value.slice(end + closeTag.length);
    selStart = start - openTag.length;
    selEnd = selStart + selected.length;
  } else if (
    selected.startsWith(openTag) &&
    selected.endsWith(closeTag) &&
    selected.length > openTag.length + closeTag.length
  ) {
    const inner = selected.slice(openTag.length, selected.length - closeTag.length);
    next = value.slice(0, start) + inner + value.slice(end);
    selStart = start;
    selEnd = start + inner.length;
  } else {
    next = value.slice(0, start) + openTag + selected + closeTag + value.slice(end);
    selStart = start + openTag.length;
    selEnd = selStart + selected.length;
  }

  return { next, selStart, selEnd };
}

export function AdminRichToolbar({ textareaRef, value, onChange }: Props) {
  function apply(openTag: string, closeTag: string, fallback: string) {
    const el = textareaRef.current;
    if (!el) return;
    const { next, selStart, selEnd } = wrapSelection(
      el,
      value,
      openTag,
      closeTag,
      fallback,
    );
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  }

  return (
    <div className="rich-toolbar" role="toolbar" aria-label="قالب‌بندی متن">
      <button
        type="button"
        className="rich-toolbar__btn"
        title="پررنگ"
        aria-label="پررنگ"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => apply("<b>", "</b>", "متن پررنگ")}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        className="rich-toolbar__btn"
        title="کج"
        aria-label="کج"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => apply("<i>", "</i>", "متن کج")}
      >
        <em>I</em>
      </button>
      <span className="rich-toolbar__hint">متن را انتخاب کنید، بعد B یا I</span>
    </div>
  );
}
