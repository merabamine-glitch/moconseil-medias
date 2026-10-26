# Scripts v3 (26/10/2026) : 15 à 30 s, modèle en 6 temps, voix alternées (homme / femme)
import re, json
FIN = ["[warmly] Vous restez chez vous, nous gérons le reste.", "[smiling] Réservez votre appel découverte."]
SAL = "sans que vous ayez à vous déplacer."
SIG = ", c'est exactement ce que fait M et O Conseil."  # l'écran montre « une équipe en Europe, une équipe en Algérie »
P = [
 dict(n=2, nom="Pack Suivi de Société", voix="Femme", fic="pack-02-suivi",
  acc="Votre société est en Algérie, et vous vivez en Europe ?",
  pb="Chaque mois, des déclarations à déposer… et personne sur place pour tenir les délais.",
  tr="Tenir ces délais" + SIG,
  pk="Avec le Pack Suivi de Société, notre expert-comptable dépose vos déclarations à temps, " + SAL,
  ob="Chaque mois, ce que vous obtenez, c'est une société à jour."),
 dict(n=3, nom="Pack Retour Définitif", voix="Homme", fic="pack-03-retour",
  acc="Vous préparez votre retour définitif en Algérie ?",
  pb="Logement, banque, voiture : tout doit être prêt, et vous êtes encore à l'étranger.",
  tr="Tout préparer à distance" + SIG,
  pk="Avec le Pack Retour Définitif, nous préparons votre dossier consulaire et trouvons votre logement, sans que vous ayez à faire l'aller-retour.",
  ob="À la fin, ce que vous obtenez, c'est un logement prêt à votre arrivée."),
 dict(n=4, nom="Pack Achat Immobilier", voix="Femme", fic="pack-04-achat",
  acc="Vous voulez acheter un bien en Algérie, depuis l'Europe ?",
  pb="Le risque se cache dans le titre de propriété… et d'ici, impossible de le vérifier.",
  tr="Vérifier sur place" + SIG,
  pk="Avec le Pack Achat Immobilier, nous vérifions le titre et signons l'acte en votre nom, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un bien à votre nom."),
 dict(n=5, nom="Pack Conciergerie", voix="Homme", fic="pack-05-conciergerie",
  acc="Vous avez un bien en Algérie… et personne pour s'en occuper ?",
  pb="Une facture, du courrier, un artisan : à chaque fois, il faut solliciter un proche.",
  tr="Être ce relais de confiance" + SIG,
  pk="Avec le Pack Conciergerie, un représentant règle vos factures et accueille vos artisans, " + SAL,
  ob="Chaque mois, ce que vous obtenez, c'est un compte rendu avec les justificatifs."),
 dict(n=6, nom="Pack Compte Bancaire", voix="Femme", fic="pack-06-banque",
  acc="Vous envoyez régulièrement de l'argent vers l'Algérie ?",
  pb="Sans compte prêt sur place, un virement peut attendre des semaines.",
  tr="Préparer ce compte pour vous" + SIG,
  pk="Avec le Pack Compte Bancaire, nous ouvrons votre compte en devises et préparons votre dossier, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un compte prêt à recevoir vos virements."),
 dict(n=7, nom="Pack Succession & Transmission", voix="Homme", fic="pack-07-succession",
  acc="Vous héritez d'un bien en Algérie, et la famille vit dans plusieurs pays ?",
  pb="Sans la Fredha, l'acte qui désigne les héritiers, le bien reste bloqué.",
  tr="Débloquer cette succession" + SIG,
  pk="Avec le Pack Succession et Transmission, nous faisons établir la Fredha et coordonnons les héritiers, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un bien prêt à être partagé ou vendu."),
 dict(n=8, nom="Pack Logement & Installation", voix="Femme", fic="pack-08-logement",
  acc="Vous vous installez en Algérie pour plusieurs mois ?",
  pb="Trouver un logement, signer le bail, ouvrir les compteurs… sans rien pouvoir visiter d'ici.",
  tr="Visiter et tout préparer pour vous" + SIG,
  pk="Avec le Pack Logement et Installation, nous visitons, faisons authentifier votre bail et ouvrons vos compteurs, sans que vous ayez à faire l'aller-retour.",
  ob="À la fin, ce que vous obtenez, c'est un logement prêt à votre arrivée."),
 dict(n=9, nom="Pack Reconnaissance de Nationalité", voix="Homme", fic="pack-09-nationalite",
  acc="Un parent algérien… et vous êtes né à l'étranger ?",
  pb="Il faut retrouver des actes, parfois sur deux générations, dans des communes où vous ne connaissez personne.",
  tr="Retrouver ces actes" + SIG,
  pk="Avec le Pack Reconnaissance de Nationalité, nous recherchons vos actes et suivons votre dossier au tribunal, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un dossier complet, suivi jusqu'au certificat."),
 dict(n=10, nom="Pack Scolarisation", voix="Femme", fic="pack-10-scolarisation",
  acc="Vous rentrez en Algérie avec vos enfants… et l'école vous inquiète ?",
  pb="Chaque école a sa période d'inscription… et elle n'attend pas votre retour.",
  tr="Déposer ce dossier à temps" + SIG,
  pk="Avec le Pack Scolarisation, nous choisissons l'école avec vous et déposons l'inscription, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est une inscription déposée à temps."),
]
TAGS = ["[warmly]", "[confident]", "[smiling]", "[upbeat]", "[confident]"]
def texte(p):
    return "\n".join([f"{TAGS[i]} {p[k]}" for i, k in enumerate(["acc", "pb", "tr", "pk", "ob"])] + FIN)
def mots(t):
    return len(re.findall(r"[\wÀ-ÿ'’-]+", re.sub(r'\[[^\]]+\]\s*', '', t)))
RATE = {"Homme": 3.18, "Femme": 3.0}  # mots par seconde mesurés (homme 23/10) ; femme : voix v3 à Speed 1,05
if __name__ == "__main__":
    for p in P:
        w = mots(texte(p)); v = w / RATE[p['voix']]
        print(p['n'], p['voix'], w, 'mots', round(v, 1), 's de voix', round(v + 2.0, 1), 's de vidéo')
    json.dump({p['n']: texte(p) for p in P}, open('/home/claude/scripts10/textes4.json', 'w'), ensure_ascii=False, indent=1)
