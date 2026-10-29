import type { GalleryCategory } from "./types";

/** Each category has its own mood — colours + copy used on the gallery page. */
export const GALLERY_THEMES: Record<
  GalleryCategory,
  { label: string; tagline: string; accent: string; deep: string; tint: string; glow: string }
> = {
  pregnancy: {
    label: "بارداری",
    tagline: "انتظار شیرین",
    accent: "#c4727c",
    deep: "#8a3f4a",
    tint: "#fbeff0",
    glow: "rgba(214, 140, 150, 0.35)",
  },
  newborn: {
    label: "نوزاد",
    tagline: "اولین روزهای زندگی",
    accent: "#a83232",
    deep: "#7a2222",
    tint: "#f8f1ea",
    glow: "rgba(222, 186, 150, 0.4)",
  },
  kids: {
    label: "کودک",
    tagline: "شادی‌های کودکانه",
    accent: "#58745a",
    deep: "#3f5542",
    tint: "#eef3e8",
    glow: "rgba(176, 141, 62, 0.3)",
  },
};

export const GALLERY_PATH = "/nemoone-kar";
