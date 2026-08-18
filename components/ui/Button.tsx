import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
  href?: string;
  type?: "button" | "submit";
  className?: string;
  children: React.ReactNode;
} & React.AriaAttributes;

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold " +
  "transition-all duration-[240ms] ease-ork select-none " +
  // Foco visible obligatorio — ORKESTA-DESIGN.md §5
  "focus-visible:outline-2 focus-visible:outline-ork-cyan-hi focus-visible:outline-offset-2";

const variants = {
  // Fondo cyan, texto negro (no blanco) — §5
  primary:
    "bg-ork-cyan text-ork-bg hover:bg-ork-cyan-hi hover:-translate-y-px " +
    "hover:shadow-[0_8px_24px_rgba(0,229,255,0.25)]",
  secondary:
    "border border-ork-border-hi text-ork-text bg-transparent " +
    "hover:border-ork-cyan hover:bg-[rgba(0,180,216,0.06)]",
} as const;

const sizes = {
  default: "h-12 px-6 text-body",
  small: "h-11 px-4 text-small", // 44px: objetivo táctil mínimo — §9
} as const;

export function Button({
  variant = "primary",
  size = "default",
  href,
  type = "button",
  className,
  children,
  ...aria
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    // Externo (Cal.com, LinkedIn): pestaña nueva — brief §5c
    if (href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...aria}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...aria}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...aria}>
      {children}
    </button>
  );
}
