"""
Normaliza los logos de cliente para el fondo oscuro de la web (#050505).

ORKESTA-DESIGN.md §2/§7: sobre fondo negro los logos van en blanco, o en su
color si contrasta. Cada logo se trata según cómo esté construido:

  strip_white  quita el fondo blanco opaco (deja el logo recortado)
  modo="blanco"  toda la tinta pasa a blanco (logos monocromos oscuros)
  modo="tinta"   solo la tinta oscura y desaturada pasa a blanco; los colores
                 saturados se conservan (logos con marca de color + texto negro)
  modo="color"   se deja tal cual (ya contrasta)

Nunca se amplía por encima del tamaño original: un logo borroso se ve peor
que uno pequeño.
"""
import os
import pillow_avif  # noqa: F401  (registra el decodificador AVIF)
from PIL import Image

JARVIS = r"C:\Users\aitor\OneDrive\Escritorio\ORKESTA - JARVIS\01_ORKESTA_CORE\portafolio"
BUILDS = r"C:\Users\aitor\OneDrive\Escritorio\ORKESTA - BUILDS\04_SHARED_ASSETS\brand-assets"
OUT = os.path.join(os.getcwd(), "public", "portfolio", "logos")
TARGET_H = 160

LOGOS = {
    "golden-market":              (JARVIS, "gm_img_logo/LOGOGM.webp", False, "blanco"),
    "edelweiss":                  (JARVIS, "edelweiss/Logo edelweiss.jpeg", True, "color"),
    "quickrx-specialty-pharmacy": (JARVIS, "quickrx_img_logo/LOGO.png", True, "color"),
    "sutan-cook":                 (BUILDS, "sutan-cook/logo/sutan-emblem.png", True, "color"),
    "greenriot":                  (JARVIS, "greenriot_greenhunt/4.png", False, "color"),
    "renew":                      (JARVIS, "renew/LOGO-VECTORIZADO_web_300x100-04.png", True, "blanco"),
    "psych4u":                    (JARVIS, "psych4u/logopsy4u.png", True, "tinta"),
    "cooperativa-hostelera":      (JARVIS, "coopnav/logo-cooperativa-hosteleria-1.webp", True, "color"),
    "ariete-producciones":        (JARVIS, "ariete/logoaritete.avif", False, "color"),
    "arima-experience":           (JARVIS, "arima/logo Arima_edited_edited.avif", False, "blanco"),
}


def saturacion(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    return 0 if mx == 0 else (mx - mn) / mx


def process(slug, base, rel, strip_white, modo):
    im = Image.open(os.path.join(base, rel.replace("/", os.sep))).convert("RGBA")
    px = im.load()
    w, h = im.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if strip_white and r >= 235 and g >= 235 and b >= 235:
                px[x, y] = (r, g, b, 0)
                continue
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if modo == "blanco":
                px[x, y] = (255, 255, 255, a)
            elif modo == "tinta" and lum < 120 and saturacion(r, g, b) < 0.35:
                px[x, y] = (255, 255, 255, a)

    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    # nunca ampliar: solo se reduce hasta la altura objetivo
    if im.height > TARGET_H:
        ratio = TARGET_H / im.height
        im = im.resize((max(1, round(im.width * ratio)), TARGET_H), Image.LANCZOS)
    dst = os.path.join(OUT, f"{slug}.png")
    im.save(dst, optimize=True)
    return im.size, os.path.getsize(dst)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for slug, (base, rel, sw, modo) in LOGOS.items():
        size, nbytes = process(slug, base, rel, sw, modo)
        print(f"{slug:30s} {modo:7s} {str(size):12s} {nbytes/1024:6.1f} KB")
