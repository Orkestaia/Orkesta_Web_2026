import { getCaso, getCasosPublicados } from "@/lib/casos";
import { locales } from "@/lib/i18n";
import { ogImage, OG_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Caso de automatización — Orkesta";

export function generateStaticParams() {
  return locales.flatMap((lang) => getCasosPublicados().map((c) => ({ lang, slug: c.slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return new Response("Not found", { status: 404 });
  return ogImage({
    eyebrow: `${caso.sector} · ${caso.pais}`,
    title: caso.titular,
    cifras: caso.tarjeta.map((t) => ({ valor: t.valor, etiqueta: t.etiqueta })),
    footer: caso.cliente,
  });
}
