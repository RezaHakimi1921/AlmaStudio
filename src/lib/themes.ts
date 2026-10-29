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
      "linear-gradient(180deg, rgba(88,20,20,0.2) 0%, rgba(40,10,10,0.72) 100%)",
  },
  "studio-prep": {
    accent: "#A83232",
    soft: "rgba(168, 50, 50, 0.1)",
    mood: "حرفه‌ای و صمیمی",
    heroOverlay:
      "linear-gradient(180deg, rgba(60,30,25,0.18) 0%, rgba(40,18,16,0.7) 100%)",
  },
  "outdoor-conditions": {
    accent: "#58745A",
    soft: "rgba(88, 116, 90, 0.14)",
    mood: "طبیعت و اعتماد",
    heroOverlay:
      "linear-gradient(180deg, rgba(40,55,40,0.15) 0%, rgba(35,25,20,0.72) 100%)",
  },
  "outdoor-prep": {
    accent: "#58745A",
    soft: "rgba(88, 116, 90, 0.12)",
    mood: "آرامش و راهنمایی",
    heroOverlay:
      "linear-gradient(180deg, rgba(90,100,70,0.12) 0%, rgba(45,35,25,0.68) 100%)",
  },
};
