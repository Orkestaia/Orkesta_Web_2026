import { cn } from "@/lib/cn";

type EyebrowProps = {
  /** Índice de sección: <Eyebrow index="01">EL PROBLEMA</Eyebrow> → "— 01 / EL PROBLEMA" */
  index?: string;
  className?: string;
  children: React.ReactNode;
};

/** Mono, mayúsculas, cyan, guion inicial — ORKESTA-DESIGN.md §3 */
export function Eyebrow({ index, className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-mono-label tracking-[0.12em] uppercase text-ork-cyan",
        className,
      )}
    >
      <span aria-hidden="true">— </span>
      {index ? `${index} / ` : null}
      {children}
    </p>
  );
}
