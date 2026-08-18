# ORKESTA — DESIGN.md

> Sistema de diseño de Orkesta Automatización & IA en formato DESIGN.md.
> Este archivo se copia a la raíz del repo de la web. **Manda sobre cualquier skill de diseño instalada.**
> Si una skill (taste-skill, web-design-guidelines, etc.) propone colores, tipografías o tono distintos, gana este archivo.

---

## 1. Tema visual

Dark mode tech premium. Fondo negro profundo, superficies elevadas apenas perceptibles, acentos cyan y violeta usados con avaricia.

La referencia mental no es "web de agencia de IA con degradados morados". Es **consola de control**: precisión, orden, líneas de conexión, densidad de información controlada.

**Sensaciones objetivo:** control, precisión, profundidad, alto valor.
**Sensaciones a evitar:** hype, neón saturado, futurismo de stock, "startup genérica de IA".

---

## 2. Color

### Tokens base

```css
--ork-bg: #050505; /* fondo global */
--ork-surface-1: #121212; /* tarjetas */
--ork-surface-2: #1e1e1e; /* tarjetas elevadas, hover */
--ork-border: #262626; /* bordes por defecto */
--ork-border-hi: #3a3a3a; /* bordes en hover */

--ork-cyan: #00b4d8; /* primario */
--ork-cyan-hi: #00e5ff; /* primario brillante: hover, glow, acento */
--ork-violet: #8a2be2; /* secundario */
--ork-violet-deep: #7b2cbf; /* secundario profundo, degradados */

--ork-text: #ffffff; /* títulos y texto principal */
--ork-text-muted: #b0b0b0; /* cuerpo, descripciones */
--ork-text-faint: #6e6e6e; /* metadatos, captions, labels */
```

### Degradado de marca

```css
--ork-gradient: linear-gradient(135deg, #00e5ff 0%, #00b4d8 40%, #7b2cbf 100%);
```

Uso: subrayados de titular, líneas de conexión, bordes de tarjeta activa, glow del orkestador. **Nunca como fondo de sección completa.**

### Reglas de color

- El cyan es para **lo accionable y lo activo**. Si algo es cyan, o se pulsa o está encendido.
- El violeta es **profundidad y secundario**. Nunca es un CTA.
- Superficie por defecto de una tarjeta: `--ork-surface-1` con borde `--ork-border` de 1px. En hover: `--ork-surface-2` + borde con degradado de marca al 40% de opacidad.
- Máximo **un** elemento con glow por pantalla visible. El glow saturado es lo que hace que una web parezca barata.
- Ratio de contraste mínimo AA (4.5:1) en todo el texto. `--ork-text-faint` sobre `--ork-bg` solo para texto de 14px+ no esencial.

### Paleta prohibida en la web

La paleta sobria del brandbook (`#23475B`, `#C7F464`, `#F5F7F8`) es **solo para PDFs y propuestas**. No aparece en la web.

---

## 3. Tipografía

| Rol                | Fuente             | Peso            | Notas                                    |
| ------------------ | ------------------ | --------------- | ---------------------------------------- |
| Display / H1-H2    | **Space Grotesk**  | 700             | Geométrica, técnica, encaja con el logo  |
| UI / H3-H6, cuerpo | **Inter**          | 400 / 500 / 600 | Variable font                            |
| Código y metadatos | **JetBrains Mono** | 400             | Labels, `eyebrows`, cifras de resultados |

**Autoalojadas** vía `next/font/local` con subset latino. `font-display: swap` en cuerpo, `optional` en display para no comprometer el LCP.

### Escala

```
display   clamp(2.75rem, 7vw, 5.5rem)   / line-height 0.95 / tracking -0.03em
h1        clamp(2.25rem, 5vw, 3.5rem)   / line-height 1.05 / tracking -0.02em
h2        clamp(1.75rem, 3.5vw, 2.5rem) / line-height 1.15 / tracking -0.02em
h3        1.375rem                       / line-height 1.3
body-lg   1.125rem                       / line-height 1.65
body      1rem                           / line-height 1.7
small     0.875rem                       / line-height 1.6
mono-label 0.75rem  / tracking 0.12em / uppercase
```

### Reglas

- Los titulares van en `--ork-text` puro. **Nunca** un titular entero en degradado; como mucho 1-3 palabras clave.
- El cuerpo va en `--ork-text-muted`. Blanco puro en párrafos largos cansa sobre negro.
- Ancho máximo de línea de lectura: `68ch`.
- Los `eyebrow` (etiquetas sobre los títulos de sección) van en JetBrains Mono, mayúsculas, `--ork-cyan`, precedidos de un guion: `— 01 / EL PROBLEMA`.

---

## 4. Espaciado y layout

Escala base de **4px**. Valores permitidos: `4 8 12 16 24 32 48 64 96 128 160`.

```
Contenedor:        max-width 1200px, padding lateral 24px (móvil) / 48px (desktop)
Contenedor texto:  max-width 720px
Ritmo de sección:  padding-block 96px (móvil) / 160px (desktop)
Grid:              12 columnas, gap 24px
Radio de borde:    12px (tarjetas), 8px (botones, inputs), 999px (píldoras)
```

Regla de respiración: **si dudas entre dos espaciados, elige el mayor.** El aire es lo que separa una web premium de una web apretada.

---

## 5. Componentes

### Botón primario

Fondo `--ork-cyan`, texto `#050505` (negro sobre cyan, no blanco), peso 600, altura 48px, radio 8px.
Hover: fondo `--ork-cyan-hi`, `translateY(-1px)`, sombra `0 8px 24px rgba(0,229,255,.25)`.
Focus visible: anillo de 2px `--ork-cyan-hi` con offset de 2px. **Obligatorio, sin excepciones.**

### Botón secundario

Transparente, borde 1px `--ork-border-hi`, texto `--ork-text`.
Hover: borde `--ork-cyan`, fondo `rgba(0,180,216,.06)`.

### Tarjeta

`--ork-surface-1`, borde 1px `--ork-border`, radio 12px, padding 32px.
Hover: `--ork-surface-2`, borde con degradado al 40%, elevación sutil. Transición 240ms `cubic-bezier(.22,1,.36,1)`.

### Fondos de sección

Negro plano por defecto. Texturas permitidas, siempre por debajo del 6% de opacidad:

- rejilla de 48px en `rgba(255,255,255,.02)`
- resplandor radial cyan/violeta detrás del contenido principal
- puntos tipo red neuronal

**Nunca** más de una textura activa en la misma sección.

### Código como recurso visual

Bloques de código flotantes en JetBrains Mono, `--ork-text-faint`, decorativos y sutiles, en esquinas o fondos. Ejemplos de contenido: `workflow.status = "active"`, `lead.priority = "high"`.
Prohibido: saturar la pieza, código ilegible, o que la página parezca documentación técnica.

---

## 6. Movimiento

**Curva por defecto:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out expo suave).
**Duraciones:** micro-interacción 160ms · transición de elemento 240ms · entrada de sección 600ms · secuencia orquestada 900ms.

### Reglas

- Todo lo que entra, entra desde **abajo** (`y: 24px → 0`) con opacidad. Nunca desde los lados.
- Los elementos de una lista entran escalonados a **60ms** de diferencia. Máximo 6 elementos escalonados; a partir de ahí entran en bloque.
- Nada rebota. Nada gira sin motivo. Cada animación tiene que comunicar algo (jerarquía, causalidad, estado).
- El scroll **nunca se secuestra**. Ni scroll-jacking, ni scroll suavizado que rompa la rueda del ratón.
- `prefers-reduced-motion: reduce` → todas las animaciones pasan a fundido de opacidad de 120ms, y el canvas 3D no se monta.

---

## 7. Imaginería

- **Cero fotos de stock.** Nada de manos robóticas, cerebros de circuitos, ni gente con auriculares señalando pantallas.
- Lo visual es **generado o diagramático**: el orkestador 3D, redes de nodos, diagramas de flujo, capturas reales de sistemas construidos.
- Las capturas de producto van dentro de un marco oscuro con borde de 1px y radio de 12px, nunca a sangre.
- Iconografía: lineal, outline, 1.5px de trazo, cyan o `--ork-text-muted`. Librería: Lucide.

---

## 8. Voz

Problema de negocio primero, tecnología como medio. Directo, retador, sin complacencia.

**Correcto:** "El problema no es que no lleguen oportunidades. Es que entran por demasiados canales y no hay sistema para priorizarlas."
**Incorrecto:** "Implementamos arquitecturas basadas en webhooks y automatizaciones condicionales."

### Prohibido en toda la web

"Automatizamos todo" · "La IA lo hará por ti" · "No tendrás que hacer nada" · "100% automático" · "Sin límites" · "Garantizado" · "Revolucionario" · "Transformación digital" · "Sinergia" · "Soluciones a medida" (vacío) · cualquier cifra de resultado que no venga de un cliente real.

### Traducciones obligatorias

| No escribir  | Escribir                            |
| ------------ | ----------------------------------- |
| Webhook      | aviso automático entre herramientas |
| API          | conexión segura entre sistemas      |
| CRM          | bandeja organizada de oportunidades |
| Bot          | asistente automático                |
| Dashboard    | panel de control                    |
| Lead scoring | prioridad de cada oportunidad       |
| Workflow     | flujo de trabajo                    |
| Trigger      | disparador automático               |

---

## 9. Accesibilidad

- Contraste AA mínimo en todo texto.
- Focus visible en todo elemento interactivo. Nunca `outline: none` sin sustituto.
- Navegación completa por teclado, incluido el portfolio (las carpetas son `<button>`, no `<div>` con onClick).
- El canvas 3D es `aria-hidden="true"` y `pointer-events: none`. Es decoración; ninguna información vive solo ahí.
- Objetivos táctiles de 44×44px mínimo.
