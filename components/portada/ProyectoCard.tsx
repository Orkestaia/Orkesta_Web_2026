import Image from "next/image";
import { cn } from "@/lib/cn";

export type TarjetaProyecto = {
  slug: string;
  cliente: string;
  sector: string;
  pais: string;
  logo?: string;
  iniciales?: string;
};

/**
 * Contenido de una tarjeta del carrusel — brief §3.
 * El logo manda; debajo, cliente en Space Grotesk y sector en mono cyan.
 * Sin logo se usa un tratamiento tipográfico, nunca un hueco roto.
 */
export function ProyectoCard({
  p,
  prioridad = false,
}: {
  p: TarjetaProyecto;
  prioridad?: boolean;
}) {
  return (
    <>
      <span className="flex flex-1 items-center justify-center px-7 py-6">
        {p.logo ? (
          <Image
            src={p.logo}
            alt=""
            width={220}
            height={110}
            priority={prioridad}
            sizes="(max-width: 767px) 60vw, 220px"
            className="max-h-[88px] w-auto max-w-[78%] object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-display text-[3.25rem] leading-none font-bold tracking-tight text-ork-text-muted"
          >
            {p.iniciales ?? p.cliente.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className={cn("block border-t border-ork-border px-6 pt-4 pb-5")}>
        <span className="block font-display text-body-lg leading-tight font-bold text-ork-text">
          {p.cliente}
        </span>
        <span className="mt-1.5 block font-mono text-[0.6875rem] tracking-[0.12em] text-ork-cyan uppercase">
          {p.sector} · {p.pais}
        </span>
      </span>
    </>
  );
}
