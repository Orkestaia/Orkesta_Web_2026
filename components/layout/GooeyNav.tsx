"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * GooeyNav — adaptación del componente de React Bits (spec §11.1):
 *  - <Link> de Next en lugar de <a>.
 *  - Estado activo derivado de usePathname(), no de un índice interno.
 *  - Colores mapeados a la paleta (--color-1..4 → cyan, cyan-hi, violeta,
 *    violeta profundo) en las partículas.
 *  - El filtro gooey (blur+contrast) está desactivado con
 *    prefers-reduced-motion y en móvil; aquí ni se aplica sobre el header:
 *    solo sobre la capa de efecto, que es aria-hidden.
 *  - Solo escritorio (hidden md:flex). En móvil, enlaces estándar.
 */

const ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
];

const PARTICLE_COLORS = [
  "var(--color-ork-cyan)",
  "var(--color-ork-cyan-hi)",
  "var(--color-ork-violet)",
  "var(--color-ork-violet-deep)",
];

export function GooeyNav() {
  const pathname = usePathname();
  const effectRef = useRef<HTMLSpanElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "/es" : pathname.startsWith(href);

  // Ráfaga de partículas al activar un enlace. Decorativa: capa aria-hidden,
  // y no se dispara con prefers-reduced-motion.
  function burst(e: React.MouseEvent<HTMLAnchorElement>) {
    const layer = effectRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = layer.parentElement!.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left - nav.left + r.width / 2;
    const cy = r.top - nav.top + r.height / 2;
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.6;
      p.className = "gooey-particle";
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--dx", `${Math.cos(angle) * (18 + Math.random() * 22)}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * (14 + Math.random() * 18)}px`);
      p.style.background = PARTICLE_COLORS[i % 4];
      layer.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  }

  return (
    <nav aria-label="Principal" className="relative hidden items-center md:flex">
      <span ref={effectRef} aria-hidden="true" className="gooey-layer" />
      <ul className="flex items-center gap-1">
        {ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={burst}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative z-10 rounded-full px-4 py-2 text-small font-medium transition-colors duration-[240ms]",
                  active ? "bg-ork-cyan text-ork-bg" : "text-ork-text-muted hover:text-ork-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
