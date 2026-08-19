import type { Arista, Nodo } from "@/lib/proyectos";

/**
 * Mapa del sistema — brief §5.
 *
 * SVG generado a partir de los datos del MDX, no una imagen estática.
 * Flujo de izquierda a derecha, conexiones con ángulo recto y esquina
 * redondeada (el lenguaje de las alas del logotipo).
 *
 * 🔴 Los pasos que hace una persona van en violeta: es la demostración
 * visual de que no se automatiza todo, que es el argumento de la marca.
 *
 * Todo el movimiento es CSS (ver globals.css): las líneas se dibujan, los
 * nodos entran escalonados y un punto de luz recorre el circuito. Con
 * prefers-reduced-motion no se anima nada.
 */

const ANCHO_NODO = 190;
const ALTO_NODO = 74;
const SEP_X = 96;
const SEP_Y = 30;
const RADIO = 14;

export function FlowDiagram({
  nodos,
  aristas,
  titulo,
}: {
  nodos: Nodo[];
  aristas: Arista[];
  titulo: string;
}) {
  const columnas = Math.max(...nodos.map((n) => n.col)) + 1;
  const filas = Math.max(...nodos.map((n) => n.fila)) + 1;

  const ancho = columnas * ANCHO_NODO + (columnas - 1) * SEP_X;
  const alto = filas * ALTO_NODO + (filas - 1) * SEP_Y;

  const pos = (n: Nodo) => ({
    x: n.col * (ANCHO_NODO + SEP_X),
    y: n.fila * (ALTO_NODO + SEP_Y),
  });
  const porId = new Map(nodos.map((n) => [n.id, n]));

  /** Conexión en L con esquina redondeada, de la derecha de A a la izquierda de B. */
  function trazado(a: Nodo, b: Nodo): string {
    const pa = pos(a);
    const pb = pos(b);
    const x1 = pa.x + ANCHO_NODO;
    const y1 = pa.y + ALTO_NODO / 2;
    const x2 = pb.x;
    const y2 = pb.y + ALTO_NODO / 2;
    const mx = x1 + (x2 - x1) / 2;

    if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} H ${x2}`;

    const dir = y2 > y1 ? 1 : -1;
    const r = Math.min(RADIO, Math.abs(y2 - y1) / 2, Math.abs(mx - x1));
    return [
      `M ${x1} ${y1}`,
      `H ${mx - r}`,
      `Q ${mx} ${y1} ${mx} ${y1 + r * dir}`,
      `V ${y2 - r * dir}`,
      `Q ${mx} ${y2} ${mx + r} ${y2}`,
      `H ${x2}`,
    ].join(" ");
  }

  const trazados = aristas
    .map((a) => {
      const de = porId.get(a.de);
      const hacia = porId.get(a.a);
      if (!de || !hacia) return null;
      return { d: trazado(de, hacia), key: `${a.de}-${a.a}` };
    })
    .filter((t): t is { d: string; key: string } => t !== null);

  return (
    <figure className="ork-diagrama w-full">
      <svg
        viewBox={`-4 -4 ${ancho + 8} ${alto + 8}`}
        className="h-auto w-full"
        role="img"
        aria-label={titulo}
      >
        <title>{titulo}</title>

        {/* Conexiones */}
        <g fill="none" strokeWidth="1.5">
          {trazados.map((t, i) => (
            <path
              key={t.key}
              d={t.d}
              className="ork-diagrama__linea"
              stroke="var(--color-ork-border-hi)"
              style={{ ["--i" as string]: i }}
            />
          ))}
          {/* Punto de luz que recorre el circuito */}
          {trazados.map((t, i) => (
            <path
              key={`luz-${t.key}`}
              d={t.d}
              className="ork-diagrama__luz"
              stroke="var(--color-ork-cyan-hi)"
              style={{ ["--i" as string]: i }}
            />
          ))}
        </g>

        {/* Nodos */}
        {nodos.map((n, i) => {
          const p = pos(n);
          return (
            <g
              key={n.id}
              className="ork-diagrama__nodo"
              style={{ ["--i" as string]: i }}
              transform={`translate(${p.x} ${p.y})`}
            >
              <rect
                width={ANCHO_NODO}
                height={ALTO_NODO}
                rx="12"
                fill="var(--color-ork-surface-2)"
                stroke={n.humano ? "var(--color-ork-violet)" : "var(--color-ork-cyan)"}
                strokeWidth="1.5"
              />
              <foreignObject width={ANCHO_NODO} height={ALTO_NODO}>
                <div className="flex h-full items-center justify-center px-3 text-center">
                  <span
                    className={
                      "text-[0.8125rem] leading-snug " +
                      (n.humano ? "text-ork-violet" : "text-ork-text")
                    }
                  >
                    {n.texto}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {nodos.some((n) => n.humano) ? (
        <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-mono-label tracking-[0.12em] uppercase">
          <span className="flex items-center gap-2 text-ork-text-muted">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-[3px] border border-ork-cyan"
            />
            Lo hace el sistema
          </span>
          <span className="flex items-center gap-2 text-ork-text-muted">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-[3px] border border-ork-violet"
            />
            Lo hace una persona
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
