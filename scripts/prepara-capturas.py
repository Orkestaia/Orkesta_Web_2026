"""
Prepara las capturas del portfolio para publicarlas.

Cada captura se ha abierto y mirado antes de entrar aquí (BRIEF-PORTFOLIO §6).
Las que necesitan intervención llevan escrito el motivo: o traen una cifra 🔴
del cliente, o un identificador de un tercero, o cromo de grabación.

No entra nada que no esté en este archivo.

Uso: python scripts/prepara-capturas.py
"""

import os

from PIL import Image, ImageFilter

JARVIS = r"C:\Users\aitor\OneDrive\Escritorio\ORKESTA - JARVIS\01_ORKESTA_CORE\portafolio"
DESTINO = os.path.join("public", "portfolio")


def _indice_local():
    """Mapa 'carpeta_original/archivo' → ruta, dentro de public/portfolio.

    Los originales vivían en JARVIS. Desde 2026-08-21 Aitor los entrega dentro
    de la carpeta de cada cliente, en public/portfolio/<slug>/<carpeta>/. Esa
    carpeta la ignora git (ver .gitignore): al repo solo llega el resultado de
    este script, nunca el original sin revisar.
    """
    idx = {}
    for slug in sorted(os.listdir(DESTINO)):
        base = os.path.join(DESTINO, slug)
        if not os.path.isdir(base):
            continue
        for sub in sorted(os.listdir(base)):
            carpeta = os.path.join(base, sub)
            if not os.path.isdir(carpeta):
                # Algunos clientes traen los originales sueltos en su carpeta,
                # sin subcarpeta: ahí la clave es el propio slug.
                idx.setdefault(slug + "/" + sub, carpeta)
                continue
            for f in os.listdir(carpeta):
                idx[sub + "/" + f] = os.path.join(carpeta, f)
    return idx


LOCAL = _indice_local()


def abrir(rel):
    ruta = os.path.join(JARVIS, rel.replace("/", os.sep))
    if not os.path.exists(ruta):
        ruta = LOCAL.get(rel)
    if not ruta or not os.path.exists(ruta):
        raise FileNotFoundError("No se encuentra el original " + rel)
    return Image.open(ruta).convert("RGB")


def guardar(im, slug, nombre):
    carpeta = os.path.join(DESTINO, slug)
    os.makedirs(carpeta, exist_ok=True)
    ruta = os.path.join(carpeta, nombre)
    # Las capturas se sirven grandes: no se reescalan, solo se optimizan.
    im.save(ruta, optimize=True)
    print(f"  {slug}/{nombre:32s} {im.size}  {os.path.getsize(ruta) / 1024:6.0f} KB")


def recorta(im, izq=0.0, arr=0.0, der=1.0, aba=1.0):
    w, h = im.size
    return im.crop((int(w * izq), int(h * arr), int(w * der), int(h * aba)))


def apila(arriba, abajo):
    """Une dos recortes en vertical, para saltarse una franja del medio."""
    ancho = min(arriba.width, abajo.width)
    fuera = Image.new("RGB", (ancho, arriba.height + abajo.height))
    fuera.paste(arriba.crop((0, 0, ancho, arriba.height)), (0, 0))
    fuera.paste(abajo.crop((0, 0, ancho, abajo.height)), (0, arriba.height))
    return fuera


def difumina(im, izq, arr, der, aba, radio=14):
    """Difumina una zona concreta: para tapar un dato sin romper la captura."""
    w, h = im.size
    caja = (int(w * izq), int(h * arr), int(w * der), int(h * aba))
    zona = im.crop(caja).filter(ImageFilter.GaussianBlur(radio))
    im = im.copy()
    im.paste(zona, caja)
    return im


print("Capturas que se publican tal cual (verificadas):")
DIRECTAS = [
    # golden-market
    ("gm_img_logo/webgm.png", "golden-market", "tienda.png"),
    # edelweiss
    ("edelweiss/Captura de pantalla 2026-08-19 135111.png", "edelweiss", "tienda.png"),
    ("edelweiss/Captura de pantalla 2026-08-19 135130.png", "edelweiss", "pedido.png"),
    # quickrx — el flujo y el coste real de telefonía, que es de Orkesta
    ("quickrx_img_logo/qrx_va.png", "quickrx-specialty-pharmacy", "flujo-agente-voz.png"),
    ("quickrx_img_logo/billing_retell.png", "quickrx-specialty-pharmacy", "coste-telefonia.png"),
    # water-feature-pros
    ("waterfeaturepros/Captura de pantalla 2026-08-19 132135.png", "water-feature-pros", "flujo-contenido.png"),
    ("waterfeaturepros/Captura de pantalla 2026-08-19 132159.png", "water-feature-pros", "flujo-asistente.png"),
    # sutan-cook
    ("sutan/Captura de pantalla 2026-08-19 134502.png", "sutan-cook", "web.png"),
    ("sutan/Captura de pantalla 2026-08-19 134526.png", "sutan-cook", "carta.png"),
    # renew
    ("renew/renew.png", "renew", "flujo-seguimiento.png"),
    ("renew/renew_Web.png", "renew", "web.png"),
    # greenriot
    ("greenriot_greenhunt/Captura de pantalla 2026-08-19 142316.png", "greenriot", "portada-app.png"),
    # cooperativa
    ("coopnav/Captura de pantalla 2026-08-19 134010.png", "cooperativa-hostelera", "acceso.png"),
    # psych4u — su web pública, y el mismo flujo que la farmacia
    ("psych4u/Captura de pantalla 2026-08-19 140722.png", "psych4u", "web.png"),
    ("quickrx_img_logo/qrx_va.png", "psych4u", "flujo-consulta.png"),
    # ariete
    ("ariete/arieteweb.png", "ariete-producciones", "web.png"),
    # taxi
    ("taxi_facturacion/taxi_facturacion.png", "taxi-facturacion", "flujo-contabilidad.png"),
    # mission-control y app de eventos
    ("orkesta_personal/Captura de pantalla 2026-08-19 133705.png", "mission-control", "laboratorio.png"),
    ("orkesta_personal/Captura de pantalla 2026-08-19 134722.png", "app-eventos-locales", "portada.png"),
    ("orkesta_personal/Captura de pantalla 2026-08-19 134741.png", "app-eventos-locales", "categorias.png"),
    # arima, yoursups y el mapa de greenriot
    ("arima/Captura de pantalla 2026-08-19 141354.png", "arima-experience", "web.png"),
    ("yours/Captura de pantalla 2026-08-19 133917.png", "yoursups", "tienda.png"),
    ("greenriot_greenhunt/Captura de pantalla 2026-08-19 143004.png", "greenriot", "mapa.png"),
]
for rel, slug, nombre in DIRECTAS:
    guardar(abrir(rel), slug, nombre)


print("\nCapturas intervenidas (con el motivo):")

# Golden Market · el panel de resumen. Del recorte anterior (solo la tarjeta de
# modelos vendidos) dijo Aitor que «apenas se ve el panel», así que ahora entra
# entero hasta el final de las dos gráficas. Lo que se tapa:
#   · la fila de indicadores: facturado del mes y margen medio → cifras 🔴
#   · el eje derecho de la gráfica, que va en euros de ingresos → cifra 🔴
# Lo que queda —unidades vendidas, modelos, secciones del panel— es 🟢.
gm = abrir("gm_img_logo/Captura de pantalla 2026-08-20 160520.png")
gm = difumina(gm, 0.449, 0.283, 0.479, 0.560, radio=7)
guardar(
    # La fila de indicadores se quita entera en vez de difuminarla: cuatro
    # borrones seguidos se leen peor que no enseñarla.
    apila(recorta(gm, aba=0.117), recorta(gm, arr=0.217, aba=0.625)),
    "golden-market",
    "panel.png",
)

# Golden Market · el panel de garantías y reparaciones, que es el circuito de
# postventa: cada ticket con su estado, su tipo y los días que lleva abierto.
# Lleva dos columnas de datos de terceros —el IMEI, que identifica el teléfono
# concreto de un cliente, y el teléfono del cliente—: las dos difuminadas.
rma = abrir("gm_img_logo/Captura de pantalla 2026-08-20 160717.png")
rma = difumina(rma, 0.236, 0.585, 0.305, 1.0, radio=8)
rma = difumina(rma, 0.615, 0.585, 0.670, 1.0, radio=8)
guardar(recorta(rma, aba=0.99), "golden-market", "garantias.png")

# Mission Control · el roster de agentes. Es la captura que pedía Aitor: se ven
# los cinco con su nombre y su estado. Sin datos de nadie; solo se recorta el
# hueco vacío de abajo.
eq = abrir("orkesta_personal/Captura de pantalla 2026-08-19 133450.png")
guardar(recorta(eq, aba=0.76), "mission-control", "equipo.png")

# Mission Control · la sala del agente de contenido. Limpia; se recorta el
# hueco vacío de abajo.
est = abrir("orkesta_personal/Captura de pantalla 2026-08-19 133507.png")
guardar(recorta(est, aba=0.87), "mission-control", "estudio.png")

# Arima · el flujo de entrada y clasificación de solicitudes. Solo nombres de
# pasos, ilegibles a este tamaño y sin datos de nadie. Se recorta el aviso
# naranja de ejecución del pie, que es cromo de la herramienta.
ar = abrir("arima/Captura de pantalla 2026-08-19 141517.png")
guardar(recorta(ar, aba=0.90), "arima-experience", "flujo.png")

# GreenRiot · el listado de hallazgos cercanos en el móvil. Objetos, distancia
# y hace cuánto: ni una persona identificable. Se recorta la barra de Android.
gr = abrir("greenriot_greenhunt/WhatsApp Image 2026-08-19 at 14.24.43.jpeg")
guardar(recorta(gr, aba=0.935), "greenriot", "hallazgos.png")

# Golden Market · la base operativa lleva una columna de IMEI: identifican
# el teléfono concreto que compró cada cliente. Se difumina esa columna.
air = abrir("gm_img_logo/AIRTABLE.png")
air = difumina(air, 0.487, 0.16, 0.585, 0.86, radio=9)
guardar(recorta(air, aba=0.88), "golden-market", "base-operativa.png")

# Ariete · la pestaña superior del editor lleva «MODELO_KARLA», nombre de una
# persona. Se recorta la barra.
ari = abrir("ariete/ARIETE_PRODUCCIONES.png")
guardar(recorta(ari, arr=0.058, aba=0.93), "ariete-producciones", "extraccion.png")

# Water Feature Pros · el panel viene de una grabación: abajo salen los
# controles del reproductor y la marca de agua de clideo.
wfp = abrir("waterfeaturepros/Captura de pantalla 2026-08-19 131758.png")
guardar(recorta(wfp, aba=0.83), "water-feature-pros", "panel-marketing.png")

# Cooperativa · la cabecera de la app enseña el correo de Aitor. Se difumina.
coop = abrir("quickrx_img_logo/appgastos_coop.png")
coop = difumina(coop, 0.08, 0.082, 0.30, 0.115, radio=7)
guardar(coop, "cooperativa-hostelera", "registro-gasto.png")

# Mission Control · el panel de JARVIS lista tareas con nombres de clientes y
# un asunto legal pendiente: información interna. Se recorta al orbe.
mc = abrir("orkesta_personal/Captura de pantalla 2026-08-19 133327.png")
guardar(recorta(mc, arr=0.52), "mission-control", "jarvis.png")

# Water Feature Pros · no había logo en la carpeta: se extrae del documento
# que sí lo trae, sobre fondo blanco.
doc = abrir("waterfeaturepros/Captura de pantalla 2026-08-19 131657.png")
logo = recorta(doc, izq=0.055, arr=0.025, der=0.225, aba=0.16)
logo = logo.convert("RGBA")
px = logo.load()
for y in range(logo.height):
    for x in range(logo.width):
        r, g, b, a = px[x, y]
        if r > 233 and g > 233 and b > 233:
            px[x, y] = (r, g, b, 0)
caja = logo.getbbox()
if caja:
    logo = logo.crop(caja)
ratio = 160 / logo.height
logo = logo.resize((round(logo.width * ratio), 160), Image.LANCZOS)
ruta = os.path.join(DESTINO, "logos", "water-feature-pros.png")
os.makedirs(os.path.dirname(ruta), exist_ok=True)
logo.save(ruta, optimize=True)
print(f"  logos/water-feature-pros.png{'':10s} {logo.size}  {os.path.getsize(ruta) / 1024:6.0f} KB")
