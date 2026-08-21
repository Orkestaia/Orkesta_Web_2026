import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProyectosNavegador } from "@/components/portada/ProyectosNavegador";
import { getProyectos } from "@/lib/proyectos";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Proyectos — Orkesta",
  description:
    "Dieciséis sistemas de automatización e IA construidos para negocios reales en España, Estados Unidos y Chile.",
  alternates: { canonical: `${SITE_URL}/proyectos` },
  openGraph: {
    title: "Proyectos — Orkesta",
    description: "Dieciséis sistemas construidos, contados de principio a fin.",
    url: `${SITE_URL}/proyectos`,
    type: "website",
  },
};

export default function ProyectosPage() {
  const proyectos = getProyectos().map((p) => ({
    slug: p.slug,
    cliente: p.cliente,
    sector: p.sector,
    pais: p.pais,
    logo: p.logo,
    iniciales: p.iniciales,
    resultado: p.resultado,
  }));

  return (
    <div className="py-12 lg:py-16">
      <Container>
        {/* Cabecera compacta: el catálogo tiene que verse sin bajar */}
        <header className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[30ch]">
            <Eyebrow>Trabajos</Eyebrow>
            {/* Titular fijado por Aitor (2026-08-21). Antes contaba los
                proyectos; el número envejece y no dice de qué van. */}
            <h1 className="mt-4 font-display text-[clamp(1.875rem,2.9vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance text-ork-text">
              Proyectos de automatización con{" "}
              <span className="text-gradient">inteligencia artificial</span>
            </h1>
          </div>
          <p className="max-w-[42ch] text-body text-ork-text-muted lg:pb-2 lg:text-right">
            Negocios que existen, con nombre y apellidos. Cada uno contado de principio a fin.
          </p>
        </header>
        <ProyectosNavegador proyectos={proyectos} />
      </Container>
    </div>
  );
}
