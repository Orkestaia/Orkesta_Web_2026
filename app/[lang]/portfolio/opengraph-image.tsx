import { ogImage, OG_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Portfolio de Orkesta — casos de automatización e IA";

export default function Image() {
  return ogImage({
    eyebrow: "03 / Trabajos",
    title: "Sistemas construidos, no diapositivas.",
  });
}
