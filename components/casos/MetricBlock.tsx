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
        <div key={m.etiqueta} className="rounded-xl border border-ork-border bg-ork-surface-1 p-6">
          <dd
            className={cn(
              "font-display font-bold text-ork-cyan-hi",
              size === "lg" ? "text-h2" : "text-h3",
            )}
          >
            {m.valor}
          </dd>
          <dt className="mt-2 text-small text-ork-text-muted">{m.etiqueta}</dt>
          {m.nota ? (
            <p className="mt-2 font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
              {m.nota}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
