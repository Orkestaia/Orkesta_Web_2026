"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Navegación del deck horizontal — brief §4.
 *
 * El carril es un contenedor con scroll-snap horizontal: el desplazamiento
 * con rueda, arrastre táctil e inercia los da el navegador, que lo hace mejor
 * y más accesible que cualquier gestor a mano. Encima se añaden:
 *   - flechas ← →, PageUp/PageDown y espacio
 *   - zonas de click a los lados (15% del ancho)
 *   - Esc o la X para volver
 *   - el foco pasa a la diapositiva nueva
 *
 * Las diapositivas las pinta el servidor (children): la ficha funciona
 * abierta en frío y sin JavaScript.
 */
export function Deck({
  total,
  etiquetas,
  children,
}: {
  total: number;
  etiquetas: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);

  const irA = useCallback(
    (i: number, foco = true) => {
      const rail = railRef.current;
      if (!rail) return;
      const destino = Math.max(0, Math.min(i, total - 1));
      const slide = rail.children[destino] as HTMLElement | undefined;
      if (!slide) return;
      // Asignación directa: el suavizado lo pone el CSS del carril, que
      // además se desactiva solo con prefers-reduced-motion.
      rail.scrollLeft = slide.offsetLeft;
      // El índice se fija por intención, no solo por el evento de scroll: así
      // la etiqueta y el progreso son correctos aunque el desplazamiento
      // suavizado tarde o no llegue a animarse.
      setIndice(destino);
      if (foco) slide.focus({ preventScroll: true });
    },
    [total],
  );

  // Índice activo a partir de la posición real del carril
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setIndice(Math.round(rail.scrollLeft / rail.clientWidth));
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Teclado global
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // El objetivo puede no ser un elemento (p. ej. window): comprobarlo
      // antes de preguntar por su ascendencia.
      const objetivo = e.target instanceof Element ? e.target : null;
      if (objetivo?.closest("a,button,input,textarea")) {
        if (e.key === "Escape") router.push("/proyectos");
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          irA(indice + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          irA(indice - 1);
          break;
        case "Home":
          e.preventDefault();
          irA(0);
          break;
        case "End":
          e.preventDefault();
          irA(total - 1);
          break;
        case "Escape":
          router.push("/proyectos");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indice, irA, router, total]);

  // La rueda vertical avanza el deck: aquí el eje natural de lectura es
  // horizontal, así que no se está rompiendo el scroll de una página normal.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let bloqueado = false;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (bloqueado) return;
      bloqueado = true;
      window.setTimeout(() => {
        bloqueado = false;
      }, 420);
      irA(indice + (e.deltaY > 0 ? 1 : -1), false);
    };
    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, [indice, irA]);

  return (
    <div className="ork-deck">
      <div ref={railRef} className="ork-deck__rail">
        {children}
      </div>

      {/* Zonas de click a los lados — 15% del ancho, altura completa */}
      <button
        type="button"
        className="ork-deck__zona ork-deck__zona--prev"
        aria-label="Diapositiva anterior"
        tabIndex={-1}
        onClick={() => irA(indice - 1)}
      />
      <button
        type="button"
        className="ork-deck__zona ork-deck__zona--next"
        aria-label="Diapositiva siguiente"
        tabIndex={-1}
        onClick={() => irA(indice + 1)}
      />

      {/* Etiqueta fija arriba: 03 / 09 · EL SISTEMA */}
      <p className="ork-deck__etiqueta" aria-live="polite">
        {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        <span className="text-ork-text-muted"> · {etiquetas[indice]}</span>
      </p>

      {/* Progreso abajo */}
      <div className="ork-deck__progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
