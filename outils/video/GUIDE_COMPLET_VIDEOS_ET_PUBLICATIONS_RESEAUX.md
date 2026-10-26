# GUIDE COMPLET — Vidéos et publications sur les réseaux sociaux (M&O Conseil)

**Version 2.2 — 26 octobre 2026 (19h).** Remplace la « Recette vidéos réseaux » (v1.1). Ce guide est la référence unique pour toute vidéo et toute publication (Instagram, Facebook, TikTok, LinkedIn). Claude le relit avant chaque production et applique le skill « createur-videos-reseaux-sociaux ».

Copies tenues à jour ensemble : projet Claude `claude/GUIDE_COMPLET_VIDEOS_ET_PUBLICATIONS_RESEAUX.md` ; Drive › RÉSEAUX SOCIAUX (document Word, même lien que l'ancienne recette) ; dépôt GitHub `moconseil-medias`, dossier `outils/video/`.

---

## Règles d'or (non négociables)

| N° | Règle | Origine |
|---|---|---|
| 1 | La mention « contenu généré par IA » n'est **jamais** cochée, sur aucun réseau. | Décision d'Amine, 23/10/2026 |
| 2 | Quand Amine demande une action, elle est exécutée. Un risque se signale en une ligne, sans suspendre ni annuler. | 23/10/2026 |
| 3 | Durée d'une vidéo : **20 secondes en moyenne, 30 secondes au maximum**, carte de fin comprise (le taux de rétention est calculé sur la durée totale). | 26/10/2026 |
| 4 | Script en **6 temps** : accroche, problème, nous comme solution, le pack, ce que vous obtenez, promesse et appel. | 23/10/2026 |
| 5 | Voix ElevenLabs d'Amine, **alternée** : une vidéo « Homme », la suivante « Femme ». | 26/10/2026 |
| 6 | Chaque légende se termine par « lien en bio ou sur www.moconseildz.com » et chaque publication porte un **lieu : Alger**. | 26/10/2026 |
| 7 | Vidéos du **mardi** : publiées **à la main par Amine**, jamais dans Metricool. Claude livre vidéo, couverture et légende la veille ou le matin même, avec deux rappels. | 23/10/2026 |
| 8 | Bruitages à −10 dB sous leur niveau d'origine ; aucun « ding », aucun scintillement en cloche. | 23/10/2026 |
| 9 | Aucune image générée d'un **lieu réel** ni d'une **personne**. Objets et ambiances générés : autorisés, photos réelles en priorité équivalente. | 26/10/2026 |
| 10 | Un élément qu'Amine a vu et aimé ne disparaît pas sans son accord. | 23/10/2026 |
| 11 | Tout fait réglementaire dit ou écrit est vérifié (veille réglementaire ou source officielle de moins de 90 jours). | Procédure de publication |
| 12 | Aucun faux témoignage, faux commentaire, faux chiffre ou faux document officiel. | Déontologie |
| 13 | **Premier plan : aucune animation ajoutée** (papiers, plaques, objets qui tombent, étiquettes). L'accroche vient de l'image elle-même : vidéo réelle, mouvement de caméra, texte. Ne s'applique pas aux vidéos déjà publiées ou validées. | Décision d'Amine, 26/10/2026 |
| 14 | **Légende et textes : objectif unique, l'appel découverte.** Aucune restriction, nuance de formule ou réserve qui freine l'appel (les limites de palier se traitent pendant l'appel). | Décision d'Amine, 26/10/2026 |
| 15 | Ciel terne ou gris sur une vidéo réelle : l'étalonner en ciel bleuté (masque du ciel, relief des nuages conservé) avant le montage. | Demande d'Amine, 26/10/2026 |

---

## 1. Objectif

Produire des vidéos verticales de 15 à 30 secondes et des publications qui :
- arrêtent le défilement dès la première seconde, par une **action visuelle spectaculaire** synchronisée avec la question de la voix ;
- font comprendre, même sans le son, à qui elles parlent, le problème réglé et ce que le client obtient ;
- donnent une image premium, sérieuse et humaine du cabinet : un vrai travail d'animation (3D, relief, objets qui bougent), pas des photos qui zooment ;
- se terminent sur un seul appel à l'action : l'appel découverte (lien en bio ou www.moconseildz.com).

## 2. Acteurs et outils

| Qui ou quoi | Rôle | Accès |
|---|---|---|
| Amine | Choisit ou valide les sujets ; valide scripts et vidéos ; fournit des photos (Drive › Banque photos) ; publie à la main les vidéos du mardi et LinkedIn. | — |
| Emily (Alger) | Peut fournir des photos ou vidéos de mains, de lieux, de documents (sans visage). | Drive |
| Claude | Script, storyboard, voix (si connecteur), animation, son, rendu, contrôle, légendes, dépôts, calendrier, rappels. | Projet Claude |
| ElevenLabs | Voix off « Homme » et « Femme » d'Amine (Voice Design, modèle Eleven v3) ; bruitages ponctuels (bibliothèque). | Compte d'Amine ; connecteur claude.ai si activé |
| Remotion 4 (React) | Moteur de montage par code : scènes, animations, transitions, rendu MP4. | `outils/video/` du dépôt |
| Three.js + @remotion/three | Vraie 3D : globe, objets en relief, caméra 3D. Validé le 26/10/2026 (rendu WebGL logiciel). | idem |
| ffmpeg, Python (numpy, librosa, soundfile) | Analyse de la voix, mixage, normalisation, contrôle de synchronisation. | Espace de travail Claude |
| Kokoro (voix locale) | Référence d'alignement mot à mot uniquement, jamais publiée. | idem |
| Metricool (marque 7184987) | Programmation Instagram, Facebook, TikTok (sauf mardi). Formule gratuite : 20 publications par mois. | Connecteur Metricool |
| Calendrier réseaux (Google Sheets) | Une ligne par publication, colonnes A à Z ; onglet « Quota du mois ». | Connecteur Google Sheets |
| GitHub `moconseil-medias` (public) | Médias publiés (`posts/`), banque d'images (`banque/`), outils (`outils/video/`). | Claude |
| GitHub `moconseil-depot` (privé) + script Google | Dépôt vers Drive : fiches `ajouter`, `remplacer`, `corbeille` traitées toutes les 10 min ; journal « Journal du dépôt Claude ». | Claude |
| Google Drive › RÉSEAUX SOCIAUX | Posts, banque photos, documents (ce guide, scripts). | Connecteur Drive |
| Pexels, Unsplash | Photos libres de droits (licence à noter au registre). | — |
| Canva | Possible pour des visuels fixes (connecteur disponible), pas nécessaire pour la vidéo. | Connecteur Canva |
| Plus tard | Higgsfield et un second outil évoqué par Amine (vidéo générée) : à évaluer avec la règle 9. | — |

## 3. Skills à utiliser

**Obligatoires pour toute vidéo** (outil Skill, avant d'écrire) :
- `marketing-skills:video` : production, choix des outils, pipeline ;
- `marketing-skills:social` : règle des 3 secondes, formats Reels et TikTok, accroches, pas de tics d'écriture IA ;
- `marketing-skills:copywriting` puis `marketing-skills:copy-editing` : script et légende ;
- `marketing-skills:marketing-psychology` : un levier honnête par vidéo.

**Selon le besoin** : `marketing-skills:ad-creative` (version publicité), `marketing-skills:image` (photos), `marketing-skills:product-marketing` et `marketing-skills:offers` (contenu d'un pack), `marketing-skills:customer-research` (vocabulaire réel de la diaspora), `brand-guidelines` et `ui-ux-pro-max:brand` (charte), `design:design-critique` (relecture de la planche de contrôle).

**Skills et outils repérés par Amine (26/10/2026), à évaluer avant usage** : Humanizer (rendre un texte plus humain : nos règles d'écriture le couvrent déjà) ; HyperFrames (vidéo en HTML, alternative à Remotion : non retenu, Remotion fait déjà tout) ; 21st.dev (composants d'interface pour les maquettes de téléphone et les « UI world ») ; Watch (analyse d'une vidéo de référence plan par plan) ; Apify (collecte web, utile pour la veille) ; Google Workspace (déjà couvert par nos connecteurs) ; Find Skills ; Orca ; REA ; Playwright (captures du site pour les maquettes de téléphone : disponible dans l'espace de travail).

## 4. Matériel nécessaire et où le trouver

| Élément | Où |
|---|---|
| Script validé | Document des scripts (projet `claude/SCRIPTS_VIDEO_SERIE_PACKS_30S.md`, Drive) |
| Voix MP3 | ElevenLabs : généré par Claude (connecteur) ou envoyé par Amine dans la conversation |
| Photos | `banque/site/`, `banque/drive/`, `banque/amine/` du dépôt ; Drive › Banque photos (dossiers 1 à 6, dont « 3 - Démarches ») ; photos envoyées par Amine |
| Textures 3D | `outils/video/public/img/terre.jpg` (NASA Blue Marble, domaine public) |
| Logos, polices | `outils/video/` (logos clair et couleur, Manrope, Cormorant Garamond) |
| Contenu des packs | Projet Claude : « CATALOGUE DES PACKS DE SERVICE - MO CONSEIL.pdf » |
| Faits réglementaires | `claude/VEILLE_REGLEMENTAIRE.md` ou source officielle |
| Références d'inspiration | `claude/REFERENCES_INSPIRATION_VIDEO.md` (captures d'Amine du 26/10/2026) |

---

## 5. Déroulé, étape par étape

### Étape 0 — Choisir le sujet (Claude, validation d'Amine)
1. Lire le Calendrier : objectif (Attirer, Prouver, Humaniser), pilier, pack, alternance (jamais deux fois le même pack de suite, ni le même gabarit).
2. Vérifier le quota Metricool (onglet « Quota du mois »), sauf pour le mardi.
3. Choisir la voix : l'inverse de la vidéo précédente (registre en tête du document des scripts).

### Étape 1 — Script (15 à 30 s)
**Modèle obligatoire, 6 temps, 75 à 85 mots** (voix « Homme » : environ 3,2 mots par seconde ; « Femme » : environ 3,0 à Speed 1,05) :

| Temps | Rôle | Formule |
|---|---|---|
| 1 | Accroche | Une question qui nomme la situation du prospect. |
| 2 | Problème | Ce que la démarche demande depuis l'étranger. La phrase se termine sur l'idée que la transition reprend. |
| 3 | Nous, la solution | « [reprise de l'idée finale du problème], c'est exactement ce que fait M et O Conseil. » L'écran montre « une équipe en Europe, une équipe en Algérie ». |
| 4 | Le pack | « Avec le Pack [nom], nous [2 ou 3 actions du catalogue], sans que vous ayez à vous déplacer. » (« à faire l'aller-retour » quand le client viendra de toute façon : Retour, Logement.) |
| 5 | Ce que vous obtenez | « À la fin, ce que vous obtenez, c'est [résultat que nous maîtrisons]. » Pack mensuel : « Chaque mois, … ». |
| 6 | Promesse et appel | « Vous restez chez vous, nous gérons le reste. » puis « Réservez votre appel découverte. » |

Règles d'écriture : phrases courtes, écrites pour l'oreille ; « M et O Conseil » écrit ainsi pour la prononciation ; points de suspension pour une pause ; aucune procuration évoquée dans la voix ; aucun résultat qui dépend d'un tiers (tribunal, école) présenté comme garanti ; interdits : « ce n'est pas X, c'est Y », listes de négations, questions qu'on se pose pour y répondre, tirets cadratins, superlatifs non prouvés, « devis », « garantie », prénoms de l'équipe.

### Étape 2 — Storyboard plan par plan (méthode de déconstruction)
Avant toute animation, Claude écrit un tableau par plan (inspiré du prompt « Motion Graphics Director » repéré par Amine) :

| Colonne | Contenu |
|---|---|
| Temps | début et fin du plan, calés sur les mots de la voix |
| Cadrage et caméra | plan, mouvement (travelling, orbite, zoom traversant, dolly zoom), profondeur de champ, point focal |
| Sujet | objet ou lieu, 2D ou 3D, position, échelle |
| Texte | mots exacts, police, graisse, taille, couleur, animation |
| Couleurs et lumière | palette (hex), direction de la lumière, ombres, texture |
| Transition | vers le plan suivant (technique et durée) |
| Son | bruitage, niveau, moment exact |

Pour imiter une vidéo de référence : la décomposer avec ce tableau (temps, cadrage, sujet, typographie, couleurs, mouvements, son, motifs récurrents), puis remplacer chaque élément par notre charte et notre message. On copie la grammaire du montage, jamais les images, le texte ou la musique de la référence.

### Étape 3 — Voix (ElevenLabs)
- **Voix** : « Homme » et « Femme » (Mes voix, compte d'Amine), alternées. Modèle **Eleven v3**, mode Naturel. Réglages de référence (noms des fichiers d'Amine) : Speed 100 %, Stability 50 %, Similarity 75 %. Voix « Femme » : Speed 1,05 si la vidéo dépasse 30 s.
- **Balises** (une par ligne, non lues) : `[warmly]`, `[confident]`, `[smiling]`, `[upbeat]`, `[reassuring]`, `[short pause]`. Trop théâtral : retirer la balise.
- **Mode automatique (en service depuis le 26/10/2026)** : connecteur ElevenLabs de claude.ai. Voix « Femme » `DIP3DjEqbauGU9CKo8WB` et « Homme » `smkDZIwty9tTDIcycYFo` (outil `creative_list_voices`), modèle `eleven_v3`.
  1. `creative_create_flow` (un flux par vidéo, nommé « M&O Conseil · Vidéo NN · Pack … »).
  2. `creative_generate_speech` avec `estimate_only: true` : lire le coût (environ 530 crédits par prise de 28 s).
  3. Génération : **une seule prise** par défaut (`generations_count: 1`) pour tenir le budget ; deux prises seulement pour une vidéo importante.
  4. `creative_get_flow_run_status` jusqu'à `all_completed`, puis choix de la prise la plus courte et la plus naturelle.
  5. Téléchargement : l'espace de travail de Claude ne joint pas `storage.googleapis.com`. Claude passe par le navigateur intégré de l'ordinateur d'Amine (une autorisation à accepter par fichier). Pour supprimer cette étape : claude.ai › Paramètres › Capacités › autoriser le domaine `storage.googleapis.com`.
- **Budget** : 10 000 crédits par mois. Réserve de sécurité : ne jamais descendre sous 3 000 crédits sans l'accord d'Amine. Les prises restent disponibles dans le flux ElevenLabs (« Flows »).
- **Mode manuel (secours)** : Amine colle le texte du script, génère, télécharge et envoie le MP3 nommé `pack-NN-sujet.mp3`.
- Autres fonctions ElevenLabs (bruitages, musique) : uniquement pour constituer une **bibliothèque de bruitages réutilisables** générée une fois (tampon, avion, porte, clé, papier, clic), après estimation des crédits.

### Étape 4 — Analyse et calage de la voix (Claude)
1. Durée, niveau, pauses (`ffmpeg`, enveloppe d'énergie).
2. Position de chaque mot : `outils/video/voix/align_p01.py` (référence Kokoro et alignement DTW sur MFCC), contrôlée par les pauses détectées ; précision visée sous 0,1 s.
3. Les temps des mots pilotent toutes les apparitions de texte et les coupes.

### Étape 5 — Images
1. **Une image par idée**, qui illustre ce que dit la voix à cet instant.
2. Ordre de recherche : banque du dépôt, Drive › Banque photos, Pexels ou Unsplash, puis demande à Amine (une ou deux images précises, demandées avant l'analyse).
3. Images générées par IA : objets et ambiances seulement (une clé, un dossier, une texture, un ciel), jamais un lieu réel d'Algérie, jamais une personne.
4. Personnes filmées : mains et silhouettes, sans visage (Amine ou Emily), pour l'instant.
5. Chaque nouvelle image : copie dans `banque/` et ligne au `REGISTRE.csv` (sujet, source, licence, date d'usage).
6. Une image ne revient pas deux fois dans une vidéo, sauf rappel voulu (ex. : tampon au registre du commerce puis au résultat, demande d'Amine du 26/10).

### Étape 6 — Direction artistique « cinéma 3D réaliste »
- **Accroche (0 à 3 s)** : une image forte en même temps que la question de la voix et le texte (règle des 3 secondes) : vidéo réelle d'Alger (plans d'Amine), mouvement de caméra (recul, poussée), coupe nette vers le plan suivant. **Aucune animation ajoutée sur le premier plan** (règle 13). On varie l'image d'une vidéo à l'autre et on mesure la rétention.
- **Vraie 3D** (Three.js) : globe terrestre, objets en volume, caméra qui orbite ; lumière principale chaude, contre-jour doré.
- **Relief 2,5D** : photo découpée en plans (premier plan, sujet, fond) qui bougent à des vitesses différentes ; objet détouré qui sort de son cadre ou traverse l'image (comme l'avion).
- **Rythme selon le pack** : dynamique (un plan toutes les 1 à 2 s) pour Création, Suivi, Compte Bancaire, Achat ; posé (2 à 3 s) pour Succession, Nationalité, Retour, Scolarisation, Logement, Conciergerie.
- **Fil conducteur** : le trait d'union doré. **Plan signature** : mains en maillon, trait d'or, logo, repères « Europe » et « Algérie ». **Carte de fin** « nuit et or » avec le nom du pack, bouton « Réserver un appel découverte → » (au moins 2 s à l'écran), moconseildz.com.
- **Charte** : marine #1B2A41, nuit #0E1726, or #C9A24B, or clair #E9CF8E, or foncé sur fond clair #9C7726, pierre #F4EFE6 ; Manrope 700–800 pour l'information, Cormorant Garamond italique pour le mot émotion.
- **Logo** net, sans halo ; un seul soulignement (déjà dans le logo) ; aucun cercle autour d'un mot.

### Étape 7 — Bibliothèque des 16 effets de montage
Chaque effet est réalisable dans Remotion. Une vidéo en utilise 3 à 5, pas plus.

| N° | Effet | Ce que c'est | Comment (Remotion) | Quand l'utiliser | Limite |
|---|---|---|---|---|---|
| 01 | Headline wall | Le titre envahit l'écran, mot par mot, en très grand | Mots en blocs empilés, apparition décalée de 3 à 5 images, échelle et flou d'entrée | Accroche d'une vidéo d'information | Pas plus de 6 mots |
| 02 | Zoom-through cut | La caméra plonge dans un élément (lettre, fenêtre, porte) qui devient le plan suivant | Masque sur l'élément, échelle de 1 à 15 en 8 à 10 images, flou de mouvement | Passer du problème à la solution | Élément central et contrasté |
| 03 | Vertigo (dolly zoom) | Le sujet garde sa taille pendant que le fond s'étire | Sujet détouré à échelle fixe, fond qui grossit avec perspective | Moment de prise de conscience | Nécessite un sujet détouré |
| 04 | Green screen | Une personne filmée sur fond vert, incrustée sur un décor animé | Détourage par la couleur (ffmpeg `colorkey` ou masque) | Plus tard, si une personne filme | Pas de visage pour l'instant |
| 05 | Phone mockup | Un téléphone en 3D qui affiche une page réelle | Capture du site (Playwright) dans un cadre de téléphone qui pivote en 3D | Montrer la réservation de l'appel découverte | Capture réelle uniquement |
| 06 | Digital zoom | Recadrage brusque sur un détail | Échelle 1 → 1,4 en 3 images, léger flou, retour doux | Insister sur un mot ou un chiffre | 1 ou 2 fois par vidéo |
| 07 | Paper cut | Éléments en papier découpé, ombres portées, déchirures | Formes SVG à bords irréguliers, texture papier, ombres | Expliquer des étapes | Style doux, pour packs posés |
| 08 | UI world | Cartes d'interface qui flottent en 3D autour du sujet | Cartes HTML en perspective, profondeur, parallaxe | Montrer ce que comprend un pack | 3 à 4 cartes |
| 09 | Orbit | La caméra tourne autour d'un objet, ou des cartes autour du logo | Three.js (caméra en orbite) ou rotation 3D CSS | Plan signature, objet héros | Mouvement lent |
| 10 | Frame break | Le sujet sort du cadre de l'image | Sujet détouré posé au-dessus du bord du cadre | Accroche, couverture | Sujet net et détourable |
| 11 | Doodle boil | Traits dessinés à la main qui « vibrent » | Tracé SVG redessiné toutes les 3 images avec un léger bruit | Flèches, soulignements | Jamais de cercle autour d'un mot |
| 12 | Sticky text | Le texte suit un objet qui bouge | Position du texte liée à la position animée de l'objet | Nommer un objet (clé, dossier) | Objet suivi lisible |
| 13 | Before + after | Avant et après, séparés par un volet | Deux plans, masque vertical animé ou glissé | Désordre administratif puis dossier complet | Ne pas inventer un cas client |
| 14 | Pull-back reveal | De très près à la scène entière | Échelle de 3 à 1 sur la photo ou caméra 3D qui recule | Ouverture ou résultat final | Photo en haute définition |
| 15 | Depth scatter | L'image se sépare en couches qui s'écartent en profondeur | Couches détourées ou carte de profondeur, déplacement en Z | Transition « waouh » | Un seul par vidéo |
| 16 | Comment bubble | Une bulle de commentaire qui apparaît | Bulle au style réseau social, animation de saut | Reprendre une vraie question reçue | Jamais de faux commentaire ni de faux nom |

Effets déjà en service : trait d'or qui se dessine, mains en maillon avec logo, carte aux épingles reliées, tampon frappé avec léger nuage de poussière (26/10/2026), fenêtre photo éditoriale qui se rétracte, coches synchronisées, volet vertical, poussée latérale, ouverture en cercle vers la carte de fin, globe 3D (prototype du 26/10/2026).

### Étape 8 — Texte à l'écran
- **Mots clés seulement** (2 à 6 mots par plan), au moment exact où la voix les dit ; jamais la transcription complète ; la vidéo reste compréhensible sans le son.
- Zones sûres : texte important entre y = 220 et y = 1600 (sur 1920) ; rien d'essentiel dans les 120 px de droite entre y = 900 et y = 1500.
- Apostrophes typographiques (’), accents vérifiés.

### Étape 9 — Son
1. Voix d'origine, sans retouche, calée à 0 s.
2. Musique : nappe originale générée en code (zéro crédit), baissée sous la voix, fondue à la fin.
3. Bruitages : générés en code (souffles, impacts, coches) à −10 dB (`sfx *= 0.316`) ; bruitages réalistes (tampon, avion, porte) tirés de la bibliothèque ElevenLabs quand elle existe. Aucun « ding ».
4. Niveau final −14 LUFS visé (−15 mesuré), crête sous −1,5 dB, AAC 192 kb/s, 48 kHz.

### Étape 10 — Rendu
1. `npm install`, puis `python3 make_photos.py` (images en data URI).
2. `npx remotion bundle src/index.ts --out-dir build`, puis rendu par morceaux de 60 images (`render_p01.sh`), Chromium préinstallé, `--gl=swiftshader` pour la 3D.
3. Une retouche limitée se re-rend sur les seuls morceaux concernés (`render_p01_patch.sh`), puis concaténation.

### Étape 11 — Contrôle avant envoi (bloquant)
1. Planche d'une image par seconde, puis chaque transition image par image.
2. Synchronisation voix : corrélation avec la voix d'origine, écart attendu 0 ms.
3. Chaque mot à l'écran tombe sur le mot dit (écart sous 0,15 s).
4. Orthographe, accents, apostrophes.
5. Niveaux : bruitages nettement sous la voix, aucune saturation.
6. Logo net, un seul soulignement, aucun cercle.
7. Durée entre 15 et 30 s.
8. Test « inconnu » : sans le son, comprend-on à qui ça parle, de quoi, et quoi faire ?

### Étape 12 — Envoi à Amine et retouches
- Vidéo envoyée dans la conversation avec 3 à 5 lignes.
- Choix esthétique ouvert : deux aperçus en image avant le rendu complet.
- Retouche de son seul : remixage en quelques minutes ; retouche d'image : re-rendu des morceaux concernés (10 à 30 min).

### Étape 13 — Publication
**Légende (modèle)** :
```
[émoji] Accroche : la question de la vidéo.

Problème en 2 phrases.

Avec le Pack [nom], [ce que nous faisons], en 3 ou 4 points numérotés.

À la fin, [résultat].

✨ Vous restez chez vous, nous gérons le reste.

👉 Réservez votre appel découverte gratuit, lien en bio ou sur www.moconseildz.com

#4 à 5 hashtags
```
Plus : premier commentaire (une vraie question au lecteur), titre TikTok, texte alternatif, texte LinkedIn (plus posé, sans émoji, termine par moconseildz.com), **lieu : Alger**.

**Mardi (publication manuelle par Amine)** : Claude dépose vidéo, couverture et `legende.txt` dans Drive › Posts › `AAAA-MM-JJ-mardi-sujet`, met le Calendrier en « À publier à la main », crée deux rappels (lundi 18h, mardi 18h15). Amine publie à 19h sur Instagram (Reel), Facebook (Reel), TikTok et LinkedIn, ajoute le lieu « Alger », puis confirme : statut « Publié ».

**Autres jours (Metricool)** : `createScheduledPost` (marque 7184987, Europe/Zurich), Instagram REEL, Facebook REEL, TikTok selon le quota ; `isAiGenerated: false`, `isAigc: false` ; `videoCoverMilliseconds` sur l'image d'accroche ; brouillon par défaut, programmation directe sur demande d'Amine.
- **Lieu** : l'outil Metricool de Claude ne sait pas encore ajouter un lieu. Dans Metricool (web) : ouvrir le post › icône d'épingle › « Alger ». Possible pour les posts et Reels Instagram et les posts de page Facebook (pas les Reels Facebook). TikTok : dans l'application. Claude peut aussi le faire depuis le navigateur de l'ordinateur d'Amine quand il est relié.
- Calendrier : ligne complète (colonnes A à Z), lien des médias en Z, texte LinkedIn en X.
- Drive : copie par le script `copierVisuels` ; toujours vérifier, sinon dépôt (fiche `ajouter`), contrôle du journal, puis vidage du dépôt.

### Étape 14 — Mesure à J+7
Metricool (analytique) : portée, durée moyenne de visionnage, enregistrements, partages, clics sur le lien. On note dans le Calendrier (colonne U) et on ajuste l'accroche suivante (type d'action, premier mot, image).

---

## 6. Délais indicatifs

| Étape | Durée indicative |
|---|---|
| Script et storyboard | 30 à 60 min, plus la validation d'Amine |
| Voix | 5 à 15 min (manuel) ; 2 à 5 min (connecteur) |
| Calage de la voix | 10 à 20 min |
| Animation d'une nouvelle vidéo | 2 à 4 h (3D et effets) ; 1 h en réutilisant un modèle |
| Rendu | 5 à 20 min pour 30 s (3D : jusqu'à 30 min) |
| Contrôle, envoi, publication | 30 min |

## 7. Coûts

| Poste | Coût indicatif |
|---|---|
| ElevenLabs | Environ 1 000 crédits pour 30 s de voix avec essais ; bibliothèque de bruitages : coût unique, estimé avant génération. |
| Metricool | Formule gratuite : 20 publications par mois (une vidéo sur 3 réseaux = 3) ; le mardi manuel ne compte pas. |
| Photos, textures, musique, bruitages en code | Gratuits (licences notées au registre). |
| Remotion, Three.js | Gratuits pour une petite structure (licence Remotion d'entreprise au-delà de 3 personnes). |

## 8. Résultat attendu
MP4 1080 × 1920, 30 images par seconde, 15 à 30 s, son intégré (voix, musique, bruitages), −14 à −15 LUFS ; couverture JPEG ; légende complète ; publication programmée ou prête pour le mardi ; ligne du Calendrier ; copie dans Drive › Posts ; fiche `fiche.json` dans `posts/`.

## 9. À qui transmettre
Amine (validation, publication du mardi, LinkedIn) ; Metricool ; Drive › Posts ; Calendrier. Emily : rien à faire, sauf si on lui demande des photos.

## 10. Risques et erreurs fréquentes

| Risque | Parade |
|---|---|
| Vidéo trop longue | Script de 75 à 85 mots ; Speed 1,05 sur la voix « Femme » ; contrôle de durée bloquant. |
| Images « qui bougent juste un peu » | Au moins une action 3D ou un objet animé par vidéo, dès la première seconde. |
| 3D lente ou noire au rendu | `--gl=swiftshader`, textures en data URI, rendu par morceaux. |
| Crédits ElevenLabs épuisés | Lecture des crédits avant chaque génération ; 2 essais au plus ; réserve de 3 000 crédits. |
| Voix robotique | Toujours ElevenLabs pour une vidéo publiée (Kokoro sert seulement au calage). |
| Texte décalé de la voix | Alignement mot à mot et contrôle de corrélation. |
| Bruitages trop forts, « ding » | −10 dB, bruitages en cloche bannis. |
| Logo qui « bave » | Pas de halo ; masque à l'intérieur, filtre à l'extérieur. |
| Promesse trop forte | Modèle 6 temps ; résultat sur ce que nous maîtrisons. |
| Lieu oublié | Case « Lieu : Alger » dans la légende et rappel à la publication. |
| Lien non cliquable sur Instagram | « lien en bio » reste le chemin principal ; l'adresse du site est lisible et cliquable sur Facebook et LinkedIn. |
| Faux commentaire ou faux cas client | Interdit : seulement des questions réellement reçues ou présentées comme exemples. |
| Sources perdues | Tout est dans `outils/video/` du dépôt `moconseil-medias`. |

## 11. Cas particuliers
- **Vidéo sans voix** : musique et bruitages, texte plus complet (3,5 à 4,5 s de lecture par idée) ; modèle : certificat négatif du 22/10/2026.
- **Voix plus longue que 30 s** : raccourcir le script plutôt que d'accélérer au-delà de Speed 1,1.
- **Format 16:9** (site, YouTube) : même script, mise en page horizontale à reconstruire.
- **Publicité** : version 15 s (accroche, pack, promesse) à partir de la même animation.
- **Vidéo de présentation** (sans pack) : même direction artistique, 6 temps adaptés (situation, problème, nous, nos packs, méthode, promesse).

## 12. Optimisations possibles
- Un modèle Remotion paramétré par un fichier JSON (script, temps des mots, images, effets choisis) pour produire une vidéo de la série en moins d'une heure.
- Bibliothèque de bruitages ElevenLabs générée une fois et réutilisée.
- Globe 3D et plan signature réutilisables comme « marque sonore et visuelle » de la série.
- Déclinaisons automatiques : 16:9 pour le site, 15 s pour la publicité, image de couverture pour Pinterest et le site.
- Tests d'accroche mesurés à J+7 (type d'action, premier mot).
- Plus tard : vidéo générée (Higgsfield et autre outil évoqué par Amine) pour les mains et silhouettes, dans le respect de la règle 9.

---

## Annexe A — Dossier d'une publication
`posts/AAAA-MM-JJ-jour-sujet/` : vidéo MP4, couverture JPEG, `legende.txt` (légende, premier commentaire, titre TikTok, texte alternatif, texte LinkedIn, lieu), `fiche.json` (date, objectif, pilier, pack, voix, texte de la voix, photos, sources, historique).

## Annexe B — Prompt de déconstruction d'une vidéo de référence (adapté)
« Agis comme directeur de motion design. Phase 1 : décompose la vidéo plan par plan (temps de début et de fin, cadrage et caméra, sujet, typographie exacte, palette en hex et lumière, éléments d'interface, transition, son), puis résume la durée, le rythme, le style en une ligne et les motifs récurrents. Phase 2 : transforme cette analyse en un storyboard pour notre montage (Remotion), en remplaçant chaque élément par la charte M&O Conseil (logo, couleurs, texte du script), sans copier les images, le texte ni la musique d'origine. Tout ce qui n'est pas remplacé reste fidèle à la logique visuelle de la référence. »

## Annexe C — Repères techniques internes (ne pas transmettre hors de l'équipe)
- Metricool : marque 7184987, fuseau Europe/Zurich.
- Calendrier réseaux : Google Sheets `1Wq51J4FI5z1DxpW9sGjTSMzkkKuvdu-EAceEFElZIUE` (onglets « Publications », « Quota du mois »).
- Drive › Posts : dossier `1t-NqtgXp_GMNeBXaHD-xENUPhEVPhNBV`.
- Journal du dépôt : `1auxApUwxNO1vBiCiMUER_gGQ9C-ybbSC9VjUmv7HwCA`.
- Dépôts : `merabamine-glitch/moconseil-medias` (public), `moconseil-depot` (privé).

## Historique
- v1.0 (23/10/2026) : recette issue de la vidéo de présentation.
- v1.1 (23/10/2026) : modèle de script en 6 temps, mardi publié à la main.
- v2.2 (26/10/2026, 19h) : règles 13 (premier plan sans animation ajoutée), 14 (légende orientée appel uniquement), 15 (ciel bleuté).
- v2.1 (26/10/2026, 13h) : durée 20 s en moyenne, 30 s au maximum ; voix générées par Claude via le connecteur ElevenLabs (identifiants des voix, une prise par défaut, téléchargement).
- v2.0 (26/10/2026) : guide complet : durée 15 à 30 s, voix alternées, site et lieu dans chaque publication, direction « cinéma 3D réaliste », bibliothèque des 16 effets, méthode de déconstruction, outils et skills, règles d'or.
