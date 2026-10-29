import type { IntroTheme } from "./types";

export type PageTheme = {
  accent: string;
  soft: string;
  mood: string;
  heroOverlay: string;
};

export const PAGE_THEMES: Record<IntroTheme, PageTheme> = {
  "studio-conditions": {
    accent: "#A83232",
    soft: "rgba(168, 50, 50, 0.12)",
    mood: "شفافیت و اعتبار",
    heroOverlay:
      "linear-gradient(180deg, rgba(40,12,12,0.08) 0%, rgba(40,12,12,0.28) 45%, rgba(28,8,8,0.62) 100%)",
  },
  "studio-prep": {
    accent: "#A83232",
    soft: "rgba(168, 50, 50, 0.1)",
    mood: "حرفه‌ای و صمیمی",
    heroOverlay:
      "linear-gradient(180deg, rgba(40,20,16,0.08) 0%, rgba(40,18,16,0.25) 45%, rgba(30,12,10,0.6) 100%)",
  },
  "outdoor-conditions": {
    accent: "#58745A",
    soft: "rgba(88, 116, 90, 0.14)",
    mood: "طبیعت و اعتماد",
    heroOverlay:
      "linear-gradient(180deg, rgba(30,45,30,0.05) 0%, rgba(35,40,25,0.22) 45%, rgba(25,20,12,0.58) 100%)",
  },
  "outdoor-prep": {
    accent: "#58745A",
    soft: "rgba(88, 116, 90, 0.12)",
    mood: "آرامش و راهنمایی",
    heroOverlay:
      "linear-gradient(180deg, rgba(50,55,30,0.05) 0%, rgba(45,40,25,0.2) 45%, rgba(30,24,14,0.55) 100%)",
  },
};
