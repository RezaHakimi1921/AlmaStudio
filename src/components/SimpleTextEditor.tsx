"use client";

import { useEffect, useRef } from "react";
import { sanitizeBodyHtml } from "@/lib/rich-text";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label: string;
};

/**
 * Write like in a notes app: Enter starts a new paragraph, «پررنگ» makes the
 * selected words bold and they look bold right away. No HTML tags visible.
 * Pasted text is inserted as plain text.
 */
export function SimpleTextEditor({ value, onChange, placeholder, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);

  // load outside changes (first render, reset after save) without moving the caret while typing
  useEffect(() => {
    const el = ref.current;
    if (!el || value === lastEmitted.current) return;
    el.innerHTML = sanitizeBodyHtml(value);
    lastEmitted.current = value;
  }, [value]);

  function emit() {
    const el = ref.current;
    if (!el) return;
    const clean = sanitizeBodyHtml(el.innerHTML);
    lastEmitted.current = clean;
    onChange(clean);
  }

  function bold() {
    ref.current?.focus();
    document.execCommand("bold");
    emit();
  }

  return (
    <div className="ste">
      <div className="ste__bar" role="toolbar" aria-label={`ابزار ${label}`}>
        <button
          type="button"
          className="ste__btn"
          onMouseDown={(e) => e.preventDefault()} // keep the selection
          onClick={bold}
          title="کلمات انتخاب‌شده پررنگ می‌شوند"
        >
          <b>ب</b> پررنگ
        </button>
        <span className="ste__tip">کلمه‌ها را انتخاب کنید و «پررنگ» را بزنید · Enter = پاراگراف جدید</span>
      </div>
      <div
        ref={ref}
        className="ste__area"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        data-placeholder={placeholder}
        onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
        onInput={emit}
        onBlur={emit}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
            e.preventDefault();
            bold();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
      />
    </div>
  );
}
