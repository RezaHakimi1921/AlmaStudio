import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "آتلیه آلما | Alma Studio",
  description: "لینک‌های اختصاصی مشتریان آتلیه آلما — عکاسی نوزاد و بارداری",
  icons: {
    icon: [{ url: "/alma-apple.svg", type: "image/svg+xml" }],
    shortcut: ["/alma-apple.svg"],
    apple: [{ url: "/alma-apple.svg" }],
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
