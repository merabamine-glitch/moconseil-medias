"""Recalage de la v3 Conciergerie : temps des mots v2 (align_p05.json) -> nouvelle voix (align_p05v3.json, alignement local
corrigé à la main sur les silences). Écrit src/warp_p05v3.ts."""
import json, re, pathlib
R = pathlib.Path(__file__).parent
FIX = {'chaque': 7.70, 'exactement': 11.47, 'veillons': 18.25, 'tous': 24.10, 'les': 24.25, 'restez': 25.58}
norm = lambda x: re.sub(r"[^\wàâçéèêëîïôûùüÿœ'-]", '', x.lower().replace('’', "'"))
new = []
for c in json.load(open(R / 'align_p05v3.json')):
    for w, t in c['words']:
        if re.search(r'\w', w):
            n = norm(w); new.append((n, FIX.pop(n, t) if n in FIX else t))
old = [(norm(x['w']), x['s']) for x in json.load(open(R / 'align_p05.json')) if re.search(r'\w', x['w'])]
i = [w for w, _ in old].index('pendant'); old = old[:i] + old[i + 2:]   # « Pendant que » retiré du script v3
assert [w for w, _ in old] == [w for w, _ in new], ([w for w, _ in old], [w for w, _ in new])
A = [(0.0, 0.0)]
for (w, a), (_, b) in zip(old, new):
    if a > A[-1][0] + 0.02 and b > A[-1][1] + 0.02:
        A.append((round(a, 3), round(b, 3)))
A += [(28.10, 28.75), (29.5, 29.45)]
ts = (R.parent / 'src' / 'warp_p05v3.ts').read_text()
ts = re.sub(r'export const ANCHORS5: \[number, number\]\[\] = .*?;\n', 'export const ANCHORS5: [number, number][] = ' + json.dumps(A) + ';\n', ts, flags=re.S)
(R.parent / 'src' / 'warp_p05v3.ts').write_text(ts)
print(len(A), 'ancres'); print(A)
