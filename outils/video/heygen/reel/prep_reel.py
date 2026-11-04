"""Vidéo HeyGen « conseillère réelle — présentation M&O » (04/11/2026, formule payante, sans filigrane).
Pauses raccourcies (même coupe image et son, coupes alignées sur les images à 25 i/s), accélération x1,1 de l'image ET du son
(lèvres synchrones), recadrage tête-buste (720x960) agrandi x1,5 (1080x1440). Écrit src/reel_data.ts (table de temps)."""
import json, subprocess, pathlib
D = pathlib.Path(__file__).resolve().parent
V = D.parent.parent
SRC = D / 'source-heygen-reel.mp4'
SP = 1.1
SIL = [(1.26, 1.96), (4.15, 4.67), (9.35, 9.85), (12.03, 12.30), (14.12, 14.51), (16.52, 16.95), (18.96, 19.33), (23.06, 23.48), (24.34, 24.75), (25.65, 26.03), (26.99, 27.34)]
pts = [0.08]
for a, b in SIL:
    pts += [a + 0.08, b - 0.08]
pts.append(29.24)
KEEP = [(pts[i], pts[i + 1]) for i in range(0, len(pts), 2)]
KEEP = [(round(a / 0.04) * 0.04, round(b / 0.04) * 0.04) for a, b in KEEP]
n = len(KEEP)
fc = ''.join(f"[0:v]trim={a:.2f}:{b:.2f},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a:.2f}:{b:.2f},asetpts=PTS-STARTPTS[a{i}];" for i, (a, b) in enumerate(KEEP))
fc += ''.join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[vc][ac];"
fc += f"[vc]setpts=PTS/{SP},crop=720:960:0:0,scale=1080:1440:flags=lanczos,unsharp=5:5:0.6,fps=25,format=yuv420p[v];[ac]atempo={SP}[a]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(SRC), '-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-crf', '12', '-preset', 'veryfast', '-an', str(V / 'public' / 'video' / 'reel-presentation.mp4'),
                '-map', '[a]', '-ac', '1', '-ar', '48000', str(D / 'reel-voix.wav')], check=True)
cum, t = [], 0.0
for a, b in KEEP:
    cum.append([a, b, round(t, 4)]); t += b - a
dur = round(t / SP, 3)
(V / 'src' / 'reel_data.ts').write_text(
    '// généré par heygen/reel/prep_reel.py — ne pas modifier à la main\n'
    f'export const REEL_SP = {SP};\nexport const REEL_VOIX = {dur};\nexport const REEL_CUM: [number, number, number][] = {json.dumps(cum)};\n'
    'export const RT = (x: number): number => { for (const [a, b, c] of REEL_CUM) if (x <= b + 0.01) return (c + Math.max(0, x - a)) / REEL_SP; return REEL_VOIX; };\n')
print(KEEP); print('durée voix', dur)
