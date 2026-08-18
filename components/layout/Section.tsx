import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  /** Índice de sección para el eyebrow: "— 01 / EL PROBLEMA" */
  index?: string;
  className?: string;
  children: React.ReactNode;
};

/** Ritmo vertical de sección: 96px móvil / 160px desktop — ORKESTA-DESIGN.md §4 */
export function Section({ id, eyebrow, index, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-24 lg:py-40", className)}>
      <Container>
        {eyebrow ? (
          <Eyebrow index={index} className="mb-6">
            {eyebrow}
          </Eyebrow>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
