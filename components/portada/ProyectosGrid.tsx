import Link from "next/link";
import { ProyectoCard, type TarjetaProyecto } from "./ProyectoCard";

/**
 * Rejilla de proyectos: lo que pinta el servidor y lo que se queda en móvil
 * y con prefers-reduced-motion. Scroll normal, sin 3D — brief §3.
 */
export function ProyectosGrid({ proyectos }: { proyectos: TarjetaProyecto[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {proyectos.map((p, i) => (
        <li key={p.slug}>
          <Link
            href={"/proyectos/" + p.slug}
            className="ork-tarjeta ork-tarjeta--rejilla"
            aria-label={p.cliente + " — " + p.sector + ", " + p.pais}
          >
            <ProyectoCard p={p} prioridad={i < 4} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
