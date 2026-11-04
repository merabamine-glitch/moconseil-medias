"""Voix de la vidéo 5 « Pack Conciergerie » v3 : prise d'Amine du 04/11/2026 (ElevenLabs « Homme », eleven v3).
Pauses longues ramenées à ~0,22 s (0,30 s avant « Conciergerie »), puis tempo x1,035 hauteur et timbre conservés.
Produit voix/pack-05-conciergerie-v3.mp3 ; newt() convertit un temps de la prise brute en temps final."""
import subprocess, pathlib
D = pathlib.Path(__file__).resolve().parent
PAUSES = [(1.976, 2.361), (3.416, 3.822), (9.921, 10.288), (14.700, 15.051), (15.880, 16.276), (16.840, 17.278, 0.30), (22.474, 22.940), (27.228, 27.515)]
CUTS = []
for p in PAUSES:
    a, b = p[0], p[1]; keep = p[2] if len(p) > 2 else 0.22
    CUTS.append((round(a + keep / 2, 3), round(b - keep / 2, 3)))
END = 31.10
TEMPO = 1.035
def newt(t):
    s = 0.0
    for a, b in CUTS:
        if t >= b: s += b - a
        elif t > a: s += t - a
    return (t - s) / TEMPO
if __name__ == '__main__':
    parts = []; prev = 0.0
    for a, b in CUTS:
        parts.append(f"atrim={prev}:{a},asetpts=PTS-STARTPTS"); prev = b
    parts.append(f"atrim={prev}:{END},asetpts=PTS-STARTPTS")
    n = len(parts)
    fc = ';'.join(f"[0:a]{p}[p{i}]" for i, p in enumerate(parts)) + ';' + ''.join(f"[p{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[c];[c]rubberband=tempo={TEMPO}:pitchq=quality:formant=preserved[o]"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(D / 'pack-05-conciergerie-v3-brut.mp3'), '-filter_complex', fc, '-map', '[o]', '-ar', '44100', '-b:a', '192k', str(D / 'pack-05-conciergerie-v3.mp3')], check=True)
    print('fin voix :', round(newt(END), 2), 's')
