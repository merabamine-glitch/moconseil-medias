"""Bande son du duo Conciergerie (04/11/2026) : voix (out/duo-voix.wav) + nappe légère + bruitages à -10 dB. Sortie public/audio/duo-bande-son.wav"""
import pathlib, numpy as np, soundfile as sf
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
v, _ = sf.read(str(ROOT / 'out' / 'duo-voix.wav'), dtype='float32'); N = len(v); T = N / SR
rng = np.random.default_rng(5)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = np.zeros(N, np.float32); chords = [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]]; seg = T / 8
for c in range(8):
    ch = chords[c % 4]; s0 = int(c * seg * SR); s1 = min(N, int((c + 1) * seg * SR) + int(0.4 * SR)); tt = np.arange(s1 - s0) / SR
    env = np.clip(np.minimum(1, tt / 0.6) * np.minimum(1, (s1 - s0) / SR - tt + 0.01), 0, 1)
    for m in ch: pad[s0:s1] += 0.022 * env * (np.sign(np.sin(2 * np.pi * note(m) * tt)) * 0.25 + np.sin(2 * np.pi * note(m) * tt) * 0.75)
beat = 60 / 110; pulse = np.zeros(N, np.float32); b = 0.5
while b < T - 1.5:
    i = int(b * SR); L = int(0.18 * SR); tt = np.arange(L) / SR
    pulse[i:i + L] += (0.08 * np.sin(2 * np.pi * (60 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 16))[:N - i]; b += beat
music = pad + pulse
vabs = np.convolve(np.abs(v), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same')
music *= (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.8
def blip(t0, f0=880, f1=1320, d=0.09, g=0.08):
    L = int(d * SR); tt = np.arange(L) / SR; f = np.linspace(f0, f1, L)
    return int(t0 * SR), (g * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-tt * 18)).astype(np.float32)
def whoosh(t0, d=0.6, g=0.12):
    L = int(d * SR); nz = rng.standard_normal(L); out = np.zeros(L); y = 0.0; cut = np.linspace(0.03, 0.3, L)
    for n in range(L): y += cut[n] * (nz[n] - y); out[n] = y
    return int(t0 * SR), (g * out * np.sin(np.pi * np.arange(L) / L) ** 2).astype(np.float32)
def boing(t0, g=0.1):
    L = int(0.35 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (180 + 260 * tt / 0.35 + 30 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.exp(-tt * 7)).astype(np.float32)
def thud(t0, g=0.3):
    L = int(0.4 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (62 + 60 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 14)).astype(np.float32)
def sparkle(t0, g=0.05):
    out = np.zeros(int(1.0 * SR), np.float32)
    for k in range(9):
        i0, sig = blip(k * 0.09, 1200 + k * 120, 1800 + k * 140, 0.08, g)
        out[i0:i0 + len(sig)] += sig[:len(out) - i0]
    return int(t0 * SR), out
ev = [blip(0.95), blip(2.2, 700, 1000), blip(3.75, 990, 1480), whoosh(5.85, 1.0, 0.14), boing(7.12), thud(7.5, 0.25),
      blip(9.45, 660, 1320, 0.14, 0.07), thud(10.4, 0.18), whoosh(12.4, 0.4, 0.08)]
ev += [blip(12.65 + 0.17 * k, 1100, 1500, 0.06, 0.05) for k in range(3)]
ev += [blip(14.25, 500, 800, 0.1, 0.05), sparkle(16.5), whoosh(18.4, 0.6, 0.14)]
sfx = np.zeros(N, np.float32)
for i, sg in ev: sfx[i:i + len(sg)] += sg[:N - i]
sfx *= 0.316
mix = v + music + sfx; mix /= np.abs(mix).max() / 0.89
(ROOT / 'public' / 'audio').mkdir(exist_ok=True)
sf.write(str(ROOT / 'public' / 'audio' / 'duo-bande-son.wav'), mix.astype(np.float32), SR)
print('ok', round(T, 2))
