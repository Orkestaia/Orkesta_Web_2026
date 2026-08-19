# orkesta-web — CLAUDE.md

## Qué es

El portfolio de Orkesta Automatización & IA. Objetivo: **que agenden llamadas**.
Se enseña a agencias y prospectos.

## Fuentes de verdad (en ORKESTA - JARVIS, `01_ORKESTA_CORE/website/`)

| Archivo                      | Rol                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `BRIEF-BUILDS-DEFINITIVO.md` | **El brief vigente.** Sustituye a `BRIEF-BUILDS.md` §5/§5b y al de rediseño            |
| `BRIEF-BUILDS.md`            | Solo siguen vigentes §1, §2, §3, §4, §7 y §9                                           |
| `ORKESTA-DESIGN.md`          | Copiado a la raíz. **Manda sobre cualquier skill de diseño**                           |
| `portfolio-casos.md`         | Fuente de **hechos y cifras**, no de texto final. Los 16 proyectos y el mapa de assets |

## Arquitectura

- **Portada (`/`)**: carrusel con profundidad (DepthCarousel de React Bits adaptado) con los
  16 proyectos, sobre el campo de nodos en canvas 2D. En móvil y con `prefers-reduced-motion`
  se queda la rejilla, que es lo que pinta el servidor.
- **Ficha (`/proyectos/[slug]`)**: deck horizontal de diapositivas a pantalla completa.
  Fuera del grupo `(sitio)`, así que no lleva cabecera ni pie.
- **Contenido**: `content/proyectos/*.mdx`. Las diapositivas son **datos tipados en el
  frontmatter**, no prosa. El esquema y el límite de palabras están en `lib/proyectos.ts`.
- **Diagramas**: `<FlowDiagram>` genera el SVG desde el MDX. Los pasos de una persona van
  en violeta; los del sistema, en cyan.

## Reglas no negociables

1. **`renew/crm_renew.png` no se publica nunca.** Datos personales de ~22 personas reales.
2. **Antes de insertar una captura, ábrela y mírala.** Si hay un nombre, un email, un teléfono
   o datos operativos de un tercero, no entra. Lo verifica quien la inserta.
3. Ninguna cifra que no esté en `portfolio-casos.md`. Solo 🟢 y 🟡, nunca 🔴.
4. QuickRx y Psych4U: autorizados con nombre real, **sin cifras de negocio**.
   Sí se publica el coste de telefonía, que es de Orkesta.
5. Sector salud (QuickRx, Psych4U, Ortodoncia): sin datos de pacientes ni capturas de
   interfaz con datos operativos reales.
6. Yoursups y Arima: se habla de lo que se **diseñó**, nunca de resultados obtenidos.
7. Máximo 40 palabras por diapositiva (90 en `lista`). **El build falla si se supera.**
8. Lenguaje de negocio: horas, dinero, qué deja de pasar. Nada de webhooks, endpoints ni IMEI.
9. First Load JS ≤ 130 KB — el CI lo bloquea.
10. No conectar `orkestaia.com`. Avisar antes de cada entrega: compartir la URL exige Vercel Pro.

## Comandos

`npm run dev` · `npm run build && npm run check:budget` · `npm run lint` · `npm run format`
`python scripts/normalize-logos.py` regenera los logos de cliente para fondo oscuro.

## Deploy

Vercel: `orkesta-web-2026` (team `orkesta-automation`). Push a `main` → deploy automático.
