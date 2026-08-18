import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * noindex mientras el sitio esté incompleto (sin home) — brief §5 SEO.
 * Al publicar la home (F1): permitir todo e incluir explícitamente
 * GPTBot, PerplexityBot y ClaudeBot (spec §9.4).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
