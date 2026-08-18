import { cn } from "@/lib/cn";

type CardProps = {
  /** En hover: surface-2 + borde con degradado de marca al 40% — ORKESTA-DESIGN.md §5 */
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Card({ hoverable = false, className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ork-border bg-ork-surface-1 p-8",
        hoverable && "card-gradient-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
