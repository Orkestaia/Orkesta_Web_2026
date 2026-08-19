import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Colección de proyectos del portfolio.
 *
 * Cada proyecto es un deck de diapositivas (BRIEF-DEFINITIVO §4). El contenido
 * vive en el frontmatter de content/proyectos/*.mdx como datos tipados, no como
 * prosa: una diapositiva es una estructura, no un párrafo.
 *
 * Fuente de hechos y cifras: portfolio-casos.md (JARVIS). El texto se reescribe
 * en registro de negocio; ninguna cifra sale de otro sitio.
 */

/** Un nodo del mapa del sistema. `humano` lo pinta en otro color (§5). */
const nodoSchema = z.object({
  id: z.string(),
  texto: z.string(),
  col: z.number().int().min(0),
  fila: z.number().int().min(0),
  /** Paso que hace una persona, no el sistema. Se pinta en violeta. */
  humano: z.boolean().default(false),
});

const aristaSchema = z.object({
  de: z.string(),
  a: z.string(),
  etiqueta: z.string().optional(),
});

const imagenSchema = z.object({
  src: z.string(),
  alt: z.string(),
  ancho: z.number().int(),
  alto: z.number().int(),
});

const slideSchema = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("portada") }),
  z.object({ tipo: z.literal("frase"), texto: z.string(), pie: z.string().optional() }),
  z.object({
    tipo: z.literal("imagen"),
    imagen: imagenSchema,
    pie: z.string(),
    encaje: z.enum(["cubrir", "contener"]).default("contener"),
  }),
  z.object({
    tipo: z.literal("comparativa"),
    antes: imagenSchema,
    despues: imagenSchema,
    pie: z.string(),
  }),
  z.object({
    tipo: z.literal("diagrama"),
    titulo: z.string(),
    nodos: z.array(nodoSchema).min(2),
    aristas: z.array(aristaSchema).min(1),
    pie: z.string().optional(),
  }),
  z.object({
    tipo: z.literal("cifra"),
    valor: z.string(),
    etiqueta: z.string(),
    nota: z.string().optional(),
  }),
  z.object({
    tipo: z.literal("lista"),
    titulo: z.string(),
    puntos: z.array(z.object({ texto: z.string() })).max(4),
  }),
  z.object({ tipo: z.literal("cierre"), stack: z.string() }),
]);

export const proyectoSchema = z.object({
  cliente: z.string(),
  sector: z.string(),
  pais: z.string(),
  anio: z.number().int(),
  /** Los propios van al final del carrusel (§3). */
  grupo: z.enum(["cliente", "propio"]).default("cliente"),
  orden: z.number().int(),
  titular: z.string(),
  /** Meta description y texto de apoyo de la tarjeta. */
  resumen: z.string(),
  logo: z.string().optional(),
  /** Línea de resultado que aparece al enfocar la tarjeta — brief §3 */
  resultado: z.string().optional(),
  /** Sin logo: la tarjeta usa tratamiento tipográfico. */
  iniciales: z.string().optional(),
  stack: z.string(),
  slides: z.array(slideSchema).min(3),
});

export type Nodo = z.infer<typeof nodoSchema>;
export type Arista = z.infer<typeof aristaSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type Proyecto = z.infer<typeof proyectoSchema> & { slug: string };

const CONTENT_DIR = join(process.cwd(), "content", "proyectos");

/** Cuenta palabras de una diapositiva para el límite del §4 del brief. */
function palabrasDe(slide: Slide): number {
  const trozos: string[] = [];
  if ("texto" in slide && slide.texto) trozos.push(slide.texto);
  if ("pie" in slide && slide.pie) trozos.push(slide.pie);
  if ("titulo" in slide && slide.titulo) trozos.push(slide.titulo);
  if ("etiqueta" in slide && slide.etiqueta) trozos.push(slide.etiqueta);
  if ("valor" in slide && slide.valor) trozos.push(slide.valor);
  if ("nota" in slide && slide.nota) trozos.push(slide.nota);
  if (slide.tipo === "lista") trozos.push(...slide.puntos.map((p) => p.texto));
  return trozos.join(" ").split(/\s+/).filter(Boolean).length;
}

let cache: Proyecto[] | null = null;

export function getProyectos(): Proyecto[] {
  if (cache) return cache;
  const proyectos = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(readFileSync(join(CONTENT_DIR, file), "utf8"));
      const parsed = proyectoSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Frontmatter inválido en ${file}:\n${parsed.error.message}`);
      }
      // Límite de palabras por diapositiva — brief §4. Falla el build si se supera.
      parsed.data.slides.forEach((slide, i) => {
        const max = slide.tipo === "lista" ? 90 : 40;
        const n = palabrasDe(slide);
        if (n > max) {
          throw new Error(
            `${file}: la diapositiva ${i + 1} (${slide.tipo}) tiene ${n} palabras, el máximo es ${max}.`,
          );
        }
      });
      return { ...parsed.data, slug };
    });

  // Cliente primero, propios al final; dentro de cada grupo, por orden.
  cache = proyectos.sort(
    (a, b) => (a.grupo === b.grupo ? 0 : a.grupo === "cliente" ? -1 : 1) || a.orden - b.orden,
  );
  return cache;
}

export function getProyecto(slug: string): Proyecto | undefined {
  return getProyectos().find((p) => p.slug === slug);
}
