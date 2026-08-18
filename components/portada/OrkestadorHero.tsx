import { ORKESTADOR_PATH, ORKESTADOR_VIEWBOX } from "@/components/brand/orkestador-path";

/**
 * El orkestador como protagonista visual de la portada — brief §5b.
 * Tres animaciones, todas CSS/SVG (clases en globals.css):
 *  - entrada: trazo con stroke-dashoffset (~1,2s) y relleno en fundido
 *  - reposo: flotación senoidal ±6px, periodo 6s
 *  - pulso: drop-shadow cyan que respira (8s) — único glow de la pantalla
 * Con prefers-reduced-motion: silueta estática, sin flotación ni pulso.
 * Componente de servidor: cero JS de cliente.
 */
export function OrkestadorHero({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="ork-hero-float">
        <svg viewBox={ORKESTADOR_VIEWBOX} focusable="false" className="h-full w-full">
          <defs>
            <linearGradient id="ork-grad-hero" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="40%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#7B2CBF" />
            </linearGradient>
          </defs>
          <path className="ork-hero-stroke" fillRule="evenodd" d={ORKESTADOR_PATH} pathLength={1} />
          <path className="ork-hero-fill" fillRule="evenodd" d={ORKESTADOR_PATH} />
        </svg>
      </div>
    </div>
  );
}
