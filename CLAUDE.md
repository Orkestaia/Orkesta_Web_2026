# orkesta-web — CLAUDE.md

## Qué es

El portfolio de Orkesta Automatización & IA. Objetivo: **que agenden llamadas**.
Se enseña a agencias y prospectos. El listón: que se vea que lo ha hecho alguien que sabe.

## Fuentes de verdad (en ORKESTA - JARVIS, `01_ORKESTA_CORE/website/`)

| Archivo | Rol |
| --- | --- |
| `BRIEF-PORTFOLIO.md` | **El único brief vigente.** Si algo no está aquí, no aplica |
| `portfolio-casos.md` | Fuente de **hechos y cifras**, no de texto final. Los 16 proyectos y el mapa de assets |
| `ORKESTA-DESIGN.md` | Copiado a la raíz. **Manda sobre cualquier skill de diseño instalada** |
| `_archivo/*` | Los cinco briefs anteriores. **No valen.** No leerlos ni citarlos |

## Arquitectura

| Ruta | Qué es |
| --- | --- |
| `/` | Solo la ficha de Aitor colgando (Lanyard) + `<h1>` en `sr-only` para el LCP |
| `/proyectos` | Los 16 proyectos: carrusel con profundidad en escritorio, rejilla en móvil, con conmutador |
| `/proyectos/[slug]` | Deck horizontal de diapositivas a pantalla completa |

- `app/[lang]/(sitio)/` lleva cabecera y pie. El deck queda **fuera** de ese grupo porque
  ocupa la pantalla entera.
- **Contenido**: `content/proyectos/*.mdx`. Las diapositivas son **datos tipados en el
  frontmatter**, no prosa. El esquema y el límite de palabras están en `lib/proyectos.ts`.
- Las dimensiones de cada imagen se leen del PNG al construir (`medirPng`), no se escriben a mano.
- **Diagramas**: `<FlowDiagram>` genera el SVG desde el MDX. Los pasos de una persona van
  en violeta; los del sistema, en cyan. En móvil se dibuja transpuesto en vertical.
- **El Lanyard está calibrado para cámara `[0, 1, 18]` con fov 20.** Acercarla deja el cordón
  fuera de cuadro; acortar la cuerda descuadra la cinta, porque su ancho va en unidades de mundo.

## Reglas no negociables

1. **`renew/crm_renew.png` no se publica nunca.** Datos personales de ~22 personas reales.
   Las tres capturas de Ortodoncia, tampoco: panel clínico y una sesión con email. Ortodoncia
   sale **solo con diagramas**.
2. **Antes de insertar una captura, ábrela y mírala.** Si hay un nombre, un email, un teléfono
   o datos operativos de un tercero, no entra. Lo verifica quien la inserta, no quien la entrega.
3. Ninguna cifra que no esté en `portfolio-casos.md`. Solo 🟢 y 🟡, nunca 🔴.
4. QuickRx y Psych4U: autorizados con nombre real, **sin cifras de negocio**.
   Sí se publica el coste de telefonía, que es de Orkesta.
5. Sector salud (QuickRx, Psych4U, Ortodoncia): sin datos de pacientes ni capturas de
   interfaz con datos operativos reales.
6. Yoursups y Arima: se habla de lo que se **diseñó**, nunca de resultados obtenidos.
7. Máximo 40 palabras por diapositiva (90 en `lista`). **El build falla si se supera.**
8. Lenguaje de negocio: horas, dinero, qué deja de pasar. Nada de webhooks, endpoints ni IMEI.
9. First Load JS ≤ 130 KB — el CI lo bloquea.
10. No conectar `orkestaia.com`. **Vercel sigue en Hobby, la URL no se comparte y el `noindex`
    se mantiene.** Compartirla con alguien exige pasar a Pro; avisar antes.
11. El nombre es **Aitor Colino**. Si aparece «Aitor García Martínez», está mal: era un
    marcador de posición inventado en un brief viejo.

## Entregas

En cada entrega, adjuntar capturas de escritorio y de móvil:

```
node scripts/qa-capturas.mjs [url]
```

Saca cada pantalla a 1440 y a 375 en `qa/` y avisa de desbordes y errores de consola.
Después **abrir los archivos y mirarlos**: no basta con que el script diga «ok».
Si al mirarla no dirías «esto está bien hecho», no está terminada.

## Scripts

| Script | Para qué |
| --- | --- |
| `scripts/qa-capturas.mjs` | Capturas de QA en 1440 y 375. Acepta URL |
| `scripts/genera-tarjeta.py` | Caras de la ficha del Lanyard. **Encuadre parametrizado arriba** |
| `scripts/prepara-capturas.py` | Capturas del portfolio, con el motivo de cada recorte escrito al lado |
| `scripts/normalize-logos.py` | Logos de cliente para fondo oscuro |
| `scripts/check-bundle-budget.mjs` | Presupuesto de 130 KB, en el CI |

## Comandos

`npm run dev` · `npm run build && npm run check:budget` · `npm run lint` · `npm run format`

En Windows, `pkill` no libera el puerto: hay que hacerlo con PowerShell y `Get-NetTCPConnection`,
o se sirve un build viejo sin estilos y parece un fallo de CSS.

## Deploy

Vercel: `orkesta-web-2026` (team `orkesta-automation`). Push a `main` → deploy automático.
URL: https://orkesta-web-2026.vercel.app

## Pendiente

1. **Decisión de Aitor:** ¿el Lanyard también en móvil? El brief lo limita a escritorio
   ≥1024 px y manda retirarlo si el Lighthouse móvil baja de 95. El modelo pesa 2,4 MB más
   la física en WebAssembly. Plan acordado: activarlo tras el filtro de dispositivo, medir,
   y enseñar las cifras antes de dejarlo.
2. **GooeyNav** (punto 8 del brief). Es adorno; la cabecera funciona sin él.
3. **Gate de Lighthouse** (punto 9), medido **en producción**, no en local: local es bastante
   más pesimista y llevaría a tocar cosas que no hace falta tocar.
