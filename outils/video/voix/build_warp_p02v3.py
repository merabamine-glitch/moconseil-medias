"""Table de recalage vidéo 2 : temps des mots de la voix 1 (align_p02.json) -> voix 3 (prise d'Amine du 03/11, alignement local align_p02v3.json, sans accélération).
Écrit warp_p02v2.json et src/warp_p02v2.ts (noms conservés : le montage p02v2.tsx les lit)."""
import json, re, pathlib
R = pathlib.Path(__file__).parent
nw = [(w, t) for c in json.load(open(R / 'align_p02v3.json')) for w, t in c['words'] if re.search(r'\w', w)]
ow = [(w, t) for c in json.load(open(R / 'align_p02.json')) for w, t in c['words'] if re.search(r'\w', w)]
norm = lambda x: re.sub(r'[^\wàâçéèêëîïôûùüÿœ\'-]', '', x.lower()).replace('’', "'")
pairs, j = [], 0
for w, t in ow:
    k = j
    while k < len(nw) and norm(nw[k][0]) != norm(w):
        k += 1
    if k < len(nw) and k - j <= 3:
        pairs.append((t, nw[k][1], w)); j = k + 1
mono = []
for p in pairs:
    if (not mono or (p[0] > mono[-1][0] + 0.02 and p[1] > mono[-1][1] + 0.02)) and p[2].lower() not in ('restez', 'exactement'):
        mono.append(p)
mono.append((29.5, 29.5, 'FIN'))
json.dump({'old': [round(a, 3) for a, b, _ in mono], 'new': [round(b, 3) for a, b, _ in mono], 'mots': [w for *_, w in mono]}, open(R / 'warp_p02v2.json', 'w'), ensure_ascii=False, indent=1)
(R.parent / 'src' / 'warp_p02v2.ts').write_text('// généré par voix/build_warp_p02v3.py (voix v3 du 03/11/2026) depuis voix/warp_p02v2.json\nexport const WARP_OLD = %s;\nexport const WARP_NEW = %s;\n' % ([round(a, 3) for a, b, _ in mono], [round(b, 3) for a, b, _ in mono]))
for a, b, w in mono: print(f'{w:18s} {a:6.2f} -> {b:6.2f}')
print(len(mono), 'ancres')
