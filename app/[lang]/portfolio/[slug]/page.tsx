import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getCaso, getCasosPublicados } from "@/lib/casos";
import { CAL_URL, SERVICIO_LABELS, SITE_URL } from "@/lib/site";
import { locales } from "@/lib/i18n";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MetricBlock } from "@/components/casos/MetricBlock";
import { buildMdxComponents } from "@/components/casos/mdx-components";

export const dynamic = "force-static";
export const dynamicParams = false;

// Solo los casos publicados generan ruta. Los `publicado: false`
// (quickrx, psych4u) devuelven 404 hasta que llegue el OK escrito.
export function generateStaticParams() {
  return locales.flatMap((lang) => getCasosPublicados().map((c) => ({ lang, slug: c.slug })));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return {};
  return {
    title: `${caso.cliente} — caso de automatización | Orkesta`,
    description: caso.resumen,
    alternates: { canonical: `${SITE_URL}/portfolio/${slug}` },
    openGraph: {
      title: `${caso.cliente} — Orkesta`,
      description: caso.titular,
      url: `${SITE_URL}/portfolio/${slug}`,
      type: "article",
    },
  };
}

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE_URL}/portfolio` },
          { "@type": "ListItem", position: 3, name: caso.cliente },
        ],
      },
      {
        "@type": "CreativeWork",
        name: `${caso.cliente} — sistema de automatización`,
        headline: caso.titular,
        about: caso.sector,
        creator: { "@type": "Organization", name: "Orkesta", url: SITE_URL },
        url: `${SITE_URL}/portfolio/${slug}`,
      },
    ],
  };

  return (
    <article className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="text">
        <nav aria-label="Miga de pan" className="mb-10">
          <Link
            href="/portfolio"
            className="font-mono text-mono-label tracking-[0.12em] text-ork-text-faint uppercase transition-colors duration-[160ms] hover:text-ork-cyan"
          >
            ← Portfolio
          </Link>
        </nav>

        {/* Cabecera — destino de la transición compartida carpeta → caso */}
        <header
          className="rounded-xl border border-ork-border bg-ork-surface-1 p-8"
          style={{ viewTransitionName: `folder-${slug}` } as React.CSSProperties}
        >
          <div
            aria-hidden="true"
            className="mb-6 h-0.5 w-24 rounded-full"
            style={{ background: "var(--ork-gradient)" }}
          />
          <p className="font-mono text-mono-label tracking-[0.12em] text-ork-cyan uppercase">
            {caso.cliente} · {caso.sector} · {caso.pais} · {caso.anio}
            {caso.periodo ? ` · ${caso.periodo}` : ""}
          </p>
          {caso.badge ? (
            <p className="mt-3 inline-block rounded-full border border-ork-border-hi px-3 py-1 font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
              {caso.badge}
            </p>
          ) : null}
          <h1 className="mt-4 font-display text-h2 font-bold text-ork-text">{caso.titular}</h1>
          <p className="mt-5 flex flex-wrap gap-2">
            {caso.servicios.map((s) => (
              <span
                key={s}
                className="rounded-full bg-ork-surface-2 px-3 py-1 text-small text-ork-text-muted"
              >
                {SERVICIO_LABELS[s]}
              </span>
            ))}
          </p>
        </header>

        {/* Bloque resultado: las cifras de la tarjeta, en grande */}
        {caso.tarjeta.length > 0 ? <MetricBlock metrics={caso.tarjeta} className="mt-10" /> : null}

        <div className="mt-12">
          <MDXRemote
            source={caso.body}
            components={buildMdxComponents(caso)}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        {/* Stack: una sola línea discreta, al pie — spec §8.5 */}
        <p className="mt-14 border-t border-ork-border pt-6 font-mono text-small text-ork-text-faint">
          Stack: {caso.stack}
        </p>

        <aside className="mt-14 rounded-xl border border-ork-border bg-ork-surface-1 p-8 text-center">
          <h2 className="font-display text-h3 font-bold text-ork-text">
            ¿Tienes un problema parecido?
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-body text-ork-text-muted">
            Me cuentas cómo funciona hoy tu operación y te digo qué automatizaría primero — y qué
            no.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href={CAL_URL} aria-label="Agenda una llamada (se abre en pestaña nueva)">
              Agenda una llamada
            </Button>
            <Button href="/portfolio" variant="secondary">
              Ver más casos
            </Button>
          </div>
        </aside>
      </Container>
    </article>
  );
}
