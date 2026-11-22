import sys, os, math
sys.path.insert(0, "/home/claude/moconseil-medias/outils")
os.chdir("/home/claude/moconseil-medias")
import mo_visuels as mv
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

W, H, M = 1080, 1350, 84
MAR = (27, 42, 65); OR = (201, 162, 75); ORF = (156, 119, 38); VERT = (46, 125, 82)
out = sys.argv[1]

# fond : dégradé chaud pierre -> sable avec lueur dorée
y = np.linspace(0, 1, H)[:, None]; x = np.linspace(0, 1, W)[None, :]
top = np.array([248, 240, 224]); bot = np.array([232, 212, 172])
base = top * (1 - y[..., None]) + bot * y[..., None]
base = np.broadcast_to(base, (H, W, 3)).copy()
d2 = ((x - 0.62) ** 2 + ((y - 0.68) * 1.1) ** 2)
glow = np.exp(-d2 / 0.06)[..., None]
base = base * (1 - 0.35 * glow) + np.array([255, 236, 190]) * 0.35 * glow
img = Image.fromarray(base.clip(0, 255).astype(np.uint8)).convert("RGBA")
d = ImageDraw.Draw(img)

# titres
f_sur = mv.police("moyen", 30); f_t = mv.police("titre", 94)
d.text((M, 120), "VOTRE DOSSIER EN ALGÉRIE", font=f_sur, fill=ORF, spacing=0)
d.text((M, 175), "Une étape faite,", font=f_t, fill=MAR)
d.text((M, 290), "une preuve envoyée.", font=f_t, fill=ORF)

# téléphone
pw, ph = 470, 860; px = W - M - pw + 20; py = 500
sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
ds.rounded_rectangle([px + 18, py + 30, px + pw + 18, py + ph + 30], 70, fill=(60, 40, 10, 110))
sh = sh.filter(ImageFilter.GaussianBlur(28)); img.alpha_composite(sh); d = ImageDraw.Draw(img)
d.rounded_rectangle([px, py, px + pw, py + ph], 70, fill=MAR)
sx, sy, sw = px + 22, py + 22, pw - 44
d.rounded_rectangle([sx, sy, sx + sw, py + ph - 22], 52, fill=(250, 248, 243))
d.rounded_rectangle([px + pw / 2 - 60, sy + 14, px + pw / 2 + 60, sy + 40], 13, fill=MAR)
# en-tête de conversation
d.rectangle([sx, sy + 60, sx + sw, sy + 150], fill=(240, 234, 222))
d.ellipse([sx + 24, sy + 76, sx + 84, sy + 136], fill=MAR)
mv.logo(img, sx + 31, sy + 94, 46, "clair"); d = ImageDraw.Draw(img)
d.text((sx + 102, sy + 82), "M&O Conseil", font=mv.police("gras", 26), fill=MAR)
d.text((sx + 102, sy + 114), "Équipe en Algérie", font=mv.police("normal", 19), fill=(110, 110, 110))

def bulle(yb, titre, fichier):
    bx = sx + 22; bw = sw - 60; bh = 150
    d.rounded_rectangle([bx, yb, bx + bw, yb + bh], 26, fill=(255, 255, 255), outline=(225, 215, 195), width=2)
    # vignette document
    dx, dy = bx + 20, yb + 22
    d.rounded_rectangle([dx, dy, dx + 80, dy + 106], 8, fill=(246, 239, 226), outline=OR, width=3)
    for k in range(4):
        d.line([dx + 14, dy + 24 + k * 18, dx + 66 - (k == 3) * 20, dy + 24 + k * 18], fill=(190, 170, 130), width=4)
    # coche
    cx, cy = dx + 70, dy + 96
    d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=VERT)
    d.line([cx - 10, cy, cx - 3, cy + 8, cx + 11, cy - 8], fill="white", width=5, joint="curve")
    d.text((dx + 112, yb + 36), titre, font=mv.police("gras", 25), fill=MAR)
    d.text((dx + 112, yb + 78), fichier, font=mv.police("normal", 21), fill=(120, 120, 120))

bulle(sy + 190, "Dossier déposé", "récépissé.pdf")
bulle(sy + 365, "Facture payée", "reçu.jpg")
bulle(sy + 540, "Courrier relevé", "courrier.pdf")

# logo
mv.logo(img, M, H - 84 - 120, 190, "couleur")
img.convert("RGB").save(out, quality=94)
print("ok")
