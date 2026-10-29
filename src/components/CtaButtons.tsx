import { InstagramIcon, PinIcon } from "./Icons";

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
    <div className="cta-stack" data-reveal>
      {showInstagram ? (
        <div>
          <p className="cta-heading">ما را در اینستاگرام دنبال کنید</p>
          <a
            className={`cta-btn cta-btn--shine${garden ? " cta-btn--garden" : ""}`}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            <span>اینستاگرام آلما</span>
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
