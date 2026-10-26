# Scripts v4 « format 20 s » (26/10/2026) : 6 temps, 60 à 68 mots, une action principale dans le pack
import re, json
FIN = ["[warmly] Vous restez chez vous, nous gérons le reste.", "[smiling] Réservez votre appel découverte."]
SAL = "sans que vous ayez à vous déplacer."
SIG = ", c'est exactement ce que fait M et O Conseil."
P = [
 dict(n=3, nom="Pack Retour Définitif", voix="Homme", fic="pack-03-retour",
  acc="Vous préparez votre retour en Algérie ?",
  pb="Logement, banque, voiture : tout doit être prêt avant d'arriver.",
  tr="Tout préparer à distance" + SIG,
  pk="Avec le Pack Retour Définitif, nous organisons chaque démarche, sans que vous ayez à faire l'aller-retour.",
  ob="À la fin, ce que vous obtenez, c'est un logement prêt à votre arrivée."),
 dict(n=4, nom="Pack Achat Immobilier", voix="Femme", fic="pack-04-achat",
  acc="Vous achetez un bien en Algérie, depuis l'Europe ?",
  pb="Le risque se cache dans le titre de propriété.",
  tr="Le vérifier sur place" + SIG,
  pk="Avec le Pack Achat Immobilier, nous vérifions le titre et signons pour vous, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un bien à votre nom."),
 dict(n=5, nom="Pack Conciergerie", voix="Homme", fic="pack-05-conciergerie",
  acc="Un bien en Algérie… et personne pour s'en occuper ?",
  pb="Factures, courrier, artisans : il faut toujours solliciter un proche.",
  tr="Être ce relais de confiance" + SIG,
  pk="Avec le Pack Conciergerie, un représentant s'en charge pour vous, " + SAL,
  ob="Chaque mois, ce que vous obtenez, c'est un compte rendu avec les justificatifs."),
 dict(n=6, nom="Pack Compte Bancaire", voix="Femme", fic="pack-06-banque",
  acc="Vous envoyez de l'argent vers l'Algérie ?",
  pb="Sans compte prêt sur place, un virement peut attendre des semaines.",
  tr="Préparer ce compte" + SIG,
  pk="Avec le Pack Compte Bancaire, nous ouvrons votre compte en devises, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un compte prêt à recevoir vos virements."),
 dict(n=7, nom="Pack Succession & Transmission", voix="Homme", fic="pack-07-succession",
  acc="Vous héritez d'un bien en Algérie ?",
  pb="Sans la Fredha, l'acte qui désigne les héritiers, le bien reste bloqué.",
  tr="Débloquer cette succession" + SIG,
  pk="Avec le Pack Succession et Transmission, nous faisons établir la Fredha, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un bien prêt à être partagé ou vendu."),
 dict(n=8, nom="Pack Logement & Installation", voix="Femme", fic="pack-08-logement",
  acc="Vous vous installez en Algérie ?",
  pb="Logement, bail, compteurs… impossible de tout visiter d'ici.",
  tr="Visiter et préparer pour vous" + SIG,
  pk="Avec le Pack Logement et Installation, nous trouvons votre logement, sans que vous ayez à faire l'aller-retour.",
  ob="À la fin, ce que vous obtenez, c'est un logement prêt à votre arrivée."),
 dict(n=9, nom="Pack Reconnaissance de Nationalité", voix="Homme", fic="pack-09-nationalite",
  acc="Un parent algérien… et vous êtes né à l'étranger ?",
  pb="Il faut retrouver des actes dans des communes où vous ne connaissez personne.",
  tr="Retrouver ces actes" + SIG,
  pk="Avec le Pack Reconnaissance de Nationalité, nous montons votre dossier, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est un dossier suivi jusqu'au certificat."),
 dict(n=10, nom="Pack Scolarisation", voix="Femme", fic="pack-10-scolarisation",
  acc="Vous rentrez en Algérie avec vos enfants ?",
  pb="Chaque école a sa période d'inscription… et elle n'attend pas.",
  tr="Déposer ce dossier à temps" + SIG,
  pk="Avec le Pack Scolarisation, nous inscrivons votre enfant, " + SAL,
  ob="À la fin, ce que vous obtenez, c'est une inscription déposée à temps."),
]
TAGS = ["[warmly]", "[confident]", "[smiling]", "[upbeat]", "[confident]"]
def texte(p): return "\n".join([f"{TAGS[i]} {p[k]}" for i, k in enumerate(["acc", "pb", "tr", "pk", "ob"])] + FIN)
def mots(t): return len(re.findall(r"[\wÀ-ÿ'’-]+", re.sub(r'\[[^\]]+\]\s*', '', t)))
RATE = {"Homme": 3.18, "Femme": 2.86}  # mesuré : Homme 23/10, Femme 26/10 (27,5 s pour 79 mots)
if __name__ == "__main__":
    for p in P:
        w = mots(texte(p)); v = w / RATE[p['voix']]
        print(p['n'], p['voix'], w, 'mots', round(v, 1), 's voix', round(v + 2.0, 1), 's vidéo')
    json.dump({p['n']: texte(p) for p in P}, open('/home/claude/scripts10/textes5.json', 'w'), ensure_ascii=False, indent=1)
