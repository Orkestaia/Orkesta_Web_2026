import type { Metadata } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

// Fuentes autoalojadas, subset latino — ORKESTA-DESIGN.md §3.
// Nada de Google Fonts por CDN.
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin-700-normal.woff2",
  weight: "700",
  display: "optional", // display: no compromete el LCP
  variable: "--font-space-grotesk",
});

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://orkesta-web-2026.vercel.app"),
  title: "Orkesta — Automatización e IA para negocios",
  description: "Automatización e IA aplicadas a los procesos reales de tu negocio.",
  // noindex mientras el sitio esté incompleto (sin home). Se quita en F1.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        lang="es"
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}
