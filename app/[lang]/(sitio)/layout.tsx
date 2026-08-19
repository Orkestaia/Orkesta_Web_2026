import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Envoltorio del sitio: cabecera y pie.
 *
 * Las fichas de proyecto quedan fuera de este grupo a propósito: el deck
 * ocupa la pantalla completa (100vw × 100dvh por diapositiva) y no lleva
 * cabecera ni pie, solo la X para salir — brief §4.
 */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
