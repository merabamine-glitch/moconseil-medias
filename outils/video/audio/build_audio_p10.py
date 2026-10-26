"""Bande son de la vidéo « Pack Retour Définitif » (15 s, 26/10/2026).
Voix « Femme » (une seule prise, x1,1) décalée de 0,3 s ; musique originale en code (nappe chaude + pulsation douce + charleston),
baissée sous la voix ; bruitages en code à -10 dB (règle n° 8), aucun « ding ». Sortie : out/p10-bande-son.wav (48 kHz)."""
import pathlib, subprocess
import numpy as np, soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
OFF = 9 / 30
T = 450 / 30
N = int(T * SR)
wav = ROOT / 'out' / 'voix48_p10.wav'
(ROOT / 'out').mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(ROOT / 'voix' / 'pack-10-retour.mp3'), '-ar', str(SR), '-ac', '1', str(wav)], check=True)
v, _ = sf.read(str(wav), dtype='float32')
voice = np.zeros(N, np.float32)
o = int(OFF * SR)
voice[o:o + min(len(v), N - o)] = v[:N - o]
voice *= 0.5 / np.abs(voice).max()
rng = np.random.default_rng(10)


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


# nappe : Fa majeur lumineux (F, Dm, Bb, C), 4 accords sur 15 s
chords = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 60]]
pad = np.zeros(N, np.float32)
seg = 12.0 / 4
for c in range(5):
    ch = chords[c % 4] if c < 4 else chords[0]
    t0 = c * seg
    s0 = int(t0 * SR)
    s1 = min(N, int((t0 + seg) * SR) + int(0.5 * SR)) if c < 4 else N
    tt = np.arange(s1 - s0) / SR
    dur = (s1 - s0) / SR
    env = np.clip(np.minimum(1, tt / 0.6) * np.minimum(1, (dur - tt) / 0.5 + 0.0001), 0, 1)
    for m in ch + [ch[0] - 12]:
        fq = note(m)
        w = np.sin(2 * np.pi * fq * tt) + 0.25 * np.sin(2 * np.pi * 2 * fq * tt + 0.4) + 0.1 * np.sin(2 * np.pi * 3 * fq * tt)
        pad[s0:s1] += 0.028 * env * w
# pulsation (grosse caisse douce) à 100 BPM à partir de 1,6 s, coupée sur la carte de fin puis reprise
beat = 60 / 100
pulse = np.zeros(N, np.float32)
hats = np.zeros(N, np.float32)
b = 1.6
while b < 14.4:
    i = int(b * SR); L = int(0.3 * SR); tt = np.arange(L) / SR
    pulse[i:i + L] += (0.13 * np.sin(2 * np.pi * (52 + 95 * np.exp(-tt * 32)) * tt) * np.exp(-tt * 13))[:N - i]
    j = int((b + beat / 2) * SR); Lh = int(0.05 * SR)
    nz = np.diff(np.concatenate([[0], rng.standard_normal(Lh) * np.exp(-np.arange(Lh) / SR * 90)]))
    hats[j:j + Lh] += (0.016 * nz)[:max(0, N - j)]
    b += beat
# arpège pincé discret (notes de l'accord) sur les croches
pluck = np.zeros(N, np.float32)
b = 1.6; k = 0
while b < 11.8:
    c = min(3, int(b / seg))
    m = chords[c][k % 4] + 12
    i = int(b * SR); L = int(0.35 * SR); tt = np.arange(L) / SR
    pluck[i:i + L] += (0.022 * np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 9) * (1 - np.exp(-tt * 400)))[:N - i]
    b += beat / 2; k += 1
music = pad + pulse + hats + pluck
env = np.ones(N)
env[:int(0.4 * SR)] = np.linspace(0.4, 1, int(0.4 * SR))
env[-int(1.6 * SR):] = np.linspace(1, 0, int(1.6 * SR))
vabs = np.convolve(np.abs(voice), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same')
music *= env * (1 - 0.5 * np.clip(vabs / 0.03, 0, 1)) * 0.9


def lowpass(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)):
        y += cut[n] * (nz[n] - y); out[n] = y
    return out


def whoosh(t0, d=0.5, up=True, g=0.18):
    L = int(d * SR)
    cut = np.linspace(0.02, 0.35, L) if up else np.linspace(0.35, 0.02, L)
    out = lowpass(rng.standard_normal(L), cut) * np.sin(np.pi * np.arange(L) / L) ** 2
    return int(t0 * SR), (g * out).astype(np.float32)


def pop(t0, f=700, g=0.05):
    L = int(0.1 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * f * tt * (1 + 0.5 * np.exp(-tt * 40))) * np.exp(-tt * 45)).astype(np.float32)


def boom(t0, g=0.2):
    L = int(0.9 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (46 + 40 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 4.5)).astype(np.float32)


def thump(t0, g=0.45):
    """Valise posée : coup sourd + petit cliquetis des roulettes."""
    L = int(0.6 * SR); tt = np.arange(L) / SR
    body = np.sin(2 * np.pi * (58 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
    nz = lowpass(rng.standard_normal(L), np.full(L, 0.18)) * np.exp(-tt * 40)
    rattle = np.zeros(L)
    for d in [0.05, 0.09, 0.12]:
        a = int(d * SR); Lr = int(0.03 * SR)
        rattle[a:a + Lr] += rng.standard_normal(Lr) * np.exp(-np.arange(Lr) / SR * 150) * 0.25
    return int(t0 * SR), (g * (body + nz * 1.2 + rattle) / 2.0).astype(np.float32)


def paper(t0, g=0.2):
    L = int(0.22 * SR); tt = np.arange(L) / SR
    nz = rng.standard_normal(L)
    hi = nz - lowpass(nz, np.full(L, 0.12))
    sig = hi * np.exp(-tt * 30) * 0.8 + np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 40) * 0.6
    return int(t0 * SR), (g * sig / np.abs(sig).max()).astype(np.float32)


def shimmer(t0, d=0.6, g=0.05):
    L = int(d * SR); tt = np.arange(L) / SR
    nz = rng.standard_normal(L)
    hi = nz - lowpass(nz, np.full(L, 0.5))
    return int(t0 * SR), (g * hi * np.sin(np.pi * tt / d) ** 2).astype(np.float32)


fr = lambda f: f / 30
ev = [whoosh(0.0, 1.2, False, 0.12)]                                  # avion qui descend vers Alger
ev += [boom(fr(32), 0.12)]                                             # ALGÉRIE
ev += [whoosh(fr(48), 0.45, True, 0.24)]                               # étiquettes filées
for a in [52, 63, 86, 118]:
    ev.append(paper(fr(a + 4), 0.2))                                   # cartes posées
ev += [whoosh(fr(106), 0.5, True, 0.06), pop(fr(119), 520, 0.05)]     # tracé du pouls (sans bip)
ev += [whoosh(fr(136), 0.4, False, 0.18)]                              # cartes qui s'envolent
ev += [boom(fr(174), 0.22), pop(fr(179), 420, 0.04)]                   # RETOUR / DÉFINITIF
ev += [whoosh(fr(199), 0.45, True, 0.12), boom(fr(203), 0.1)]          # porté vers le haut, moyeu
for i in range(5):
    ev.append(pop(fr(217 + 3 * i), 600 + 60 * i, 0.05))                # satellites
for i in range(5):
    ev.append(whoosh(fr(240 + 3 * i), 0.18, True, 0.03))               # rayons
for i in range(5):
    ev.append(pop(fr(257 + 4 * i), 980, 0.028))                        # coches
ev += [whoosh(fr(281), 0.5, False, 0.16), thump(fr(296), 0.5)]         # aspiration, valise posée
ev += [whoosh(fr(299), 0.45, True, 0.18)]                              # l'étiquette devient le monde
ev += [whoosh(fr(353), 0.5, True, 0.2), boom(fr(366), 0.12)]           # iris vers la carte de fin, logo
ev += [boom(fr(371), 0.1), shimmer(fr(393), 0.5, 0.06)]                # bouton, reflet
sfx = np.zeros(N, np.float32)
for i, sig in ev:
    if i >= N:
        continue
    sfx[i:i + len(sig)] += sig[:N - i]
sfx *= 0.316  # bruitages à -10 dB
mix = voice + music + sfx
mix /= max(1e-6, np.abs(mix).max()) / 0.89
sf.write(str(ROOT / 'out' / 'p10-bande-son.wav'), mix.astype(np.float32), SR)
print('bande son', T, 's,', len(ev), 'bruitages')
