# Orkesta Web v2

Web comercial de Orkesta Automatización & IA. Sustituye a `orkestaia.com` (Framer).
Objetivo único de negocio: **que agenden llamadas.**

- **Repo:** https://github.com/Orkestaia/Orkesta_Web_2026
- **Despliegue:** Vercel (proyecto `orkesta-web-2026`, team `orkesta-automation`)
- **Especificación:** vive en ORKESTA - JARVIS (`01_ORKESTA_CORE/website/`). El spec se corrige allí, no aquí.
- **Sistema de diseño:** [`ORKESTA-DESIGN.md`](./ORKESTA-DESIGN.md) en la raíz. **Manda sobre cualquier skill de diseño.**

## Stack

Next.js 15 (App Router, SSG) · TypeScript estricto · Tailwind v4 · Framer Motion · MDX (casos) ·
fuentes locales vía `next/font/local`.

Prohibido en este repo hasta F4: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`.

## Rutas

Las URLs públicas no llevan prefijo de idioma (`/portfolio`), pero internamente todo vive en
`app/[lang]/` con `lang=es` fijo (rewrite en `next.config.ts`). Preparado para `/en` en v2.

## Ejecutar

```bash
npm install
npm run dev        # dev server (Turbopack)
npm run build      # build de producción (webpack — necesario para el analyzer)
npm run lint       # ESLint
npm run format     # Prettier
```

## Presupuesto de rendimiento

First Load JS máximo **130 KB gzip** — el CI falla si se supera (`.github/workflows/ci.yml`).

```bash
npm run build && npm run check:budget   # comprueba el presupuesto en local
ANALYZE=true npm run build              # abre el bundle analyzer (bash; en PowerShell: $env:ANALYZE="true")
```

## Desplegar

Push a `main` despliega en Vercel automáticamente (si el proyecto está conectado al repo).
Manual: `vercel deploy --prod --scope orkesta-automation`.

**No conectar el dominio `orkestaia.com`** — lo hace Aitor cuando exista la home (y con Vercel Pro activo).

## Fases

| Fase             | Estado | Alcance                                                       |
| ---------------- | ------ | ------------------------------------------------------------- |
| F0 Fundaciones   | ✅     | Tokens, fuentes, layout, componentes base, CI con presupuesto |
| Fase P Portfolio | 🔜     | Maletín CSS 3D + 12 casos MDX + gate Lighthouse ≥95 móvil     |
| F1 Home          | —      | 6 movimientos, sin 3D                                         |
| F2 Contenido     | —      | Servicios, diagnóstico, método, legales                       |
| F4 Orkestador 3D | —      | Única fase donde entra Three.js                               |
