import Link from "next/link";
import { readContent } from "@/lib/content";
import { publicPathForSlug } from "@/lib/routes";
import { normalizeMediaUrl } from "@/lib/media";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();
  const hub = content.settings.hub;
  const hero = normalizeMediaUrl(hub.heroImageUrl);

  return (
    <main className="hub-page">
      <section className="hub-hero" aria-label="معرفی آتلیه آلما">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hub-hero__photo"
          src={hero}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="hub-hero__veil" />
        <div className="hub-hero__copy glass-strong">
          <AlmaAppleLogo size={48} className="alma-logo--on-dark" />
          <h1 className="hub-hero__title">{hub.title}</h1>
          {hub.subtitle ? <p className="hub-hero__subtitle">{hub.subtitle}</p> : null}
        </div>
      </section>

      <section className="hub-body">
        <header className="hub-body__head">
          <p className="hub-body__eyebrow">لینک‌های مشتریان</p>
          <p className="hub-body__hint">یکی از موضوع‌ها را انتخاب کنید</p>
        </header>
        <ul className="hub-list">
          {content.pages
            .filter((page) => page.published)
            .map((page) => {
              const href = publicPathForSlug(page.slug);
              return (
                <li key={page.slug}>
                  <Link href={href} className="hub-card glass">
                    <span className="hub-card__text">
                      <strong className="hub-card__title">{page.title}</strong>
                      <span className="hub-card__mood">{page.moodTag}</span>
                      <span className="hub-card__desc">{page.subtitle}</span>
                    </span>
                    <span className="hub-card__enter" aria-hidden="true">
                      ورود
                    </span>
                  </Link>
                </li>
              );
            })}
          {content.settings.decors.enabled && content.settings.decors.items.some((d) => d.visible) ? (
            <li>
              <Link href="/dekor" className="hub-card glass">
                <span className="hub-card__text">
                  <strong className="hub-card__title">دکورهای آتلیه</strong>
                  <span className="hub-card__mood">انتخاب با شماره</span>
                  <span className="hub-card__desc">دکور دلخواهتان را قبل از جلسه انتخاب کنید</span>
                </span>
                <span className="hub-card__enter" aria-hidden="true">
                  ورود
                </span>
              </Link>
            </li>
          ) : null}
          {content.settings.gallery.enabled ? (
            <li>
              <Link href="/nemoone-kar" className="hub-card glass">
                <span className="hub-card__text">
                  <strong className="hub-card__title">نمونه‌کارها</strong>
                  <span className="hub-card__mood">گالری</span>
                  <span className="hub-card__desc">بارداری · نوزاد · کودک</span>
                </span>
                <span className="hub-card__enter" aria-hidden="true">
                  ورود
                </span>
              </Link>
            </li>
          ) : null}
        </ul>
        <footer className="hub-admin">
          <p className="hub-admin__note">ورود مدیریت فقط برای تیم آتلیه</p>
          <Link href="/admin" className="hub-admin__link">
            پنل مدیریت
          </Link>
        </footer>
      </section>
    </main>
  );
}
