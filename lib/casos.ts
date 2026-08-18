import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Colección tipada de casos del portfolio.
 * Fuente de contenido: portfolio-casos.md (JARVIS). Ninguna cifra sale de otro sitio.
 * Solo métricas 🟢/🟡 — las 🔴 no entran en v1 (decisión de Aitor 2026-08-17).
 */

const metricaSchema = z.object({
  valor: z.string(),
  etiqueta: z.string(),
  nota: z.string().optional(),
});

export const casoSchema = z.object({
  cliente: z.string(),
  sector: z.string(),
  pais: z.string(),
  anio: z.number(),
  periodo: z.string().optional(),
  estado: z.enum(["produccion", "en_construccion", "disenado_no_implementado"]),
  servicios: z.array(z.enum(["captacion", "atencion", "operacion", "contenido"])),
  destacado: z.boolean().default(false),
  /** 🔒 quickrx y psych4u: false hasta OK escrito del cliente. No se renderizan. */
  publicado: z.boolean().default(true),
  fallback_anonimo: z.string().optional(),
  orden: z.number(),
  titular: z.string(),
  /** Meta description y texto de tarjeta en móvil */
  resumen: z.string(),
  /** Las 3 cifras de la tarjeta de portfolio (puede estar vacío: WFP, psych4u) */
  tarjeta: z.array(metricaSchema).max(3).default([]),
  /** Tabla completa de métricas publicables (🟢/🟡) */
  metricas: z.array(metricaSchema).default([]),
  stack: z.string(),
  /** Etiqueta visible en la propia carpeta (separadores 2 y 3) */
  badge: z.string().optional(),
});

export type Metrica = z.infer<typeof metricaSchema>;
export type CasoFrontmatter = z.infer<typeof casoSchema>;
export type Caso = CasoFrontmatter & { slug: string; body: string };

export const SEPARADORES = [
  { estado: "produccion", label: "Sistemas en producción" },
  { estado: "en_construccion", label: "En construcción" },
  { estado: "disenado_no_implementado", label: "Diagnósticos y arquitecturas" },
] as const;

export type EstadoCaso = (typeof SEPARADORES)[number]["estado"];

const CONTENT_DIR = join(process.cwd(), "content", "casos");

let cache: Caso[] | null = null;

/** Todos los casos (incluidos los no publicados). Uso interno. */
function getTodos(): Caso[] {
  if (cache) return cache;
  cache = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = readFileSync(join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = casoSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Frontmatter inválido en ${file}: ${parsed.error.message}`);
      }
      return { ...parsed.data, slug, body: content };
    })
    .sort((a, b) => a.orden - b.orden);
  return cache;
}

/** Solo los publicados. Es la única lista que ve el renderizado. */
export function getCasosPublicados(): Caso[] {
  return getTodos().filter((c) => c.publicado);
}

export function getCaso(slug: string): Caso | undefined {
  return getCasosPublicados().find((c) => c.slug === slug);
}

/** Casos publicados agrupados por separador del archivador, en orden. */
export function getCasosPorSeparador() {
  const publicados = getCasosPublicados();
  return SEPARADORES.map((sep) => ({
    ...sep,
    casos: publicados.filter((c) => c.estado === sep.estado),
  })).filter((g) => g.casos.length > 0);
}
