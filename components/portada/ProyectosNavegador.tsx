"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TarjetaProyecto } from "./ProyectoCard";

// El carrusel arrastra gsap: va en su propio chunk y solo se carga cuando
// se va a usar de verdad (escritorio, sin reduced-motion).
const ProyectosCarousel = dynamic(
  () => import("./ProyectosCarousel").then((m) => m.ProyectosCarousel),
  { ssr: false },
);

/**
 * Decide cómo se navegan los proyectos.
 *
 * El servidor pinta siempre la rejilla (children): es el contenido semántico,
 * funciona sin JavaScript y es lo que ve Google. En escritorio y sin
 * prefers-reduced-motion se sustituye por el carrusel con profundidad.
 * En móvil y con movimiento reducido se queda la rejilla — brief §3.
 */
export function ProyectosNavegador({
  proyectos,
  children,
}: {
  proyectos: TarjetaProyecto[];
  children: React.ReactNode;
}) {
  const [carrusel, setCarrusel] = useState(false);

  useEffect(() => {
    const mqAncho = window.matchMedia("(min-width: 1024px)");
    const mqMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluar = () => setCarrusel(mqAncho.matches && !mqMovimiento.matches);
    evaluar();
    mqAncho.addEventListener("change", evaluar);
    mqMovimiento.addEventListener("change", evaluar);
    return () => {
      mqAncho.removeEventListener("change", evaluar);
      mqMovimiento.removeEventListener("change", evaluar);
    };
  }, []);

  if (carrusel) return <ProyectosCarousel proyectos={proyectos} />;
  return <>{children}</>;
}
