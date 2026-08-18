import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { GooeyNav } from "@/components/layout/GooeyNav";
import { OrkestadorMark } from "@/components/brand/OrkestadorMark";
import { CAL_URL } from "@/lib/site";

/**
 * Header de Fase P: orkestador + wordmark, GooeyNav (solo escritorio),
 * enlace estándar en móvil y CTA a Cal.com en pestaña nueva.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ork-border bg-ork-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ork-text"
          aria-label="Orkesta — inicio"
        >
          <OrkestadorMark className="h-7 w-auto" />
          ORKESTA
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <GooeyNav />
          {/* Móvil: menú estándar */}
          <Link
            href="/portfolio"
            className="text-small font-medium text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-text md:hidden"
          >
            Portfolio
          </Link>
          {/* En 375px el texto completo parte el botón en dos líneas y lo
              desborda del header: se acorta, y el nombre accesible se
              completa con texto para lector de pantalla. */}
          <Button href={CAL_URL} size="small" className="shrink-0 whitespace-nowrap">
            <span aria-hidden="true">
              Agenda<span className="hidden sm:inline">&nbsp;una llamada</span>
            </span>
            <span className="sr-only">
              Agenda una llamada de 30 minutos (se abre en pestaña nueva)
            </span>
          </Button>
        </div>
      </Container>
    </header>
  );
}
