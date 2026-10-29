import type { LinkSlug } from "@/lib/types";

/** Small monochrome icons for hub cards — not photography */
export function HubLinkIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: `hub-card__svg ${className}`.trim(),
  };

  switch (slug as LinkSlug) {
    case "outdoor-conditions":
      return (
        <svg {...common}>
          <path d="M4 19h16" />
          <path d="M7 19c0-4 2-7 5-9 3 2 5 5 5 9" />
          <path d="M12 10V6" />
          <path d="M9.5 7.5 12 5l2.5 2.5" />
        </svg>
      );
    case "outdoor-prep":
      return (
        <svg {...common}>
          <path d="M9 6h11" />
          <path d="M9 12h11" />
          <path d="M9 18h11" />
          <path d="M4 6.5 5.2 7.7 7.5 5" />
          <path d="M4 12.5 5.2 13.7 7.5 11" />
          <circle cx="5.5" cy="18" r="1.4" />
        </svg>
      );
    case "studio-prep":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M4.5 10.5h2.2l1.4-2.2h7.8l1.4 2.2H19.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
      );
    case "studio-conditions":
    default:
      return (
        <svg {...common}>
          <path d="M7 4h10v16H7z" />
          <path d="M10 8h4" />
          <path d="M10 12h4" />
          <path d="M10 16h2.5" />
        </svg>
      );
  }
}
