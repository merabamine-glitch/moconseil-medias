"""Bande son « Succession : la fredha » (04/11/2026) : voix HeyGen (heygen/pixar-voix.wav) à 0,4 s, nappe, bruitages à -10 dB."""
import pathlib, numpy as np, soundfile as sf, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000; OFF = 0.4; T = 19.9; N = int(T * SR)
v, sr = sf.read(str(ROOT / 'heygen' / 'pixar-voix.wav'), dtype='float32')
voice = np.zeros(N, np.float32); o = int(OFF * SR); voice[o:o + len(v)] = v[:N - o]; voice *= 0.5 / np.abs(voice).max()
rng = np.random.default_rng(7); note = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = np.zeros(N, np.float32); chords = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]; seg = T / 8
for c in range(8):
    ch = chords[c % 4]; s0 = int(c * seg * SR); s1 = min(N, int((c + 1) * seg * SR) + int(0.5 * SR)); tt = np.arange(s1 - s0) / SR
    env = np.clip(np.minimum(1, tt / 0.8) * np.minimum(1, (s1 - s0) / SR - tt + 0.01), 0, 1)
    for m in ch + [ch[0] - 12]: pad[s0:s1] += 0.03 * env * (np.sin(2 * np.pi * note(m) * tt) + 0.25 * np.sin(4 * np.pi * note(m) * tt))
pulse = np.zeros(N, np.float32); b = OFF; beat = 60 / 100
while b < T - 2:
    i = int(b * SR); L = int(0.22 * SR); tt = np.arange(L) / SR
    pulse[i:i + L] += (0.1 * np.sin(2 * np.pi * (55 + 85 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14))[:N - i]; b += beat
music = pad + pulse
vabs = np.convolve(np.abs(voice), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same'); music *= (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.85
env = np.ones(N); env[-int(2 * SR):] = np.linspace(1, 0, int(2 * SR)); music *= env
def lp(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)): y += cut[n] * (nz[n] - y); out[n] = y
    return out
def whoosh(t0, d=0.5, g=0.15):
    L = int(d * SR); return int(t0 * SR), (g * lp(rng.standard_normal(L), np.linspace(0.03, 0.35, L)) * np.sin(np.pi * np.arange(L) / L) ** 2).astype(np.float32)
def stamp(t0, g=0.4):
    L = int(0.5 * SR); tt = np.arange(L) / SR
    sig = np.sin(2 * np.pi * (62 + 70 * np.exp(-tt * 28)) * tt) * np.exp(-tt * 16) + lp(rng.standard_normal(L), np.full(L, 0.25)) * np.exp(-tt * 55) * 1.6
    return int(t0 * SR), (g * sig / 2.2).astype(np.float32)
def boom(t0, g=0.22):
    L = int(0.9 * SR); tt = np.arange(L) / SR; return int(t0 * SR), (g * np.sin(2 * np.pi * (46 + 40 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 4.5)).astype(np.float32)
def pop(t0, f=900, g=0.06):
    L = int(0.1 * SR); tt = np.arange(L) / SR; return int(t0 * SR), (g * np.sin(2 * np.pi * f * tt * (1 + 0.5 * np.exp(-tt * 40))) * np.exp(-tt * 45)).astype(np.float32)
def clank(t0, g=0.3):
    L = int(0.6 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * (np.sin(2 * np.pi * 420 * tt) * 0.6 + np.sin(2 * np.pi * 1130 * tt) * 0.4) * np.exp(-tt * 9)).astype(np.float32)
import json, re
A7 = json.loads(re.search(r'const A7: \[number, number\]\[\] = (\[.*?\]);', (ROOT / 'src' / 'p07pixar.tsx').read_text(), re.S).group(1))
def W7(x):
    for (a0, b0), (a1, b1) in zip(A7, A7[1:]):
        if x <= a1: return b0 + (x - a0) * (b1 - b0) / (a1 - a0)
    return x
V = lambda x: W7(x) + OFF
ev = [whoosh(V(1.6), 0.45, 0.18), whoosh(V(2.88), 0.45, 0.15), boom(V(4.9), 0.22), whoosh(V(5.5), 0.5, 0.12), stamp(V(6.55) + 0.17, 0.35)]
ev += [pop(V(7.59) + 0.2 + k * 0.13, 880 + k * 120, 0.06) for k in range(4)]
ev += [whoosh(V(8.35), 0.4, 0.14), clank(V(10.4) + 0.25, 0.3), stamp(V(10.87) + 0.17, 0.38), stamp(V(11.58) + 0.17, 0.38),
       whoosh(V(12.4), 0.4, 0.12), whoosh(V(13.4), 1.3, 0.1), stamp(V(15.25) + 0.17, 0.32), whoosh(V(15.25), 0.4, 0.12), whoosh(V(17.2), 0.7, 0.16), pop(V(17.45) + 0.2, 880, 0.07)]
sfx = np.zeros(N, np.float32)
for i, sg in ev: sfx[i:i + len(sg)] += sg[:N - i]
sfx *= 0.316
mix = voice + music + sfx; mix /= np.abs(mix).max() / 0.89
sf.write(str(ROOT / 'public' / 'audio' / 'p07-bande-son.wav'), mix.astype(np.float32), SR); print('ok')
