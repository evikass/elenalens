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
  title: "ElenaLens — Фотостудия Елены | Портретная, семейная и свадебная фотография",
  description:
    "ElenaLens — фотостудия Елены. Создаю живые портреты, семейные истории и свадебные кадры, которые остаются с вами навсегда. Москва и область.",
  keywords: [
    "ElenaLens",
    "Елена Ленс",
    "фотограф Москва",
    "портретная съёмка",
    "семейный фотограф",
    "свадебный фотограф",
    "фотостудия",
    "женский портрет",
    "детская съёмка",
  ],
  authors: [{ name: "ElenaLens" }],
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
