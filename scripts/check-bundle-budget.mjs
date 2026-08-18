/**
 * Presupuesto de rendimiento — brief §3.4 / spec §5.
 * Calcula el First Load JS (gzip) de cada ruta del App Router a partir de
 * .next/app-build-manifest.json y falla si alguna supera el presupuesto.
 *
 * Uso: node scripts/check-bundle-budget.mjs   (tras `next build`)
 * Presupuesto: BUNDLE_BUDGET_KB (por defecto 130).
 */
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 130);
const distDir = join(process.cwd(), ".next");

let manifest;
try {
  manifest = JSON.parse(readFileSync(join(distDir, "app-build-manifest.json"), "utf8"));
} catch {
  console.error("✖ No existe .next/app-build-manifest.json — ejecuta `next build` primero.");
  process.exit(1);
}

const gzipCache = new Map();
function gzipKb(file) {
  if (!gzipCache.has(file)) {
    const path = join(distDir, file);
    try {
      statSync(path);
      gzipCache.set(file, gzipSync(readFileSync(path)).length / 1024);
    } catch {
      gzipCache.set(file, 0);
    }
  }
  return gzipCache.get(file);
}

const rows = [];
for (const [page, files] of Object.entries(manifest.pages)) {
  const js = files.filter((f) => f.endsWith(".js"));
  const kb = js.reduce((sum, f) => sum + gzipKb(f), 0);
  rows.push({ page, kb });
}

rows.sort((a, b) => b.kb - a.kb);
console.log(`\nFirst Load JS (gzip) por ruta — presupuesto: ${BUDGET_KB} KB\n`);
for (const { page, kb } of rows) {
  const flag = kb > BUDGET_KB ? " ✖ EXCEDE" : "";
  console.log(`  ${kb.toFixed(1).padStart(7)} KB  ${page}${flag}`);
}

const worst = rows[0];
if (worst && worst.kb > BUDGET_KB) {
  console.error(
    `\n✖ ${worst.page} carga ${worst.kb.toFixed(1)} KB — supera el presupuesto de ${BUDGET_KB} KB. Build rechazado.`,
  );
  process.exit(1);
}
console.log(`\n✔ Todas las rutas dentro del presupuesto (${BUDGET_KB} KB).\n`);
