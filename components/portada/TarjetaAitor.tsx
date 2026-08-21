"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

// El Lanyard arrastra three.js, drei y el motor de física: va en su propio
// chunk y solo se carga cuando de verdad se va a usar — brief §2.
const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

type NavegadorConMemoria = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function hayWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * La portada entera: la ficha de Aitor colgando de un cordón.
 *
 * Solo se monta en escritorio (≥1024 px), sin prefers-reduced-motion, con
 * WebGL y en un equipo que pueda con ello. En cualquier otro caso se muestra
 * la misma tarjeta como imagen estática, sin cordón ni física: la
 * composición es la misma y se ve bien igual — brief §2.
 */
export function TarjetaAitor() {
  const [conFisica, setConFisica] = useState(false);

  useEffect(() => {
    const nav = navigator as NavegadorConMemoria;
    const permitido =
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (navigator.hardwareConcurrency ?? 2) > 4 &&
      (nav.deviceMemory ?? 2) >= 4 &&
      !nav.connection?.saveData &&
      hayWebGL();
    setConFisica(permitido);
  }, []);

  if (!conFisica) return <TarjetaEstatica />;

  return (
    <div className="ork-lanyard">
      <Lanyard
        // El conjunto ancla-cordón-tarjeta ocupa unas 6 unidades de alto y
        // está centrado en y≈1. Con fov 20 hace falta z≈18 para que entre
        // entero; subir la cámara más de eso deja ver el tramo de cuerda
        // que cruza por delante de la foto.
        position={[0, 1, 18]}
        gravity={[0, -40, 0]}
        fov={20}
        transparent
        frontImage="/lanyard/tarjeta-frente.png"
        backImage="/lanyard/tarjeta-dorso.png"
        // El cordón que trae el componente es negro y lleva el logotipo de
        // React Bits: invisible sobre fondo negro y de otra marca.
        lanyardImage="/lanyard/cordon-orkesta.png"
        // La ficha se veía pequeña (Aitor, 2026-08-21). No se toca la cámara
        // —acercarla saca el cordón de cuadro—: crece la tarjeta.
        cardScale={1.35}
      />
    </div>
  );
}

/**
 * Respaldo sin física: la misma tarjeta completa, con su tramo de cinta y su
 * enganche dibujados en CSS, sombra larga y una flotación suave. No es la
 * foto suelta — tiene que leerse como la misma ficha, quieta.
 */
function TarjetaEstatica() {
  return (
    <div className="ork-ficha" aria-hidden="true">
      <span className="ork-ficha__cinta">
        <span className="ork-ficha__cinta-texto">ORKESTA · ORKESTA</span>
      </span>
      <span className="ork-ficha__pinza" />
      <span className="ork-ficha__cuerpo">
        <Image
          src="/lanyard/tarjeta-frente.png"
          alt=""
          width={660}
          height={940}
          priority
          sizes="(max-width: 1023px) 74vw, 320px"
          className="ork-ficha__img"
        />
      </span>
    </div>
  );
}
