import { ogImage, OG_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Orkesta — Automatización e IA para negocios";

export default function Image() {
  return ogImage({
    eyebrow: "Automatización & IA aplicada",
    title: "Automatización e IA aplicadas a los procesos reales de tu negocio",
    cifras: [
      { valor: "19", etiqueta: "automatizaciones en producción" },
      { valor: "×3", etiqueta: "reservas online" },
      { valor: "14×", etiqueta: "más alcance diario" },
    ],
  });
}
