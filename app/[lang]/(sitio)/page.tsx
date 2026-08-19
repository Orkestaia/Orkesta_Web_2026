import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { NodeFieldGate } from "@/components/portada/NodeFieldGate";
import { ProyectosGrid } from "@/components/portada/ProyectosGrid";
import { ProyectosNavegador } from "@/components/portada/ProyectosNavegador";
import { getProyectos } from "@/lib/proyectos";
import { CAL_URL, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Orkesta — Automatización e IA para negocios",
  description:
    "Sistemas de automatización e IA construidos para negocios reales en España, Estados Unidos y Chile. Dieciséis proyectos, contados de principio a fin.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Orkesta — Automatización e IA para negocios",
    description: "Automatización e IA aplicadas a los procesos reales de tu negocio.",
    url: SITE_URL,
    type: "website",
  },
};

export default function Portada() {
  const proyectos = getProyectos().map((p) => ({
    slug: p.slug,
    cliente: p.cliente,
    sector: p.sector,
    pais: p.pais,
    logo: p.logo,
    iniciales: p.iniciales,
  }));

  return (
    <>
      <NodeFieldGate />
      <div className="relative z-10">
        <Container className="py-14 lg:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10">
            {/* Izquierda: el H1 es el elemento LCP, texto real */}
            <div>
              <Eyebrow>Automatización &amp; IA aplicada</Eyebrow>
              <h1 className="mt-6 font-display text-[clamp(2.1rem,3.3vw,3rem)] leading-[1.06] font-bold tracking-[-0.02em] text-ork-text">
                <span className="h1-line">Automatización e IA</span>
                <span className="h1-line" style={{ "--line-delay": "60ms" } as React.CSSProperties}>
                  aplicadas a los procesos
                </span>
                <span
                  className="h1-line"
                  style={{ "--line-delay": "120ms" } as React.CSSProperties}
                >
                  reales de tu negocio.
                </span>
              </h1>
              <p className="mt-7 max-w-[46ch] text-body-lg text-ork-text-muted">
                Dieciséis sistemas construidos para negocios que existen, con nombre y apellidos.
                Cada uno contado de principio a fin.
              </p>
              <div className="mt-9">
                <Button href={CAL_URL}>Agenda una llamada</Button>
              </div>
            </div>

            {/* Derecha: el navegador de proyectos */}
            <div className="lg:-mr-6">
              <ProyectosNavegador proyectos={proyectos}>
                <ProyectosGrid proyectos={proyectos} />
              </ProyectosNavegador>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
