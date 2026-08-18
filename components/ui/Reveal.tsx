"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

type RevealProps = {
  /** Retardo en segundos. Escalonado estándar: 60ms entre elementos, máx. 6 */
  delay?: number;
  /** Desplazamiento de entrada. Todo entra desde abajo — ORKESTA-DESIGN.md §6 */
  y?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
};

const EASE_ORK = [0.22, 1, 0.36, 1] as const;

/**
 * Envoltorio de entrada estándar: y 24px → 0 con opacidad, 600ms.
 * Con prefers-reduced-motion: fundido de opacidad de 120ms y nada más.
 */
export function Reveal({ delay = 0, y = 24, once = true, className, children }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
        whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once, margin: "-10% 0px" }}
        transition={reduced ? { duration: 0.12 } : { duration: 0.6, ease: EASE_ORK, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
