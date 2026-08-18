import { Link } from "next-view-transitions";
import type { Caso } from "@/lib/casos";
import { getCasosPorSeparador } from "@/lib/casos";
import { cn } from "@/lib/cn";

/**
 * El archivador del portfolio — spec §8. CSS 3D puro, cero WebGL y cero JS
 * de cliente: hover, foco, atenuación de vecinas y entradas viven en
 * globals.css. Cada carpeta es un enlace real: Tab la alcanza, Enter la abre.
 */
export function CaseDrawer() {
  const grupos = getCasosPorSeparador();
  let globalIndex = 0;

  return (
    <div className="drawer-scene">
      <div className="drawer-plane mx-auto max-w-[860px]">
        {grupos.map((grupo) => (
          <section key={grupo.estado} aria-label={grupo.label}>
            <DrawerDivider label={grupo.label} count={grupo.casos.length} />
            {grupo.casos.map((caso, i) => {
              const idx = globalIndex++;
              return (
                <CaseFolder
                  key={caso.slug}
                  caso={caso}
                  first={i === 0}
                  z={idx * 6}
                  enterDelay={Math.min(idx, 6) * 60}
                  floatDuration={4 + (idx % 3)}
                  floatDelay={-(idx * 0.7)}
                />
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}

/** Separador con pestaña propia, más alta que las carpetas — spec §8.1.b */
function DrawerDivider({ label, count }: { label: string; count: number }) {
  return (
    <h2 className="mt-10 mb-4 first:mt-0">
      <span className="inline-block rounded-t-lg border border-b-0 border-ork-border-hi bg-ork-surface-2 px-5 py-3 font-mono text-mono-label tracking-[0.12em] text-ork-text uppercase">
        {label}
        <span className="ml-3 text-ork-text-muted">{count}</span>
      </span>
      <span aria-hidden="true" className="block h-px w-full bg-ork-border-hi" />
    </h2>
  );
}

function CaseFolder({
  caso,
  first,
  z,
  enterDelay,
  floatDuration,
  floatDelay,
}: {
  caso: Caso;
  first: boolean;
  z: number;
  enterDelay: number;
  floatDuration: number;
  floatDelay: number;
}) {
  const cifras = caso.tarjeta.map((t) => `${t.valor} ${t.etiqueta}`).join(" · ");
  return (
    <Link
      href={`/portfolio/${caso.slug}`}
      className={cn("folder group", first && "folder-first")}
      style={
        {
          "--z": `${z}px`,
          "--enter-delay": `${enterDelay}ms`,
          "--float-duration": `${floatDuration}s`,
          "--float-delay": `${floatDelay}s`,
          viewTransitionName: `folder-${caso.slug}`,
        } as React.CSSProperties
      }
    >
      <span className="folder-float overflow-hidden rounded-xl border border-ork-border bg-ork-surface-1 transition-colors duration-[240ms] group-hover:bg-ork-surface-2">
        {/* Borde superior en degradado de marca — DESIGN §8.1 */}
        <span
          aria-hidden="true"
          className="block h-0.5 w-full"
          style={{ background: "var(--ork-gradient)" }}
        />
        {/* El nombre accesible sale del propio contenido visible (WCAG 2.5.3,
            "Label in Name"): un aria-label que no incluya el texto de la
            carpeta rompe la correspondencia para quien usa control por voz. */}
        <span className="sr-only">Abrir caso: </span>
        {/* Pestaña: el nombre del cliente es texto HTML, no una textura */}
        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-6 pt-4">
          <span className="font-display text-body-lg font-bold text-ork-text">{caso.cliente}</span>
          <span className="font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
            {caso.sector}
          </span>
          {caso.badge ? (
            <span className="rounded-full border border-ork-border-hi px-3 py-0.5 font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
              {caso.badge}
            </span>
          ) : null}
        </span>
        {/* Cuerpo: cifras de tarjeta (o resumen si el caso no lleva cifras) */}
        <span className="block px-6 pt-2 pb-6 text-small text-ork-text-muted md:pb-20">
          {cifras || caso.resumen}
        </span>
      </span>
    </Link>
  );
}
