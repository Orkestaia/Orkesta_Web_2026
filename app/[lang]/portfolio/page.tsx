import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { CaseDrawer } from "@/components/casos/CaseDrawer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Casos de automatización e IA | Orkesta",
  description:
    "El archivador de Orkesta: sistemas de automatización e IA en producción, en construcción y en diseño, con métricas reales de cada proyecto.",
  alternates: { canonical: `${SITE_URL}/portfolio` },
  openGraph: {
    title: "Casos de automatización e IA | Orkesta",
    description: "Sistemas construidos, no diapositivas.",
    url: `${SITE_URL}/portfolio`,
    type: "website",
  },
};

export default function PortfolioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Portfolio" },
    ],
  };

  return (
    <div className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <header className="mb-16 max-w-[720px] lg:mb-20">
          <Eyebrow index="03">Trabajos</Eyebrow>
          <Heading as="h1" size="h1" className="mt-6">
            Sistemas construidos, no diapositivas.
          </Heading>
          <p className="mt-6 max-w-[68ch] text-body-lg text-ork-text-muted">
            El archivador real de Orkesta: lo que está en producción, lo que está en construcción y
            lo que se quedó en diseño — contado tal cual, con las métricas de cada sistema.
          </p>
        </header>
        <CaseDrawer />
      </Container>
    </div>
  );
}
