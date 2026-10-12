#!/usr/bin/env python3
"""
Générateur de visuels M&O Conseil — réseaux sociaux.

Usage :
    python3 outils/mo_visuels.py rendre <fiche.json> <dossier_sortie>

La fiche JSON décrit un post (format, gabarit, slides, photos). Le script
produit des PNG 1080 × 1350 (feed) ou un MP4 1080 × 1920 (vidéo).
Toute la charte (couleurs, polices, marges) est définie ici : ne pas la
modifier sans l'accord d'Amine (voir claude/STRATEGIE_EDITORIALE_RESEAUX).
"""
import json, math, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
POL = os.path.join(ICI, "polices")
MARQUE = os.path.join(ICI, "marque")

W, H = 1080, 1350          # feed 4:5
VW, VH = 1080, 1920        # vidéo 9:16
M = 84                     # marge latérale
SUR = int(H * 0.10)        # zone de sécurité haute/basse de la slide 1

# ---------------------------------------------------------------- couleurs
def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

C = {
    "marine": hx("1B2A41"), "nuit": hx("0F1B2D"), "or": hx("C9A24B"),
    "or_clair": hx("E9CF8E"), "pierre": hx("F4EFE6"), "sable": hx("E8DCC6"),
    "encre": hx("1E2430"), "gris": hx("6B6F78"), "blanc": (255, 255, 255),
    # accents secondaires (variété) — à n'utiliser qu'en aplat ou en motif
    "terre": hx("A8502E"), "olive": hx("56634A"), "mer": hx("24627F"),
}

# Ambiances : fond / texte principal / texte secondaire / accent
AMBIANCES = {
    "marine": dict(fond=C["marine"], titre=C["blanc"], texte=C["pierre"], accent=C["or"], logo="clair"),
    "nuit":   dict(fond=C["nuit"], titre=C["blanc"], texte=C["pierre"], accent=C["or"], logo="clair"),
    "pierre": dict(fond=C["pierre"], titre=C["marine"], texte=C["encre"], accent=C["or"], logo="couleur"),
    "sable":  dict(fond=C["sable"], titre=C["marine"], texte=C["encre"], accent=C["terre"], logo="couleur"),
    "terre":  dict(fond=C["terre"], titre=C["blanc"], texte=C["pierre"], accent=C["or_clair"], logo="clair"),
    "olive":  dict(fond=C["olive"], titre=C["blanc"], texte=C["pierre"], accent=C["or_clair"], logo="clair"),
    "mer":    dict(fond=C["mer"], titre=C["blanc"], texte=C["pierre"], accent=C["or_clair"], logo="clair"),
    "blanc":  dict(fond=C["blanc"], titre=C["marine"], texte=C["encre"], accent=C["or"], logo="couleur"),
}

# ---------------------------------------------------------------- polices
_cache = {}
def police(nom, taille):
    cle = (nom, taille)
    if cle in _cache:
        return _cache[cle]
    fichiers = {
        "titre": ("Lora-Variable.ttf", "SemiBold"), "titre_gras": ("Lora-Variable.ttf", "Bold"),
        "titre_ital": ("Lora-Italic-Variable.ttf", "Medium Italic"),
        "leger": ("Poppins-Light.ttf", None), "normal": ("Poppins-Regular.ttf", None),
        "moyen": ("Poppins-Medium.ttf", None), "gras": ("Poppins-Bold.ttf", None),
    }
    fic, var = fichiers[nom]
    f = ImageFont.truetype(os.path.join(POL, fic), taille)
    if var:
        f.set_variation_by_name(var)
    _cache[cle] = f
    return f

# ---------------------------------------------------------------- typographie
def typo(t):
    """Typographie française : apostrophe courbe, espaces insécables."""
    if not t:
        return ""
    t = t.replace("'", "’")
    t = re.sub(r"\s*([?!:;»])", "\u00a0\\1", t)
    t = re.sub(r"«\s*", "«\u00a0", t)
    t = t.replace("\u00a0\u00a0", "\u00a0")
    t = re.sub(r"(\d) (\d{3})", "\\1\u00a0\\2", t)
    return t

def largeur(txt, f, esp=0):
    if not txt:
        return 0
    return f.getlength(txt) + esp * max(len(txt) - 1, 0)

def couper(txt, f, lmax, esp=0):
    """Coupe en lignes ; respecte les \\n explicites ; ne coupe pas après une insécable."""
    lignes = []
    for para in txt.split("\n"):
        mots = para.split(" ")
        cur = ""
        for m in mots:
            essai = (cur + " " + m).strip() if cur else m
            if largeur(essai, f, esp) <= lmax:
                cur = essai
            else:
                if cur:
                    lignes.append(cur)
                cur = m
        lignes.append(cur)
    return lignes

def bloc(d, x, y, txt, nom, taille, couleur, lmax, interl=1.25, max_lignes=None,
         taille_min=None, esp=0, aligne="g", maj=False):
    """Écrit un bloc de texte ; réduit la taille si besoin (jusqu'à taille_min).
    Lève une erreur si le texte ne tient pas : le texte doit être raccourci."""
    txt = typo(txt)
    if maj:
        txt = txt.upper()
    t = taille
    taille_min = taille_min or taille
    while True:
        f = police(nom, t)
        lignes = couper(txt, f, lmax, esp)
        if max_lignes is None or len(lignes) <= max_lignes or t <= taille_min:
            break
        t -= 2
    if max_lignes is not None and len(lignes) > max_lignes:
        raise ValueError(f"TEXTE TROP LONG ({len(lignes)} lignes > {max_lignes}) : « {txt[:60]}… »")
    pas = int(t * interl)
    for i, l in enumerate(lignes):
        lx = x
        if aligne == "c":
            lx = x + (lmax - largeur(l, f, esp)) / 2
        elif aligne == "d":
            lx = x + lmax - largeur(l, f, esp)
        if esp:
            cx = lx
            for ch in l:
                d.text((cx, y + i * pas), ch, font=f, fill=couleur)
                cx += f.getlength(ch) + esp
        else:
            d.text((lx, y + i * pas), l, font=f, fill=couleur)
    return y + len(lignes) * pas, t

def hauteur_bloc(txt, nom, taille, lmax, interl=1.25, esp=0, maj=False):
    txt = typo(txt)
    if maj:
        txt = txt.upper()
    f = police(nom, taille)
    return len(couper(txt, f, lmax, esp)) * int(taille * interl)

# ---------------------------------------------------------------- marque
def logo(img, x, y, larg, variante="couleur"):
    L = Image.open(os.path.join(MARQUE, f"logo-{variante}.png")).convert("RGBA")
    h = int(L.height * larg / L.width)
    L = L.resize((larg, h), Image.LANCZOS)
    img.alpha_composite(L, (int(x), int(y)))
    return h

def filet(d, x, y, l, couleur, ep=3):
    d.rectangle([x, y, x + l, y + ep - 1], fill=couleur)

def compteur(d, i, n, couleur, droite=W - M, y=72):
    if n <= 1:
        return
    f = police("leger", 24)
    t = f"{i}/{n}"
    d.text((droite - f.getlength(t), y), t, font=f, fill=couleur)

def swipe(d, couleur, y=H - 92):
    f = police("moyen", 20)
    t = "GLISSEZ"
    esp = 4
    l = largeur(t, f, esp)
    x = W - M - 56 - l
    cx = x
    for ch in t:
        d.text((cx, y), ch, font=f, fill=couleur)
        cx += f.getlength(ch) + esp
    d.line([(W - M - 44, y + 13), (W - M, y + 13)], fill=couleur, width=2)
    d.line([(W - M - 10, y + 6), (W - M, y + 13), (W - M - 10, y + 20)], fill=couleur, width=2)

def poignee(d, couleur, x=M, y=H - 92):
    d.text((x, y), "@moconseildz", font=police("normal", 22), fill=couleur)

# ---------------------------------------------------------------- photos
def ouvrir_photo(chemin):
    p = chemin if os.path.isabs(chemin) else os.path.join(RACINE, chemin)
    return Image.open(p).convert("RGB")

def recadrer(img, w, h, fx=0.5, fy=0.5):
    """Remplit w×h en recadrant ; fx/fy = point d'intérêt (0–1)."""
    r = max(w / img.width, h / img.height)
    im = img.resize((math.ceil(img.width * r), math.ceil(img.height * r)), Image.LANCZOS)
    x = int((im.width - w) * fx)
    y = int((im.height - h) * fy)
    return im.crop((x, y, x + w, y + h))

def traitement_charte(img):
    """Chaîne de traitement de la charte (§5) : balance chaude, contraste,
    split-tone, saturation, bloom."""
    a = np.asarray(img).astype(np.float32) / 255.0
    a[..., 0] *= 1.081; a[..., 2] *= 0.883
    a = (a - 0.48) * 1.28 + 0.48
    a = np.clip(a, 0, 1)
    L = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    a += ((1 - L) ** 1.5)[..., None] * (np.array([-6, -6, 14]) / 255.0)
    a += (L ** 1.7)[..., None] * (np.array([25, 8, -18]) / 255.0)
    a = np.clip(a, 0, 1)
    g = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])[..., None]
    a = np.clip(g + (a - g) * 1.28, 0, 1)
    L = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    masque = np.clip((L - 0.70) / 0.30, 0, 1) ** 1.5
    lum = Image.fromarray((a * masque[..., None] * 255).astype(np.uint8))
    flou = np.asarray(lum.filter(ImageFilter.GaussianBlur(28))).astype(np.float32) / 255.0
    ecran = 1 - (1 - a) * (1 - flou)
    a = a + (ecran - a) * 0.30
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def traitement_doux(img, chaleur=1.0):
    """Traitement léger, naturel (gabarits photo hors bande)."""
    a = np.asarray(img).astype(np.float32) / 255.0
    a[..., 0] *= 1 + 0.04 * chaleur; a[..., 2] *= 1 - 0.05 * chaleur
    a = (a - 0.5) * 1.10 + 0.5
    g = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])[..., None]
    a = g + (a - g) * 1.12
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

BANDES = {
    "bronze": dict(haut=(44, 23, 9), milieu=(126, 74, 24), bas=(52, 28, 11),
                   titre=C["blanc"], texte=(252, 246, 236), sur=(252, 226, 170), filet=(236, 190, 110)),
    "nuit": dict(haut=(8, 23, 42), milieu=(18, 58, 99), bas=(10, 27, 46),
                 titre=C["blanc"], texte=(246, 242, 234), sur=(238, 201, 122), filet=C["or"]),
}

def rideau(photo, variante):
    """Bande sombre en dégradé (charte §3 et §6), assombrissement multiplicatif."""
    b = BANDES[variante]
    w, h = photo.size
    a = np.asarray(photo).astype(np.float32) / 255.0
    x = np.linspace(0, 1, w)[None, :]
    y = np.linspace(0, 1, h)[:, None]
    t = np.clip((x - 0.34) / (0.96 - 0.34), 0, 1)
    voile = 0.97 * 0.5 * (1 + np.cos(np.pi * t))
    voile = voile + np.clip((y - 0.60) / 0.40, 0, 1) ** 1.5 * 0.62
    voile = voile + np.clip((0.16 - y) / 0.16, 0, 1) ** 1.6 * 0.30
    voile = np.clip(voile, 0, 0.97)
    u = np.clip(y / 0.62, 0, 1)
    v = np.clip((y - 0.62) / 0.38, 0, 1)
    H_, M_, B_ = (np.array(b[k]) / 255.0 for k in ("haut", "milieu", "bas"))
    bande = (H_ + (M_ - H_) * u[..., None]) * (1 - v[..., None]) + B_ * v[..., None]
    bande = np.broadcast_to(bande, (h, w, 3))
    out = a * (1 - voile[..., None]) + bande * (voile[..., None] ** 1.15)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))

def degrade_bas(img, hauteur_frac=0.55, force=0.85, couleur=(10, 16, 26), courbe=1.6):
    w, h = img.size
    a = np.asarray(img).astype(np.float32)
    y = np.linspace(0, 1, h)[:, None]
    v = np.clip((y - (1 - hauteur_frac)) / hauteur_frac, 0, 1) ** courbe * force
    v = np.broadcast_to(v, (h, w))[..., None]
    out = a * (1 - v) + np.array(couleur) * v
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# ---------------------------------------------------------------- motifs
def motif_zellige(w, h, couleur, alpha=60, pas=150, trait=2):
    """Étoiles à huit branches et octogones, en filigrane."""
    calque = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    col = couleur + (alpha,)
    r = pas * 0.42
    for j in range(-1, h // pas + 2):
        for i in range(-1, w // pas + 2):
            cx = i * pas + (pas / 2 if j % 2 else 0)
            cy = j * pas * 0.87
            for rot in (0, math.pi / 4):
                pts = [(cx + r * math.cos(rot + k * math.pi / 2), cy + r * math.sin(rot + k * math.pi / 2)) for k in range(4)]
                d.polygon(pts, outline=col, width=trait)
            ro = r * 0.42
            pts = [(cx + ro * math.cos(math.pi / 8 + k * math.pi / 4), cy + ro * math.sin(math.pi / 8 + k * math.pi / 4)) for k in range(8)]
            d.polygon(pts, outline=col, width=trait)
    return calque

def masque_arche(w, h):
    """Arche outrepassée stylisée (fenêtre photo)."""
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    r = w / 2
    d.rectangle([0, r, w, h], fill=255)
    d.ellipse([0, 0, w, 2 * r], fill=255)
    return m

# ---------------------------------------------------------------- gabarits
def toile(ambiance):
    A = AMBIANCES[ambiance]
    img = Image.new("RGBA", (W, H), A["fond"] + (255,))
    return img, ImageDraw.Draw(img), A

def poser(img, dessin, y_min, y_max, align="centre"):
    """Dessine un bloc sur un calque à partir de y=0, mesure sa hauteur,
    puis le place dans la zone [y_min, y_max] (centré, en haut ou en bas)."""
    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fin = int(dessin(calque, ImageDraw.Draw(calque), 0))
    if fin > y_max - y_min:
        raise ValueError(f"CONTENU TROP LONG : {fin}px pour {y_max - y_min}px disponibles — raccourcir le texte.")
    if align == "centre":
        y = y_min + (y_max - y_min - fin) // 2
    elif align == "bas":
        y = y_max - fin
    else:
        y = y_min
    img.alpha_composite(calque.crop((0, 0, W, max(fin, 1))), (0, y))
    return y, y + fin

def pied(img, d, A, i, n, logo_pos="g"):
    """Éléments fixes : logo sur la couverture, poignée sur les slides intérieures."""
    compteur(d, i, n, A["texte"])
    if i == 1:
        x = M if logo_pos == "g" else W - M - 150
        logo(img, x, H - SUR - 96, 150, A["logo"])
        if n > 1:
            swipe(d, A["titre"])
    else:
        poignee(d, A["texte"])

def cta_final(img, d, A, s):
    """Dernière slide commune : un seul appel à l'action."""
    def dessin(c, dc, y):
        filet(dc, M, y, 120, A["accent"], 4)
        y += 50
        y, _ = bloc(dc, M, y, s.get("titre", "Parlons de votre projet"), "titre", 80, A["titre"], W - 2 * M, 1.14, 3, 58)
        y += 30
        if s.get("texte"):
            y, _ = bloc(dc, M, y, s["texte"], "leger", 38, A["texte"], W - 2 * M, 1.45, 5, 30)
            y += 44
        action = typo(s.get("action", "Appel découverte gratuit · lien en bio"))
        f = police("moyen", 32)
        tw = f.getlength(action)
        dc.rounded_rectangle([M, y, M + tw + 70, y + 82], radius=41, fill=A["accent"])
        dc.text((M + 35, y + 20), action, font=f, fill=A["fond"] if A["fond"] != C["blanc"] else C["marine"])
        return y + 82
    poser(img, dessin, 140, H - 360)
    lh = logo(img, M, H - 300, 250, A["logo"])
    d.text((M, H - 300 + lh + 22), typo("Le trait d’union avec votre Algérie"), font=police("titre_ital", 30), fill=A["texte"])

def titre_texte(s, A, couv, lmax=W - 2 * M, t_couv=84, t_int=70, coul_titre=None, coul_texte=None, x=M):
    """Bloc standard : surtitre, titre, filet, texte, accent."""
    ct = coul_titre or A["titre"]
    cx = coul_texte or A["texte"]
    def dessin(c, dc, y):
        if s.get("surtitre"):
            y, _ = bloc(dc, x, y, s["surtitre"], "moyen", 28, A["accent"], lmax, 1.3, 2, 22, esp=3, maj=True)
            y += 28
        y, _ = bloc(dc, x, y, s["titre"], "titre", t_couv if couv else t_int, ct, lmax, 1.12, 5, 50)
        filet(dc, x, y + 22, 110, A["accent"], 4)
        y += 22 + 4
        if s.get("texte"):
            y, _ = bloc(dc, x, y + 40, s["texte"], "leger", 36 if couv else 38, cx, lmax, 1.45, 8, 28)
        if s.get("accent"):
            y, _ = bloc(dc, x, y + 30, s["accent"], "moyen", 36, ct, lmax, 1.35, 3, 28)
        return y
    return dessin

def g_pierre(s, i, n, opts):
    """Éditorial clair : grand titre serif, fenêtre photo en arche (couverture)."""
    img, d, A = toile(opts.get("ambiance", "pierre"))
    if s.get("role") == "cta":
        cta_final(img, d, A, s); return img
    if i == 1 and s.get("photo"):
        aw, ah = 420, 520
        ph = traitement_doux(recadrer(ouvrir_photo(s["photo"]), aw, ah, *s.get("focus", (0.5, 0.5))))
        px, py = W - M - aw, SUR
        img.paste(ph, (px, py), masque_arche(aw, ah))
        d.arc([px - 16, py - 16, px + aw + 16, py + aw + 16], 180, 360, fill=A["accent"], width=3)
        if s.get("surtitre"):
            bloc(d, M, py + 10, s["surtitre"], "moyen", 28, A["accent"], W - 2 * M - aw - 40, 1.35, 4, 22, esp=3, maj=True)
        s2 = dict(s); s2.pop("surtitre", None)
        poser(img, titre_texte(s2, A, True, t_couv=80), py + ah + 40, H - SUR - 110, "haut")
    else:
        poser(img, titre_texte(s, A, i == 1), SUR if i == 1 else 140, H - SUR - 130 if i == 1 else H - 150,
              "haut" if i == 1 else "centre")
    pied(img, d, A, i, n)
    return img

def g_zellige(s, i, n, opts):
    """Aplat de couleur + motif zellige en filigrane + carte de texte claire."""
    amb = opts.get("ambiance", "marine")
    img, d, A = toile(amb)
    img.alpha_composite(motif_zellige(W, H, A["accent"], alpha=46 if amb not in ("pierre", "sable", "blanc") else 70))
    if s.get("role") == "cta":
        img.alpha_composite(Image.new("RGBA", (W, H), A["fond"] + (190,)))
        cta_final(img, d, A, s); return img
    clair = amb in ("pierre", "sable", "blanc")
    carte = C["blanc"] if clair else C["pierre"]
    Ac = dict(A, titre=C["marine"], texte=C["encre"], accent=C["or"] if not clair else A["accent"])
    if amb == "terre":
        Ac["accent"] = C["terre"]
    cx0, cw = M - 24, W - 2 * (M - 24)
    inner = titre_texte(s, Ac, i == 1, lmax=cw - 110, t_couv=78, t_int=64, x=cx0 + 56)
    def dessin(c, dc, y):
        haut = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        fin = inner(haut, ImageDraw.Draw(haut), 64)
        h = fin + 64
        dc.rounded_rectangle([cx0, y, cx0 + cw, y + h], radius=30, fill=carte)
        dc.rectangle([cx0, y + 40, cx0 + 8, y + h - 40], fill=Ac["accent"])
        c.alpha_composite(haut.crop((0, 0, W, h)), (0, y))
        return y + h
    poser(img, dessin, SUR + 10 if i == 1 else 140, H - SUR - 140 if i == 1 else H - 150, "centre")
    pied(img, d, A, i, n)
    return img

def g_etapes(s, i, n, opts):
    """Démarche pas à pas : liste numérotée en couverture, une étape par slide."""
    img, d, A = toile(opts.get("ambiance", "blanc"))
    if s.get("role") == "cta":
        cta_final(img, d, A, s); return img
    if i == 1:
        def dessin(c, dc, y):
            if s.get("surtitre"):
                y, _ = bloc(dc, M, y, s["surtitre"], "moyen", 28, A["accent"], W - 2 * M, 1.3, 2, 22, esp=3, maj=True)
                y += 30
            y, _ = bloc(dc, M, y, s["titre"], "titre", 80, A["titre"], W - 2 * M, 1.1, 4, 56)
            y += 44
            for k, e in enumerate(s.get("liste", [])):
                dc.ellipse([M, y + 2, M + 48, y + 50], outline=A["accent"], width=3)
                f = police("moyen", 26)
                num = str(k + 1)
                dc.text((M + 24 - f.getlength(num) / 2, y + 8), num, font=f, fill=A["accent"])
                y, _ = bloc(dc, M + 76, y + 4, e, "normal", 34, A["texte"], W - 2 * M - 76, 1.3, 2, 28)
                y += 20
            if s.get("texte"):
                y, _ = bloc(dc, M, y + 8, s["texte"], "leger", 28, C["gris"], W - 2 * M, 1.4, 2, 22)
            return y
        poser(img, dessin, SUR, H - SUR - 130, "haut")
        pied(img, d, A, i, n, logo_pos="d")
        return img
    num = str(s.get("numero", i - 1))
    tot = int(s.get("total", n - 2))
    d.text((M - 10, 60), num, font=police("titre", 300), fill=A["accent"])
    fx0, fx1, fy = M, W - M, 450
    d.line([(fx0, fy), (fx1, fy)], fill=C["sable"], width=4)
    if tot > 1:
        pos = fx0 + (fx1 - fx0) * (int(num) - 1) / (tot - 1)
        d.line([(fx0, fy), (pos, fy)], fill=A["accent"], width=4)
        for k in range(tot):
            px = fx0 + (fx1 - fx0) * k / (tot - 1)
            r = 10 if k + 1 == int(num) else 7
            d.ellipse([px - r, fy - r, px + r, fy + r], fill=A["accent"] if k + 1 <= int(num) else C["sable"])
    poser(img, titre_texte(s, A, False, t_int=68), 510, H - 260, "centre")
    if s.get("delai"):
        f2 = police("moyen", 28)
        t = typo("Délai indicatif : " + s["delai"])
        d.rounded_rectangle([M, H - 230, M + f2.getlength(t) + 52, H - 170], radius=30, outline=A["accent"], width=2)
        d.text((M + 26, H - 219), t, font=f2, fill=A["titre"])
    compteur(d, i, n, C["gris"])
    poignee(d, C["gris"])
    return img

def g_vrai_faux(s, i, n, opts):
    """Idée reçue (haut, clair) / En réalité (bas, foncé)."""
    if s.get("role") == "cta":
        img, d, A = toile("marine"); cta_final(img, d, A, s); return img
    if i == 1:
        img, d, A = toile(opts.get("ambiance_couverture", "terre"))
        s2 = dict(s); s2.setdefault("surtitre", "Idées reçues")
        poser(img, titre_texte(s2, A, True, t_couv=96), SUR + 20, H - SUR - 140, "centre")
        pied(img, d, A, i, n)
        return img
    img = Image.new("RGBA", (W, H), C["sable"] + (255,))
    d = ImageDraw.Draw(img)
    coupe = int(H * 0.42)
    d.rectangle([0, coupe, W, H], fill=C["marine"])
    f = police("moyen", 26)
    def haut(c, dc, y):
        dc.text((M, y), "IDÉE REÇUE", font=f, fill=C["terre"])
        cx, cy = W - M - 22, y + 16
        dc.line([(cx - 16, cy - 16), (cx + 16, cy + 16)], fill=C["terre"], width=4)
        dc.line([(cx - 16, cy + 16), (cx + 16, cy - 16)], fill=C["terre"], width=4)
        dc.line([(M, y + 48), (M + 60, y + 48)], fill=C["terre"], width=3)
        y, _ = bloc(dc, M, y + 84, "« " + s["idee"].strip("«» ") + " »", "titre_ital", 54, C["encre"], W - 2 * M, 1.2, 4, 40)
        return y
    poser(img, haut, 100, coupe - 50, "centre")
    def bas(c, dc, y):
        dc.text((M, y), "EN RÉALITÉ", font=f, fill=C["or"])
        dc.line([(M, y + 48), (M + 60, y + 48)], fill=C["or"], width=3)
        y, _ = bloc(dc, M, y + 84, s["realite"], "titre", 54, C["blanc"], W - 2 * M, 1.18, 4, 40)
        if s.get("texte"):
            y, _ = bloc(dc, M, y + 30, s["texte"], "leger", 34, C["pierre"], W - 2 * M, 1.45, 5, 26)
        return y
    poser(img, bas, coupe + 70, H - 140, "centre")
    poignee(d, C["pierre"])
    compteur(d, i, n, C["pierre"], y=H - 92)
    return img

def g_actualite(s, i, n, opts):
    """Actualité réglementaire : bandeau daté, ce qui change, notre réponse, source."""
    if s.get("role") == "cta":
        img, d, A = toile("marine"); cta_final(img, d, A, s); return img
    img, d, A = toile("blanc")
    A = dict(A, accent=C["terre"])
    hb = 230 if i == 1 else 160
    d.rectangle([0, 0, W, hb], fill=C["marine"])
    f = police("moyen", 26)
    lab = "ACTUALITÉ RÉGLEMENTAIRE" if i == 1 else typo(s.get("rubrique", "Actualité")).upper()
    yb = hb - 96
    d.rounded_rectangle([M, yb - 12, M + largeur(lab, f, 3) + 44, yb + 46], radius=8, fill=C["terre"])
    cx = M + 22
    for ch in lab:
        d.text((cx, yb), ch, font=f, fill=C["blanc"]); cx += f.getlength(ch) + 3
    if s.get("date"):
        fd = police("leger", 26)
        t = typo(s["date"])
        d.text((W - M - fd.getlength(t), yb + 6), t, font=fd, fill=C["pierre"])
    poser(img, titre_texte(s, A, i == 1, t_couv=80, t_int=64, coul_titre=C["marine"], coul_texte=C["encre"]),
          hb + 70, H - 240, "haut" if i == 1 else "centre")
    if s.get("source"):
        bloc(d, M, H - 220, "Source : " + s["source"], "leger", 24, C["gris"], W - 2 * M - 200, 1.35, 2, 20)
    if i == 1:
        logo(img, W - M - 150, H - SUR - 80, 150, "couleur")
        if n > 1:
            swipe(d, C["marine"])
    else:
        poignee(d, C["gris"])
    compteur(d, i, n, C["pierre"], y=40)
    return img

def g_question(s, i, n, opts):
    """« La question qu'on nous pose » : grand guillemet, réponse courte."""
    img, d, A = toile(opts.get("ambiance", "mer"))
    if s.get("role") == "cta":
        cta_final(img, d, A, s); return img
    def dessin(c, dc, y):
        dc.text((M - 14, y - 70), "“", font=police("titre_gras", 300), fill=A["accent"])
        y += 170
        return titre_texte(s, A, i == 1, t_couv=76, t_int=64)(c, dc, y)
    poser(img, dessin, SUR + 10 if i == 1 else 130, H - SUR - 140 if i == 1 else H - 150, "centre")
    pied(img, d, A, i, n)
    return img

def g_chiffre(s, i, n, opts):
    """Chiffre clé : un nombre vérifiable en très grand, son explication."""
    img, d, A = toile(opts.get("ambiance", "nuit"))
    if s.get("role") == "cta":
        cta_final(img, d, A, s); return img
    def dessin(c, dc, y):
        if s.get("surtitre"):
            y, _ = bloc(dc, M, y, s["surtitre"], "moyen", 28, A["accent"], W - 2 * M, 1.3, 2, 22, esp=3, maj=True)
            y += 20
        t = typo(s["chiffre"])
        taille = 320
        while police("titre", taille).getlength(t) > W - 2 * M and taille > 120:
            taille -= 10
        bb = police("titre", taille).getbbox(t)
        dc.text((M - 6, y - bb[1]), t, font=police("titre", taille), fill=A["accent"])
        y += bb[3] - bb[1] + 30
        if s.get("unite"):
            y, _ = bloc(dc, M, y, s["unite"], "titre_ital", 56, A["titre"], W - 2 * M, 1.15, 2, 40)
        filet(dc, M, y + 16, 110, A["accent"], 4)
        y += 56
        y, _ = bloc(dc, M, y, s["titre"], "moyen", 44, A["titre"], W - 2 * M, 1.3, 4, 34)
        if s.get("texte"):
            y, _ = bloc(dc, M, y + 26, s["texte"], "leger", 36, A["texte"], W - 2 * M, 1.45, 5, 28)
        return y
    poser(img, dessin, SUR + 10, H - SUR - 140, "centre")
    pied(img, d, A, i, n, logo_pos="d")
    return img

def degrade_haut(img, frac=0.22, force=0.55, couleur=(10, 16, 26)):
    w, h = img.size
    a = np.asarray(img).astype(np.float32)
    y = np.linspace(0, 1, h)[:, None]
    v = np.clip((frac - y) / frac, 0, 1) ** 1.4 * force
    v = np.broadcast_to(v, (h, w))[..., None]
    return Image.fromarray(np.clip(a * (1 - v) + np.array(couleur) * v, 0, 255).astype(np.uint8))

def g_pleine_photo(s, i, n, opts):
    """Photo plein cadre, texte en bas sur dégradé sombre ; traitement naturel."""
    if s.get("role") == "cta":
        img, d, A = toile("nuit"); cta_final(img, d, A, s); return img
    ph = recadrer(ouvrir_photo(s["photo"]), W, H, *s.get("focus", (0.5, 0.5)))
    ph = degrade_haut(degrade_bas(traitement_doux(ph), 0.62, 0.94, courbe=0.85))
    img = ph.convert("RGBA")
    d = ImageDraw.Draw(img)
    A = dict(AMBIANCES["nuit"], accent=C["or_clair"], titre=C["blanc"], texte=C["pierre"])
    poser(img, titre_texte(s, A, True, t_couv=74), SUR + 200, H - SUR - 10, "bas")
    logo(img, M, 70, 150, "clair")
    compteur(d, i, n, C["pierre"])
    if n > 1 and i == 1:
        swipe(d, C["blanc"])
    return img

def g_bande(s, i, n, opts):
    """Gabarit historique de la charte : photo traitée + bande sombre bronze ou nuit.
    Au plus une fois sur quatre publications."""
    var = opts.get("bande", "nuit")
    b = BANDES[var]
    if s.get("role") == "cta":
        img, d, A = toile("nuit" if var == "nuit" else "terre"); cta_final(img, d, A, s); return img
    ph = recadrer(ouvrir_photo(s["photo"]), W, H, *s.get("focus", (0.6, 0.5)))
    img = rideau(traitement_charte(ph), var).convert("RGBA")
    d = ImageDraw.Draw(img)
    lmax = int(W * 0.62)
    A = dict(titre=b["titre"], texte=b["texte"], accent=b["filet"])
    def dessin(c, dc, y):
        if s.get("surtitre"):
            y, _ = bloc(dc, M, y, s["surtitre"], "moyen", 28, b["sur"], lmax, 1.3, 2, 24, esp=3, maj=True)
            y += 28
        y, _ = bloc(dc, M, y, s["titre"], "titre", 66, b["titre"], lmax, 1.16, 4, 48, maj=True)
        filet(dc, M, y + 20, 110, b["filet"], 3)
        y += 24
        if s.get("texte"):
            y, _ = bloc(dc, M, y + 36, s["texte"], "leger", 34, b["texte"], lmax, 1.5, 6, 28)
        if s.get("accent"):
            y, _ = bloc(dc, M, y + 24, s["accent"], "moyen", 32, b["sur"], lmax, 1.45, 3, 26)
        return y
    poser(img, dessin, SUR if i == 1 else 150, H - SUR - 170 if i == 1 else H - 150, "haut" if i == 1 else "centre")
    d.line([(W - M - 100, 84), (W - M, 84)], fill=b["filet"], width=2)
    compteur(d, i, n, b["texte"], droite=W - M - 120, y=70)
    if i == 1:
        logo(img, M, H - SUR - 120, 190, "clair")
        if n > 1:
            swipe(d, b["sur"])
    else:
        poignee(d, b["texte"])
    return img

GABARITS = {
    "pierre": g_pierre, "zellige": g_zellige, "etapes": g_etapes, "vrai-faux": g_vrai_faux,
    "actualite": g_actualite, "question": g_question, "chiffre": g_chiffre,
    "pleine-photo": g_pleine_photo, "bande": g_bande,
}

# ---------------------------------------------------------------- vidéo
def video_texte(fiche, sortie):
    """Vidéo verticale 1080×1920 : plans de texte animés (apparition par ligne),
    photo optionnelle en fond avec zoom lent. Muette : la musique est ajoutée
    par la plateforme."""
    fps = 30
    plans = fiche["plans"]
    amb = fiche.get("ambiance", "marine")
    A = AMBIANCES[amb]
    proc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                             "-s", f"{VW}x{VH}", "-r", str(fps), "-i", "-", "-c:v", "libx264", "-preset", "medium",
                             "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", sortie],
                            stdin=subprocess.PIPE)
    fonds = {}
    for k, p in enumerate(plans):
        if p.get("photo"):
            ph = ouvrir_photo(p["photo"])
            fonds[k] = traitement_doux(recadrer(ph, int(VW * 1.15), int(VH * 1.15), *p.get("focus", (0.5, 0.5))))
    for k, p in enumerate(plans):
        duree = float(p.get("duree", 3.0))
        nb = int(duree * fps)
        amb_p = AMBIANCES[p.get("ambiance", amb)]
        lignes = [typo(l) for l in p["texte"]]
        taille = int(p.get("taille", 92))
        f = police("titre" if p.get("style", "titre") == "titre" else "moyen", taille)
        lmax = VW - 2 * M
        # coupe chaque ligne logique en sous-lignes
        rendu = []
        for l in lignes:
            for sl in couper(l, f, lmax):
                rendu.append(sl)
        pas = int(taille * 1.18)
        # texte centré dans la zone utile (au-dessus de l'interface des applications)
        y0 = int(p.get("y", (VH * 0.80 - len(rendu) * pas) / 2 + 60))
        for t in range(nb):
            if k in fonds:
                z = 1.0 + 0.08 * (t / nb)
                bg = fonds[k]
                bw, bh = int(VW * z), int(VH * z)
                base = bg.resize((int(bg.width * z / 1.15), int(bg.height * z / 1.15)), Image.BILINEAR)
                ox, oy = (base.width - VW) // 2, (base.height - VH) // 2
                base = base.crop((ox, oy, ox + VW, oy + VH))
                base = degrade_bas(base, 0.75, 0.80).convert("RGBA")
                voile = Image.new("RGBA", (VW, VH), (10, 16, 26, 125))
                base.alpha_composite(voile)
                img = base
                coul = C["blanc"]; acc = C["or_clair"]
            else:
                img = Image.new("RGBA", (VW, VH), amb_p["fond"] + (255,))
                if p.get("motif", True):
                    img.alpha_composite(motif_zellige(VW, VH, amb_p["accent"], alpha=30, pas=180))
                coul = amb_p["titre"]; acc = amb_p["accent"]
            d = ImageDraw.Draw(img)
            for j, l in enumerate(rendu):
                debut = j * 0.35 * fps
                prog = max(0.0, min(1.0, (t - debut) / (0.45 * fps)))
                if prog <= 0:
                    continue
                e = 1 - (1 - prog) ** 3
                dy = int((1 - e) * 40)
                calque = Image.new("RGBA", (VW, pas + 40), (0, 0, 0, 0))
                ImageDraw.Draw(calque).text((0, 0), l, font=f, fill=coul + (int(255 * e),))
                img.alpha_composite(calque, (M, y0 + j * pas + dy))
            if p.get("filet", True) and t > 0.3 * fps:
                lf = int(min(1.0, (t - 0.3 * fps) / (0.5 * fps)) * 140)
                d.rectangle([M, y0 - 50, M + lf, y0 - 45], fill=acc)
            # barre de progression et marque
            tot = sum(int(float(q.get("duree", 3.0)) * fps) for q in plans)
            fait = sum(int(float(q.get("duree", 3.0)) * fps) for q in plans[:k]) + t
            d.rectangle([0, VH - 10, int(VW * fait / tot), VH], fill=acc)
            if p.get("logo") or k == len(plans) - 1:
                # au-dessus de la zone couverte par l'interface Reels/TikTok (bas ~25 %)
                logo(img, M, min(y0 + len(rendu) * pas + 90, int(VH * 0.62)), 260,
                     "clair" if (k in fonds or amb_p["logo"] == "clair") else "couleur")
            d.text((M, 150), "@moconseildz", font=police("normal", 30), fill=coul)
            proc.stdin.write(img.convert("RGB").tobytes())
    proc.stdin.close()
    proc.wait()
    # couverture = premier plan pleinement affiché
    return sortie

# ---------------------------------------------------------------- rendu
def rendre(fiche, dossier):
    os.makedirs(dossier, exist_ok=True)
    sorties = []
    if fiche["format"] == "video":
        out = os.path.join(dossier, fiche.get("nom", "video") + ".mp4")
        video_texte(fiche, out)
        sorties.append(out)
        return sorties
    g = GABARITS[fiche["gabarit"]]
    slides = fiche["slides"]
    n = len(slides)
    for i, s in enumerate(slides, 1):
        img = g(s, i, n, fiche.get("options", {}))
        out = os.path.join(dossier, f"{fiche.get('nom', 'post')}-{i:02d}.png")
        img.convert("RGB").save(out, optimize=True)
        sorties.append(out)
    return sorties

if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] != "rendre":
        print(__doc__); sys.exit(1)
    with open(sys.argv[2], encoding="utf-8") as fh:
        fiche = json.load(fh)
    for s in rendre(fiche, sys.argv[3]):
        print(s)
