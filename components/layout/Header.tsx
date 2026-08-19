import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CAL_URL } from "@/lib/site";

/**
 * Cabecera — brief §3: marca, "Proyectos" y el CTA a Cal.com.
 *
 * La marca es la figura del orkestador recortada del logotipo y servida a 2x:
 * la silueta plana a 28 px no se leía, se perdía la cabeza. Provisional hasta
 * que exista una versión horizontal del logotipo (§9).
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
          <Image
            src="/marca-orkesta.png"
            alt=""
            width={166}
            height={120}
            priority
            sizes="42px"
            className="h-[30px] w-auto"
          />
          ORKESTA
        </Link>
        <div className="flex items-center gap-5 sm:gap-7">
          <Link
            href="/"
            className="text-small font-medium text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-text"
          >
            Proyectos
          </Link>
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
