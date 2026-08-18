import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

/**
 * Header mínimo de Fase P: logo + "Portfolio" + CTA "Agenda una llamada".
 * GooeyNav (solo desktop) llega en F1 con la home.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ork-border bg-ork-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ork-text"
          aria-label="Orkesta — inicio"
        >
          ORKESTA
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-6">
          <Link
            href="/portfolio"
            className="text-small font-medium text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-text"
          >
            Portfolio
          </Link>
          <Button href="/agenda" size="small">
            Agenda una llamada
          </Button>
        </nav>
      </Container>
    </header>
  );
}
