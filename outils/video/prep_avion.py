"""Prépare la photo de l'avion entre les immeubles :
- ciel.jpg      : plaque propre (avion effacé)
- avion.png     : l'avion détouré (fond transparent)
- premier-plan.png : les immeubles seuls (ciel transparent), posés au-dessus de l'avion
"""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter

SRC = 'public/photos/avion-immeubles.jpg'
im = np.array(Image.open(SRC).convert('RGB')).astype(np.float32)
H, W, _ = im.shape

# --- 1. zone de l'avion
x0, y0, x1, y1 = 596, 986, 972, 1362
# --- 2. plaque propre : par ligne, modèle linéaire en x estimé sur des colonnes de ciel de part et d'autre
clean = im.copy()
L = np.arange(x0 - 70, x0 - 10)
R = np.arange(x1 + 10, x1 + 70)
xs = np.concatenate([L, R]).astype(np.float32)
rows = np.arange(y0 - 30, y1 + 30)
fit = np.zeros((len(rows), 3, 2), np.float32)
for k, y in enumerate(rows):
    for c in range(3):
        ys = np.concatenate([im[y, L, c], im[y, R, c]])
        b, a = np.polyfit(xs, ys, 1)
        fit[k, c] = (a, b)
# lisser les coefficients verticalement (enlève le bruit ligne à ligne)
from scipy.ndimage import gaussian_filter1d
fit = gaussian_filter1d(fit, 6, axis=0)
rng = np.random.default_rng(3)
# bruit du ciel (grain photo)
noise_std = im[y0:y1, x0 - 70:x0 - 10].std(axis=1).mean() * 0.35
xx = np.arange(x0, x1).astype(np.float32)
for k, y in enumerate(rows):
    if y < y0 or y >= y1:
        continue
    for c in range(3):
        a, b = fit[k, c]
        clean[y, x0:x1, c] = a + b * xx
clean[y0:y1, x0:x1] += rng.normal(0, noise_std, (y1 - y0, x1 - x0, 1))
# raccord doux sur les bords du rectangle
mask = np.zeros((H, W), np.float32)
mask[y0 + 12:y1 - 12, x0 + 12:x1 - 12] = 1
mask = cv2.GaussianBlur(mask, (0, 0), 6)
plate = im * (1 - mask[..., None]) + clean * mask[..., None]
Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8)).save('public/photos/ciel.jpg', quality=93)

# --- 3. avion détouré
P = im[y0:y1, x0:x1]
S = plate[y0:y1, x0:x1]
bmr_s = S[..., 2] - S[..., 0]
bmr_p = P[..., 2] - P[..., 0]
a1 = np.clip((bmr_s - bmr_p) / np.maximum(bmr_s - 8, 1), 0, 1)
lum = np.abs(P.mean(-1) - S.mean(-1)) / 40
a = np.clip(np.maximum(a1, np.clip(lum, 0, 1)), 0, 1)
a[a < 0.06] = 0
# ne garder que l'avion (plus grande composante), légèrement dilatée : supprime le grain du ciel
n, lab, stats, _ = cv2.connectedComponentsWithStats((a > 0.35).astype(np.uint8), 8)
big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
keep = (lab == big).astype(np.uint8)
keep = cv2.dilate(keep, np.ones((7, 7), np.uint8))
keep = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.2)
a = a * keep
a = cv2.GaussianBlur(a, (0, 0), 0.6)
F = (P - (1 - a[..., None]) * S) / np.maximum(a[..., None], 0.05)
F = np.clip(F, 0, 255)
rgba = np.dstack([F, a * 255]).astype(np.uint8)
spr = Image.fromarray(rgba, 'RGBA')
bb = spr.getbbox()
spr = spr.crop(bb)
spr.save('public/photos/avion.png')
print('avion bbox (dans la photo):', x0 + bb[0], y0 + bb[1], x0 + bb[2], y0 + bb[3], 'taille', spr.size)

# --- 4. premier plan : immeubles (ciel transparent)
sky = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(sky)
poly = [(545, -5), (1015, -5), (1281, 1420), (1100, 1503), (975, 1515), (975, H + 5),
        (596, H + 5), (596, 1515), (470, 1502), (287, 1420)]
d.polygon(poly, fill=255)
sky = sky.filter(ImageFilter.GaussianBlur(1.2))
alpha = Image.eval(sky, lambda v: 255 - v)
fg = Image.open(SRC).convert('RGBA')
fg.putalpha(alpha)
fg.save('public/photos/premier-plan.png')
# contrôle visuel : plaque + masque
chk = Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8)).convert('RGBA')
over = Image.new('RGBA', (W, H), (255, 0, 0, 0))
over.putalpha(Image.eval(sky, lambda v: v // 4))
chk = Image.alpha_composite(chk, over)
chk.convert('RGB').resize((784, 1176)).save('/tmp/claude-0/-home-claude/1cbd4eaf-0c59-5fca-a876-ad1cdf6e7727/scratchpad/v1/chk_plate.jpg', quality=88)
