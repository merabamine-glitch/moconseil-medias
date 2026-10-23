"""Régénère src/photos.ts (photos en data URI) à partir de public/img/.
Nom de l'export : P_ + nom du fichier sans extension, tirets remplacés par _ (ex. premier-plan.webp -> P_premier_plan)."""
import base64, pathlib
root = pathlib.Path(__file__).parent
mime = {'.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp'}
out = ['// généré par make_photos.py : photos en data URI (évite les chargements réseau pendant le rendu)']
for p in sorted((root / 'public' / 'img').iterdir()):
    if p.suffix.lower() in mime:
        b = base64.b64encode(p.read_bytes()).decode()
        out.append(f"export const P_{p.stem.replace('-', '_')} = 'data:image/{mime[p.suffix.lower()]};base64,{b}';")
(root / 'src' / 'photos.ts').write_text('\n'.join(out) + '\n')
print(len(out) - 1, 'photos')
