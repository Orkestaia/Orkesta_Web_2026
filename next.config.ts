import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Las URLs públicas no llevan prefijo de idioma en v1: /portfolio sirve
  // internamente app/[lang]/portfolio con lang=es. Cuando llegue /en (v2),
  // estos rewrites se sustituyen por negociación real de idioma.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/es" },
        { source: "/:path*", destination: "/es/:path*" },
      ],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // El prefijo /es no es una URL pública: canónicas sin prefijo.
      { source: "/es", destination: "/", permanent: false },
      { source: "/es/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
