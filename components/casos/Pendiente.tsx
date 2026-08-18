/**
 * Hueco visible para material pendiente de entrega (brief Fase P, regla 4).
 * Se sustituye por las piezas reales cuando Aitor las aporte. No se rellena
 * con contenido genérico ni imágenes de stock.
 */
export function Pendiente({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <aside
      role="note"
      className="my-8 rounded-xl border border-dashed border-ork-border-hi bg-ork-surface-1 p-6"
    >
      <p className="font-mono text-mono-label tracking-[0.12em] uppercase text-ork-text-muted">
        TODO — {titulo}
      </p>
      {detalle ? <p className="mt-2 text-small text-ork-text-muted">{detalle}</p> : null}
    </aside>
  );
}
