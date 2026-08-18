import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { locales, type Locale } from "@/lib/i18n";
import { LINKEDIN_URL, SITE_URL } from "@/lib/site";

// Organization + ProfessionalService — spec §9.3
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "Orkesta",
  legalName: "Orkesta Automatización & IA",
  url: SITE_URL,
  sameAs: [LINKEDIN_URL],
  areaServed: ["ES", "US", "CL"],
  description:
    "Automatización e IA aplicadas a los procesos reales de negocio: captación, atención 24/7, operación y contenido.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  return (
    <div className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
