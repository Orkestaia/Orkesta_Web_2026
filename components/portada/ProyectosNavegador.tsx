"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TarjetaProyecto } from "./ProyectoCard";
import { ProyectosGrid } from "./ProyectosGrid";

// El carrusel arrastra gsap: chunk aparte, solo cuando se va a usar.
const ProyectosCarousel = dynamic(
  () => import("./ProyectosCarousel").then((m) => m.ProyectosCarousel),
  { ssr: false },
);

type Vista = "carrusel" | "rejilla";

/**
 * Decide cómo se navegan los proyectos y deja elegir — brief §3.
 *
 * El servidor pinta la rejilla: es el contenido semántico, funciona sin
 * JavaScript y es lo que ve Google. En escritorio sin movimiento reducido se
 * ofrece además el carrusel, y un conmutador para ver los 16 de golpe.
 * En móvil y con prefers-reduced-motion, rejilla siempre y sin conmutador.
 */
export function ProyectosNavegador({ proyectos }: { proyectos: TarjetaProyecto[] }) {
  const [puedeCarrusel, setPuedeCarrusel] = useState(false);
  const [vista, setVista] = useState<Vista>("carrusel");

  useEffect(() => {
    const ancho = window.matchMedia("(min-width: 1024px)");
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluar = () => setPuedeCarrusel(ancho.matches && !movimiento.matches);
    evaluar();
    ancho.addEventListener("change", evaluar);
    movimiento.addEventListener("change", evaluar);
    return () => {
      ancho.removeEventListener("change", evaluar);
      movimiento.removeEventListener("change", evaluar);
    };
  }, []);

  if (!puedeCarrusel) return <ProyectosGrid proyectos={proyectos} />;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <div className="ork-conmutador" role="group" aria-label="Forma de ver los proyectos">
          {(["carrusel", "rejilla"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVista(v)}
              aria-pressed={vista === v}
              className="ork-conmutador__opcion"
            >
              {v === "carrusel" ? "Carrusel" : "Rejilla"}
            </button>
          ))}
        </div>
      </div>
      {vista === "carrusel" ? (
        <ProyectosCarousel proyectos={proyectos} />
      ) : (
        <ProyectosGrid proyectos={proyectos} />
      )}
    </div>
  );
}
