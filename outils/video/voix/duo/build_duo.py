"""Duo Game Boy « Conciergerie » (04/11/2026) : voix d'Amine (ElevenLabs, deux prises contenant les 4 répliques, Homme + Femme).
Assemble la voix (out/duo-voix.wav), calcule l'ouverture de bouche par image et par personnage (src/duo_data.ts)."""
import json, pathlib, subprocess
import numpy as np, soundfile as sf
D = pathlib.Path(__file__).resolve().parent; ROOT = D.parent.parent
SR = 48000; FPS = 30
def load(p):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()
p1 = load(D / 'duo-conciergerie-prise1.mp3'); p2 = load(D / 'duo-conciergerie-prise2.mp3')
OFF = 0.5
# (fichier, début, fin, personnage, début dans la vidéo)
SEGS = [(p1, 0.05, 6.72, 'homme', OFF), (p1, 6.86, 13.45, 'femme', OFF + 6.67 + 0.25),
        (p2, 0.0, 0.66, 'homme', None), (p2, 0.78, 4.13, 'femme', None)]
T = 19.8
N = int(T * SR); voice = np.zeros(N, np.float32); who = []
t = OFF
for i, (src, a, b, k, st) in enumerate(SEGS):
    if st is None: st = t + (0.22 if i == 2 else 0.12)
    seg = src[int(a * SR):int(b * SR)]
    i0 = int(st * SR); voice[i0:i0 + len(seg)] += seg[:N - i0]
    who.append({'k': k, 's': round(st, 3), 'e': round(st + (b - a), 3), 'src_a': a})
    t = st + (b - a)
voice *= 0.5 / np.abs(voice).max()
sf.write(str(ROOT / 'out' / 'duo-voix.wav'), voice, SR)
# ouverture de bouche par image (RMS lissé, normalisé par personnage)
nf = int(T * FPS); hop = SR // FPS
rms = np.array([np.sqrt((voice[i * hop:(i + 1) * hop] ** 2).mean()) for i in range(nf)])
mouth = {'homme': [0.0] * nf, 'femme': [0.0] * nf}
for w in who:
    f0, f1 = int(w['s'] * FPS), int(w['e'] * FPS)
    seg = rms[f0:f1]; mx = np.percentile(seg, 95) + 1e-6
    for j, v in enumerate(seg): mouth[w['k']][f0 + j] = round(float(min(1, v / mx)), 2)
(ROOT / 'src' / 'duo_data.ts').write_text('// généré par voix/duo/build_duo.py\nexport const DUO_SEGS = %s;\nexport const MOUTH_H = %s;\nexport const MOUTH_F = %s;\nexport const DUO_DUREE = %s;\n' % (json.dumps(who), json.dumps(mouth['homme']), json.dumps(mouth['femme']), T))
for w in who: print(w)
