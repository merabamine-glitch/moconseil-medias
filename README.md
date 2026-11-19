# moconseil-medias

Dépôt **public** des visuels publiés sur les réseaux sociaux de M&O Conseil (Instagram, Facebook, TikTok, LinkedIn).

- `posts/AAAA-MM-JJ-…/` : visuels de chaque publication (PNG 1080 × 1350, MP4 1080 × 1920). Metricool les récupère par leur lien public et en garde sa propre copie.
- `banque/` : photos utilisables (photos du site moconseildz.com et banque fournie par M&O Conseil). Registre : `banque/REGISTRE.csv`.
- `outils/` : générateur de visuels (`mo_visuels.py`), polices (licence SIL OFL) et logo.

Ce dépôt ne contient **aucun** document client, rapport ou donnée interne.

## Règle de couverture (19/11/2026)

La première image d'un carrousel ou d'une vidéo est épurée : un titre de 2 à 6 mots en très gros, un surtitre court, une seule image, aucun paragraphe. Pour le gabarit `bande`, utiliser `taille` (118) et `largeur` (0,9) sur la slide 1 et ne pas mettre de `texte`. Règle complète : playbook, section 10.5.
