import { Container } from "@/components/layout/Container";
import { CONTACT_EMAIL, LINKEDIN_URL, WEBSITE_URL } from "@/lib/site";

/** Footer mínimo de Fase P: logo, email de contacto, LinkedIn y la web actual. */
export function Footer() {
  return (
    <footer className="border-t border-ork-border py-12">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-display text-body font-bold text-ork-text">ORKESTA</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono text-small text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-cyan"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-small text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-cyan"
          >
            LinkedIn
          </a>
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-small text-ork-text-muted transition-colors duration-[160ms] hover:text-ork-cyan"
          >
            orkestaia.com
          </a>
        </div>
        <p className="text-small text-ork-text-muted">
          © {new Date().getFullYear()} Orkesta Automatización &amp; IA
        </p>
      </Container>
    </footer>
  );
}
