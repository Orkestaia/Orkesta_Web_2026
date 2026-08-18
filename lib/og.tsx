import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Imágenes Open Graph dinámicas — se generan en build (SSG), coste cero en
 * runtime. Satori no soporta woff2, por eso hay copias .woff en assets/og-fonts.
 */

const FONTS_DIR = join(process.cwd(), "assets", "og-fonts");

function font(file: string) {
  return readFileSync(join(FONTS_DIR, file));
}

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage({
  eyebrow,
  title,
  cifras,
  footer,
}: {
  eyebrow: string;
  title: string;
  cifras?: { valor: string; etiqueta: string }[];
  footer?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#050505",
        padding: 72,
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: 160,
            height: 4,
            borderRadius: 999,
            background: "linear-gradient(135deg, #00E5FF 0%, #00B4D8 40%, #7B2CBF 100%)",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            letterSpacing: "0.12em",
            color: "#00B4D8",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          {`— ${eyebrow}`}
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: title.length > 90 ? 44 : 54,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#FFFFFF",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 48 }}>
          {(cifras ?? []).map((c) => (
            <div key={c.etiqueta} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "Space Grotesk",
                  fontSize: 44,
                  fontWeight: 700,
                  color: "#00E5FF",
                }}
              >
                {c.valor}
              </div>
              <div style={{ fontSize: 20, color: "#B0B0B0", marginTop: 6, maxWidth: 260 }}>
                {c.etiqueta}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 32,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          {`ORKESTA${footer ? ` · ${footer}` : ""}`}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Grotesk", data: font("space-grotesk-latin-700-normal.woff"), weight: 700 },
        { name: "Inter", data: font("inter-latin-400-normal.woff"), weight: 400 },
        { name: "JetBrains Mono", data: font("jetbrains-mono-latin-400-normal.woff"), weight: 400 },
      ],
    },
  );
}
