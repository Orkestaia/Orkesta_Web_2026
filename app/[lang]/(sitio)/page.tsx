import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NodeFieldGate } from "@/components/portada/NodeFieldGate";
import { SwarmCursorGate } from "@/components/portada/SwarmCursorGate";
import { TarjetaAitor } from "@/components/portada/TarjetaAitor";
import { CAL_URL, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// El nombre lo confirmó Aitor directamente. El brief traía «Aitor García
// Martínez», que era un marcador de posición: no coincide ni con su correo
// ni con su LinkedIn. Reportado a JARVIS.
const NOMBRE = "Aitor Colino";
const CARGO = "Founder";
const EMPRESA = "Orkesta Automatización & IA";

export const metadata: Metadata = {
  title: `${NOMBRE} — ${CARGO} en ${EMPRESA}`,
  description:
    "Diseño y construyo sistemas de automatización e IA para negocios reales. Dieciséis proyectos en España, Estados Unidos y Chile.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${NOMBRE} — ${EMPRESA}`,
    description: "Automatización e IA aplicadas a procesos reales de negocio.",
    url: SITE_URL,
    type: "profile",
  },
};

export default function Portada() {
  const persona = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NOMBRE,
    jobTitle: CARGO,
    worksFor: { "@type": "Organization", name: "Orkesta", url: SITE_URL },
    url: SITE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(persona) }}
      />
      <NodeFieldGate />
      <div className="ork-portada">
        {/* Enjambre que sigue al puntero. Capa de fondo, por detrás del texto */}
        <SwarmCursorGate />

        <div className="ork-portada__rejilla">
          {/*
            La portada llevaba solo la ficha y el H1 en sr-only (brief §2).
            Decisión de Aitor del 2026-08-21: se veía pobre y ahora lleva
            propuesta de valor escrita. El H1 pasa a ser texto visible, que
            además es mejor LCP que un texto oculto.
          */}
          <div className="ork-portada__texto">
            <Eyebrow>Automatización &amp; IA</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[1.03] font-bold tracking-[-0.03em] text-balance text-ork-text">
              Experimenta los beneficios de{" "}
              <span className="text-gradient">automatizar procesos</span>
            </h1>
            <p className="mt-8 max-w-[46ch] text-body-lg text-ork-text-muted">
              Creamos soluciones a medida para optimizar procesos, mejorar tu productividad y
              aumentar tus ingresos.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={CAL_URL}>Agenda una llamada</Button>
              <Button href="/proyectos" variant="secondary">
                Ver proyectos
              </Button>
            </div>
            {/* La identidad sigue en el DOM para lectores de pantalla y para
                el marcado de Person; en pantalla ya la lleva la ficha. */}
            <p className="sr-only">
              {NOMBRE} · {CARGO} · {EMPRESA}
            </p>
          </div>

          <TarjetaAitor />
        </div>
      </div>
    </>
  );
}
