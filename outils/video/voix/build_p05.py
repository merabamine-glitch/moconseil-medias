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

# v2c (26/10, 19h30) : la phrase finale est remplacée par une prise « ultra enjouée » (règle d'Amine pour toutes les vidéos),
# raccordée à 26,90 s, niveau ramené à 1,4 fois celui de la phrase d'origine.
import numpy as np, soundfile as sf
def _load(p, sr=44100):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()
SR = 44100
base = _load(D / 'pack-05-conciergerie.mp3'); cta = _load(D / 'pack-05-cta-enjoue.mp3')
old = base[int(26.9 * SR):]
nz = np.where(np.abs(cta) > 0.01)[0]; cta = cta[max(0, nz[0] - int(0.03 * SR)): nz[-1] + int(0.12 * SR)]
rms = lambda x: np.sqrt((x[np.abs(x) > 0.02] ** 2).mean())
cta *= 1.4 * rms(old) / rms(cta)
fade = np.linspace(0, 1, int(0.01 * SR)); cta[:len(fade)] *= fade
out = np.concatenate([base[:int(26.9 * SR)], np.zeros(int(0.05 * SR), np.float32), cta])
sf.write(str(D / 'tmp_v2c.wav'), out, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(D / 'tmp_v2c.wav'), '-b:a', '192k', str(D / 'pack-05-conciergerie.mp3')], check=True)
(D / 'tmp_v2c.wav').unlink()
print('fin enjouée raccordée : durée', round(len(out) / SR, 2), 's ; « Réservez » à', round(26.95 + 0.03, 2), 's')
