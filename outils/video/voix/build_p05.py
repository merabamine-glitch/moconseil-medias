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
