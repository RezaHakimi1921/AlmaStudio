type Props = {
  showInstagram: boolean;
  showMaps: boolean;
  instagramUrl: string;
  mapsUrl: string;
  garden?: boolean;
};

export function CtaButtons({
  showInstagram,
  showMaps,
  instagramUrl,
  mapsUrl,
  garden = false,
}: Props) {
  if (!showInstagram && !showMaps) return null;

  return (
    <div className="cta-stack">
      {showInstagram ? (
        <div>
          <p className="cta-heading">شبکه‌های اجتماعی</p>
          <a
            className={`cta-btn${garden ? " cta-btn--garden" : ""}`}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            <span>اینستاگرام</span>
          </a>
        </div>
      ) : null}
      {showMaps ? (
        <div>
          <p className="cta-heading">آدرس و مسیریابی</p>
          <a
            className="cta-btn cta-btn--ghost"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PinIcon />
            <span>مسیریاب گوگل</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
