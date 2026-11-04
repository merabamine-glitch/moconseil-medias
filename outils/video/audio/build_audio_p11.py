"""Bande son « Présentation — conseillère réelle » (04/11/2026) : voix HeyGen (heygen/reel/reel-voix.wav) à 0,4 s, nappe, bruitages à -10 dB."""
import pathlib, re, json, numpy as np, soundfile as sf
ROOT = pathlib.Path(__file__).resolve().parent.parent
d = (ROOT / 'src' / 'reel_data.ts').read_text()
SP = float(re.search(r'REEL_SP = ([\d.]+)', d).group(1)); VOIX = float(re.search(r'REEL_VOIX = ([\d.]+)', d).group(1))
CUM = json.loads(re.search(r'REEL_CUM: \[number, number, number\]\[\] = (\[.*?\]);', d).group(1))
def RT(x):
    for a, b, c in CUM:
        if x <= b + 0.01: return (c + max(0, x - a)) / SP
    return VOIX
SR = 48000; OFF = 0.4; T = round(0.4 + VOIX + 1.3, 1); N = int(T * SR)
v, sr = sf.read(str(ROOT / 'heygen' / 'reel' / 'reel-voix.wav'), dtype='float32')
voice = np.zeros(N, np.float32); o = int(OFF * SR); voice[o:o + len(v)] = v[:N - o]; voice *= 0.5 / np.abs(voice).max()
rng = np.random.default_rng(11); note = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = np.zeros(N, np.float32); chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; seg = T / 10
for c in range(10):
    ch = chords[c % 4]; s0 = int(c * seg * SR); s1 = min(N, int((c + 1) * seg * SR) + int(0.5 * SR)); t = np.arange(s1 - s0) / SR
    env = np.clip(np.minimum(1, t / 0.8) * np.minimum(1, (s1 - s0) / SR - t + 0.01), 0, 1)
    for m in ch + [ch[0] - 12]: pad[s0:s1] += 0.03 * env * (np.sin(2 * np.pi * note(m) * t) + 0.25 * np.sin(4 * np.pi * note(m) * t))
pulse = np.zeros(N, np.float32); b = OFF; beat = 60 / 104
while b < T - 2:
    i = int(b * SR); L = int(0.22 * SR); t = np.arange(L) / SR
    pulse[i:i + L] += (0.1 * np.sin(2 * np.pi * (55 + 85 * np.exp(-t * 30)) * t) * np.exp(-t * 14))[:N - i]; b += beat
music = pad + pulse
vabs = np.convolve(np.abs(voice), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same'); music *= (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.85
env = np.ones(N); env[-int(2 * SR):] = np.linspace(1, 0, int(2 * SR)); music *= env
def lp(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)): y += cut[n] * (nz[n] - y); out[n] = y
    return out
def whoosh(t0, d=0.5, g=0.15):
    L = int(d * SR); return int(t0 * SR), (g * lp(rng.standard_normal(L), np.linspace(0.03, 0.35, L)) * np.sin(np.pi * np.arange(L) / L) ** 2).astype(np.float32)
def boom(t0, g=0.22):
    L = int(0.9 * SR); t = np.arange(L) / SR; return int(t0 * SR), (g * np.sin(2 * np.pi * (46 + 40 * np.exp(-t * 12)) * t) * np.exp(-t * 4.5)).astype(np.float32)
def pop(t0, f=900, g=0.06):
    L = int(0.1 * SR); t = np.arange(L) / SR; return int(t0 * SR), (g * np.sin(2 * np.pi * f * t * (1 + 0.5 * np.exp(-t * 40))) * np.exp(-t * 45)).astype(np.float32)
def tick(t0, g=0.05):
    L = int(0.04 * SR); t = np.arange(L) / SR; return int(t0 * SR), (g * lp(rng.standard_normal(L), np.full(L, 0.5)) * np.exp(-t * 120)).astype(np.float32)
V = lambda x: RT(x) + OFF
ev = [whoosh(V(2.9), 0.45, 0.16), boom(V(3.52), 0.18), whoosh(V(4.6), 0.4, 0.12)]
ev += [pop(V(x) + 0.05, 820 + k * 110, 0.07) for k, x in enumerate([4.67, 6.0, 6.9, 8.2])]
ev += [whoosh(V(9.55), 0.4, 0.12)] + [tick(V(10.6) + k / 6, 0.05) for k in range(8)]
ev += [whoosh(V(12.1), 0.4, 0.12), boom(V(14.51), 0.2), whoosh(V(15.4), 0.8, 0.1), whoosh(V(16.7), 0.45, 0.14), whoosh(V(18.05), 0.4, 0.12)]
ev += [pop(V(19.33) + k * 0.047, 700 + k * 60, 0.05) for k in range(10)] + [boom(V(20.1) + 0.4, 0.16), whoosh(V(21.4), 0.4, 0.12)]
ev += [pop(V(21.6) + k * 0.27, 900 + k * 90, 0.06) for k in range(5)] + [whoosh(V(23.25), 0.45, 0.13), whoosh(V(25.8), 0.7, 0.16), pop(V(27.34) + 0.25, 880, 0.07)]
sfx = np.zeros(N, np.float32)
for i, sg in ev: sfx[i:i + len(sg)] += sg[:max(0, N - i)]
sfx *= 0.316
mix = voice + music + sfx; mix /= np.abs(mix).max() / 0.89
sf.write(str(ROOT / 'public' / 'audio' / 'p11-bande-son.wav'), mix.astype(np.float32), SR); print('ok', T)
