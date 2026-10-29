type Props = {
  phone: string;
  showMaps?: boolean;
  mapsUrl?: string;
  garden?: boolean;
};

export function ContactBar({
  phone,
  showMaps = false,
  mapsUrl = "",
  garden = false,
}: Props) {
  const ready = phone.trim().length > 0;
  const split = showMaps && Boolean(mapsUrl);

  return (
    <div className={`float-cta glass-strong${split ? " float-cta--split" : ""}`}>
      {ready ? (
        <a
          className={`cta-btn${garden ? " cta-btn--garden" : ""}`}
          href={`tel:${phone.replace(/\s+/g, "")}`}
        >
          تماس
        </a>
      ) : (
        <button type="button" className="cta-btn is-disabled" disabled>
          تماس
        </button>
      )}
      {split ? (
        <a
          className="cta-btn cta-btn--ghost"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          مسیریاب
        </a>
      ) : null}
    </div>
  );
}
