---
name: createur-videos-reseaux-sociaux
description: Créer de A à Z une vidéo ou une publication réseaux sociaux de M&O Conseil (Instagram, Facebook, TikTok, LinkedIn) selon le guide complet du cabinet.
---

# Créateur de vidéos et de publications réseaux sociaux — M&O Conseil

Utilise ce skill pour toute vidéo, Reel, carrousel, visuel ou texte destiné aux réseaux de M&O Conseil, et pour toute retouche d'une publication existante.

## 0. Avant tout
1. Lis le guide de référence dans le projet Claude : `claude/GUIDE_COMPLET_VIDEOS_ET_PUBLICATIONS_RESEAUX.md` (copie : dépôt `merabamine-glitch/moconseil-medias`, `outils/video/`). Il prime sur ce résumé.
2. Lis aussi : `claude/PROCEDURE_PUBLICATIONS_RESEAUX.md` (textes, Calendrier, Metricool), `claude/SCRIPTS_VIDEO_SERIE_PACKS_30S.md` (scripts en cours), `claude/REFERENCES_INSPIRATION_VIDEO.md` (références d'Amine).
3. Charge les skills : `marketing-skills:video`, `marketing-skills:social`, `marketing-skills:copywriting`, `marketing-skills:copy-editing`, `marketing-skills:marketing-psychology` ; selon le besoin `marketing-skills:image`, `marketing-skills:ad-creative`, `brand-guidelines`, `design:design-critique`.
4. Clone ou mets à jour `moconseil-medias` (outils Remotion dans `outils/video/`) et installe (`npm install`, `python3 make_photos.py`).

## 1. Règles d'or (jamais d'exception)
- Ne jamais cocher la mention « contenu généré par IA » (`isAiGenerated: false`, `isAigc: false`, `isAiGeneratedContent: false`).
- Quand Amine demande une action : l'exécuter ; signaler un risque en une ligne sans suspendre.
- Vidéo : 15 à 30 s, carte de fin comprise.
- Script en 6 temps : accroche (question), problème (finit sur l'idée reprise), « [reprise], c'est exactement ce que fait M et O Conseil. », « Avec le Pack [nom], nous [2-3 actions], sans que vous ayez à vous déplacer. », « À la fin, ce que vous obtenez, c'est [résultat maîtrisé]. », « Vous restez chez vous, nous gérons le reste. Réservez votre appel découverte. »
- Voix ElevenLabs d'Amine « Homme » et « Femme », alternées d'une vidéo à l'autre (Eleven v3, Stability 50 %, Similarity 75 %, Speed 100 %).
- Légende : se termine par « lien en bio ou sur www.moconseildz.com » ; lieu de chaque publication : Alger.
- Mardi : publication à la main par Amine (jamais Metricool) ; livrer vidéo, couverture et `legende.txt` la veille ou le matin, créer deux rappels (lundi 18h, mardi 18h15).
- Bruitages à −10 dB (`sfx *= 0.316`), aucun « ding ». Logo net sans halo, un seul soulignement, aucun cercle autour d'un mot.
- Images : photos réelles ou objets et ambiances générés ; jamais de lieu réel ni de personne générés ; personnes filmées : mains et silhouettes, sans visage.
- Aucun faux témoignage, faux commentaire, faux chiffre, faux document officiel. Faits réglementaires vérifiés.
- Ne jamais retirer un élément qu'Amine a vu et aimé sans le lui demander.

## 2. Déroulé
1. **Sujet** : Calendrier (Google Sheets « Calendrier réseaux », onglet Publications) ; alternance objectif, pack, gabarit ; quota Metricool (sauf mardi) ; voix inverse de la précédente.
2. **Script** selon le modèle ; 75 à 85 mots ; écrit pour l'oreille ; validation d'Amine.
3. **Storyboard plan par plan** : temps (calés sur les mots), cadrage et caméra, sujet, texte, couleurs et lumière, transition, son. Pour imiter une référence : la décomposer avec le même tableau, puis remplacer par la charte et le message.
4. **Voix** : via le connecteur ElevenLabs s'il permet la synthèse (lire les crédits d'abord, 2 essais maximum, réserve de 3 000 crédits) ; sinon Amine envoie le MP3.
5. **Calage** : alignement mot à mot (`voix/align_p01.py`), précision < 0,1 s.
6. **Images** : banque du dépôt, Drive › Banque photos, Pexels ; demander à Amine 1 ou 2 images précises avant l'analyse ; registre `banque/REGISTRE.csv`.
7. **Animation « cinéma 3D réaliste »** : action spectaculaire dès la 1re seconde (avion, globe 3D vers Alger, tampon qui frappe, porte, clé), vraie 3D (Three.js + `@remotion/three`, rendu `--gl=swiftshader`), relief 2,5D, plan signature (mains en maillon, trait d'or, logo, Europe / Algérie), carte de fin nuit et or avec le nom du pack. Rythme : dynamique (Création, Suivi, Banque, Achat) ou posé (les autres).
8. **Effets** : 3 à 5 par vidéo parmi les 16 du guide (headline wall, zoom-through cut, vertigo, green screen, phone mockup, digital zoom, paper cut, ui world, orbit, frame break, doodle boil, sticky text, before + after, pull-back reveal, depth scatter, comment bubble), avec leurs limites.
9. **Texte à l'écran** : mots clés seulement, au moment exact où la voix les dit ; zones sûres (y 220 à 1600).
10. **Son** : voix d'origine ; nappe en code ; bruitages en code ou bibliothèque ElevenLabs ; −14 LUFS visé.
11. **Rendu** par morceaux de 60 images ; retouche : re-rendu des seuls morceaux touchés.
12. **Contrôle bloquant** : planche 1 image/s, transitions, synchro 0 ms, mots à l'écran, orthographe, niveaux, logo, durée 15-30 s, test sans le son.
13. **Envoi** à Amine (vidéo + 3 à 5 lignes) ; choix esthétique : deux aperçus avant le rendu complet.
14. **Publication** : dossier `posts/AAAA-MM-JJ-jour-sujet/` (vidéo, couverture, `legende.txt`, `fiche.json`) ; Calendrier (colonnes A à Z) ; Drive › Posts (vérifier, sinon dépôt `moconseil-depot`, puis vider) ; Metricool hors mardi (brouillon par défaut) ; lieu Alger à ajouter dans Metricool web (épingle) ou dans l'application ; LinkedIn à la main.
15. **Mesure J+7** : rétention, enregistrements, clics ; ajuster l'accroche suivante.

## 3. Livrables d'une vidéo
MP4 1080 × 1920, 30 i/s, 15 à 30 s, son intégré ; couverture JPEG ; `legende.txt` (légende, premier commentaire, titre TikTok, texte alternatif, texte LinkedIn, lieu) ; `fiche.json` ; ligne du Calendrier ; copie Drive.
