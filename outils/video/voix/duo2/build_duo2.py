"""Duo Game Boy « Signé ≠ propriétaire » (16/11/2026) : voix Homme et Femme recréées par Amine (ElevenLabs, Voice Design, v3).
Découpe les 5 répliques (pauses internes raccourcies), assemble à 0,4 s, tempo x1,05 (Rubber Band, hauteur conservée),
écrit out/duo2-voix.wav et src/duo2_data.ts (répliques, repères de mots, bouches par image)."""
import json, pathlib, subprocess
import numpy as np, soundfile as sf
D = pathlib.Path(__file__).resolve().parent; ROOT = D.parent.parent
SR = 48000; FPS = 30; TEMPO = 1.05; OFF = 0.4
def load(p):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()
H = load(D / 'duo2-homme.mp3'); F = load(D / 'duo2-femme.mp3')
# réplique : (source, personnage, [(début, fin), ...] morceaux gardés, pause entre morceaux)
LINES = [
    ('H1', H, 'homme', [(0.02, 3.17)]),
    ('F2', F, 'femme', [(0.12, 1.08), (1.63, 6.45)]),
    ('H3', H, 'homme', [(3.31, 3.95), (4.25, 5.47)]),
    ('F4', F, 'femme', [(6.98, 9.09), (9.48, 11.95)]),
    ('H5', H, 'homme', [(5.71, 6.87), (7.04, 8.30)]),
]
INNER = {'F2': 0.30, 'H3': 0.22, 'F4': 0.26, 'H5': 0.22}
GAP = 0.24
pieces = []; marks = {}; segs = []
t = OFF
for name, src, who, parts in LINES:
    st = t
    for j, (a, b) in enumerate(parts):
        if j: t += INNER[name]
        pieces.append((src, a, b, t)); marks[f'{name}.{j}'] = [a, b, t]
        t += b - a
    segs.append({'id': name, 'k': who, 's': st, 'e': t})
    t += GAP
T0 = t
N = int((T0 + 0.5) * SR); voice = np.zeros(N, np.float32)
for src, a, b, st in pieces:
    seg = src[int(a * SR):int(b * SR)]; i0 = int(st * SR); voice[i0:i0 + len(seg)] += seg
tmp = ROOT / 'out' / 'duo2-voix-brut.wav'; sf.write(str(tmp), voice, SR)
out = ROOT / 'out' / 'duo2-voix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp), '-af', f'rubberband=tempo={TEMPO}', '-ar', str(SR), '-ac', '1', str(out)], check=True)
v, _ = sf.read(str(out), dtype='float32'); v *= 0.5 / np.abs(v).max(); sf.write(str(out), v, SR)
# temps du montage : (temps brut) / TEMPO
sc = lambda x: round(x / TEMPO, 3)
for s_ in segs: s_['s'] = sc(s_['s']); s_['e'] = sc(s_['e'])
def at(name, j, x):  # x = temps dans le fichier source -> temps montage
    a, b, st = marks[f'{name}.{j}']; return sc(st + (x - a))
# repères de mots (temps source mesurés à l'énergie et à la transcription)
M = {
    'h1_signe': at('H1', 0, 0.35), 'h1_notaire': at('H1', 0, 1.1), 'h1_alger': at('H1', 0, 1.75), 'h1_moi': at('H1', 0, 2.55),
    'f2_pas': at('F2', 0, 0.16), 'f2_tant': at('F2', 1, 1.67), 'f2_publie': at('F2', 1, 2.75), 'f2_conservation': at('F2', 1, 3.35),
    'f2_propriete': at('F2', 1, 4.69), 'f2_transferee': at('F2', 1, 5.75),
    'h3_serieux': at('H3', 0, 3.35), 'h3_signature': at('H3', 1, 4.29), 'h3_suffit': at('H3', 1, 4.9),
    'f4_publication': at('F4', 0, 7.02), 'f4_proprietaire': at('F4', 0, 8.2), 'f4_suivez': at('F4', 1, 9.52), 'f4_titre': at('F4', 1, 10.9),
    'h5_signe': at('H5', 0, 5.75), 'h5_bien': at('H5', 0, 6.35), 'h5_publie': at('H5', 1, 7.08), 'h5_moi': at('H5', 1, 7.75),
}
T = round(segs[-1]['e'] + 1.45, 2)
nf = int(T * FPS) + 1; hop = SR // FPS
vv = np.zeros(nf * hop, np.float32); vv[:min(len(v), len(vv))] = v[:len(vv)]
rms = np.array([np.sqrt((vv[i * hop:(i + 1) * hop] ** 2).mean()) for i in range(nf)])
mouth = {'homme': [0.0] * nf, 'femme': [0.0] * nf}
for s_ in segs:
    f0, f1 = int(s_['s'] * FPS), int(s_['e'] * FPS) + 1
    seg = rms[f0:f1]; mx = np.percentile(seg, 95) + 1e-6
    for j, x in enumerate(seg): mouth[s_['k']][f0 + j] = round(float(min(1, x / mx)), 2)
(ROOT / 'src' / 'duo2_data.ts').write_text('// généré par voix/duo2/build_duo2.py\nexport const D2_SEGS = %s;\nexport const D2 = %s as const;\nexport const D2_MOUTH_H = %s;\nexport const D2_MOUTH_F = %s;\nexport const D2_DUREE = %s;\n' % (json.dumps(segs), json.dumps(M), json.dumps(mouth['homme']), json.dumps(mouth['femme']), T))
print(json.dumps(segs)); print(json.dumps(M)); print('durée', T)
