"""Musique originale lo-fi « chill » (libre de droits, composée ici) + bruitages, pour la vidéo du 22/10.
80 BPM, 1 mesure = 3 s, accords ii-V-I-VI (Dm9, G13, Cmaj9, A7b13), piano électrique FM, basse ronde,
batterie feutrée avec swing, craquements de vinyle, filtre passe-bas d'ambiance. Sortie stéréo 48 kHz."""
import numpy as np, soundfile as sf, sys

SR = 48000
T = 25.5
N = int(T * SR)
BPM = 80
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(22)
L = np.zeros(N); R = np.zeros(N)

def mtof(m): return 440 * 2 ** ((m - 69) / 12)

def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.414
    R[i:i + len(sig)] += sig * gain * r * 1.414

def onepole_lp(x, a):
    y = np.zeros_like(x); s = 0.0
    for n in range(len(x)):
        s += a * (x[n] - s); y[n] = s
    return y

# ---------------------------------------------------------------- instruments
def epiano(m, dur, vel=1.0):
    f = mtof(m); n = int((dur + 0.9) * SR); t = np.arange(n) / SR
    idx = 1.6 * np.exp(-t * 3.0) + 0.22
    mod = np.sin(2 * np.pi * f * t) * idx
    car = np.sin(2 * np.pi * f * t + mod)
    tine = 0.18 * np.sin(2 * np.pi * f * 7.0 * t) * np.exp(-t * 18)
    env = np.minimum(1, t / 0.004) * (0.55 * np.exp(-t * 2.2) + 0.45 * np.exp(-t * 0.45))
    rel = np.clip((dur + 0.9 - t) / 0.9, 0, 1) ** 2
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.6 * t)
    return (car + tine) * env * rel * trem * vel

def bass(m, dur):
    f = mtof(m); n = int((dur + 0.3) * SR); t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t * 0.9) * np.clip((dur + 0.3 - t) / 0.3, 0, 1)
    return np.tanh(1.6 * sig * env) * 0.8

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + 0.15 * rng.standard_normal(n) * np.exp(-t * 200)

def snare():
    n = int(0.4 * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    nz = nz - onepole_lp(nz, 0.08)            # passe-haut doux
    nz = onepole_lp(nz, 0.35)
    body = 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return (nz * np.exp(-t * 16) * 0.7 + body)

def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n); nz = nz - onepole_lp(nz, 0.5)
    return nz * np.exp(-t * (14 if open_ else 70))

def crackle(dur):
    n = int(dur * SR); out = 0.004 * onepole_lp(rng.standard_normal(n), 0.05)
    k = int(dur * 9)
    for _ in range(k):
        i = rng.integers(0, n - 200); a = rng.uniform(0.02, 0.09) * rng.choice([-1, 1])
        out[i:i + 60] += a * np.exp(-np.arange(60) / 9)
    return out

# ---------------------------------------------------------------- harmonie
CH = [
    (38, [65, 69, 72, 76]),        # Dm9 : F A C E (basse D)
    (43, [65, 71, 74, 76]),        # G13 : F B D E (basse G)
    (36, [64, 67, 71, 74]),        # Cmaj9 : E G B D (basse C)
    (45, [67, 73, 77, 79]),        # A7b13 : G C# F G (basse A)
]
nbars = int(np.ceil(T / BAR))
for b in range(nbars):
    t0 = b * BAR
    root, voic = CH[b % 4]
    last = b == nbars - 1
    # piano : accord sur le 1, re-frappé en syncope sur le « et » de 2 (léger strum)
    for j, m in enumerate(voic):
        add(epiano(m, BAR - 0.35 if not last else 2.6, 0.9), t0 + j * 0.012, 0.05, pan=-0.25 + j * 0.15)
    # nappe douce qui lie les accords
    n = int((BAR + 0.8) * SR); tt = np.arange(n) / SR
    pad = np.zeros(n)
    for m in voic + [root + 12]:
        fq = mtof(m)
        pad += np.sin(2 * np.pi * fq * tt) + np.sin(2 * np.pi * fq * 1.004 * tt + 1.0) * 0.7
    penv = np.minimum(1, tt / 0.45) * np.clip((BAR + 0.8 - tt) / 0.8, 0, 1)
    add(onepole_lp(pad * penv, 0.08), t0, 0.024)
    if not last:
        for j, m in enumerate(voic[1:]):
            add(epiano(m, 0.9, 0.6), t0 + 1.5 * BEAT + j * 0.01, 0.04, pan=0.2 - j * 0.12)
        for j, m in enumerate(voic[2:]):
            add(epiano(m, 0.5, 0.45), t0 + 3.25 * BEAT + j * 0.01, 0.03, pan=0.3)
    # basse : 1 et 3 (et une approche sur le 4+)
    add(bass(root, 1.3), t0, 0.22)
    if not last:
        add(bass(root + 7, 0.6), t0 + 2 * BEAT, 0.16)
        nxt = CH[(b + 1) % 4][0]
        add(bass(nxt - 1, 0.25), t0 + 3.5 * BEAT, 0.12)

# mélodie discrète (cloche FM, pentatonique)
mel = [(1.0, 81, 0.9), (1.75, 79, 0.6), (2.25, 76, 0.7), (4.5, 77, 0.8), (5.25, 76, 0.5), (7.5, 79, 0.8), (8.25, 76, 0.6),
       (8.75, 74, 0.5), (10.5, 76, 0.8), (13.0, 81, 0.8), (13.75, 79, 0.6), (14.25, 76, 0.6), (16.5, 77, 0.8), (17.25, 81, 0.6),
       (19.5, 79, 0.8), (20.25, 76, 0.6), (22.5, 74, 0.8), (23.25, 76, 0.7), (24.0, 72, 0.9)]
for tt, m, v in mel:
    add(epiano(m, 0.5, v) * 0.8, tt, 0.035, pan=0.3)

# batterie : entre à la mesure 2 (3 s), sort à 24 s, swing 58 %
SW = 0.58
for b in range(nbars):
    t0 = b * BAR
    if t0 < 3.0 - 1e-6 or t0 >= 24.0 - 1e-6:
        continue
    add(kick(), t0, 0.30); add(kick(), t0 + 2.5 * BEAT, 0.20)
    add(snare(), t0 + BEAT, 0.13, pan=0.05); add(snare(), t0 + 3 * BEAT, 0.13, pan=0.05)
    for q in range(4):
        add(hat(), t0 + q * BEAT, 0.045, pan=0.35)
        add(hat(), t0 + q * BEAT + SW * BEAT, 0.03, pan=0.35)
# hats seuls en introduction (1,5 → 3 s)
for q in range(2):
    add(hat(), 1.5 + q * BEAT, 0.03, pan=0.35); add(hat(), 1.5 + q * BEAT + SW * BEAT, 0.02, pan=0.35)
add(crackle(T), 0, 1.0)

# ---------------------------------------------------------------- réverbération + couleur lo-fi
def reverb(x, sec=1.6, mix=0.18, seed=1):
    r = np.random.default_rng(seed); n = int(sec * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir = onepole_lp(ir, 0.25); ir /= np.sqrt((ir ** 2).sum())
    from scipy.signal import fftconvolve
    return x + mix * fftconvolve(x, ir)[: len(x)]
L = reverb(L, seed=1); R = reverb(R, seed=2)
L = onepole_lp(L, 0.42); R = onepole_lp(R, 0.42)          # passe-bas d'ambiance (~5 kHz)
# fondu d'entrée court, fondu de sortie
t = np.arange(N) / SR
env = np.minimum(1, t / 0.25) * np.clip((T - t) / 1.6, 0, 1) ** 1.2
L *= env; R *= env
music = np.stack([L, R], 1)

# ---------------------------------------------------------------- bruitages
SL = np.zeros(N); SRr = np.zeros(N)
def sfx(sig, t0, g, pan=0.0):
    i = int(t0 * SR); sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4) * 1.414; r = np.sin((pan + 1) * np.pi / 4) * 1.414
    SL[i:i + len(sig)] += sig * g * l; SRr[i:i + len(sig)] += sig * g * r
def whoosh(d=0.55, up=True):
    n = int(d * SR); nz = rng.standard_normal(n)
    cut = np.linspace(0.015, 0.25, n) if up else np.linspace(0.25, 0.015, n)
    out = np.zeros(n); y = 0.0
    for k in range(n): y += cut[k] * (nz[k] - y); out[k] = y
    return out * np.sin(np.pi * np.arange(n) / n) ** 2 * 1.3
def paper(d=0.35):
    n = int(d * SR); nz = rng.standard_normal(n); nz = nz - onepole_lp(nz, 0.2)
    return nz * np.sin(np.pi * np.arange(n) / n) ** 1.5 * (0.6 + 0.4 * rng.random(n))
def tick(f=1900):
    n = int(0.09 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 55) + 0.3 * rng.standard_normal(n) * np.exp(-tt * 400)
def scribble(d=0.6):
    n = int(d * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n); nz = nz - onepole_lp(nz, 0.3)
    return nz * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt)) ** 2 * np.sin(np.pi * tt / d)
def shimmer(d=1.4):
    n = int(d * SR); tt = np.arange(n) / SR; o = np.zeros(n)
    for f in [1318, 1760, 2093, 2637]: o += np.sin(2 * np.pi * f * tt) * np.exp(-tt * (2.5 + f / 1500))
    return o * np.minimum(1, tt / 0.02)
def pop(f=880):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt * (1 + 0.5 * np.exp(-tt * 40))) * np.exp(-tt * 35)

sfx(whoosh(0.6, True), 4.0, 0.10)
sfx(paper(0.45), 4.55, 0.05, pan=-0.2)
sfx(whoosh(0.45, True), 8.0, 0.06)
for tc in (9.0, 9.75, 10.5):
    sfx(tick(1900), tc + 0.1, 0.06, pan=0.15)
sfx(scribble(0.65), 11.45, 0.035, pan=0.1)
sfx(whoosh(0.45, True), 12.55, 0.10)
sfx(whoosh(0.5, True), 16.3, 0.09)
sfx(pop(700), 16.8, 0.07)
sfx(paper(0.3), 18.05, 0.05, pan=0.2)
sfx(whoosh(0.55, False), 20.1, 0.08)
sfx(shimmer(1.4), 20.45, 0.05)
sfx(pop(880), 22.62, 0.06)
fx = np.stack([SL, SRr], 1)

mix = music + fx
mix = np.tanh(mix * 1.3) / 1.3
mix /= np.abs(mix).max() / 0.89
out = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/video-mo/out/certificat-son.wav'
sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
sf.write(out.replace('.wav', '-musique-seule.wav'), (music / np.abs(music).max() * 0.89).astype(np.float32), SR, subtype='PCM_16')
print('ok', out, mix.shape)
