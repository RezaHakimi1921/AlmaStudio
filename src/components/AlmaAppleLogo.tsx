type Props = {
  size?: number;
  className?: string;
  variant?: "mark" | "lockup";
  label?: string;
};

export function AlmaAppleLogo({
  size = 40,
  className = "",
  variant = "mark",
  label = "آتلیه آلما",
}: Props) {
  const onDark = className.includes("alma-logo--on-dark");
  const apple = onDark ? "#F8F3ED" : "#A83232";
  const leaf = onDark ? "#C5D5C4" : "#58745A";

  return (
    <span className={`alma-logo ${className}`} style={{ gap: size * 0.2 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="alma-logo__mark"
      >
        <path d="M32 21C27 14 11 15 7.5 32 4.5 47 15.5 61 25.5 60.5 29 60.3 30.5 58.8 32 58.8S35 60.3 38.5 60.5C48.5 61 59.5 47 56.5 32 53 15 37 14 32 21Z" fill={apple} />
        <path d="M16 31C16.5 25 20 21.5 24.5 20.5" fill="none" stroke={onDark ? "#A83232" : "#F8F3ED"} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <path d="M32 22C32.5 15 34.5 10 38 6" fill="none" stroke={onDark ? "#C5D5C4" : "#5B3A29"} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M35.5 14.5C37 8 44 5 51 6.5 49.5 13 43 17 35.5 14.5Z" fill={leaf} />
      </svg>
      {variant === "lockup" ? (
        <span className="alma-logo__label" style={{ fontSize: size * 0.42, color: apple }}>
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
