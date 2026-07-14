import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElenaLens — Фотостудия Елены | Портретная, семейная и свадебная фотография в Нижнем Новгороде и Кирове",
  description:
    "ElenaLens — фотостудия Елены. Создаю живые портреты, семейные истории и свадебные кадры, которые остаются с вами навсегда. Нижний Новгород и Киров (Вятка).",
  keywords: [
    "ElenaLens",
    "Елена Ленс",
    "фотограф Нижний Новгород",
    "фотограф Киров",
    "портретная съёмка",
    "семейный фотограф",
    "свадебный фотограф",
    "фотостудия",
    "женский портрет",
    "детская съёмка",
  ],
  authors: [{ name: "ElenaLens" }],
  icons: {
    icon: [
      { url: "favicon.ico", sizes: "any" },
      { url: "favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "site.webmanifest",
  openGraph: {
    title: "ElenaLens — Фотостудия Елены",
    description:
      "Живые портреты, семейные истории, свадебные кадры. Фотограф Елена.",
    siteName: "ElenaLens",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
