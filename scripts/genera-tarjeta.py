"""
Genera las dos caras de la tarjeta del Lanyard de la portada.

Cara delantera: foto de Aitor + nombre y cargo.
Cara trasera:  el orkestador sobre negro.

Colores y tipografías salen de ORKESTA-DESIGN.md. Las fuentes se convierten
desde assets/og-fonts (woff) a TTF en caliente, porque PIL no lee woff.

────────────────────────────────────────────────────────────────────────────
AJUSTES DE ENCUADRE — se tocan aquí, no en el código de la web
────────────────────────────────────────────────────────────────────────────
La foto va a cambiar. Todo lo que depende de ella está parametrizado:

  BANDA_ANCLAJE   Franja superior reservada para la pinza del cordón. La foto
                  empieza por debajo, así que el enganche nunca cae sobre la
                  cara. Es la «zona segura» del anclaje.
  FOCO_X, FOCO_Y  Punto de la foto original que queda centrado en el hueco
                  (0..1). FOCO_Y bajo = más frente y menos barbilla.
  ZOOM            1.0 = la foto llena el hueco justo. Subirlo acerca la cara;
                  bajarlo deja más aire alrededor.
  RECORTE_ORIGEN  Recorte previo del archivo original, para quitar marcas de
                  agua o bordes. (izq, arriba, der, abajo) en fracción.

Con una foto nueva: ajustar FOCO_Y y ZOOM, ejecutar y mirar el PNG.

Uso: python scripts/genera-tarjeta.py
"""

import io
import os

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

# La foto vive en el repo para que la tarjeta se pueda regenerar sin depender
# de rutas de fuera. Al cambiarla, sustituir el archivo y ajustar FOCO_Y y ZOOM.
FOTO = os.path.join("assets", "foto", "aitor-2026-08.png")
SALIDA = os.path.join("public", "lanyard")

# ── Encuadre ───────────────────────────────────────────────────────────────
BANDA_ANCLAJE = 0.115  # fracción de alto reservada arriba para la pinza
ALTO_FOTO = 0.60      # fracción de alto que ocupa la foto
FOCO_X, FOCO_Y = 0.5, 0.18
ZOOM = 1.0
RECORTE_ORIGEN = (0.0, 0.0, 1.0, 1.0)  # la foto actual no necesita recorte previo

# ── Marca (ORKESTA-DESIGN.md §2) ───────────────────────────────────────────
BG = (5, 5, 5)
SURFACE = (18, 18, 18)
TEXTO = (255, 255, 255)
MUTED = (176, 176, 176)
CYAN = (0, 229, 255)

NOMBRE = "Aitor Colino"
CARGO = "Founder"
EMPRESA = "Orkesta Automatización & IA"

W, H = 660, 940  # relación ~0,70, la de la cara del modelo card.glb


def fuente(nombre, tam):
    ruta = os.path.join("assets", "og-fonts", nombre + ".woff")
    ft = TTFont(ruta)
    ft.flavor = None
    buf = io.BytesIO()
    ft.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, tam)


def degradado_marca(d, y0, y1):
    """Filete horizontal con el degradado de marca."""
    for x in range(W):
        t = x / (W - 1)
        if t < 0.4:
            k = t / 0.4
            c = (0, int(229 - 49 * k), int(255 - 39 * k))
        else:
            k = (t - 0.4) / 0.6
            c = (int(123 * k), int(180 - 136 * k), int(216 - 25 * k))
        d.line([(x, y0), (x, y1)], fill=c)


def encaja(im, w, h, foco_x, foco_y, zoom):
    """Recorta la foto para llenar w×h respetando el punto focal."""
    r = max(w / im.width, h / im.height) * zoom
    im = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)
    x = round((im.width - w) * foco_x)
    y = round((im.height - h) * foco_y)
    x = max(0, min(x, im.width - w))
    y = max(0, min(y, im.height - h))
    return im.crop((x, y, x + w, y + h))


def delantera():
    card = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(card)

    banda = int(H * BANDA_ANCLAJE)
    alto_foto = int(H * ALTO_FOTO)

    foto = Image.open(FOTO).convert("RGB")
    fw, fh = foto.size
    izq, arr, der, aba = RECORTE_ORIGEN
    foto = foto.crop((int(fw * izq), int(fh * arr), int(fw * der), int(fh * aba)))
    foto = encaja(foto, W, alto_foto, FOCO_X, FOCO_Y, ZOOM)
    card.paste(foto, (0, banda))

    # La foto se funde con el fondo por abajo, sin corte duro
    fundido_alto = 200
    mascara = Image.new("L", (1, fundido_alto))
    for y in range(fundido_alto):
        mascara.putpixel((0, y), int(255 * (y / (fundido_alto - 1)) ** 1.4))
    mascara = mascara.resize((W, fundido_alto))
    card.paste(
        Image.new("RGB", (W, fundido_alto), BG),
        (0, banda + alto_foto - fundido_alto),
        mascara,
    )

    # Banda de anclaje: superficie elevada + filete de marca. Aquí cae la pinza.
    d.rectangle([0, 0, W, banda], fill=SURFACE)
    degradado_marca(d, 0, 5)
    # Ranura, como la de una tarjeta real
    ranura_w, ranura_h = 150, 16
    x0 = (W - ranura_w) // 2
    y0 = (banda - ranura_h) // 2 + 4
    d.rounded_rectangle([x0, y0, x0 + ranura_w, y0 + ranura_h], radius=8, fill=BG)

    f_nombre = fuente("space-grotesk-latin-700-normal", 62)
    f_cargo = fuente("jetbrains-mono-latin-400-normal", 27)
    f_empresa = fuente("inter-latin-400-normal", 30)

    tope = banda + alto_foto
    alto_bloque = 62 + 30 + 27 + 26 + 30
    y = tope + (H - tope - alto_bloque) // 2
    d.text((54, y), NOMBRE, font=f_nombre, fill=TEXTO)
    y += 92
    d.text((54, y), CARGO.upper(), font=f_cargo, fill=CYAN)
    y += 53
    d.text((54, y), EMPRESA, font=f_empresa, fill=MUTED)
    return card


def trasera():
    """Cara trasera: el orkestador sobre negro."""
    card = Image.new("RGB", (W, H), BG)
    src = os.path.join("public", "marca-orkesta.png")
    if os.path.exists(src):
        marca = Image.open(src).convert("RGBA")
        r = min((W * 0.62) / marca.width, (H * 0.42) / marca.height)
        marca = marca.resize((round(marca.width * r), round(marca.height * r)), Image.LANCZOS)
        card.paste(marca, ((W - marca.width) // 2, (H - marca.height) // 2 - 40), marca)

    d = ImageDraw.Draw(card)
    f = fuente("jetbrains-mono-latin-400-normal", 24)
    texto = "ORKESTA"
    caja = d.textbbox((0, 0), texto, font=f)
    d.text(((W - (caja[2] - caja[0])) // 2, int(H * 0.66)), texto, font=f, fill=MUTED)
    degradado_marca(d, 0, 5)
    return card


if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    delantera().save(os.path.join(SALIDA, "tarjeta-frente.png"), optimize=True)
    trasera().save(os.path.join(SALIDA, "tarjeta-dorso.png"), optimize=True)
    for n in ("tarjeta-frente.png", "tarjeta-dorso.png"):
        p = os.path.join(SALIDA, n)
        print(f"{n:24s} {Image.open(p).size}  {os.path.getsize(p) / 1024:6.1f} KB")
