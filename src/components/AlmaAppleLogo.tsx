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
        <path
          d="M32 14c4.5-8 12.5-9.5 16-8.5-3.5 4.5-3.5 9-1 12.5 7 3.5 12.5 11.5 12.5 20.5C59.5 51 49 61 32 61S4.5 51 4.5 38.5c0-9 5.5-17 12.5-20.5 2.5-3.5 2.5-8-1-12.5C19.5 4.5 27.5 6 32 14z"
          fill={apple}
        />
        <path
          d="M32 14c0-6 4.5-10.5 9-12-1.5 6-4.5 9.5-9 12z"
          fill={leaf}
        />
        <circle cx="38" cy="34" r="3" fill={onDark ? "#A83232" : "#F8F3ED"} opacity="0.85" />
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
