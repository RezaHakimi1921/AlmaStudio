import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Self-hosted Vazirmatn (OFL) — no dependency on Google Fonts at build or runtime */
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

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
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
