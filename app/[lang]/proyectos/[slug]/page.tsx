import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProyecto, getProyectos } from "@/lib/proyectos";
import { locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { Deck } from "@/components/proyecto/Deck";
import { Slide } from "@/components/proyecto/Slide";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProyectos().map((p) => ({ lang, slug: p.slug })));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProyecto(slug);
  if (!p) return {};
  return {
    title: `${p.cliente} — ${p.sector} | Orkesta`,
    description: p.resumen,
    alternates: { canonical: `${SITE_URL}/proyectos/${slug}` },
    openGraph: {
      title: `${p.cliente} — Orkesta`,
      description: p.titular,
      url: `${SITE_URL}/proyectos/${slug}`,
      type: "article",
    },
  };
}

/** Etiqueta de cada diapositiva para la barra superior del deck. */
const ETIQUETAS: Record<string, string> = {
  portada: "El proyecto",
  frase: "El problema",
  imagen: "En pantalla",
  comparativa: "Antes y después",
  diagrama: "El sistema",
  cifra: "El resultado",
  lista: "Qué se hizo",
  cierre: "Hablamos",
};

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Proyectos", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: proyecto.cliente },
        ],
      },
      {
        "@type": "CreativeWork",
        name: `${proyecto.cliente} — sistema de automatización`,
        headline: proyecto.titular,
        about: proyecto.sector,
        creator: { "@type": "Organization", name: "Orkesta", url: SITE_URL },
        url: `${SITE_URL}/proyectos/${slug}`,
      },
    ],
  };

  const etiquetas = proyecto.slides.map((s) => ETIQUETAS[s.tipo] ?? "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="ork-deck__salir" aria-label="Volver a los proyectos">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Link>

      <Deck total={proyecto.slides.length} etiquetas={etiquetas}>
        {proyecto.slides.map((slide, i) => (
          <Slide
            key={i}
            slide={slide}
            proyecto={proyecto}
            indice={i}
            total={proyecto.slides.length}
          />
        ))}
      </Deck>
    </>
  );
}
