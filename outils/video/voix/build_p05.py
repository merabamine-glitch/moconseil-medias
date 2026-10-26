"""Voix de la vidéo 5 « Pack Conciergerie » v2 : deux pauses raccourcies puis accélération x1,12 hauteur conservée.
Produit voix/pack-05-conciergerie.mp3 et voix/align_p05.json (temps des mots dans la voix finale)."""
import json, subprocess, pathlib
D = pathlib.Path(__file__).resolve().parent
CUTS = [(1.80, 2.04), (3.40, 3.74)]   # coupes dans les silences après « Algérie… » et « Europe ? »
TEMPO = 1.12
def newt(t):
    s = 0.0
    for a, b in CUTS:
        if t >= b: s += b - a
        elif t > a: s += t - a
    return (t - s) / TEMPO
src = D / 'pack-05-conciergerie-brut.mp3'
parts = []; prev = 0.0
for a, b in CUTS:
    parts.append(f"atrim={prev}:{a},asetpts=PTS-STARTPTS"); prev = b
parts.append(f"atrim=start={prev},asetpts=PTS-STARTPTS")
n = len(parts)
fc = ';'.join(f"[0:a]{p}[p{i}]" for i, p in enumerate(parts)) + ';' + ''.join(f"[p{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[c];[c]rubberband=tempo={TEMPO}:pitchq=quality:formant=preserved[o]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-filter_complex', fc, '-map', '[o]', '-ar', '44100', '-b:a', '192k', str(D / 'pack-05-conciergerie.mp3')], check=True)
w = json.load(open(D / 'scribe_p05.json'))['words']
out = [{'w': x['text'], 's': round(newt(x['start']), 3), 'e': round(newt(x['end']), 3)} for x in w if not x['text'].startswith('[') and x['text'] not in ('pause]',)]
json.dump(out, open(D / 'align_p05.json', 'w'), ensure_ascii=False, indent=0)
for x in out: print(f"{x['s']:6.2f} {x['e']:6.2f} {x['w']}")

# v2d (26/10, 19h50) : fin ultra enjouée dans la MÊME prise que « Pendant que vous restez chez vous… nous gérons le reste. »
# (pack-05-fin-v3.mp3, même voix et même timbre que le reste). Raccord dans le silence avant « Pendant » (24,07 s),
# prise insérée à vitesse naturelle, « Réservez » recalé à 26,97 s comme avant (aucun changement d'images).
import numpy as np, soundfile as sf
SR = 44100
def _load(p):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()
base = _load(D / 'pack-05-conciergerie.mp3'); fin = _load(D / 'pack-05-fin-v3.mp3')
rms = lambda x: np.sqrt((x[np.abs(x) > 0.02] ** 2).mean())
SPLICE_BASE, SPLICE_FIN = 24.07, 4.89          # début dans le silence avant « Pendant » (base finale / prise)
RES_FIN, RES_TARGET = 7.55, 26.97               # « Réservez » dans la prise / dans la vidéo
fin_seg = fin[int(SPLICE_FIN * SR):]
fin_seg *= rms(base[int(22 * SR):int(23.6 * SR)]) / rms(fin[int(0.0 * SR):int(4.4 * SR)])   # même niveau que la phrase d'avant
res_at = SPLICE_BASE + (RES_FIN - SPLICE_FIN)
extra = max(0.0, RES_TARGET - res_at)
k = int((7.25 - SPLICE_FIN + 0.12) * SR)        # milieu du silence entre « reste. » et « Réservez »
fin_seg = np.concatenate([fin_seg[:k], np.zeros(int(extra * SR), np.float32), fin_seg[k:]])
xf = int(0.03 * SR)
head = base[:int(SPLICE_BASE * SR)].copy()
fin_seg[:xf] *= np.linspace(0, 1, xf); head[-xf:] *= np.linspace(1, 0, xf)
head[-xf:] += 0  # fondu sortant dans le silence
out = np.concatenate([head, fin_seg])
sf.write(str(D / 'tmp_v2d.wav'), out, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(D / 'tmp_v2d.wav'), '-b:a', '192k', str(D / 'pack-05-conciergerie.mp3')], check=True)
(D / 'tmp_v2d.wav').unlink()
print('v2d : durée', round(len(out) / SR, 2), 's ; pause ajoutée', round(extra, 2), 's')
