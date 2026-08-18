import type { Metrica } from "@/lib/casos";
import { cn } from "@/lib/cn";

/**
 * Cifras grandes de resultado. Los valores son datos reales de
 * portfolio-casos.md — este componente nunca calcula ni redondea.
 */
export function MetricBlock({
  metrics,
  size = "lg",
  className,
}: {
  metrics: Metrica[];
  size?: "lg" | "sm";
  className?: string;
}) {
  if (metrics.length === 0) return null;
  return (
    <dl
      className={cn(
        "grid gap-6",
        size === "lg" ? "sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {metrics.map((m) => (
        // Dentro de <dl>, un <div> de agrupación solo admite <dt> y <dd>:
        // la nota va dentro del <dt>, y el orden visual lo pone flex.
        <div
          key={m.etiqueta}
          className="flex flex-col rounded-xl border border-ork-border bg-ork-surface-1 p-6"
        >
          <dt className="order-2 mt-2 text-small text-ork-text-muted">
            {m.etiqueta}
            {m.nota ? (
              <span className="mt-2 block font-mono text-mono-label tracking-[0.12em] uppercase">
                {m.nota}
              </span>
            ) : null}
          </dt>
          <dd
            className={cn(
              "order-1 font-display font-bold text-ork-cyan-hi",
              size === "lg" ? "text-h2" : "text-h3",
            )}
          >
            {m.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}
