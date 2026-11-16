"""Bande son du duo n°2 « Signé ≠ propriétaire » (16/11/2026) : voix (out/duo2-voix.wav) + nappe + bruitages à -10 dB (construction, écroulement, tampons)."""
import pathlib, re, json, numpy as np, soundfile as sf
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
d = (ROOT / 'src' / 'duo2_data.ts').read_text()
M = json.loads(re.search(r'export const D2 = (\{.*?\}) as const', d).group(1))
SEGS = json.loads(re.search(r'export const D2_SEGS = (\[.*?\]);', d).group(1))
T = 21.15; N = int(T * SR)
v0, _ = sf.read(str(ROOT / 'out' / 'duo2-voix.wav'), dtype='float32')
v = np.zeros(N, np.float32); v[:min(N, len(v0))] = v0[:N]
rng = np.random.default_rng(17)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
pad = np.zeros(N, np.float32); chords = [[62, 66, 69], [59, 62, 66], [67, 71, 74], [69, 73, 76]]; seg = T / 8
for c in range(8):
    ch = chords[c % 4]; s0 = int(c * seg * SR); s1 = min(N, int((c + 1) * seg * SR) + int(0.4 * SR)); tt = np.arange(s1 - s0) / SR
    env = np.clip(np.minimum(1, tt / 0.6) * np.minimum(1, (s1 - s0) / SR - tt + 0.01), 0, 1)
    for m in ch: pad[s0:s1] += 0.02 * env * (np.sign(np.sin(2 * np.pi * note(m) * tt)) * 0.25 + np.sin(2 * np.pi * note(m) * tt) * 0.75)
beat = 60 / 112; pulse = np.zeros(N, np.float32); b = 0.4
while b < T - 1.5:
    i = int(b * SR); L = int(0.18 * SR); tt = np.arange(L) / SR
    pulse[i:i + L] += (0.08 * np.sin(2 * np.pi * (60 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 16))[:N - i]; b += beat
music = pad + pulse
# trou de musique au moment de l'écroulement (effet comique)
gap = np.ones(N); a0, a1 = int((M['f2_pas']) * SR), int((M['f2_pas'] + 0.9) * SR); gap[a0:a1] = 0.15
music *= gap
vabs = np.convolve(np.abs(v), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same')
music *= (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.8
env = np.ones(N); env[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); music *= env
def blip(t0, f0=880, f1=1320, d=0.09, g=0.08):
    L = int(d * SR); tt = np.arange(L) / SR; fr = np.linspace(f0, f1, L)
    return int(t0 * SR), (g * np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * np.exp(-tt * 18)).astype(np.float32)
def lp(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)): y += cut[n] * (nz[n] - y); out[n] = y
    return out
def whoosh(t0, d=0.6, g=0.12):
    L = int(d * SR); return int(t0 * SR), (g * lp(rng.standard_normal(L), np.linspace(0.03, 0.3, L)) * np.sin(np.pi * np.arange(L) / L) ** 2).astype(np.float32)
def boing(t0, g=0.1):
    L = int(0.35 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (180 + 260 * tt / 0.35 + 30 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.exp(-tt * 7)).astype(np.float32)
def thud(t0, g=0.3):
    L = int(0.4 * SR); tt = np.arange(L) / SR
    return int(t0 * SR), (g * np.sin(2 * np.pi * (62 + 60 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 14)).astype(np.float32)
def crash(t0, d=1.0, g=0.35):
    L = int(d * SR); tt = np.arange(L) / SR
    rumble = lp(rng.standard_normal(L), np.full(L, 0.05)) * np.exp(-tt * 3.5)
    debris = np.zeros(L)
    for k in range(14):
        i0 = int((0.05 + rng.random() * 0.8) * SR); l = int(0.06 * SR); tk = np.arange(l) / SR
        debris[i0:i0 + l] += (rng.standard_normal(l) * np.exp(-tk * 60))[:max(0, L - i0)] * 0.5
    return int(t0 * SR), (g * (rumble * 3 + debris)).astype(np.float32)
def stamp(t0, g=0.35):
    i, s1 = thud(t0, g); _, s2 = blip(t0, 300, 200, 0.05, 0.05); out = s1.copy(); out[:len(s2)] += s2; return i, out
def sparkle(t0, g=0.05):
    out = np.zeros(int(1.0 * SR), np.float32)
    for k in range(9):
        i0, sig = blip(k * 0.09, 1200 + k * 120, 1800 + k * 140, 0.08, g); out[i0:i0 + len(sig)] += sig[:len(out) - i0]
    return int(t0 * SR), out
ev = [whoosh(0.4, 0.5, 0.1), stamp(M['h1_notaire'] + 0.1)]
b1, b2 = M['h1_signe'] + 0.2, M['h1_moi'] + 0.15
ev += [blip(b1 + k * (b2 - b1) / 10, 520 + k * 60, 700 + k * 60, 0.06, 0.05) for k in range(10)]
ev += [sparkle(M['h1_moi'])]
F2s = [x for x in SEGS if x['id'] == 'F2'][0]['s']
ev += [boing(F2s - 0.35), thud(F2s + 0.05, 0.2), crash(M['f2_pas'] + 0.05), whoosh(M['f2_tant'] - 0.15, 0.45, 0.1), whoosh(M['f2_conservation'] - 0.1, 0.4, 0.08), thud(M['f2_propriete'] + 0.05, 0.2)]
H3s = [x for x in SEGS if x['id'] == 'H3'][0]['s']; F4s = [x for x in SEGS if x['id'] == 'F4'][0]['s']
ev += [blip(H3s + 0.05, 500, 800, 0.1, 0.05), whoosh(F4s - 0.1, 0.45, 0.1), stamp(M['f4_proprietaire'] - 0.2)]
c1, c2 = M['f4_publication'], M['f4_titre']
ev += [blip(c1 + k * (c2 - c1) / 12, 520 + k * 50, 700 + k * 50, 0.06, 0.045) for k in range(12)]
ev += [whoosh(M['f4_suivez'] - 0.2, 0.4, 0.08), blip(M['f4_suivez'] + 0.45, 900, 1300, 0.08, 0.06), blip(M['f4_titre'], 1000, 1500, 0.1, 0.07), sparkle(M['f4_titre'])]
ev += [sparkle(M['h5_publie']), whoosh(18.95, 0.6, 0.14), blip(19.2, 880, 1320, 0.12, 0.06)]
sfx = np.zeros(N, np.float32)
for i, sg in ev: sfx[i:i + len(sg)] += sg[:max(0, N - i)]
sfx *= 0.316
mix = v + music + sfx; mix /= np.abs(mix).max() / 0.89
sf.write(str(ROOT / 'public' / 'audio' / 'duo2-bande-son.wav'), mix.astype(np.float32), SR)
print('ok', T)
