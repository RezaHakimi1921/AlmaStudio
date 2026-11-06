"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type OrderItem = {
  slug: string;
  title: string;
  path: string;
  published: boolean;
  noPhone: boolean;
};

/** Link list with up/down buttons — the order here is the order on the main page. */
export function AdminLinkOrder({ items: initial }: { items: OrderItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (busy || target < 0 || target >= items.length) return;
    const previous = items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/content/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: next.map((i) => i.slug) }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setItems(previous);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="dash-order-hint">ترتیب این لیست، ترتیب نمایش در صفحه اصلی است.</p>
      {failed ? <p className="dash-order-error">ذخیره ترتیب انجام نشد؛ دوباره تلاش کنید.</p> : null}
      <ul className="dash-links">
        {items.map((item, i) => (
          <li key={item.slug} className="dash-link-row">
            <Link href={`/admin/${item.slug}`} className="dash-link">
              <span>
                <strong>{item.title}</strong>
                <small dir="ltr">{item.path}</small>
              </span>
              <span className="dash-link__meta">
                {item.published ? (
                  <em className="chip chip--ok">منتشر</em>
                ) : (
                  <em className="chip">پیش‌نویس</em>
                )}
                {item.noPhone ? <em className="chip chip--warn">بدون شماره</em> : null}
              </span>
            </Link>
            <span className="dash-order">
              <button
                type="button"
                className="dash-order__btn"
                aria-label={`بالا بردن ${item.title}`}
                disabled={busy || i === 0}
                onClick={() => move(i, -1)}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="m5 12.5 5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="dash-order__btn"
                aria-label={`پایین بردن ${item.title}`}
                disabled={busy || i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
