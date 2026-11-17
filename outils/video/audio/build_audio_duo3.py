"""Bandes son des 4 duos éducatifs (17/11/2026) : voix (out/duo3-vN-voix.wav) + nappe chiptune + pulsation
+ bruitages calés sur les repères de mots (à -10 dB). Fond bleu : accords do-la-fa-sol ; fond or : ré-si-sol-la (comme le duo n°2)."""
import json, pathlib, re, sys
import numpy as np, soundfile as sf
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
DATA = (ROOT / 'src' / 'duo3_data.ts').read_text()
rng = np.random.default_rng(23)
note = lambda m: 440 * 2 ** ((m - 69) / 12)


def lp(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)): y += cut[n] * (nz[n] - y); out[n] = y
    return out


def blip(t0, f0=880, f1=1320, d=0.09, g=0.08):
    L = int(d * SR); tt = np.arange(L) / SR; fr = np.linspace(f0, f1, L)
    return int(t0 * SR), (g * np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * np.exp(-tt * 18)).astype(np.float32)


def whoosh(t0, d=0.6, g=0.12):
    L = int(d * SR); return int(t0 * SR), (g * lp(rng.standard_normal(L), np.linspace(0.03, 0.3, L)) * np.sin(np.pi * np.arange(L) / L) ** 2).astype(np.float32)


def boing(t0, g=0.1):
    L = int(0.35 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (180 + 260 * tt / 0.35 + 30 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.exp(-tt * 7)).astype(np.float32)


def thud(t0, g=0.3):
    L = int(0.4 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (62 + 60 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 14)).astype(np.float32)


def stamp(t0, g=0.35):
    i, s1 = thud(t0, g); _, s2 = blip(t0, 300, 200, 0.05, 0.05); out = s1.copy(); out[:len(s2)] += s2; return i, out


def sparkle(t0, g=0.05):
    out = np.zeros(int(1.0 * SR), np.float32)
    for k in range(9):
        i0, sig = blip(k * 0.09, 1200 + k * 120, 1800 + k * 140, 0.08, g); out[i0:i0 + len(sig)] += sig[:len(out) - i0]
    return int(t0 * SR), out


def womp(t0, g=0.07):  # « raté » descendant (idée reçue)
    out = np.zeros(int(0.9 * SR), np.float32)
    for k, (a, b) in enumerate([(392, 370), (370, 349), (349, 262)]):
        i0, sig = blip(k * 0.22, a, b, 0.2 if k < 2 else 0.45, g); out[i0:i0 + len(sig)] += sig[:len(out) - i0]
    return int(t0 * SR), out


def ding(t0, g=0.07):
    L = int(0.6 * SR); tt = np.arange(L) / SR
    sig = g * (np.sin(2 * np.pi * 1568 * tt) + 0.5 * np.sin(2 * np.pi * 2093 * tt)) * np.exp(-tt * 6)
    return int(t0 * SR), sig.astype(np.float32)


def zap(t0, g=0.12):  # éclair
    L = int(0.35 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * rng.standard_normal(L) * np.exp(-tt * 12) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 40 * tt)))).astype(np.float32)


def moteur(t0, d=1.0, g=0.06):  # petite voiture
    L = int(d * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sign(np.sin(2 * np.pi * (70 + 30 * tt / d) * tt)) * np.sin(np.pi * tt / d) ** 0.5).astype(np.float32)


def get(vid):
    j = json.loads(re.search(r'export const D3_%s: DuoData = (\{.*?\});\n' % vid.upper(), DATA).group(1))
    return j


def ev_v1(M, S, fin):
    return [whoosh(0.4, 0.5, 0.1), blip(M['h1_algerie'], 700, 1000, 0.07, 0.05), whoosh(M['h1_france'] - 0.15, 0.4, 0.08), womp(M['h1_mort'] - 0.05),
            boing(S['F2']['s'] - 0.35), thud(S['F2']['s'] + 0.05, 0.22), whoosh(M['f2_vivre'] - 0.1, 0.4, 0.07), stamp(M['f2_obligatoire'] + 0.15),
            whoosh(S['H3']['s'] - 0.1, 0.45, 0.1), blip(S['H3']['s'] + 0.05, 500, 800, 0.1, 0.05)] + \
           [blip(M['h3_distance'] - 0.1 + k * 0.12, 600 + k * 60, 760 + k * 60, 0.05, 0.035) for k in range(8)] + \
           [whoosh(M['f4_procuration'] + 0.1, 1.0, 0.09), blip(M['f4_representant'], 880, 1320, 0.1, 0.06), ding(M['f4_place'] + 0.1),
            whoosh(M['f4_etapes'] - 0.2, 0.4, 0.08)] + \
           [blip(M['f4_etapes'] + 0.05 + k * 0.25, 900 + k * 80, 1200 + k * 80, 0.07, 0.05) for k in range(4)] + \
           [ding(M['f4_presence'] - 0.1, 0.06), whoosh(S['H5']['s'] - 0.1, 0.45, 0.08), whoosh(M['h5_avion'] - 0.55, 1.2, 0.13), stamp(M['h5_sans'], 0.28), sparkle(M['h5_sans']),
            whoosh(fin, 0.6, 0.14), blip(fin + 0.25, 880, 1320, 0.12, 0.06)]


def ev_v2(M, S, fin):
    return [whoosh(0.4, 0.5, 0.1), whoosh(M['h1_associer'] - 0.3, 0.4, 0.08), blip(M['h1_associer'] - 0.15, 500, 800, 0.1, 0.05),
            boing(S['F2']['s'] - 0.35), thud(S['F2']['s'] + 0.05, 0.25), whoosh(M['f2_seul'] - 0.25, 0.45, 0.1),
            blip(M['f2_seul'] + 0.1, 700, 1000, 0.07, 0.05), stamp(M['f2_eurl'] - 0.1, 0.22)] + \
           [blip(M['f2_plusieurs'] + 0.05 + k * 0.12, 700 + k * 120, 1000 + k * 120, 0.06, 0.045) for k in range(3)] + \
           [stamp(M['f2_sarl'] - 0.1, 0.22), whoosh(S['H3']['s'] - 0.15, 0.4, 0.08)] + \
           [blip(M['h3_biens'] - 0.15 + k * 0.08, 520 + k * 50, 700 + k * 50, 0.05, 0.04) for k in range(11)] + \
           [womp(M['h3_mal'] - 0.5, 0.05), zap(M['h3_mal'] - 0.05), thud(M['h3_mal'], 0.2),
            whoosh(M['f4_responsabilite'] - 0.2, 0.6, 0.1), sparkle(M['f4_responsabilite']), zap(M['f4_limitee'] - 0.15, 0.1), ding(M['f4_limitee'] - 0.1),
            zap(M['f4_apports'] - 0.1, 0.1), ding(M['f4_apports'] - 0.05, 0.06), whoosh(S['H5']['s'] - 0.1, 0.45, 0.08),
            blip(M['h5_choisis'], 900, 1300, 0.08, 0.06), blip(M['h5_choisis'] + 0.25, 1000, 1500, 0.08, 0.06), sparkle(M['h5_projet']),
            whoosh(fin, 0.6, 0.14), blip(fin + 0.25, 880, 1320, 0.12, 0.06)]


def ev_v3(M, S, fin):
    walk0 = M['f4_present']
    return [whoosh(0.4, 0.5, 0.1), whoosh(M['h1_procuration'] - 0.3, 0.4, 0.08)] + \
           [blip(M[k] - 0.1, 700 + i * 120, 1000 + i * 120, 0.07, 0.05) for i, k in enumerate(['h1_meubles', 'h1_voiture', 'h1_douane'])] + \
           [boing(S['F2']['s'] - 0.35), thud(S['F2']['s'] + 0.05, 0.22), stamp(M['f2_oui']), womp(M['f2_mais'] - 0.05, 0.06), thud(M['f2_dedouanement'] - 0.15, 0.3),
            blip(S['H3']['s'] + 0.05, 500, 800, 0.1, 0.05), blip(M['h3_douane'] - 0.3, 600, 900, 0.1, 0.04), whoosh(S['F4']['s'] - 0.1, 0.45, 0.1),
            stamp(M['f4_present'] + 0.05)] + \
           [thud(walk0 + k * 0.18, 0.08) for k in range(5)] + \
           [moteur(walk0 + 0.95, 0.5, 0.05), ding(walk0 + 1.0), whoosh(M['f4_procuration'] - 0.15, 0.4, 0.08), thud(M['f4_procuration'] - 0.1, 0.25),
            whoosh(S['H5']['s'] - 0.1, 0.45, 0.08), whoosh(M['h5_billet'] - 0.6, 1.2, 0.13), sparkle(M['h5_billet'] - 0.2),
            whoosh(fin, 0.6, 0.14), blip(fin + 0.25, 880, 1320, 0.12, 0.06)]


def ev_v4(M, S, fin):
    return [whoosh(0.4, 0.5, 0.1), moteur(M['h1_voiture'] - 0.4, 0.9, 0.07), thud(M['h1_voiture'] + 0.35, 0.12), boing(M['h1_neuve'] - 0.35, 0.06),
            boing(S['F2']['s'] - 0.35), thud(S['F2']['s'] + 0.05, 0.25), whoosh(M['f2_changement'] - 0.2, 0.45, 0.1)] + \
           [blip(M['f2_changement'] + k * 0.15, 600 + k * 60, 760 + k * 60, 0.05, 0.035) for k in range(8)] + \
           [whoosh(M['f2_ramener'] - 0.05, 1.1, 0.08), ding(M['f2_europe'] + 0.35), whoosh(S['H3']['s'] - 0.1, 0.4, 0.08), blip(M['h3_annees'] - 0.35, 500, 800, 0.1, 0.05),
            whoosh(S['F4']['s'] - 0.1, 0.45, 0.1), stamp(M['f4_oui'] + 0.05, 0.25)] + \
           [blip(M['f4_neuve'] + k * (M['f4_cinq'] + 0.35 - M['f4_neuve']) / 6, 600 + k * 80, 800 + k * 80, 0.05, 0.04) for k in range(6)] + \
           [ding(M['f4_cinq'] + 0.35), blip(M['f4_cinq'] + 0.5, 300, 200, 0.1, 0.05)] + \
           [blip(M[k], 900 + i * 150, 1300 + i * 150, 0.08, 0.06) for i, k in enumerate(['f4_essence', 'f4_hybride', 'f4_electrique'])] + \
           [whoosh(S['H5']['s'] - 0.1, 0.45, 0.08), moteur(M['h5_voiture'], 0.7, 0.06), sparkle(M['h5_voiture']), stamp(M['h5_budget'] - 0.1, 0.25),
            whoosh(fin, 0.6, 0.14), blip(fin + 0.25, 880, 1320, 0.12, 0.06)]


EV = {'v1': ev_v1, 'v2': ev_v2, 'v3': ev_v3, 'v4': ev_v4}
CHORDS = {'bleu': [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]], 'or': [[62, 66, 69], [59, 62, 66], [67, 71, 74], [69, 73, 76]]}
THEME = {'v1': 'bleu', 'v2': 'or', 'v3': 'bleu', 'v4': 'or'}

for vid in (sys.argv[1:] or ['v1', 'v2', 'v3', 'v4']):
    if vid not in EV: continue
    d = get(vid); T = d['duree']; N = int(T * SR); M = d['m']; S = {x['id']: x for x in d['segs']}; fin = d['fin']
    v0, _ = sf.read(str(ROOT / 'out' / f'duo3-{vid}-voix.wav'), dtype='float32')
    v = np.zeros(N, np.float32); v[:min(N, len(v0))] = v0[:N]
    pad = np.zeros(N, np.float32); chords = CHORDS[THEME[vid]]; sg = T / 8
    for c in range(8):
        ch = chords[c % 4]; s0 = int(c * sg * SR); s1 = min(N, int((c + 1) * sg * SR) + int(0.4 * SR)); tt = np.arange(s1 - s0) / SR
        env = np.clip(np.minimum(1, tt / 0.6) * np.minimum(1, (s1 - s0) / SR - tt + 0.01), 0, 1)
        for mm in ch: pad[s0:s1] += 0.02 * env * (np.sign(np.sin(2 * np.pi * note(mm) * tt)) * 0.25 + np.sin(2 * np.pi * note(mm) * tt) * 0.75)
    beat = 60 / (116 if THEME[vid] == 'bleu' else 112); pulse = np.zeros(N, np.float32); b = 0.4
    while b < T - 1.5:
        i = int(b * SR); L = int(0.18 * SR); tt = np.arange(L) / SR
        pulse[i:i + L] += (0.08 * np.sin(2 * np.pi * (60 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 16))[:N - i]; b += beat
    music = pad + pulse
    gap = np.ones(N); a0, a1 = int(S['F2']['s'] * SR), int((S['F2']['s'] + 0.7) * SR); gap[a0:a1] = 0.2
    music *= gap
    vabs = np.convolve(np.abs(v), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same')
    music *= (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.8
    env = np.ones(N); env[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); music *= env
    sfx = np.zeros(N, np.float32)
    for i, sgn in EV[vid](M, S, fin): sfx[i:i + len(sgn)] += sgn[:max(0, N - i)]
    sfx *= 0.316
    mix = v + music + sfx; mix /= np.abs(mix).max() / 0.89
    sf.write(str(ROOT / 'public' / 'audio' / f'duo3-{vid}-bande-son.wav'), mix.astype(np.float32), SR)
    print('ok', vid, T)
