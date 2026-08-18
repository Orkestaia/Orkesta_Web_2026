import type { MDXComponents } from "mdx/types";
import type { Caso } from "@/lib/casos";
import { MetricBlock } from "@/components/casos/MetricBlock";
import { Pendiente } from "@/components/casos/Pendiente";

/**
 * Mapeo de elementos MDX a la escala tipográfica de ORKESTA-DESIGN.md.
 * <Metricas /> y <Pendiente /> son los únicos componentes disponibles en el
 * cuerpo de un caso; Metricas renderiza el frontmatter, nunca cifras propias.
 */
export function buildMdxComponents(caso: Caso): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-14 mb-5 font-display text-h3 font-bold text-ork-text first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-10 mb-4 font-display text-body-lg font-bold text-ork-text" {...props} />
    ),
    p: (props) => <p className="my-5 max-w-[68ch] text-body text-ork-text-muted" {...props} />,
    ul: (props) => (
      <ul className="my-5 max-w-[68ch] list-disc space-y-3 pl-6 text-ork-text-muted" {...props} />
    ),
    ol: (props) => (
      <ol
        className="my-5 max-w-[68ch] list-decimal space-y-3 pl-6 text-ork-text-muted"
        {...props}
      />
    ),
    li: (props) => <li className="text-body" {...props} />,
    strong: (props) => <strong className="font-semibold text-ork-text" {...props} />,
    a: (props) => (
      <a
        className="text-ork-cyan underline decoration-ork-cyan/40 underline-offset-4 hover:text-ork-cyan-hi"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-small" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="border-b border-ork-border-hi px-3 py-2 text-left font-mono text-mono-label tracking-[0.12em] text-ork-text-faint uppercase"
        {...props}
      />
    ),
    td: (props) => (
      <td className="border-b border-ork-border px-3 py-2 text-ork-text-muted" {...props} />
    ),
    Metricas: ({ titulo }: { titulo?: string }) =>
      caso.metricas.length > 0 ? (
        <section className="my-10">
          <p className="mb-4 font-mono text-mono-label tracking-[0.12em] text-ork-cyan uppercase">
            <span aria-hidden="true">— </span>
            {titulo ?? "Métricas"}
          </p>
          <MetricBlock metrics={caso.metricas} size="sm" />
        </section>
      ) : null,
    Pendiente,
  };
}
