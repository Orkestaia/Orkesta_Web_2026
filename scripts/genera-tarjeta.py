"""
Genera las dos caras de la tarjeta del Lanyard de la portada.

Cara delantera: foto de Aitor + nombre y cargo.
Cara trasera:  el orkestador sobre negro.

Los colores y las tipografías salen de ORKESTA-DESIGN.md. Las fuentes se
convierten desde assets/og-fonts (woff) a TTF en caliente, porque PIL no lee
woff. Salida en public/lanyard/.

Uso: python scripts/genera-tarjeta.py
"""
import io
import os

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

FOTO = (
    r"C:\Users\aitor\OneDrive\Escritorio\ORKESTA - JARVIS"
    r"\01_ORKESTA_CORE\portafolio\orkesta_personal\aitor.jpeg"
)
SALIDA = os.path.join("public", "lanyard")

# ORKESTA-DESIGN.md §2
BG = (5, 5, 5)
SURFACE = (18, 18, 18)
TEXTO = (255, 255, 255)
MUTED = (176, 176, 176)
CYAN = (0, 229, 255)

# El nombre lo confirmó Aitor directamente; el brief traía un apellido
# distinto que era un marcador de posición.
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


def recorta_cubriendo(im, w, h):
    """Recorta la imagen para llenar w×h sin deformarla."""
    r = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x = (im.width - w) // 2
    y = (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def delantera():
    card = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(card)

    # Foto: ocupa la parte superior, con desvanecido hacia el fondo
    alto_foto = int(H * 0.60)
    foto = Image.open(FOTO).convert("RGB")
    # El original trae una marca de agua en la esquina superior derecha:
    # se recorta antes de componer.
    fw, fh = foto.size
    foto = foto.crop((0, int(fh * 0.10), int(fw * 0.93), fh))
    foto = recorta_cubriendo(foto, W, alto_foto)
    card.paste(foto, (0, 0))

    # Degradado de la foto al fondo para que no haya un corte duro
    fundido_alto = 260
    fundido = Image.new("L", (1, fundido_alto))
    for y in range(fundido_alto):
        fundido.putpixel((0, y), int(255 * (y / (fundido_alto - 1)) ** 1.4))
    fundido = fundido.resize((W, fundido_alto))
    negro = Image.new("RGB", (W, fundido_alto), BG)
    card.paste(negro, (0, alto_foto - fundido_alto), fundido)

    # Filete del degradado de marca, arriba
    for x in range(W):
        t = x / (W - 1)
        if t < 0.4:
            k = t / 0.4
            c = (int(0 + 0 * k), int(229 - 49 * k), int(255 - 39 * k))
        else:
            k = (t - 0.4) / 0.6
            c = (int(0 + 123 * k), int(180 - 136 * k), int(216 - 25 * k))
        d.line([(x, 0), (x, 5)], fill=c)

    # Textos
    f_nombre = fuente("space-grotesk-latin-700-normal", 62)
    f_cargo = fuente("jetbrains-mono-latin-400-normal", 27)
    f_empresa = fuente("inter-latin-400-normal", 30)

    # El bloque de texto se centra ópticamente en la banda que queda bajo la
    # foto, en vez de quedar pegado a ella con un hueco muerto debajo.
    alto_bloque = 62 + 30 + 27 + 26 + 30
    y = alto_foto + (H - alto_foto - alto_bloque) // 2
    d.text((54, y), NOMBRE, font=f_nombre, fill=TEXTO)
    y += 92
    d.text((54, y), CARGO.upper(), font=f_cargo, fill=CYAN)
    y += 53
    d.text((54, y), EMPRESA, font=f_empresa, fill=MUTED)

    return card


def trasera_simple():
    """Cara trasera: el orkestador del brandbook, limpio, sobre negro."""
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

    for x in range(W):
        t = x / (W - 1)
        if t < 0.4:
            k = t / 0.4
            c = (0, int(229 - 49 * k), int(255 - 39 * k))
        else:
            k = (t - 0.4) / 0.6
            c = (int(123 * k), int(180 - 136 * k), int(216 - 25 * k))
        d.line([(x, 0), (x, 5)], fill=c)
    return card


if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    a = delantera()
    a.save(os.path.join(SALIDA, "tarjeta-frente.png"), optimize=True)
    b = trasera_simple()
    b.save(os.path.join(SALIDA, "tarjeta-dorso.png"), optimize=True)
    for n in ("tarjeta-frente.png", "tarjeta-dorso.png"):
        p = os.path.join(SALIDA, n)
        print(f"{n:24s} {Image.open(p).size}  {os.path.getsize(p)/1024:6.1f} KB")
