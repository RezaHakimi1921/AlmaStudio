import { faMoney, toFaDigits } from "@/lib/tehran";
import type { StudioPackage } from "@/lib/types";
import { CheckIcon, TagIcon } from "./Icons";

/** Package cards — swipeable row on phones. Also used as the live preview in admin. */
export function PackagesSection({
  packages,
  garden = false,
  reveal = true,
}: {
  packages: StudioPackage[];
  garden?: boolean;
  reveal?: boolean;
}) {
  if (!packages.length) return null;
  return (
    <section
      className={`packages${garden ? " packages--garden" : ""}`}
      data-reveal={reveal ? "" : undefined}
    >
      <h2 className="card-title">
        <span className="card-title__icon">
          <TagIcon />
        </span>
        پکیج‌ها و قیمت
      </h2>
      <div className="packages__row">
        {packages.map((p) => {
          const off = p.oldPrice > p.price && p.price > 0 ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
          return (
            <article key={p.id} className={`pkg-card${p.badge ? " is-featured" : ""}`}>
              {p.badge ? <span className="pkg-card__badge">{p.badge}</span> : null}
              <h3>{p.name}</h3>
              {p.description ? <p className="pkg-card__desc">{p.description}</p> : null}
              <div className="pkg-card__price">
                {p.price > 0 ? (
                  <>
                    <strong>{faMoney(p.price)}</strong>
                    <span>تومان</span>
                  </>
                ) : (
                  <strong className="pkg-card__ask">قیمت با تماس</strong>
                )}
              </div>
              {off > 0 ? (
                <p className="pkg-card__old">
                  <s>{faMoney(p.oldPrice)}</s>
                  <em>{toFaDigits(off)}٪ تخفیف</em>
                </p>
              ) : null}
              {p.features.length ? (
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <CheckIcon size={12} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
      {packages.length > 1 ? <p className="packages__hint">برای دیدن پکیج‌های دیگر ورق بزنید ←</p> : null}
    </section>
  );
}
