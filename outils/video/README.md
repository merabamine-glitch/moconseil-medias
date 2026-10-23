# Projet vidéo M&O Conseil (Remotion)

Sources des vidéos avec voix off et photos réelles : présentation (27/10/2026), certificat négatif (22/10/2026), et modèle de la série « Un pack en 30 secondes ».

- Méthode complète : `RECETTE_VIDEOS_RESEAUX_MO_Conseil.md` (copie du projet Claude `claude/RECETTE_VIDEOS_RESEAUX_MO_Conseil.md`).
- Scripts de la série : `SCRIPTS_SERIE_PACKS_30S.md`.
- Installer : `npm install`, puis `python3 make_photos.py` (génère `src/photos.ts` depuis `public/img/`).
- Compositions (`src/Root.tsx`) : `PresentationV4A` (version publiée), `Certificat`, et les versions précédentes.
- Rendu : `bash render5.sh` (rendu par morceaux de 60 images, Chromium préinstallé).
- Son : `audio/build_audio6.py` (voix + nappe + bruitages à -10 dB), `audio/musique_chill.py` (lo-fi originale pour les vidéos sans voix).
- Alignement voix / mots : `voix/align.py`.
