import { cn } from "@/lib/cn";

type ContainerProps = {
  /** "text" limita a 720px para lectura; por defecto 1200px — ORKESTA-DESIGN.md §4 */
  size?: "default" | "text";
  className?: string;
  children: React.ReactNode;
};

export function Container({ size = "default", className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 lg:px-12",
        size === "default" ? "max-w-[1200px]" : "max-w-[720px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
