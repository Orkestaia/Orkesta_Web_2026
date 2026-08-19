import Link from "next/link";
import { ProyectoCard, type TarjetaProyecto } from "./ProyectoCard";

/**
 * Rejilla de proyectos: es lo que pinta el servidor y lo que se queda en
 * móvil y con prefers-reduced-motion (brief §3). Scroll normal, sin 3D.
 */
export function ProyectosGrid({ proyectos }: { proyectos: TarjetaProyecto[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((p, i) => (
        <li key={p.slug}>
          <Link
            href={"/proyectos/" + p.slug}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-ork-border bg-ork-surface-1 transition-colors duration-[240ms] ease-ork hover:border-ork-border-hi hover:bg-ork-surface-2"
          >
            <span aria-hidden="true" className="ork-borde-marca" />
            <ProyectoCard p={p} prioridad={i < 2} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
