import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { publicPathForSlug } from "@/lib/routes";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";

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

  const content = await readContent();

  return (
    <main className="admin-shell">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <AlmaAppleLogo size={40} variant="lockup" />
          <p className="home-lead" style={{ marginBottom: "1rem" }}>
            ویرایش ساده هر لینک — عنوان، تصویر، متن، تلفن
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <nav className="admin-tiles" aria-label="بخش‌های پنل">
        <Link href="/admin/settings" className="admin-tile">
          <strong>اطلاعیه، ساعات و سوالات</strong>
          <span>جشنواره و تخفیف · ساعات پذیرش · سوالات متداول</span>
        </Link>
        <Link href="/admin/gallery" className="admin-tile">
          <strong>نمونه‌کارها</strong>
          <span>
            گالری بارداری، نوزاد و کودک · {content.settings.gallery.images.length.toLocaleString("fa-IR")}{" "}
            تصویر
          </span>
        </Link>
        <Link href="/admin/packages" className="admin-tile">
          <strong>پکیج‌ها و قیمت</strong>
          <span>
            {content.settings.packages.items.length.toLocaleString("fa-IR")} پکیج · با پیش‌نمایش آنچه
            مشتری می‌بیند
          </span>
        </Link>
        <Link href="/admin/decors" className="admin-tile">
          <strong>دکورهای آتلیه</strong>
          <span>
            {content.settings.decors.items.length.toLocaleString("fa-IR")} دکور شماره‌دار · مشتری
            انتخاب می‌کند
          </span>
        </Link>
        <Link href="/admin/stats" className="admin-tile">
          <strong>آمار بازدید و کلیک</strong>
          <span>بازدید هر صفحه، تماس، مسیریابی و اشتراک‌گذاری</span>
        </Link>
      </nav>

      <div className="admin-backup glass">
        <div>
          <strong>نسخه پشتیبان</strong>
          <span>همه متن‌ها، تنظیمات، آمار و عکس‌ها در یک فایل — هفته‌ای یک بار دانلود کنید</span>
        </div>
        <a className="admin-btn admin-btn--ghost" href="/api/backup" download>
          دانلود پشتیبان
        </a>
      </div>

      <h2 className="admin-section-title">لینک‌های مشتریان</h2>

      <ul className="home-list">
        {content.pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/admin/${page.slug}`} className="glass">
              <strong>
                {page.title}{" "}
                {!page.published ? <span className="draft-badge">پیش‌نویس</span> : null}
              </strong>
              <span>
                {page.moodTag} · {publicPathForSlug(page.slug)} ·{" "}
                {page.phone.trim() ? `تماس: ${page.phone.trim()}` : "بدون شماره تماس"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
