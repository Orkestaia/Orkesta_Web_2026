/**
 * Capturas de control — BRIEF-PORTFOLIO.md §7.1.
 *
 * Saca la misma pantalla en escritorio (1440) y en móvil (375) para poder
 * MIRARLA, que es el punto: medir números sin ver el resultado es el fallo
 * que este brief viene a corregir.
 *
 * Uso:  node scripts/qa-capturas.mjs [baseUrl]
 * Salida: qa/<nombre>-desktop.png y qa/<nombre>-movil.png
 *
 * Opciones por ruta:
 *   espera      ms adicionales antes de disparar (animaciones de entrada)
 *   slide       índice de diapositiva del deck a la que desplazarse
 *   reduced     fuerza prefers-reduced-motion
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3200";
const SALIDA = "qa";

const RUTAS = [
  // La ficha tiene física: a los 2,6 s todavía se está columpiando.
  { nombre: "portada", url: "/", espera: 7000 },
  { nombre: "proyectos", url: "/proyectos", espera: 1800 },
  { nombre: "deck-portada", url: "/proyectos/golden-market", espera: 1200 },
  { nombre: "deck-frase", url: "/proyectos/golden-market", slide: 1, espera: 1200 },
  { nombre: "deck-diagrama", url: "/proyectos/golden-market", slide: 4, espera: 2400 },
  { nombre: "deck-imagen", url: "/proyectos/golden-market", slide: 3, espera: 1600 },
  { nombre: "deck-lista", url: "/proyectos/golden-market", slide: 6, espera: 1400 },
  { nombre: "deck-panel", url: "/proyectos/golden-market", slide: 7, espera: 1600 },
  { nombre: "deck-garantias", url: "/proyectos/golden-market", slide: 8, espera: 1600 },
  { nombre: "deck-cifra", url: "/proyectos/golden-market", slide: 9, espera: 1200 },
  { nombre: "deck-cierre", url: "/proyectos/golden-market", slide: 14, espera: 1200 },
  { nombre: "deck-psych4u", url: "/proyectos/psych4u", slide: 4, espera: 2400 },
  // El diagrama más ancho del portfolio: siete columnas
  {
    nombre: "deck-quickrx-diagrama",
    url: "/proyectos/quickrx-specialty-pharmacy",
    slide: 3,
    espera: 2400,
  },
  {
    nombre: "deck-quickrx-metricas",
    url: "/proyectos/quickrx-specialty-pharmacy",
    slide: 9,
    espera: 1400,
  },
  { nombre: "deck-mc-equipo", url: "/proyectos/mission-control", slide: 2, espera: 1600 },
  { nombre: "deck-mc-lista", url: "/proyectos/mission-control", slide: 3, espera: 1400 },
  { nombre: "deck-greenriot-vertical", url: "/proyectos/greenriot", slide: 6, espera: 1600 },
];

const VISTAS = [
  { sufijo: "desktop", width: 1440, height: 900 },
  { sufijo: "movil", width: 375, height: 812, isMobile: true, hasTouch: true },
];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await chromium.launch();
mkdirSync(SALIDA, { recursive: true });

for (const vista of VISTAS) {
  for (const ruta of RUTAS) {
    const contexto = await navegador.newContext({
      viewport: { width: vista.width, height: vista.height },
      deviceScaleFactor: 2,
      isMobile: vista.isMobile ?? false,
      hasTouch: vista.hasTouch ?? false,
      reducedMotion: ruta.reduced ? "reduce" : "no-preference",
    });
    const page = await contexto.newPage();
    const errores = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errores.push(m.text()));

    await page.goto(BASE + ruta.url, { waitUntil: "networkidle" });
    await espera(ruta.espera ?? 800);

    if (ruta.slide != null) {
      await page.evaluate((i) => {
        const rail = document.querySelector(".ork-deck__rail");
        if (!rail) return;
        rail.style.scrollBehavior = "auto";
        const s = rail.children[i];
        if (s) rail.scrollLeft = s.offsetLeft;
      }, ruta.slide);
      await espera(900);
    }

    const archivo = `${SALIDA}/${ruta.nombre}-${vista.sufijo}.png`;
    await page.screenshot({ path: archivo });

    // Comprobación barata que siempre acompaña a la captura
    const desborde = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    console.log(
      `${archivo.padEnd(34)} ${desborde ? "⚠ DESBORDE HORIZONTAL" : "ok"}` +
        (errores.length ? `  ⚠ ${errores.length} error(es): ${errores[0].slice(0, 80)}` : ""),
    );
    await contexto.close();
  }
}

await navegador.close();
