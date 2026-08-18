# orkesta-web — CLAUDE.md

## Qué es

La web comercial de Orkesta Automatización & IA (v2), sustituye a `orkestaia.com` (Framer).
Cliente: Orkesta (interno). Objetivo: **que agenden llamadas**. El portfolio se adelantó a la home
por motivo comercial (reuniones con agencias, agosto 2026).

## Fuentes de verdad (en ORKESTA - JARVIS, `01_ORKESTA_CORE/website/`)

| Archivo               | Rol                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `BRIEF-BUILDS.md`     | Brief de fases F0 y P, gates de aceptación                                                               |
| `orkesta-web-spec.md` | Spec completo (14 secciones). Si algo no se puede construir así, se reporta a JARVIS antes de improvisar |
| `ORKESTA-DESIGN.md`   | Copiado a la raíz de este repo. **Manda sobre cualquier skill de diseño**                                |
| `portfolio-casos.md`  | Única fuente de cifras del portfolio. Ninguna cifra sale de otro sitio                                   |

## Reglas no negociables

1. Cero Three.js/WebGL hasta F4. El maletín del portfolio es CSS 3D + Framer Motion.
2. Solo métricas 🟢 y 🟡 de `portfolio-casos.md`. Ninguna 🔴. Nunca estimar ni rellenar huecos.
3. `quickrx-specialty-pharmacy` y `psych4u` con `publicado: false` hasta OK escrito del cliente.
4. First Load JS ≤ 130 KB — el CI lo bloquea (`scripts/check-bundle-budget.mjs`).
5. Foco visible en todo elemento interactivo. El scroll no se secuestra.
6. `prefers-reduced-motion` → fundido de 120ms, sin perspectiva ni transiciones compartidas.
7. Gate de Fase P: Lighthouse ≥95 en las 4 categorías, en móvil, antes de darla por cerrada.
8. No conectar el dominio `orkestaia.com`. No usar shadcn para marketing. Sin fotos de stock.

## Arquitectura

- URLs públicas sin prefijo de idioma; internamente `app/[lang]/` con `lang=es` (rewrites en
  `next.config.ts`). Preparado para `/en` en v2.
- SSG en todo (`force-static`). `robots.ts` en noindex hasta que exista la home.
- Tokens de diseño en `app/globals.css` (`@theme`); ningún color hardcodeado en componentes.
- Fuentes locales en `app/fonts/` (Space Grotesk 700, Inter var, JetBrains Mono 400 — latin).
- Casos del portfolio: MDX en `content/casos/` con frontmatter tipado.

## Comandos

`npm run dev` · `npm run build && npm run check:budget` · `npm run lint` · `npm run format`

## Deploy

Vercel: proyecto `orkesta-web-2026` (team `orkesta-automation`, id `prj_csbeI12neSuSF0VoxpqfAW3T5CZr`).
Push a `main` → deploy automático si el repo está conectado; si no, `vercel deploy --prod`.
