"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ProyectoCard, type TarjetaProyecto } from "./ProyectoCard";

/**
 * Carrusel con profundidad — adaptación de DepthCarousel de React Bits
 * (@react-bits/DepthCarousel-JS-CSS), reescrito en TypeScript.
 *
 * Adaptaciones obligatorias del brief §2:
 *  - autoplay desactivado: un portfolio se explora, no se contempla
 *  - cada tarjeta es un <a> real, navegable con Tab y activable con Enter
 *  - flechas ← →, arrastre y rueda del ratón
 *  - repintado a los tokens de ORKESTA-DESIGN.md; ninguna paleta por defecto
 *
 * Mejora progresiva: el servidor pinta la rejilla semántica y este componente
 * la sustituye solo en escritorio y sin prefers-reduced-motion.
 */

const CFG = {
  depth: 200,
  spread: 64,
  tilt: 22,
  perspective: 1400,
  visibleCards: 4,
  falloff: 0.2,
  blur: 6,
  duration: 0.7,
  ease: "power3.out",
} as const;

const ANCHO_TARJETA = 300;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function ProyectosCarousel({ proyectos }: { proyectos: TarjetaProyecto[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const posRef = useRef(0);
  const focoRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const escalaRef = useRef(1);
  const ruedaRef = useRef<number | undefined>(undefined);
  const arrastreRef = useRef<{
    x: number;
    inicio: number;
    ultimaX: number;
    ultimoT: number;
    v: number;
    movido: boolean;
    id: number;
  } | null>(null);
  const [activo, setActivo] = useState(0);

  const n = proyectos.length;

  /** Coloca cada tarjeta en el raíl 3D según su distancia a la posición actual. */
  const colocar = useCallback(
    (pos: number) => {
      const sc = escalaRef.current;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        let d = i - pos;
        if (n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }

        const detras = Math.max(0, d);
        const visible = Math.abs(d) <= CFG.visibleCards + 0.5;
        const tz = -CFG.depth * d;
        const tx = CFG.spread * d;
        const ry = CFG.tilt * clamp(d, 0, 1);

        let opacidad = d < 0 ? Math.max(0, 1 + d) : 1;
        if (!visible) opacidad = 0;

        const brillo = Math.max(0.15, 1 - detras * CFG.falloff);
        const desenfoque = Math.min(CFG.blur, (detras / CFG.visibleCards) * CFG.blur);

        el.style.transform =
          "translate(-50%, -50%) scale(" +
          sc +
          ") translateX(" +
          tx.toFixed(2) +
          "px) translateZ(" +
          tz.toFixed(2) +
          "px) rotateY(" +
          ry.toFixed(2) +
          "deg)";
        el.style.opacity = opacidad.toFixed(3);
        el.style.filter =
          "brightness(" + brillo.toFixed(3) + ") blur(" + desenfoque.toFixed(2) + "px)";
        el.style.zIndex = String(Math.round(2000 - d * 20));
        // Las tarjetas ocultas no se pueden pulsar, pero siguen alcanzándose
        // con Tab: al recibir el foco se traen al frente.
        el.style.pointerEvents = visible && opacidad > 0.05 ? "auto" : "none";
      }
    },
    [n],
  );

  const irA = useCallback(
    (destino: number, animar: boolean) => {
      tweenRef.current?.kill();
      const proxy = { p: posRef.current };
      tweenRef.current = gsap.to(proxy, {
        p: destino,
        duration: animar ? CFG.duration : 0,
        ease: CFG.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          colocar(proxy.p);
        },
        onComplete: () => {
          posRef.current = ((posRef.current % n) + n) % n;
          colocar(posRef.current);
        },
      });
    },
    [colocar, n],
  );

  const enfocar = useCallback(
    (indice: number, animar = true) => {
      const idx = ((indice % n) + n) % n;
      let delta = idx - posRef.current;
      if (n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      irA(posRef.current + delta, animar);
      if (idx !== focoRef.current) {
        focoRef.current = idx;
        setActivo(idx);
      }
    },
    [irA, n],
  );

  const mover = useCallback((paso: number) => enfocar(focoRef.current + paso), [enfocar]);

  // Escala el raíl al ancho disponible
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entrada]) => {
      const necesario = ANCHO_TARJETA + CFG.spread * 2 + 120;
      escalaRef.current = clamp(entrada.contentRect.width / necesario, 0.45, 1);
      colocar(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [colocar]);

  // Rueda: solo se atiende el gesto horizontal. El scroll vertical de la
  // página nunca se secuestra (ORKESTA-DESIGN.md §6).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      tweenRef.current?.kill();
      posRef.current += clamp(e.deltaX / (ANCHO_TARJETA * 0.9), -0.6, 0.6);
      colocar(posRef.current);
      window.clearTimeout(ruedaRef.current);
      ruedaRef.current = window.setTimeout(() => enfocar(Math.round(posRef.current)), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(ruedaRef.current);
    };
  }, [colocar, enfocar]);

  useEffect(() => {
    colocar(posRef.current);
    return () => {
      tweenRef.current?.kill();
    };
  }, [colocar]);

  const onPointerDown = (e: React.PointerEvent) => {
    tweenRef.current?.kill();
    arrastreRef.current = {
      x: e.clientX,
      inicio: posRef.current,
      ultimaX: e.clientX,
      ultimoT: performance.now(),
      v: 0,
      movido: false,
      id: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = arrastreRef.current;
    if (!drag) return;
    const paso = Math.max(ANCHO_TARJETA * 0.55 * escalaRef.current, 40);
    const dx = e.clientX - drag.x;
    if (!drag.movido && Math.abs(dx) > 4) {
      drag.movido = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!drag.movido) return;
    const ahora = performance.now();
    drag.v = (e.clientX - drag.ultimaX) / Math.max(ahora - drag.ultimoT, 1);
    drag.ultimaX = e.clientX;
    drag.ultimoT = ahora;
    posRef.current = drag.inicio - dx / paso;
    colocar(posRef.current);
  };

  const onPointerEnd = () => {
    const drag = arrastreRef.current;
    if (!drag?.movido) {
      arrastreRef.current = null;
      return;
    }
    const paso = Math.max(ANCHO_TARJETA * 0.55 * escalaRef.current, 40);
    enfocar(Math.round(posRef.current - (drag.v * 180) / paso));
    // Se limpia en el siguiente tick para que el click sepa que hubo arrastre
    window.setTimeout(() => {
      arrastreRef.current = null;
    }, 0);
  };

  return (
    <div
      ref={rootRef}
      className="ork-carousel"
      style={{ ["--dc-perspective" as string]: CFG.perspective + "px" }}
      role="group"
      aria-roledescription="carrusel"
      aria-label="Proyectos"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          mover(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          mover(1);
        }
      }}
    >
      <div className="ork-carousel__rail">
        {proyectos.map((p, i) => (
          <Link
            key={p.slug}
            href={"/proyectos/" + p.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="ork-carousel__card"
            aria-label={p.cliente + " — " + p.sector + ", " + p.pais}
            onFocus={() => enfocar(i)}
            onClick={(e) => {
              if (arrastreRef.current?.movido) e.preventDefault();
            }}
          >
            <ProyectoCard p={p} prioridad={i === 0} />
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="ork-carousel__flecha ork-carousel__flecha--prev"
        aria-label="Proyecto anterior"
        onClick={() => mover(-1)}
      >
        <Flecha dir="izq" />
      </button>
      <button
        type="button"
        className="ork-carousel__flecha ork-carousel__flecha--next"
        aria-label="Proyecto siguiente"
        onClick={() => mover(1)}
      >
        <Flecha dir="der" />
      </button>

      <p className="ork-carousel__contador" aria-live="polite">
        {String(activo + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </p>
    </div>
  );
}

function Flecha({ dir }: { dir: "izq" | "der" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d={dir === "izq" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
