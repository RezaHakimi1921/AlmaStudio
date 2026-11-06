import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Self-hosted Vazirmatn (OFL) — no dependency on Google Fonts at build or runtime */
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap", // text shows at once in a system font, then swaps
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const INTRO_GATE = `try{var s=location.search,k="alma-intro:"+(location.pathname.replace(/\\/+$/,"")||"/"),t=+localStorage.getItem(k)||0;if(matchMedia("(prefers-reduced-motion: reduce)").matches||/[?&]shot\\b/.test(s)||(!/[?&]intro=1\\b/.test(s)&&t&&Date.now()-t<864e5))document.documentElement.setAttribute("data-intro","skip")}catch(e){}`;

const SITE_URL = process.env.SITE_URL || "https://alma.artepersia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "آتلیه آلما | Alma Studio",
  description: "لینک‌های اختصاصی مشتریان آتلیه آلما — عکاسی نوزاد و بارداری",
  icons: {
    icon: [{ url: "/alma-apple.svg", type: "image/svg+xml" }],
    shortcut: ["/alma-apple.svg"],
    apple: [{ url: "/alma-apple.svg" }],
  },
  openGraph: {
    siteName: "آتلیه آلما",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before the first paint: returning visitors (intro seen < 24h ago),
            reduced-motion users and ?shot never see the intro overlay — not even for a frame.
            Keep the key / window in sync with src/lib/intro.ts */}
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_GATE,
          }}
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
