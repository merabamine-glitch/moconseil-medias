"""Vidéo HeyGen « femme Pixar — fredha » (04/11/2026) : pauses raccourcies (même coupe image et son), zone utile recadrée
(la vidéo HeyGen gratuite est une image carrée sur fond blanc), agrandie x2 (Lanczos + accentuation). Le filigrane HeyGen est conservé à part
(filigrane.png) et réaffiché sur chaque plan de la femme : on ne le supprime pas (version gratuite)."""
import json, subprocess, pathlib, cv2, numpy as np
D = pathlib.Path(__file__).resolve().parent
SRC = D / 'pixar-fredha-source-heygen.mp4'
KEEP = [(0.30, 1.88), (1.91, 3.16), (3.61, 5.51), (5.73, 6.45), (6.96, 9.00), (9.01, 10.42), (10.75, 12.62), (12.75, 13.46),
        (13.48, 14.35), (14.50, 15.30), (15.52, 17.20), (17.24, 18.22), (18.49, 19.25), (19.61, 21.25)]
n = len(KEEP)
fc = ''.join(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[a{i}];" for i, (a, b) in enumerate(KEEP))
fc += ''.join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(SRC), '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '10', '-preset', 'veryfast', '-r', '25', '-c:a', 'pcm_s16le', str(D / 'coupe.mov')], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(D / 'coupe.mov'), '-vn', '-ac', '1', '-ar', '48000', str(D / 'pixar-voix.wav')], check=True)
# agrandissement de la zone utile
class _SR:  # agrandissement x2 Lanczos (le modèle FSRCNN n'est pas lisible par cette version d'OpenCV)
    def upsample(self, img):
        return cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
sr = _SR()
cap = cv2.VideoCapture(str(D / 'coupe.mov'))
out = None
while True:
    ok, fr = cap.read()
    if not ok: break
    crop = fr[246:1034, 0:720]
    up = sr.upsample(crop)
    up = cv2.addWeighted(up, 1.35, cv2.GaussianBlur(up, (0, 0), 1.6), -0.35, 0)
    if out is None:
        h, w = up.shape[:2]
        out = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}', '-r', '25', '-i', '-', '-c:v', 'libx264', '-crf', '12', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', str(D.parent / 'public' / 'video' / 'pixar-fredha.mp4')], stdin=subprocess.PIPE)
    out.stdin.write(up.tobytes())
out.stdin.close(); out.wait()
# filigrane HeyGen (zone fixe sous l'image), rendu en blanc semi-opaque
cap = cv2.VideoCapture(str(SRC)); cap.set(cv2.CAP_PROP_POS_MSEC, 9000); ok, fr = cap.read()
g = cv2.cvtColor(fr[1120:1235, 490:670], cv2.COLOR_BGR2GRAY).astype(float)
alpha = np.clip((255 - g) * 5, 0, 255).astype(np.uint8)
rgba = np.dstack([np.full_like(alpha, 255)] * 3 + [alpha])
cv2.imwrite(str(D.parent / 'public' / 'img' / 'heygen-filigrane.png'), cv2.resize(rgba, None, fx=1.5, fy=1.5))
# temps des phrases dans la coupe
cum = []; t = 0
for a, b in KEEP: cum.append((a, b, t)); t += b - a
def nt(x):
    for a, b, c in cum:
        if a - 0.01 <= x <= b + 0.01: return round(c + x - a, 3)
    raise ValueError(x)
PH = [(0.34, "Vous héritez d'un bien en Algérie"), (2.01, "et vous vivez à l'étranger ?"), (3.71, 'Première étape, souvent oubliée :'), (5.83, 'la fredha.'),
      (7.06, 'Cet acte, établi chez un notaire,'), (9.11, 'liste tous les héritiers.'), (10.85, 'Sans lui, le bien reste bloqué :'), (12.85, 'ni vente,'), (13.58, 'ni partage.'),
      (14.60, 'Bonne nouvelle :'), (15.62, 'elle peut se préparer à distance,'), (17.34, 'par procuration.'), (18.59, "Besoin d'aide ?"), (19.71, 'Réservez votre appel découverte.')]
res = [{'t': nt(a), 'txt': x} for a, x in PH]
json.dump({'duree': round(t, 3), 'phrases': res}, open(D / 'pixar_temps.json', 'w'), ensure_ascii=False, indent=1)
for r in res: print(r)
print('durée', round(t, 2))
