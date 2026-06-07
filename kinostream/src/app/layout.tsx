import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "KinoStream — Бесплатный онлайн-кинотеатр",
    template: "%s | KinoStream",
  },
  description:
    "Смотрите фильмы и сериалы бесплатно. Огромная библиотека, новинки, без подписки — только короткая реклама перед просмотром.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${bebas.variable} h-full`}>
      <body className="cinema-bg cinema-grain min-h-full flex flex-col text-zinc-100 antialiased">
        <Header />
        <DemoBanner />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
