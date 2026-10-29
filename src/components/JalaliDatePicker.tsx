"use client";

import { useEffect, useRef, useState } from "react";
import {
  FA_MONTHS,
  isoToJalali,
  jalaliMonthLength,
  jalaliToIso,
  jalaliWeekday,
} from "@/lib/jalali";
import { faJalali, tehranDateKey, toFaDigits } from "@/lib/tehran";

const WEEK = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

type Props = {
  /** Gregorian ISO "YYYY-MM-DD" or "" — always shown/picked as شمسی */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  label?: string;
};

/** Persian (Jalali) date picker — Saturday-first, Persian digits. */
export function JalaliDatePicker({ value, onChange, placeholder = "انتخاب تاریخ", label }: Props) {
  const today = isoToJalali(tehranDateKey())!;
  const selected = value ? isoToJalali(value) : null;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ jy: (selected ?? today).jy, jm: (selected ?? today).jm });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      const base = selected ?? today;
      setView({ jy: base.jy, jm: base.jm });
    }
    setOpen((o) => !o);
  }

  function shift(delta: number) {
    setView((v) => {
      const idx = v.jy * 12 + (v.jm - 1) + delta;
      return { jy: Math.floor(idx / 12), jm: (idx % 12) + 1 };
    });
  }

  const days = jalaliMonthLength(view.jy, view.jm);
  const lead = jalaliWeekday(view.jy, view.jm, 1);
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div className="jdp" ref={ref}>
      <button
        type="button"
        className={`jdp__field${value ? "" : " is-empty"}`}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
      >
        <span>{value ? faJalali(value) : placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="jdp__pop" role="dialog" aria-label="تقویم شمسی">
          <div className="jdp__head">
            <button type="button" onClick={() => shift(-1)} aria-label="ماه قبل">
              ›
            </button>
            <strong>
              {FA_MONTHS[view.jm - 1]} {toFaDigits(view.jy)}
            </strong>
            <button type="button" onClick={() => shift(1)} aria-label="ماه بعد">
              ‹
            </button>
          </div>
          <div className="jdp__grid">
            {WEEK.map((w) => (
              <span key={w} className="jdp__wd">
                {w}
              </span>
            ))}
            {cells.map((d, i) =>
              d === null ? (
                <span key={`e${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  className={[
                    "jdp__day",
                    selected && selected.jy === view.jy && selected.jm === view.jm && selected.jd === d
                      ? "is-selected"
                      : "",
                    today.jy === view.jy && today.jm === view.jm && today.jd === d ? "is-today" : "",
                    (i % 7) === 6 ? "is-friday" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    onChange(jalaliToIso(view.jy, view.jm, d));
                    setOpen(false);
                  }}
                >
                  {toFaDigits(d)}
                </button>
              ),
            )}
          </div>
          <div className="jdp__foot">
            <button
              type="button"
              onClick={() => {
                onChange(tehranDateKey());
                setOpen(false);
              }}
            >
              امروز
            </button>
            {value ? (
              <button
                type="button"
                className="jdp__clear"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                پاک کردن
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** 24h time picker with Persian digits (replaces the browser's AM/PM input). */
export function PersianTimeSelect({
  value,
  onChange,
  disabled,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  const [h, m] = value.split(":");
  const minutes = ["00", "15", "30", "45"];
  if (m && !minutes.includes(m)) minutes.push(m);
  minutes.sort();
  return (
    <span className={`ptime${disabled ? " is-disabled" : ""}`} aria-label={label} role="group">
      {/* LTR box so it reads ۱۰:۳۰ — hour first, then minute */}
      <select
        value={h}
        disabled={disabled}
        aria-label="ساعت"
        onChange={(e) => onChange(`${e.target.value}:${m}`)}
      >
        {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((x) => (
          <option key={x} value={x}>
            {toFaDigits(x)}
          </option>
        ))}
      </select>
      <span aria-hidden="true">:</span>
      <select
        value={m}
        disabled={disabled}
        aria-label="دقیقه"
        onChange={(e) => onChange(`${h}:${e.target.value}`)}
      >
        {minutes.map((x) => (
          <option key={x} value={x}>
            {toFaDigits(x)}
          </option>
        ))}
      </select>
    </span>
  );
}
