import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingProps = {
  as?: HeadingLevel;
  /** Escala visual independiente del nivel semántico */
  size?: "display" | "h1" | "h2" | "h3";
  className?: string;
  children: React.ReactNode;
};

const sizeClass = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

/** Titulares en Space Grotesk 700, blanco puro — ORKESTA-DESIGN.md §3 */
export function Heading({ as: Tag = "h2", size, className, children }: HeadingProps) {
  const resolved = size ?? (Tag === "h4" ? "h3" : (Tag as "h1" | "h2" | "h3"));
  return (
    <Tag className={cn("font-display font-bold text-ork-text", sizeClass[resolved], className)}>
      {children}
    </Tag>
  );
}

/**
 * Degradado de marca para 1-3 palabras clave dentro de un titular.
 * Nunca un titular entero — ORKESTA-DESIGN.md §3.
 */
export function Hi({ children }: { children: React.ReactNode }) {
  return <span className="text-gradient">{children}</span>;
}
