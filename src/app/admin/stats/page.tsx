import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { readStats } from "@/lib/stats";
import { buildReport, change, n } from "@/lib/stats-report";
import type { Counts } from "@/lib/stats-report";
import { publicPathForSlug } from "@/lib/routes";
import { sourceLabel } from "@/lib/sources";
import { faJalali, toFaDigits } from "@/lib/tehran";
import type { TrackEvent } from "@/lib/types";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminLinkBuilder } from "@/components/AdminLinkBuilder";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

type Col = { key: TrackEvent | "maps"; label: string };

const PAGE_COLS: Col[] = [
  { key: "view", label: "بازدید" },
  { key: "call", label: "تماس" },
  { key: "maps", label: "مسیریابی" },
  { key: "instagram", label: "اینستاگرام" },
  { key: "bale", label: "بله" },
  { key: "share", label: "ارسال برای همراه" },
  { key: "gallery", label: "نمونه‌کارها" },
  { key: "decor", label: "دکورها" },
  { key: "decor_pick", label: "انتخاب دکور" },
];

const SOURCE_COLS: Col[] = [
  { key: "view", label: "بازدید" },
  { key: "call", label: "تماس" },
  { key: "maps", label: "مسیریابی" },
  { key: "share", label: "ارسال برای همراه" },
];

const fa = (v: number) => toFaDigits(v.toLocaleString("en-US").replace(/,/g, "٬"));
const value = (c: Counts | undefined, key: TrackEvent | "maps") =>
  !c ? 0 : key === "maps" ? n(c.map_google) + n(c.map_neshan) + n(c.map_balad) + n(c.map_waze) : n(c[key]);

function Delta({ now, before }: { now: number; before: number }) {
  const d = change(now, before);
  if (d === null) return <em className="stat-delta">دوره قبل: بدون داده</em>;
  const cls = d > 0 ? "is-up" : d < 0 ? "is-down" : "";
  const sign = d > 0 ? "▲" : d < 0 ? "▼" : "•";
  return (
    <em className={`stat-delta ${cls}`}>
      {sign} {toFaDigits(Math.abs(d))}٪ نسبت به دوره قبل
    </em>
  );
}

type Props = { searchParams: Promise<{ d?: string }> };

export default async function AdminStatsPage({ searchParams }: Props) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { d } = await searchParams;
  const range = RANGES.includes(Number(d) as (typeof RANGES)[number]) ? Number(d) : 30;

  const [stats, content] = await Promise.all([readStats(), readContent()]);
  const names: Record<string, string> = Object.fromEntries(content.pages.map((p) => [p.slug, p.title]));
  names.gallery = "صفحه نمونه‌کارها";
  names.decor = "صفحه دکورها";
  const pageKeys = [...content.pages.map((p) => p.slug), "gallery", "decor"];

  const r = buildReport(stats, range, pageKeys);
  const maxViews = Math.max(1, ...r.perDay.map((x) => n(x.c.view)));
  const views = n(r.total.view);
  const callRate = views ? (n(r.total.call) / views) * 100 : 0;
  const prevViews = n(r.previous.view);
  const prevRate = prevViews ? (n(r.previous.call) / prevViews) * 100 : 0;

  const sources = Object.entries(r.perSource).sort((a, b) => n(b[1].view) - n(a[1].view));

  const builderPages = [
    ...content.pages.map((p) => ({ path: publicPathForSlug(p.slug), label: p.title })),
    { path: "/nemoone-kar", label: "نمونه‌کارها" },
    { path: "/dekor", label: "دکورها" },
  ];

  return (
    <main className="admin-shell admin-stats">
      <AdminHeader title="آمار بازدید و کلیک" subtitle="بدون ذخیره هیچ اطلاعات شخصی — فقط شمارش" />

      <nav className="admin-cat-tabs" aria-label="بازه زمانی">
        {RANGES.map((x) => (
          <Link key={x} href={`/admin/stats?d=${x}`} className={x === range ? "is-active" : undefined}>
            {toFaDigits(x)} روز اخیر
          </Link>
        ))}
      </nav>
      <p className="hero-upload__hint">
        {faJalali(r.days[0])} تا {faJalali(r.days[r.days.length - 1])} — در مقایسه با {toFaDigits(range)} روز
        قبل از آن
      </p>

      <div className="stat-tiles">
        <div className="stat-tile">
          <span>بازدید</span>
          <strong>{fa(views)}</strong>
          <Delta now={views} before={prevViews} />
        </div>
        <div className="stat-tile stat-tile--accent">
          <span>تماس</span>
          <strong>{fa(n(r.total.call))}</strong>
          <Delta now={n(r.total.call)} before={n(r.previous.call)} />
        </div>
        <div className="stat-tile">
          <span>مسیریابی</span>
          <strong>{fa(value(r.total, "maps"))}</strong>
          <Delta now={value(r.total, "maps")} before={value(r.previous, "maps")} />
        </div>
        <div className="stat-tile">
          <span>نرخ تماس از بازدید</span>
          <strong>
            {toFaDigits(callRate.toFixed(1)).replace(".", "٫")}
            <small>٪</small>
          </strong>
          <em className="stat-delta">
            دوره قبل: {prevViews ? `${toFaDigits(prevRate.toFixed(1)).replace(".", "٫")}٪` : "بدون داده"}
          </em>
        </div>
      </div>

      <section className="admin-card glass admin-section">
        <h2>روند روزانه بازدید</h2>
        <div className="day-chart" role="img" aria-label="نمودار بازدید روزانه">
          {r.perDay.map(({ day, c }) => (
            <div
              key={day}
              className="day-chart__col"
              title={`${faJalali(day)} — بازدید ${fa(n(c.view))} · تماس ${fa(n(c.call))}`}
            >
              <span className="day-chart__bar" style={{ height: `${(n(c.view) / maxViews) * 100}%` }}>
                {n(c.call) ? <i className="day-chart__call" /> : null}
              </span>
            </div>
          ))}
        </div>
        <div className="day-chart__legend">
          <span>{faJalali(r.days[0], false)}</span>
          <span>
            <i className="day-chart__call day-chart__call--legend" /> روزهایی که تماس داشته
          </span>
          <span>{faJalali(r.days[r.days.length - 1], false)}</span>
        </div>
      </section>

      <section className="admin-card glass admin-section">
        <h2>از کجا آمده‌اند؟</h2>
        {sources.length ? (
          <div className="stat-table-wrap">
            <table className="stat-table">
              <thead>
                <tr>
                  <th>کانال</th>
                  {SOURCE_COLS.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th>نرخ تماس</th>
                </tr>
              </thead>
              <tbody>
                {sources.map(([src, c]) => (
                  <tr key={src}>
                    <th>{sourceLabel(src)}</th>
                    {SOURCE_COLS.map((col) => (
                      <td key={col.key}>{fa(value(c, col.key))}</td>
                    ))}
                    <td>
                      {n(c.view)
                        ? `${toFaDigits(((n(c.call) / n(c.view)) * 100).toFixed(0))}٪`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="hero-upload__hint">هنوز داده‌ای برای این بازه ثبت نشده است.</p>
        )}
        <h3 className="link-builder__title">ساخت لینک برای هر کانال</h3>
        <p className="hero-upload__hint">
          برای بیو اینستاگرام، پیام بله، پیامک و… لینک جدا بسازید تا معلوم شود هر کانال چند بازدید و تماس آورده.
          لینک‌هایی که مشتری با «ارسال برای همراه» می‌فرستد خودکار «ارسال برای همراه» ثبت می‌شوند.
        </p>
        <AdminLinkBuilder pages={builderPages} />
      </section>

      <section className="admin-card glass admin-section">
        <h2>به تفکیک صفحه</h2>
        <div className="stat-table-wrap">
          <table className="stat-table">
            <thead>
              <tr>
                <th>صفحه</th>
                {PAGE_COLS.map((e) => (
                  <th key={e.key}>{e.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageKeys.map((k) => (
                <tr key={k}>
                  <th>{names[k] ?? k}</th>
                  {PAGE_COLS.map((e) => (
                    <td key={e.key}>{fa(value(r.perPage[k], e.key))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hero-upload__hint">
          بازدیدها و کلیک‌ها به وقت تهران و روزانه شمرده می‌شوند. بازدیدهای خودتان (وقتی وارد پنل هستید) و ربات‌های
          پیش‌نمایش لینک (تلگرام، واتس‌اپ و…) شمرده نمی‌شوند.
        </p>
      </section>
    </main>
  );
}
