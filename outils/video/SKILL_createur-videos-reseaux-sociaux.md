---
name: "createur-videos-reseaux-sociaux"
description: "Créer de A à Z une vidéo ou une publication réseaux sociaux de M&O Conseil (Instagram, Facebook, TikTok, LinkedIn) selon le guide complet du cabinet."
---

# Créateur de vidéos et de publications réseaux sociaux — M&O Conseil

Utilise ce skill pour toute vidéo, Reel, carrousel, visuel ou texte destiné aux réseaux de M&O Conseil, et pour toute retouche d'une publication existante.

## 0. Avant tout
1. Lis le guide de référence dans le projet Claude : `claude/GUIDE_COMPLET_VIDEOS_ET_PUBLICATIONS_RESEAUX.md` (copie : dépôt `merabamine-glitch/moconseil-medias`, `outils/video/`). Il prime sur ce résumé, **sauf la porte qualité (§2), qui prime sur tout**.
2. Lis aussi : `claude/PROCEDURE_PUBLICATIONS_RESEAUX.md` (textes, Calendrier, Metricool), `claude/SCRIPTS_VIDEO_SERIE_PACKS_30S.md` (scripts en cours), `claude/REFERENCES_INSPIRATION_VIDEO.md` (références d'Amine) et la dernière fiche `claude/RELAIS_VIDEO_*.md`.
3. Charge **et applique** les skills :
   - Script et accroche : `social-media-skills:short-form-video-script`, `social-media-skills:hook-writer`, `social-media-skills:scripting-and-storyboarding`, `marketing-skills:copywriting`.
   - Référence : `social-media-skills:viral-reverse-engineering`, `marketing-skills:video`.
   - Montage : `remotion:remotion-best-practices` (routeur), `remotion:remotion-markup` ; selon le besoin `remotion:remotion-maps`, `video-shotcraft:video-shotcraft`.
   - Son : `social-media-skills:ai-music-and-sound`, `social-media-skills:ai-voiceover`.
   - Critique : `design:design-critique` (obligatoire à la porte P4).
   - Publication : `social-media-skills:instagram-reels-publishing`, `social-media-skills:platform-specs-and-validation`, `social-media-skills:thumbnail-design`, `marketing-skills:social`.
4. Clone ou mets à jour `moconseil-medias` (outils Remotion dans `outils/video/`, voix dans `outils/video/voix/`) et installe (`npm install`, `python3 make_photos.py`).
5. Une conversation par vidéo. En fin de conversation : fiche `claude/RELAIS_VIDEO_<n>_<pack>.md` dans le projet (état, fichiers, ce qui reste).

## 1. Règles d'or (jamais d'exception)
- Ne jamais cocher la mention « contenu généré par IA » (`isAiGenerated: false`, `isAigc: false`, `isAiGeneratedContent: false`).
- Quand Amine demande une action : l'exécuter ; signaler un risque en une ligne sans suspendre.
- Vidéo : formats 15 s, 20 s ou 30 s (carte de fin comprise), alternés d'une vidéo à l'autre.
- Script en 6 temps : accroche (question), problème (finit sur l'idée reprise), « [reprise], c'est exactement ce que fait M et O Conseil. », « Avec le Pack [nom], nous [2-3 actions], sans que vous ayez à vous déplacer. », « À la fin, ce que vous obtenez, c'est [résultat maîtrisé]. », « Vous restez chez vous, nous gérons le reste. Réservez votre appel découverte. »
- Voix ElevenLabs d'Amine « Homme » et « Femme », alternées d'une vidéo à l'autre (Eleven v3, Stability 50 %, Similarity 75 %, Speed 100 %).
- Légende : se termine par « lien en bio ou sur www.moconseildz.com » ; lieu de chaque publication : Alger.
- Mardi : publication à la main par Amine (jamais Metricool) ; livrer vidéo, couverture et `legende.txt` la veille ou le matin, créer deux rappels (lundi 18h, mardi 18h15).
- Bruitages à −10 dB (`sfx *= 0.316`), aucun « ding ». Logo net sans halo, un seul soulignement, aucun cercle autour d'un mot.
- Images : photos réelles ou objets et ambiances générés ; jamais de lieu réel ni de personne générés ; personnes filmées : mains et silhouettes, sans visage.
- Aucun faux témoignage, faux commentaire, faux chiffre, faux document officiel. Faits réglementaires vérifiés.
- Ne jamais retirer un élément qu'Amine a vu et aimé sans le lui demander.

## 2. Porte qualité (bloquante — prime sur tout)
**Bible visuelle** : les deux vidéos validées « parfaites » par Amine — Présentation du 27/10 et Pack Création de Société v2 (03/11). Photos réelles en haute définition, nuit, or, pierre, fenêtre photo, tampon, mains en maillon, trait d'or, carte de fin nuit et or. Toute nouveauté s'ajoute à cette base, ne la remplace jamais. Aucune couleur hors charte.
**Contre-exemple** : Pack Suivi de Société v1 (note 2/10) — globe 3D flou et pixelisé, cartes génériques (« Déclaration du mois », « À déposer »), mots coupés, rouge brique hors charte, interface dessinée en code à la place de photos réelles, aucun aperçu envoyé.

Cinq portes, dans l'ordre. Aucun rendu complet avant P3 validée.
- **P1 Référence** : une vidéo pro du même genre, décomposée plan par plan (tableau du guide).
- **P2 Images clés** : 4 à 6 images en 1080 × 1920 réelles (pas des vignettes), envoyées à Amine. Attendre son OK explicite.
- **P3 Aperçu** : les 5 premières secondes (accroche) rendues avec le son. Attendre son OK explicite.
- **P4 Contrôle en taille réelle** après le rendu complet :
  - recadrages à 100 % de chaque plan : aucun pixel ni flou visible, aucun mot coupé, orthographe ;
  - contenu précis : chaque plan montre une chose concrète et nommée du pack (document, démarche, lieu, résultat) — jamais un intitulé générique ;
  - couleurs strictement dans la charte ;
  - comparaison côte à côte avec les deux vidéos de la bible ;
  - note sur 10 (netteté, précision, charte, rythme, accroche) avec `design:design-critique`. **En dessous de 8 : reprendre, ne rien envoyer.**
- **P5 Envoi** : vidéo + note + 3 lignes.

**3D** : autorisée seulement si un plan test de 3 s, rendu en 1080 × 1920, est net à 100 % (texture ≥ 8K, pas d'agrandissement au-delà de la résolution source) et validé par Amine avant usage. Sinon : carte 2D nette, photo ou plan filmé.
**Mot d'arrêt** : si Amine écrit « porte qualité », s'arrêter immédiatement et revenir à la porte sautée.

## 3. Déroulé
1. **Sujet** : Calendrier (Google Sheets « Calendrier réseaux », onglet Publications) ; alternance objectif, pack, gabarit, durée (15/20/30 s) ; quota Metricool (sauf mardi) ; voix inverse de la précédente.
2. **Script** selon le modèle ; environ 2,9 à 3,2 mots par seconde de voix ; écrit pour l'oreille ; validation d'Amine.
3. **Référence et storyboard** (P1) : plan par plan — temps (calés sur les mots), cadrage et caméra, sujet concret, texte, couleurs et lumière, transition, son.
4. **Voix** : via le connecteur ElevenLabs (lire les crédits d'abord, 2 essais maximum, réserve de 3 000 crédits) ; sinon Amine envoie le MP3. Archiver le MP3 dans `outils/video/voix/`.
5. **Calage** : alignement mot à mot (`voix/align_p01.py`), précision < 0,1 s.
6. **Images** : banque du dépôt, Drive › Banque photos (dont les plans filmés à Alger), Pexels ; demander à Amine 1 ou 2 images précises avant l'analyse ; registre `banque/REGISTRE.csv`. Jamais une image agrandie au-delà de sa résolution.
7. **Images clés** (P2), puis **aperçu 5 s** (P3).
8. **Animation** : action spectaculaire dès la 1re seconde, variée d'une vidéo à l'autre (tampon qui frappe, porte, clé, avion, carte…), relief 2,5D sur photos réelles, plan signature (mains en maillon, trait d'or, logo, Europe / Algérie), carte de fin nuit et or avec le nom du pack. Rythme : dynamique (Création, Suivi, Banque, Achat) ou posé (les autres).
9. **Effets** : 3 à 5 par vidéo parmi les 16 du guide, avec leurs limites.
10. **Texte à l'écran** : mots clés seulement, au moment exact où la voix les dit ; zones sûres (y 220 à 1600).
11. **Son** : voix d'origine ; nappe en code ; bruitages en code ou bibliothèque ElevenLabs ; −14 LUFS visé.
12. **Rendu** par morceaux de 60 images ; retouche : re-rendu des seuls morceaux touchés.
13. **Contrôle** (P4) + contrôle technique : planche 1 image/s, transitions, synchro 0 ms, niveaux, logo, durée, test sans le son.
14. **Envoi** (P5).
15. **Publication** : dossier `posts/AAAA-MM-JJ-jour-sujet/` (vidéo, couverture, `legende.txt`, `fiche.json`) ; Calendrier (colonnes A à Z) ; Drive › Posts (vérifier, sinon dépôt `moconseil-depot`, puis vider) ; Metricool hors mardi (brouillon par défaut) ; lieu Alger à ajouter dans Metricool web (épingle) ou dans l'application ; LinkedIn à la main.
16. **Mesure J+7** : rétention, enregistrements, clics ; ajuster l'accroche suivante.

## 4. Livrables d'une vidéo
MP4 1080 × 1920, 30 i/s, 15, 20 ou 30 s, son intégré ; couverture JPEG ; `legende.txt` (légende, premier commentaire, titre TikTok, texte alternatif, texte LinkedIn, lieu) ; `fiche.json` ; ligne du Calendrier ; copie Drive ; fiche relais dans le projet.
