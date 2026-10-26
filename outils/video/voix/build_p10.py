"""Voix de la vidéo « Pack Retour Définitif » (15 s, voix « Femme », une seule prise, fin ultra enjouée dans la même prise).
Pauses raccourcies puis x1,1 hauteur conservée (réglage de la vidéo Femme validée). Sortie : pack-10-retour.mp3 + align_p10.json."""
import json, subprocess, pathlib
D = pathlib.Path(__file__).resolve().parent
# (début, fin) des morceaux de silence retirés, dans la voix brute
CUTS = [(1.45, 1.77), (4.36, 4.42), (5.06, 5.27), (6.30, 6.53), (10.05, 10.09), (11.16, 11.38), (13.90, 14.10)]
TEMPO = 1.1
def newt(t):
    sh = 0.0
    for a, b in CUTS:
        if t >= b: sh += b - a
        elif t > a: sh += t - a
    return (t - sh) / TEMPO
src = D / 'pack-10-retour-brut.mp3'
parts, prev = [], 0.0
for a, b in CUTS:
    parts.append(f"atrim={prev}:{a},asetpts=PTS-STARTPTS"); prev = b
parts.append(f"atrim=start={prev},asetpts=PTS-STARTPTS")
n = len(parts)
fc = ';'.join(f"[0:a]{p}[p{i}]" for i, p in enumerate(parts)) + ';' + ''.join(f"[p{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[c];[c]rubberband=tempo={TEMPO}:pitchq=quality:formant=preserved[o]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-filter_complex', fc, '-map', '[o]', '-ar', '44100', '-b:a', '192k', str(D / 'pack-10-retour.mp3')], check=True)
w = json.load(open(D / 'scribe_p10.json'))['words']
out = [{'w': x['text'], 's': round(newt(x['start']), 3), 'e': round(newt(x['end']), 3)} for x in w if not x['text'].startswith('[') and not x['text'].endswith(']')]
json.dump(out, open(D / 'align_p10.json', 'w'), ensure_ascii=False, indent=0)
for x in out: print(f"{x['s']:6.2f} {x['e']:6.2f} {x['w']}")
