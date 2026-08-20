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

/**
 * Una imagen del deck. El ancho y el alto NO se escriben a mano: se leen del
 * propio archivo al construir (ver `medirPng`). Escribirlos a mano es la vía
 * directa a un salto de maquetación, que es justo el CLS que hay que evitar.
 */
const imagenSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

type Imagen = z.infer<typeof imagenSchema> & { ancho: number; alto: number };

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
type SlideBase = z.infer<typeof slideSchema>;
/** Como el esquema, pero con las imágenes ya medidas. */
export type Slide =
  | Exclude<SlideBase, { tipo: "imagen" } | { tipo: "comparativa" }>
  | (Extract<SlideBase, { tipo: "imagen" }> & { imagen: Imagen })
  | (Extract<SlideBase, { tipo: "comparativa" }> & { antes: Imagen; despues: Imagen });
export type Proyecto = Omit<z.infer<typeof proyectoSchema>, "slides"> & {
  slug: string;
  slides: Slide[];
};

const CONTENT_DIR = join(process.cwd(), "content", "proyectos");

/** Lee ancho y alto de la cabecera IHDR de un PNG, sin dependencias. */
function medirPng(src: string): { ancho: number; alto: number } {
  const buf = readFileSync(join(process.cwd(), "public", src.replace(/^\//, "")));
  if (buf.length < 24 || buf.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`No se pudo medir ${src}: no parece un PNG con cabecera IHDR.`);
  }
  return { ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) };
}

/** Cuenta palabras de una diapositiva para el límite del §4 del brief. */
function palabrasDe(slide: SlideBase): number {
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
      // Se completan las dimensiones reales de cada imagen
      const slides = parsed.data.slides.map((slide) => {
        if (slide.tipo === "imagen") {
          return { ...slide, imagen: { ...slide.imagen, ...medirPng(slide.imagen.src) } };
        }
        if (slide.tipo === "comparativa") {
          return {
            ...slide,
            antes: { ...slide.antes, ...medirPng(slide.antes.src) },
            despues: { ...slide.despues, ...medirPng(slide.despues.src) },
          };
        }
        return slide;
      });
      return { ...parsed.data, slides, slug } as Proyecto;
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
