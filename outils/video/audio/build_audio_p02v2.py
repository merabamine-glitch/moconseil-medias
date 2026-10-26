"""Bande son de la vidéo 2 « Pack Suivi de Société » v2 (26/10/2026).
Voix v2 (ElevenLabs, voix « Femme », Eleven v3, balises d'intonation, accélérée de 10 % hauteur conservée) calée à 0 s, nappe originale en code, bruitages en code à -10 dB, aucun « ding ».
Sortie : out/p02v2-bande-son.wav (48 kHz). La normalisation à -14 LUFS se fait au multiplexage (render_p02v2.sh)."""
import pathlib, subprocess
import numpy as np, soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
T = 29.5
N = int(T * SR)
wav = ROOT / 'out' / 'voix48_p02v2.wav'
(ROOT / 'out').mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(ROOT / 'voix' / 'pack-02-suivi-v2.mp3'), '-ar', str(SR), '-ac', '1', str(wav)], check=True)
v, _ = sf.read(str(wav), dtype='float32')
voice = np.zeros(N, np.float32)
voice[:min(len(v), N)] = v[:N]
voice *= 0.5 / np.abs(voice).max()
rng = np.random.default_rng(7)
# recalage des bruitages sur la voix v2 (mêmes ancres que le montage : voix/warp_p02v2.json)
import json
_w = json.load(open(ROOT / 'voix' / 'warp_p02v2.json'))
_o, _n = np.array(_w['old']), np.array(_w['new'])
def Wp(x):
    if x <= _o[0]: return _n[0] + (x - _o[0])
    if x >= _o[-1]: return _n[-1] + (x - _o[-1])
    return float(np.interp(x, _o, _n))


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


# nappe : La mineur chaleureux (Am, F, C, G)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
pad = np.zeros(N, np.float32)
seg = T / 8
for c in range(8):
    ch = chords[c % 4]
    s0 = int(c * seg * SR)
    s1 = min(N, int((c + 1) * seg * SR) + int(0.6 * SR))
    tt = np.arange(s1 - s0) / SR
    env = np.clip(np.minimum(1, tt / 1.2) * np.minimum(1, (s1 - s0) / SR - tt + 0.01), 0, 1)
    for m in ch + [ch[0] - 12]:
        f = note(m)
        w = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt + 0.5) + 0.15 * np.sin(2 * np.pi * 3 * f * tt)
        w *= 1 + 0.1 * np.sin(2 * np.pi * 0.3 * tt)
        pad[s0:s1] += 0.035 * env * w
# pulsation douce (rythme dynamique du pack) de 3,6 à 23 s
beat = 60 / 100
pulse = np.zeros(N, np.float32)
b = 3.6
while b < 23.0:
    i = int(b * SR); L = int(0.25 * SR); tt = np.arange(L) / SR
    pulse[i:i + L] += (0.12 * np.sin(2 * np.pi * (55 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14))[:N - i]
    b += beat
hats = np.zeros(N, np.float32)
b = 3.6 + beat / 2
while b < 23.0:
    i = int(b * SR); L = int(0.05 * SR)
    nz = np.diff(np.concatenate([[0], rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 80)]))
    hats[i:i + L] += (0.02 * nz)[:N - i]
    b += beat
music = pad + pulse + hats
env = np.ones(N)
env[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR))
env[:int(0.6 * SR)] = np.linspace(0.3, 1, int(0.6 * SR))
vabs = np.convolve(np.abs(voice), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same')
music *= env * (1 - 0.55 * np.clip(vabs / 0.03, 0, 1)) * 0.85


def lowpass(nz, cut):
    out = np.zeros(len(nz)); y = 0.0
    for n in range(len(nz)):
        y += cut[n] * (nz[n] - y); out[n] = y
    return out


def whoosh(t0, d=0.7, up=True, g=0.18):
    L = int(d * SR)
    cut = np.linspace(0.02, 0.35, L) if up else np.linspace(0.35, 0.02, L)
    out = lowpass(rng.standard_normal(L), cut) * np.sin(np.pi * np.arange(L) / L) ** 2
    return int(Wp(t0) * SR), (g * out).astype(np.float32)


def pop(t0, f=900, g=0.06):
    L = int(0.1 * SR); tt = np.arange(L) / SR
    return int(Wp(t0) * SR), (g * np.sin(2 * np.pi * f * tt * (1 + 0.5 * np.exp(-tt * 40))) * np.exp(-tt * 45)).astype(np.float32)


def boom(t0, g=0.2):
    L = int(0.9 * SR); tt = np.arange(L) / SR
    return int(Wp(t0) * SR), (g * np.sin(2 * np.pi * (48 + 40 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 4.5)).astype(np.float32)


def rise(t0, d=0.7, g=0.03):
    L = int(d * SR); tt = np.arange(L) / SR
    return int(Wp(t0) * SR), (g * np.sin(2 * np.pi * np.cumsum(600 + 700 * tt / d) / SR) * np.sin(np.pi * tt / d)).astype(np.float32)


def stamp(t0, g=0.42):
    L = int(0.5 * SR); tt = np.arange(L) / SR
    body = np.sin(2 * np.pi * (62 + 70 * np.exp(-tt * 28)) * tt) * np.exp(-tt * 16)
    click = lowpass(rng.standard_normal(L), np.full(L, 0.25)) * np.exp(-tt * 55) * 1.6
    thud = np.sin(2 * np.pi * 140 * tt) * np.exp(-tt * 38) * 0.5
    return int(Wp(t0) * SR), (g * (body + click + thud) / 2.2).astype(np.float32)


def paper(t0, g=0.22):
    """Feuille qui se pose : froissement bref et petit choc sourd."""
    L = int(0.22 * SR); tt = np.arange(L) / SR
    nz = rng.standard_normal(L)
    hi = nz - lowpass(nz, np.full(L, 0.12))
    sig = hi * np.exp(-tt * 30) * 0.8 + np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 40) * 0.6
    return int(Wp(t0) * SR), (g * sig / np.abs(sig).max()).astype(np.float32)


ev = [whoosh(0.0, 0.6, False, 0.14), stamp(0.64, 0.24),                      # recul + plaque qui se pose
      whoosh(2.05, 0.5, True, 0.18), boom(2.49, 0.12), rise(2.25, 0.6, 0.025),  # tour Eiffel + trait d'or
      whoosh(3.45, 0.45, True, 0.2), whoosh(3.62, 0.6, False, 0.08)]           # zoom traversant
for a in [4.61, 4.97, 5.30, 5.62]:
    ev.append(paper(a + 0.07))                                                 # feuilles qui tombent
ev += [whoosh(5.93, 0.45, True, 0.16), pop(7.8, 700, 0.06),
       rise(8.25, 0.45), whoosh(8.3, 0.45, True, 0.15), boom(11.2, 0.2),
       whoosh(12.4, 0.5, False, 0.13), whoosh(12.55, 0.45, True, 0.14)]
for a in [15.03, 15.89, 16.36, 16.85]:
    ev.append(pop(a + 0.15, 900, 0.06))                                        # coches
ev += [whoosh(16.1, 0.4, True, 0.06), whoosh(17.4, 0.5, False, 0.1), whoosh(19.15, 0.5, True, 0.15)]
for k in range(12):
    ev.append(pop(19.95 + k * 0.19 + 0.1, 1000, 0.022))                        # 12 mois cochés
ev += [stamp(22.59, 0.42), whoosh(22.93, 0.5, True, 0.14), whoosh(23.42, 0.4, True, 0.1),
       whoosh(25.5, 0.7, True, 0.16), pop(26.35, 880, 0.07)]
sfx = np.zeros(N, np.float32)
for i, sig in ev:
    if i < 0:
        sig = sig[-i:]; i = 0
    if i >= N:
        continue
    sfx[i:i + len(sig)] += sig[:N - i]
sfx *= 0.316  # bruitages à -10 dB (règle d'or n° 8)
mix = voice + music + sfx
mix /= max(1e-6, np.abs(mix).max()) / 0.89
sf.write(str(ROOT / 'out' / 'p02v2-bande-son.wav'), mix.astype(np.float32), SR)
print('bande son', T, 's,', len(ev), 'bruitages')
