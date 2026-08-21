"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// `ogl` va en su propio chunk diferido, igual que el Lanyard: no entra en el
// First Load JS de la portada (regla 9 de CLAUDE.md).
const SwarmCursor = dynamic(() => import("./SwarmCursor"), { ssr: false });

type NavegadorConMemoria = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Gate del enjambre de la portada.
 *
 * Es un efecto de puntero: sin puntero fino no tiene ningún sentido, así que
 * ni se descarga en un teléfono. Además monta un segundo contexto WebGL
 * junto al de la ficha, de ahí el filtro de equipo — el mismo que el Lanyard.
 */
export function SwarmCursorGate() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const nav = navigator as NavegadorConMemoria;
    setOk(
      window.matchMedia("(min-width: 1024px)").matches &&
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        (navigator.hardwareConcurrency ?? 2) > 4 &&
        (nav.deviceMemory ?? 2) >= 4 &&
        !nav.connection?.saveData,
    );
  }, []);

  if (!ok) return null;

  return (
    <SwarmCursor
      // Paleta de marca, no la del ejemplo de React Bits: el cyan es el color
      // de lo activo (ORKESTA-DESIGN §2) y el azul del ejemplo no es de aquí.
      color="#00b4d8"
      accentColor="#00e5ff"
      // Ajustado sobre la captura: con los valores del ejemplo el enjambre se
      // fundía en un borrón grande. Con `merge` alto y partículas pequeñas se
      // leen como puntos de luz con estela, que es lo que pega con la marca.
      count={12}
      size={6}
      merge={0.95}
      glow={0.55}
      speed={3}
      spread={150}
      wander={0.3}
      trail={0.7}
      // Va por detrás del titular: a opacidad plena competía con el texto.
      opacity={0.75}
      scatterOnClick
    />
  );
}
