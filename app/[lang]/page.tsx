import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";

export const dynamic = "force-static";

/**
 * F0: página en blanco con el sistema de diseño aplicado.
 * En Fase P, esta ruta pasa a redirigir a /portfolio mientras no exista la home.
 */
export default function Home() {
  return (
    <Section eyebrow="FUNDACIONES" index="F0">
      <Heading as="h1" size="display">
        Orkesta
      </Heading>
      <p className="mt-6 max-w-[68ch] text-body-lg text-ork-text-muted">
        Automatización e IA aplicadas a los procesos reales de tu negocio.
      </p>
    </Section>
  );
}
