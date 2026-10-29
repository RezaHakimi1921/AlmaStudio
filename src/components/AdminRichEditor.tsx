"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  /** Remount when this changes so HTML reloads without fighting the caret */
  resetKey?: string;
};

/**
 * Lightweight WYSIWYG — user sees bold/italic in place, never raw &lt;b&gt; tags.
 * Persists sanitized-ish HTML via innerHTML for the public page.
 */
export function AdminRichEditor({ value, onChange, resetKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = value || "<p></p>";
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps -- seed only on page change

  function emit() {
    const el = ref.current;
    if (!el) return;
    onChange(el.innerHTML);
  }

  function format(command: "bold" | "italic") {
    const el = ref.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false);
    emit();
  }

  return (
    <div className="rich-field">
      <div className="rich-field__head">
        <span className="rich-field__label">متن اصلی صفحه</span>
        <div className="rich-toolbar" role="toolbar" aria-label="قالب‌بندی متن">
          <button
            type="button"
            className="rich-toolbar__btn"
            title="پررنگ"
            aria-label="پررنگ"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("bold")}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="rich-toolbar__btn"
            title="کج"
            aria-label="کج"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("italic")}
          >
            <em>I</em>
          </button>
          <span className="rich-toolbar__hint">انتخاب کنید، بعد B یا I</span>
        </div>
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="متن اصلی صفحه"
        data-placeholder="متن را اینجا بنویسید…"
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
