import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { publicPathForSlug } from "@/lib/routes";
import { readStats } from "@/lib/stats";
import { buildReport } from "@/lib/stats-report";
import { isAnnouncementLive } from "@/lib/announcement";
import { withStudio } from "@/lib/studio";
import { faJalali, tehranDateKey, toFaDigits } from "@/lib/tehran";
import { AnnouncementQuickToggle } from "@/components/AnnouncementQuickToggle";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <main className="admin-shell">
        <AlmaAppleLogo size={44} variant="lockup" />
        <AdminLoginForm />
      </main>
    );
  }

  const [content, stats] = await Promise.all([readContent(), readStats()]);
  const { settings } = content;
  const today = buildReport(stats, 1, []).total;
  const week = buildReport(stats, 7, []).total;
  const ann = settings.announcement;
  const annLive = isAnnouncementLive(ann);
  const annStatus = !ann.enabled
    ? "خاموش"
    : annLive
      ? ann.endDate
        ? `روشن تا ${faJalali(ann.endDate)}`
        : "روشن"
      : ann.startDate && tehranDateKey() < ann.startDate
        ? `از ${faJalali(ann.startDate)} نمایش داده می‌شود`
        : "تاریخش تمام شده";
  const fa = (v: number | undefined) => toFaDigits(String(v ?? 0));

  return (
    <main className="admin-shell">
      <div className="dash-top">
        <AlmaAppleLogo size={40} variant="lockup" />
        <AdminLogoutButton />
      </div>

      <section className="dash-stats" aria-label="خلاصه امروز">
        <Link href="/admin/stats?d=7" className="dash-stat">
          <span>بازدید امروز</span>
          <strong>{fa(today.view)}</strong>
          <small>۷ روز: {fa(week.view)}</small>
        </Link>
        <Link href="/admin/stats?d=7" className="dash-stat dash-stat--accent">
          <span>تماس امروز</span>
          <strong>{fa(today.call)}</strong>
          <small>۷ روز: {fa(week.call)}</small>
        </Link>
        <Link href="/admin/stats?d=7" className="dash-stat">
          <span>مسیریابی امروز</span>
          <strong>{fa((today.map_google ?? 0) + (today.map_neshan ?? 0) + (today.map_balad ?? 0) + (today.map_waze ?? 0))}</strong>
          <small>۷ روز: {fa((week.map_google ?? 0) + (week.map_neshan ?? 0) + (week.map_balad ?? 0) + (week.map_waze ?? 0))}</small>
        </Link>
      </section>

      <AnnouncementQuickToggle
        initial={settings}
        status={annStatus}
        live={annLive}
      />

      <nav className="dash-grid" aria-label="بخش‌های پنل">
        <Link href="/admin/studio" className="dash-card">
          <strong>اطلاعات تماس آتلیه</strong>
          <span>{settings.studio.phone ? toFaDigits(settings.studio.phone) : "شماره تماس وارد نشده"}</span>
        </Link>
        <Link href="/admin/settings" className="dash-card">
          <strong>صفحه اصلی، اطلاعیه، ساعات و سوالات</strong>
          <span>
            ساعات: {settings.hours.enabled ? "روشن" : "خاموش"} · سوالات:{" "}
            {settings.faq.enabled ? `${fa(settings.faq.items.filter((i) => i.visible).length)} سوال` : "خاموش"}
          </span>
        </Link>
        <Link href="/admin/gallery" className="dash-card">
          <strong>نمونه‌کارها</strong>
          <span>
            {settings.gallery.enabled ? `${fa(settings.gallery.images.length)} عکس` : "خاموش"}
          </span>
        </Link>
        <Link href="/admin/packages" className="dash-card">
          <strong>پکیج‌ها و قیمت</strong>
          <span>{fa(settings.packages.items.filter((p) => p.visible).length)} پکیج فعال</span>
        </Link>
        <Link href="/admin/decors" className="dash-card">
          <strong>دکورهای آتلیه</strong>
          <span>
            {settings.decors.enabled ? `${fa(settings.decors.items.filter((d) => d.visible).length)} دکور` : "خاموش"}
          </span>
        </Link>
        <Link href="/admin/stats" className="dash-card">
          <strong>آمار کامل</strong>
          <span>منبع ورود، مقایسه دوره‌ها، ساخت لینک</span>
        </Link>
      </nav>

      <h2 className="admin-section-title">لینک‌های مشتریان</h2>
      <ul className="dash-links">
        {content.pages.map((page) => {
          const eff = withStudio(page, settings.studio);
          return (
            <li key={page.slug}>
              <Link href={`/admin/${page.slug}`} className="dash-link">
                <span>
                  <strong>{page.title}</strong>
                  <small dir="ltr">{publicPathForSlug(page.slug)}</small>
                </span>
                <span className="dash-link__meta">
                  {page.published ? (
                    <em className="chip chip--ok">منتشر</em>
                  ) : (
                    <em className="chip">پیش‌نویس</em>
                  )}
                  {!eff.phone.trim() ? <em className="chip chip--warn">بدون شماره</em> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="admin-backup glass">
        <div>
          <strong>نسخه پشتیبان</strong>
          <span>همه متن‌ها، تنظیمات، آمار و عکس‌ها در یک فایل — هفته‌ای یک بار دانلود کنید</span>
        </div>
        <a className="admin-btn admin-btn--ghost" href="/api/backup" download>
          دانلود پشتیبان
        </a>
      </div>

      <p className="admin-version" dir="ltr">نسخه {process.env.GIT_SHA || "dev"}</p>
    </main>
  );
}
