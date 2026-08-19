import type { Metadata } from "next";
import { NodeFieldGate } from "@/components/portada/NodeFieldGate";
import { TarjetaAitor } from "@/components/portada/TarjetaAitor";
import { SITE_URL } from "@/lib/site";

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
        {/*
          La portada no lleva texto visible, así que sin este H1 el elemento
          LCP sería el canvas. Va oculto a la vista pero presente en el DOM
          (sr-only, nunca display:none): es el LCP textual, el contenido
          indexable y lo que anuncia un lector de pantalla — brief §2.
        */}
        <h1 className="sr-only">
          {NOMBRE} · {CARGO} · {EMPRESA}
        </h1>
        <TarjetaAitor />
      </div>
    </>
  );
}
