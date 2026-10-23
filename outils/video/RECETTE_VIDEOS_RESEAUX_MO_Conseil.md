# RECETTE — Vidéos réseaux sociaux avec voix off (M&O Conseil)

**Version 1.0 — 23 octobre 2026.** Méthode validée par Amine avec la vidéo de présentation du 27/10/2026 (`posts/2026-10-27-mardi-presentation-mo-conseil/`). À relire en entier avant toute nouvelle vidéo. Elle complète la procédure de publication (`claude/PROCEDURE_PUBLICATIONS_RESEAUX.md`), qui reste la règle pour le texte des posts, le Calendrier et Metricool.

Copies : projet Claude `claude/RECETTE_VIDEOS_RESEAUX_MO_Conseil.md` ; Drive › Amine M&O Conseil › RÉSEAUX SOCIAUX (Google Doc « RECETTE VIDÉOS RÉSEAUX - M&O Conseil ») ; dépôt `moconseil-medias`, `outils/video/RECETTE_VIDEOS_RESEAUX_MO_Conseil.md`. Une modification se reporte dans les trois.

---

## 1. Objectif

Produire, à partir d'un script et d'une voix ElevenLabs, une vidéo verticale de 25 à 35 secondes qui :
- arrête le défilement dans la première seconde (image, voix et texte en même temps) ;
- fait comprendre, sans le son, à qui elle parle, quel problème elle règle et ce que le client reçoit à la fin ;
- donne une image premium, sérieuse et humaine du cabinet, jamais « générique IA » ;
- se termine sur un seul appel à l'action : l'appel découverte.

## 2. Acteurs

| Qui | Rôle |
|---|---|
| Amine | Choisit le sujet ou valide la liste ; génère la voix dans ElevenLabs ; fournit des photos si besoin ; valide la vidéo ; publie à la main sur LinkedIn. |
| Claude | Écrit le script ; prépare les images ; cale la vidéo sur la voix ; mixe le son ; rend, vérifie, dépose (GitHub, Metricool, Calendrier, Drive). |
| ElevenLabs (elevenlabs.io, compte d'Amine) | Génère la voix off. Claude n'y a pas accès : le réseau de son espace de travail bloque le site, et le connecteur ElevenLabs de Claude sert aux agents vocaux, pas aux voix off. |
| Metricool | Publie sur Instagram, Facebook et TikTok à la date choisie. |
| Script Google `copierVisuels` | Copie la vidéo dans Drive › RÉSEAUX SOCIAUX › Posts dans l'heure qui suit le passage du statut à « Programmé ». |

## 3. Matériel nécessaire

| Élément | Où le trouver |
|---|---|
| Script validé (texte de la voix, mots à l'écran, plans) | Document des scripts vidéo (projet et Drive), ou écrit dans la conversation |
| Fichier audio de la voix (MP3) | Amine, depuis ElevenLabs (bouton de téléchargement sous la génération) |
| Photos réelles | Banque du site `banque/site/` et banque d'Amine `banque/drive/` du dépôt `moconseil-medias` ; Drive › RÉSEAUX SOCIAUX › Banque photos ; photos envoyées dans la conversation |
| Logos, polices, outillage | `outils/video/` du dépôt `moconseil-medias` (logos clair et couleur, Manrope, Cormorant Garamond, projet Remotion, scripts audio) |
| Catalogue des packs | Projet Claude, « CATALOGUE DES PACKS DE SERVICE - MO CONSEIL.pdf » (contenu exact de chaque pack) |
| Faits réglementaires | `claude/VEILLE_REGLEMENTAIRE.md` ou source officielle de moins de 90 jours (procédure §0) |

## 4. Skills à charger avant d'écrire (outil Skill)

Obligatoires pour toute vidéo :
- `marketing-skills:video` : production vidéo, choix Remotion, rythme ;
- `marketing-skills:social` : règle des 3 secondes (accroche visuelle + verbale + texte), formats Reels et TikTok, sous-titrage ;
- `marketing-skills:copywriting` : clarté, bénéfice final, chasse aux tics d'écriture IA ;
- `marketing-skills:marketing-psychology` : un levier honnête par vidéo (similarité, aversion à la perte, autorité, réciprocité…) ;
- `marketing-skills:copy-editing` : relecture du script et de la légende.

Selon le besoin :
- `marketing-skills:ad-creative` : si la vidéo sert aussi de publicité ;
- `marketing-skills:image` : choix et traitement des photos ;
- `marketing-skills:product-marketing` et `marketing-skills:offers` : formuler ce que contient un pack et ce que le client reçoit ;
- `marketing-skills:customer-research` : vocabulaire réel de la diaspora (commentaires, questions reçues) ;
- `ui-ux-pro-max:brand` et `brand-guidelines` : contrôle de cohérence avec la charte ;
- `design:design-critique` : regard critique sur la planche de contrôle avant le rendu final.

## 5. Déroulé, étape par étape

### Étape 1 — Script (Claude, puis validation d'Amine)

1. Écrire d'abord les trois réponses du test du premier regard : à qui, quel problème, quelle action.
2. Structure d'une vidéo de pack (30 s, 70 à 85 mots) :
   - 0–3 s, **accroche** : la cible et sa situation, en une phrase (« Vous voulez créer votre société en Algérie, sans quitter l'Europe ? »).
   - 3–8 s, **problème** : ce que coûte la démarche menée seul, à distance.
   - 8–12 s, **qui nous sommes** : une phrase (« M et O Conseil : une équipe en Europe, une équipe en Algérie. »).
   - 12–22 s, **ce que contient le pack** : trois ou quatre éléments concrets, tirés du catalogue.
   - 22–26 s, **ce que vous recevez à la fin** : le résultat tangible (une société immatriculée, un bien enregistré à votre nom…).
   - 26–31 s, **promesse et appel** : « Vous restez chez vous, nous gérons le reste. » puis l'appel découverte.
3. Écrire pour l'oreille : phrases courtes, virgules aux respirations, points de suspension pour une pause longue, aucun point au milieu d'une idée. « M et O Conseil » s'écrit ainsi pour être bien prononcé.
4. Interdits (procédure §4 E) : « ce n'est pas X, c'est Y », listes de négations, questions qu'on se pose pour y répondre soi-même, tirets cadratins, superlatifs non prouvés, « devis », « garantie », prénoms de l'équipe, faits réglementaires non vérifiés.
5. **Honnêteté sur l'effort du client.** On dit « vous restez chez vous » ; on ne dit jamais « vous n'avez rien à faire » quand une démarche personnelle subsiste (signer une procuration au consulat, présence exigée par une banque ou à la douane). Formule juste : « De votre côté : une procuration, signée près de chez vous. Le reste, nous le menons sur place. » Les cas où une présence reste exigée (banque, douane) sont expliqués pendant l'appel découverte.
6. Écrire à côté de chaque phrase les **mots clés à l'écran** (2 à 6 mots par plan, jamais la phrase entière) et la **photo** du plan.
7. Soumettre le script à Amine. Il le valide ou le corrige avant de générer la voix.

### Étape 2 — Voix (Amine, dans ElevenLabs)

1. elevenlabs.io › Text to Speech. Modèle **Eleven v3** (ou le plus récent proposé). Mode **Naturel**.
2. Voix : la voix féminine créée par Amine (Voice Design). Description de référence, si elle doit être recréée :
   « A French woman in her early 30s, native Parisian accent, upbeat, bright and genuinely motivating. Smooth, warm mid-range timbre with a clear smile in the voice and lively, energetic delivery that makes people want to keep listening. Confident and inspiring, like an enthusiastic trusted advisor presenting a premium service to a high-end clientele. Natural conversational rhythm with expressive intonation, small pauses before key words, clear articulation. Dynamic but never shouting, never sales-pitchy, never robotic, never over-acted. Studio-quality, intimate microphone, no background noise. »
3. Réglages de référence : Stability environ 35 à 50 %, Style 20 à 30 %, Speed 1.
4. Balises de ton (Eleven v3, entre crochets, non lues) : `[warmly]`, `[confident]`, `[reassuring]`, `[smiling]`, `[upbeat]`, `[energetic]`, `[short pause]`. Une par ligne au plus. Trop théâtral : on enlève la balise ; trop plat : on essaie `[excited]`.
5. Coller tout le script en une fois (un seul fichier) ou une ligne par fichier, puis télécharger le MP3 et l'envoyer dans la conversation.
5 bis. **Licence (bloquant).** Générer la voix **pendant un abonnement payant actif** (Starter au minimum) et avec un modèle qui n'est pas marqué « alpha » ou « bêta » : une voix générée avec le plan gratuit, ou avec un service en bêta, ne peut pas être utilisée dans une publication commerciale, même après passage à un plan payant (aide ElevenLabs lue le 23/10/2026).
6. Coût indicatif : environ 1 000 crédits pour 30 s avec quelques essais (le compte affichait 8 779 crédits le 23/10/2026).

### Étape 3 — Analyse de la voix (Claude)

1. Durée, niveau, pauses (`ffmpeg`, enveloppe d'énergie).
2. Position de chaque mot : `outils/video/voix/align.py` (synthèse de référence Kokoro + alignement DTW sur les MFCC), contrôlée par les pauses et les attaques détectées. Précision visée : moins de 0,1 s.
3. Écrire la table de correspondance des repères (mot → instant) : `src/warp.ts` pour adapter un montage existant, ou directement les temps des mots dans les scènes d'une nouvelle vidéo.

### Étape 4 — Images : cohérence avec le texte

1. **Une image par idée, et l'image illustre ce que dit la voix à cet instant.** Exemples validés : « vous vivez à l'étranger » → avion qui décolle entre deux immeubles ; « Algérie » → Maqam Echahid ; « quelqu'un de confiance » → poignée de main ; « c'est ce trait d'union » → mains en maillon ; « une équipe en Europe, une équipe en Algérie » → carte avec épingles ; « dix packs » → mosaïque des photos des packs ; « vous restez chez vous » → avion au sol au couchant.
2. Photos réelles uniquement : jamais d'image générée par IA d'un lieu réel, jamais de personne reconnaissable sans accord, aucun visage inventé.
3. Une photo ne revient pas dans deux plans de la même vidéo (sauf rappel volontaire en fin de vidéo).
4. Photo nouvelle d'Amine : la copier dans `public/img/` du projet vidéo et dans `banque/drive/` avec une ligne au registre.
5. Les étiquettes et petits éléments qu'Amine a vus et aimés ne disparaissent pas lors d'une retouche, sauf demande : on lui demande avant de retirer quoi que ce soit (leçon du 23/10 : étiquettes « Europe / Algérie »).

### Étape 5 — Montage (Claude, Remotion)

Direction artistique validée :
- **Fil conducteur** : le trait d'union doré (traînées de l'avion, trait d'or, trait sous le logo).
- **Caméra** : toujours en mouvement lent (poussée, travelling, légère rotation) ; aucune image figée plus de 0,5 s.
- **Typographie** : Manrope 700–800 pour l'information (marine sur fond clair, blanc sur photo sombre) ; Cormorant Garamond italique or pour le mot émotion (« à l'étranger », « Algérie », « confiance », « définitif », « le reste »).
- **Couleurs** : marine #1B2A41, nuit #0E1726, or #C9A24B, or clair #E9CF8E, or foncé sur fond clair #9C7726, pierre #F4EFE6.
- **Texte à l'écran = appui, pas sous-titre** : on affiche les mots clés au moment exact où la voix les dit ; la vidéo reste compréhensible sans le son ; jamais la transcription complète.
- **Soulignement** : un trait à la main sous le mot clé, oui ; un cercle autour d'un mot, non (jugé laid par Amine le 23/10).
- **Logo** : net, sans halo ni ombre lumineuse (un halo coupé par le masque fait un rectangle qui « bave »). Le logo contient déjà son petit trait sous « CONSEIL » : ne pas en ajouter un second.
- **Transitions** (une par changement de plan, sur le temps de la voix) : panoramique éclair vers le haut avec flou de mouvement ; photo plein cadre qui se rétracte en fenêtre éditoriale ; volet vertical entre items ; poussée latérale ; zoom traversant ; volet vers le haut ; ouverture en cercle vers la carte de fin.
- **Rythme** : un plan toutes les 2 à 4 secondes ; la voix démarre dans la première demi-seconde.
- **Carte de fin (validée le 23/10, proposition A « nuit et or »)** : fond bleu nuit en dégradé, logo clair net, signature « Le trait d'union avec votre » / « Algérie. » (Cormorant italique or clair, lueur douce), bouton doré « Réserver un appel découverte → » avec reflet, moconseildz.com en or clair. Le bouton reste au moins 2 secondes à l'écran après la dernière phrase.
- **Zones sûres** : texte important entre y = 220 et y = 1600 (sur 1920) ; rien d'essentiel dans les 120 px de droite entre y = 900 et y = 1500.

Technique (projet `outils/video/` du dépôt) :
1. `npm install` (Remotion 4), puis `python3 make_photos.py` pour régénérer `src/photos.ts` à partir de `public/img/`.
2. Polices, logos et photos intégrés en data URI (aucun chargement réseau pendant le rendu).
3. Scènes : `src/scenes4.tsx` (dernière version de la présentation) sert de modèle de composants (`Photo`, `Mask`, `Word`, `Accent`, `Spark`, `Particles`, `Pin`). Chaque mot apparaît à l'instant mesuré à l'étape 3.
4. Rendu : `npx remotion bundle src/index.ts --out-dir build`, puis rendu par morceaux de 60 images, une image à la fois (`render5.sh`), avec le Chromium préinstallé. Compter 5 à 20 minutes pour 30 s.

### Étape 6 — Son (Claude)

1. **Voix** : le fichier d'Amine, sans retouche, calé à 0 s.
2. **Musique** : nappe douce originale, libre de droits (accords tenus, pulsation légère), baissée d'environ 7 à 8 dB sous la voix (ducking automatique) et fondue en fin de vidéo. Pour une vidéo sans voix : musique lo-fi originale (`audio/musique_chill.py`, 80 BPM).
3. **Bruitages** (souffle de transition, passage d'avion, coches, clics, impact doux) : **à −10 dB par rapport au niveau d'origine des scripts** (`sfx *= 0.316` dans `audio/build_audio6.py`). Leçon du 23/10 : à −6 dB, Amine ne percevait pas la baisse ; l'oreille juge « moitié moins fort » vers −10 dB.
4. **Pas de « ding »** ni de scintillement en cloche (supprimés le 23/10).
5. Niveau final : normalisation à −14 LUFS visée (−15 mesuré), crête sous −1,5 dB, AAC 192 kb/s, 48 kHz.

### Étape 7 — Contrôle avant envoi (bloquant)

1. Planche d'images (une toutes les 0,5 à 1 s) regardée en entier, puis chaque transition image par image.
2. Synchronisation : corrélation entre la voix d'origine et le son final, écart attendu 0 ms.
3. Chaque mot à l'écran tombe sur le mot dit (écart inférieur à 0,15 s).
4. Orthographe, accents, apostrophes typographiques (’).
5. Niveaux : bruitages nettement sous la voix ; aucune saturation.
6. Logo net, un seul soulignement, aucun cercle autour d'un mot.
7. Relecture « inconnu » : sans le son, comprend-on à qui ça parle, de quoi, et que faire ?

### Étape 8 — Envoi à Amine et retouches

- Vidéo envoyée en fichier dans la conversation, avec 3 à 5 lignes sur ce qui a été fait.
- Pour un choix esthétique ouvert (carte de fin, couleur…), envoyer **deux aperçus en image** et attendre son choix avant le rendu complet.
- Une retouche de son seul se fait sans nouveau rendu de l'image (remixage et remultiplexage en quelques minutes).

### Étape 9 — Publication (après validation d'Amine)

1. Dépôt GitHub `moconseil-medias` : dossier `posts/AAAA-MM-JJ-jour-titre-du-post/` avec la vidéo, une couverture JPEG (image d'accroche) et `fiche.json` (texte de la voix, photos, historique). Vérifier les liens bruts (200).
2. Metricool (`createScheduledPost`, marque 7184987, fuseau Europe/Zurich) : Instagram REEL, Facebook REEL, TikTok si le quota le permet ; légende, premier commentaire, texte alternatif, `videoCoverMilliseconds` sur l'image d'accroche.
   - **Mention « contenu IA » : jamais cochée** (décision d'Amine du 23/10/2026) : `instagramData.isAiGenerated: false`, `tiktokData.isAigc: false`, `youtubeData.isAiGeneratedContent: false`, sur tous les posts.
   - Son intégré : aucune musique Instagram à ajouter (`audioConfiguration` absent), `autoAddMusic: false` sur TikTok.
   - Brouillon (`draft: true`) par défaut ; programmation directe (`draft: false`) seulement quand Amine le demande.
3. Calendrier réseaux, onglet « Publications » : ligne complète (colonnes A à Z), statut « Programmé », lien de la vidéo en colonne Z, texte LinkedIn en colonne X.
4. Drive : le script Google copie la vidéo dans Drive › RÉSEAUX SOCIAUX › Posts › `AAAA-MM-JJ-jour-titre-du-post` dans l'heure. Pour un dépôt immédiat ou un autre dossier : dépôt privé `moconseil-depot` (fiche `ajouter`).
5. LinkedIn : publication manuelle par Amine (vidéo + texte de la colonne X).

## 6. Délais indicatifs

| Étape | Durée indicative |
|---|---|
| Script (Claude) | 20 à 40 min par vidéo, plus la validation d'Amine |
| Voix (Amine, ElevenLabs) | 5 à 15 min par vidéo, selon le nombre d'essais |
| Analyse de la voix et calage | 10 à 20 min |
| Montage d'une nouvelle vidéo | 1 à 3 h (adaptation d'un modèle existant : 30 à 60 min) |
| Rendu | 5 à 20 min pour 30 s |
| Contrôle et envoi | 15 min |
| Publication (GitHub, Metricool, Calendrier) | 10 à 15 min |

## 7. Coûts

| Poste | Coût indicatif |
|---|---|
| ElevenLabs | **Abonnement payant obligatoire** (Starter : 6 $ par mois, ou 5 $ par mois en annuel, 30 000 crédits, tarif relevé le 23/10/2026). Le plan gratuit n'a pas de licence commerciale, et une voix générée hors abonnement payant reste non commerciale même après passage à un plan payant (aide ElevenLabs, « Can I publish the content I generate on the platform? », lue le 23/10/2026). Environ 1 000 crédits pour 30 s avec essais. |
| Metricool | Formule gratuite : 20 publications par mois, comptées par réseau (une vidéo sur Instagram, Facebook et TikTok = 3). |
| Photos | Gratuites (banque du site, photos d'Amine libres de droit). |
| Musique et bruitages | Gratuits (compositions originales générées par script, libres de droits). |
| Remotion | Gratuit pour une petite structure (licence d'entreprise au-delà de 3 personnes : à vérifier si l'équipe grandit). |

## 8. Résultat attendu

Un fichier MP4 1080 × 1920, 25 à 35 s, son intégré (voix, musique, bruitages), −14 à −15 LUFS ; une couverture JPEG ; un post programmé sur Instagram, Facebook et TikTok ; une ligne complète au Calendrier ; une copie dans Drive › Posts.

## 9. À qui transmettre

- Amine : la vidéo dans la conversation (validation), puis le texte LinkedIn et la vidéo pour la publication manuelle.
- Metricool : le post (Instagram, Facebook, TikTok).
- Drive › Posts : copie automatique.
- Emily : rien à faire ; elle voit les posts publiés comme tout abonné.

## 10. Risques et erreurs fréquentes

| Risque | Parade |
|---|---|
| Voix robotique (voix locale Kokoro) | Toujours ElevenLabs pour une vidéo publiée. |
| Texte qui ne tombe pas sur la voix | Alignement mot à mot (étape 3) et contrôle de corrélation (étape 7). |
| Bruitages trop forts | −10 dB par défaut ; réécouter sur téléphone. |
| Bruit de cloche, scintillement | Banni. |
| Logo qui « bave » (halo coupé par le masque) | Pas de halo sur le logo ; masque appliqué à l'intérieur, filtre à l'extérieur. |
| Carte de fin fade, peu contrastée | Carte « nuit et or » validée. |
| Double soulignement sous « CONSEIL » | Le logo a déjà son trait : ne pas en ajouter. |
| Élément aimé retiré lors d'une retouche | Demander avant de retirer. |
| Promesse « vous n'avez rien à faire » fausse | Nommer ce qui reste au client (procuration ; présence parfois exigée par une banque ou à la douane). |
| Fait réglementaire non vérifié dans la voix | Registre de veille ou source officielle ; sinon on retire la phrase. |
| Quota Metricool dépassé | Lire « Quota du mois » avant d'inclure TikTok. |
| Voix générée avec le plan gratuit ElevenLabs (pas de licence commerciale) | Abonnement payant actif au moment de la génération ; sinon régénérer la voix après abonnement. |
| Sources perdues en fin de session | Tout le projet vidéo est dans `outils/video/` du dépôt `moconseil-medias`. |

## 11. Cas particuliers

- **Vidéo sans voix** (texte qui défile) : musique lo-fi originale et bruitages ; texte plus complet à l'écran (3,5 à 4,5 s de lecture par idée) ; modèle : vidéo du certificat négatif du 22/10/2026 (`src/certificat.tsx`).
- **Voix livrée phrase par phrase** : caler chaque fichier sur le début de son plan, en laissant 0,2 à 0,4 s de respiration.
- **Voix plus longue que prévu** : allonger les plans concernés plutôt que de couper la voix ; durée maximale conseillée 35 s.
- **Format 16:9** (site, YouTube) : même script, mise en page horizontale à reconstruire (logo et textes recentrés).
- **Sous-titres intégraux** (si Amine les demande) : ajouter une piste de sous-titres en bas de la zone sûre, 2 lignes au plus, en plus des mots clés.

## 12. Optimisations possibles

- Une série « Un pack en 30 secondes » (10 vidéos, une par pack) réutilisable sur le site (pages des packs), dans les e-mails après l'appel découverte et en publicité.
- Un modèle Remotion unique paramétré (script, photos, temps des mots dans un fichier JSON) pour produire chaque vidéo de la série en moins d'une heure.
- Enregistrer dans ElevenLabs la voix avec ses réglages pour garder la même voix sur toute la série.
- Mesurer à J+7 la rétention (durée moyenne de visionnage) et les enregistrements, puis ajuster l'accroche des vidéos suivantes.
- Tester deux accroches (image et première phrase) sur deux vidéos proches.
