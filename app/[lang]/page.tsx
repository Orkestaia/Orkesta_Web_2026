import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { OrkestadorHero } from "@/components/portada/OrkestadorHero";
import { NodeFieldGate } from "@/components/portada/NodeFieldGate";
import { CAL_URL, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Orkesta — Automatización e IA para negocios | Consultoría",
  description:
    "Detectamos dónde pierdes tiempo y dinero, y construimos el sistema que lo arregla. Sistemas en producción en España, Estados Unidos y Chile.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Orkesta — Automatización e IA para negocios",
    description: "Automatización e IA aplicadas a los procesos reales de tu negocio. Sin humo.",
    url: SITE_URL,
    type: "website",
  },
};

// Fila de prueba — cifras reales de portfolio-casos.md, enlazadas a su caso.
// Sin QuickRx: ese caso está en publicado:false hasta el OK escrito.
const PRUEBAS = [
  { valor: "19", etiqueta: "automatizaciones en producción", href: "/portfolio/golden-market" },
  { valor: "×3", etiqueta: "reservas online", href: "/portfolio/sutan-cook" },
  { valor: "14×", etiqueta: "más alcance diario", href: "/portfolio/edelweiss" },
];

export default function Portada() {
  return (
    <>
      <NodeFieldGate />
      <div className="relative z-10">
        <section className="relative overflow-hidden">
          {/* Móvil: la silueta queda de fondo, semitransparente */}
          <OrkestadorHero className="pointer-events-none absolute inset-y-8 right-[-10%] w-[80%] opacity-15 lg:hidden" />

          <Container className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-16 lg:py-0">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
              <div className="relative">
                <Eyebrow>Automatización &amp; IA aplicada</Eyebrow>
                <h1 className="mt-6 font-display text-display font-bold text-ork-text">
                  <span className="h1-line">Automatización e IA</span>
                  <span
                    className="h1-line"
                    style={{ "--line-delay": "60ms" } as React.CSSProperties}
                  >
                    aplicadas a los procesos
                  </span>
                  <span
                    className="h1-line"
                    style={{ "--line-delay": "120ms" } as React.CSSProperties}
                  >
                    reales de tu negocio
                  </span>
                </h1>
                <p className="mt-8 max-w-[52ch] text-body-lg text-ork-text-muted">
                  Detectamos dónde pierdes tiempo y dinero, y construimos el sistema que lo arregla.
                  Sin humo y sin prometerte que la IA lo hará todo.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button
                    href={CAL_URL}
                    aria-label="Agenda una llamada de 30 minutos (se abre en pestaña nueva)"
                  >
                    Agenda una llamada
                  </Button>
                  <Button href="/portfolio" variant="secondary">
                    Ver trabajos
                  </Button>
                </div>
              </div>

              {/* Escritorio: el orkestador protagonista, alineado a la derecha */}
              <OrkestadorHero className="hidden h-[480px] lg:block" />
            </div>
          </Container>
        </section>

        {/* Fila de prueba — brief §5b.5 */}
        <section aria-label="Resultados reales" className="border-t border-ork-border">
          <Container className="py-12 lg:py-16">
            <div className="grid gap-6 sm:grid-cols-3">
              {PRUEBAS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group rounded-xl border border-ork-border bg-ork-surface-1/80 p-6 backdrop-blur-sm transition-colors duration-[240ms] hover:bg-ork-surface-2"
                >
                  <span className="font-display text-h2 font-bold text-ork-cyan-hi">{p.valor}</span>
                  <span className="mt-1 block text-small text-ork-text-muted group-hover:text-ork-text">
                    {p.etiqueta} →
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-8 font-mono text-mono-label tracking-[0.12em] text-ork-text-faint uppercase">
              Sistemas en producción en España, Estados Unidos y Chile.
            </p>
          </Container>
        </section>
      </div>
    </>
  );
}
