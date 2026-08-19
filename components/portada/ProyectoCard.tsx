import Image from "next/image";

export type TarjetaProyecto = {
  slug: string;
  cliente: string;
  sector: string;
  pais: string;
  logo?: string;
  iniciales?: string;
  /** Línea de resultado que aparece solo al enfocar la tarjeta — brief §3 */
  resultado?: string;
};

/**
 * Contenido de una tarjeta de proyecto — brief §3.
 * El logo manda; debajo, cliente en Space Grotesk y sector en mono cyan.
 * La línea de resultado está en el DOM siempre (por accesibilidad) pero solo
 * se ve al enfocar: da información sin cargar la tarjeta en reposo.
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
      <span aria-hidden="true" className="ork-tarjeta__filete" />
      <span className="ork-tarjeta__logo">
        {p.logo ? (
          <Image
            src={p.logo}
            alt=""
            width={220}
            height={110}
            priority={prioridad}
            sizes="(max-width: 1023px) 45vw, 220px"
            className="max-h-[84px] w-auto max-w-[78%] object-contain"
          />
        ) : (
          <span aria-hidden="true" className="ork-tarjeta__iniciales">
            {p.iniciales ?? p.cliente.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className="ork-tarjeta__pie">
        <span className="ork-tarjeta__cliente">{p.cliente}</span>
        <span className="ork-tarjeta__sector">
          {p.sector} · {p.pais}
        </span>
        {p.resultado ? <span className="ork-tarjeta__resultado">{p.resultado}</span> : null}
      </span>
    </>
  );
}
