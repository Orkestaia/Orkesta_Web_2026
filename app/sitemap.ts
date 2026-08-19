import type { MetadataRoute } from "next";
import { getProyectos } from "@/lib/proyectos";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...getProyectos().map((p) => ({
      url: `${SITE_URL}/proyectos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
