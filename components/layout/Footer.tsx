import { Container } from "@/components/layout/Container";

/**
 * Footer mínimo de Fase P: logo, email de contacto, LinkedIn.
 * TODO(Aitor): falta la URL del perfil de LinkedIn — se añade en cuanto exista.
 */
export function Footer() {
  return (
    <footer className="border-t border-ork-border py-12">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-display text-body font-bold text-ork-text">ORKESTA</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <a
            href="mailto:aitor@orkestaia.com"
            className="font-mono text-small text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-cyan"
          >
            aitor@orkestaia.com
          </a>
        </div>
        <p className="text-small text-ork-text-faint">
          © {new Date().getFullYear()} Orkesta Automatización &amp; IA
        </p>
      </Container>
    </footer>
  );
}
