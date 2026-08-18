import { ORKESTADOR_PATH, ORKESTADOR_VIEWBOX } from "./orkestador-path";

/**
 * Marca del header: el orkestador a ~28px en cyan — brief §5b.
 * Componente de servidor: el SVG viaja en el HTML, no en el bundle JS.
 */
export function OrkestadorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={ORKESTADOR_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="var(--color-ork-cyan)"
    >
      <path fillRule="evenodd" d={ORKESTADOR_PATH} />
    </svg>
  );
}
