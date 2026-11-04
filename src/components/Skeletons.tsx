/**
 * Route-level loading skeletons (used by loading.tsx files) — same silhouette as
 * the real pages, so nothing jumps when the content streams in.
 * Pure markup: works in server components, no JS needed.
 */

export function LinkPageSkeleton() {
  return (
    <main className="link-shell" aria-busy="true" aria-label="در حال بارگذاری">
      <div className="sk-hero">
        <div className="sk-hero__glass">
          <span className="sk-block sk-line" style={{ width: "34%" }} />
          <span className="sk-block sk-line" style={{ width: "62%", height: "1.7rem" }} />
          <span className="sk-block sk-line" style={{ width: "86%" }} />
        </div>
      </div>
      <div className="sk-body">
        {[78, 64, 70].map((w, i) => (
          <div key={i} className="sk-card">
            <span className="sk-block sk-line" style={{ width: "36%", height: "1.05rem" }} />
            <span className="sk-block sk-line" style={{ width: "100%" }} />
            <span className="sk-block sk-line" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </main>
  );
}

export function GallerySkeleton() {
  return (
    <main className="gallery-shell" aria-busy="true" aria-label="در حال بارگذاری">
      <div className="sk-head">
        <span className="sk-block sk-circle" />
        <span className="sk-block sk-line" style={{ width: "7rem", height: "1.6rem" }} />
        <span className="sk-block sk-line" style={{ width: "12rem" }} />
      </div>
      <div className="sk-block sk-tabs" />
      <div className="sk-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="sk-block" style={{ aspectRatio: "4 / 5" }} />
        ))}
      </div>
    </main>
  );
}

export function DecorSkeleton() {
  return (
    <main className="gallery-shell" aria-busy="true" aria-label="در حال بارگذاری">
      <div className="sk-head">
        <span className="sk-block sk-line" style={{ width: "9rem", height: "1.6rem" }} />
        <span className="sk-block sk-line" style={{ width: "14rem" }} />
      </div>
      <div className="sk-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="sk-block" style={{ aspectRatio: "4 / 5" }} />
        ))}
      </div>
    </main>
  );
}
