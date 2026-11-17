"""Série de 4 duos éducatifs (17/11/2026) : voix Homme + Femme d'Amine (ElevenLabs v3, un fichier par vidéo :
d'abord toutes les répliques de l'homme, puis toutes celles de la femme). Découpe les répliques (mesures à l'énergie,
transcription locale Whisper), les remet dans l'ordre du dialogue H1 F2 H3 F4 H5, pauses internes ramenées à 0,3 s au plus,
écrit out/duo3-vN-voix.wav et src/duo3_data.ts (répliques, repères de mots, bouches par image)."""
import json, pathlib, re, subprocess
import numpy as np, soundfile as sf
D = pathlib.Path(__file__).resolve().parent; ROOT = D.parent.parent
SR = 48000; FPS = 30; OFF = 0.4; GAP = 0.24; INNER_MAX = 0.3


def load(p):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()


# réplique : (id, personnage, [(début, fin, texte), ...]) — temps dans le fichier source
V = {
    'v1': [
        ('H1', 'homme', [(0.08, 1.42, "Créer ma société en Algérie ?"), (1.77, 2.86, "Mais je vis en France…"), (3.11, 3.79, "C'est mort.")]),
        ('F2', 'femme', [(8.43, 9.00, "Pas du tout :"), (9.38, 11.55, "vivre là-bas n'est pas obligatoire pour la créer.")]),
        ('H3', 'homme', [(4.25, 5.76, "Et à distance, je fais comment ?")]),
        ('F4', 'femme', [(12.04, 15.28, "Une procuration permet à un représentant d'agir pour vous sur place."), (15.98, 18.03, "Quelques étapes seulement demandent votre présence.")]),
        ('H5', 'homme', [(6.13, 8.17, "Donc mon projet avance sans moi dans l'avion !")]),
    ],
    'v2': [
        ('H1', 'homme', [(0.14, 2.57, "Pour créer ma société, je suis obligé de m'associer ?")]),
        ('F2', 'femme', [(8.44, 8.74, "Non."), (9.10, 11.01, "Seul, c'est une EURL ;"), (11.39, 13.30, "à plusieurs, une SARL.")]),
        ('H3', 'homme', [(3.10, 5.11, "Et mes biens personnels, si ça tourne mal ?")]),
        ('F4', 'femme', [(13.75, 17.10, "Dans les deux cas, votre responsabilité est limitée à vos apports.")]),
        ('H5', 'homme', [(5.51, 8.16, "Donc je choisis selon mon projet, pas par obligation !")]),
    ],
    'v3': [
        ('H1', 'homme', [(0.13, 3.44, "Pour mon retour définitif en Algérie, je donne procuration pour tout :"), (3.71, 5.32, "meubles, voiture, douane.")]),
        ('F2', 'femme', [(9.51, 11.17, "Pour beaucoup de démarches, oui…"), (11.49, 12.75, "mais pas pour le dédouanement.")]),
        ('H3', 'homme', [(5.73, 6.06, "Ah bon ?"), (6.38, 7.12, "Pourquoi pas la douane ?")]),
        ('F4', 'femme', [(13.22, 16.22, "Le titulaire doit être présent pour les formalités de dédouanement."), (16.61, 18.25, "La procuration n'y est pas acceptée.")]),
        ('H5', 'homme', [(7.49, 9.14, "Bon à savoir avant d'acheter mon billet !")]),
    ],
    'v4': [
        ('H1', 'homme', [(0.12, 1.55, "Je rentre vivre en Algérie."), (1.95, 4.78, "Pour la voiture, je dois forcément en acheter une neuve sur place ?")]),
        ('F2', 'femme', [(9.63, 10.17, "Non !"), (10.55, 13.22, "En changement de résidence, vous pouvez ramener la vôtre d'Europe.")]),
        ('H3', 'homme', [(5.09, 6.56, "Même si elle a déjà quelques années ?")]),
        ('F4', 'femme', [(13.73, 13.97, "Oui :"), (14.34, 18.11, "neuve ou de moins de cinq ans, essence, hybride ou électrique.")]),
        ('H5', 'homme', [(6.91, 9.49, "Je garde ma voiture et j'allège mon budget retour !")]),
    ],
}
# repères de mots : (clé, réplique, mot cherché dans le texte) ; position estimée au prorata des syllabes du morceau
MARKS = {
    'v1': [('h1_societe', 'H1', 'société'), ('h1_algerie', 'H1', 'Algérie'), ('h1_france', 'H1', 'France'), ('h1_mort', 'H1', 'mort'),
           ('f2_pas', 'F2', 'Pas'), ('f2_vivre', 'F2', 'vivre'), ('f2_obligatoire', 'F2', 'obligatoire'),
           ('h3_distance', 'H3', 'distance'), ('h3_comment', 'H3', 'comment'),
           ('f4_procuration', 'F4', 'procuration'), ('f4_representant', 'F4', 'représentant'), ('f4_place', 'F4', 'sur place'),
           ('f4_etapes', 'F4', 'étapes'), ('f4_presence', 'F4', 'présence'),
           ('h5_projet', 'H5', 'projet'), ('h5_sans', 'H5', 'sans moi'), ('h5_avion', 'H5', 'avion')],
    'v2': [('h1_creer', 'H1', 'créer'), ('h1_associer', 'H1', 'associer'),
           ('f2_non', 'F2', 'Non'), ('f2_seul', 'F2', 'Seul'), ('f2_eurl', 'F2', 'EURL'), ('f2_plusieurs', 'F2', 'plusieurs'), ('f2_sarl', 'F2', 'SARL'),
           ('h3_biens', 'H3', 'biens'), ('h3_mal', 'H3', 'mal'),
           ('f4_deux', 'F4', 'deux cas'), ('f4_responsabilite', 'F4', 'responsabilité'), ('f4_limitee', 'F4', 'limitée'), ('f4_apports', 'F4', 'apports'),
           ('h5_choisis', 'H5', 'choisis'), ('h5_projet', 'H5', 'projet'), ('h5_obligation', 'H5', 'obligation')],
    'v3': [('h1_retour', 'H1', 'retour'), ('h1_procuration', 'H1', 'procuration'), ('h1_tout', 'H1', 'tout'),
           ('h1_meubles', 'H1', 'meubles'), ('h1_voiture', 'H1', 'voiture'), ('h1_douane', 'H1', 'douane'),
           ('f2_beaucoup', 'F2', 'beaucoup'), ('f2_oui', 'F2', 'oui'), ('f2_mais', 'F2', 'mais'), ('f2_dedouanement', 'F2', 'dédouanement'),
           ('h3_ahbon', 'H3', 'Ah bon'), ('h3_douane', 'H3', 'douane'),
           ('f4_titulaire', 'F4', 'titulaire'), ('f4_present', 'F4', 'présent'), ('f4_formalites', 'F4', 'formalités'),
           ('f4_procuration', 'F4', 'procuration'), ('f4_acceptee', 'F4', 'acceptée'),
           ('h5_savoir', 'H5', 'savoir'), ('h5_billet', 'H5', 'billet')],
    'v4': [('h1_rentre', 'H1', 'rentre'), ('h1_algerie', 'H1', 'Algérie'), ('h1_voiture', 'H1', 'voiture'), ('h1_neuve', 'H1', 'neuve'), ('h1_place', 'H1', 'sur place'),
           ('f2_non', 'F2', 'Non'), ('f2_changement', 'F2', 'changement'), ('f2_ramener', 'F2', 'ramener'), ('f2_europe', 'F2', 'Europe'),
           ('h3_annees', 'H3', 'années'),
           ('f4_oui', 'F4', 'Oui'), ('f4_neuve', 'F4', 'neuve'), ('f4_moins', 'F4', 'moins'), ('f4_cinq', 'F4', 'cinq'),
           ('f4_essence', 'F4', 'essence'), ('f4_hybride', 'F4', 'hybride'), ('f4_electrique', 'F4', 'électrique'),
           ('h5_garde', 'H5', 'garde'), ('h5_voiture', 'H5', 'voiture'), ('h5_budget', 'H5', 'budget')],
}
# temps source mesurés directement (débuts de mots isolés à l'énergie) : priment sur l'estimation
EXACT = {'v4': {'f4_neuve': 14.34, 'f4_moins': 14.99, 'f4_essence': 16.21, 'f4_hybride': 17.00, 'f4_electrique': 17.70},
         'v2': {'f2_seul': 9.10, 'f2_eurl': 10.15, 'f2_plusieurs': 11.39, 'f2_sarl': 12.28},
         'v3': {'h3_ahbon': 5.73, 'f2_mais': 11.49}}

VOY = re.compile(r"[aeiouyàâäéèêëîïôöùûüœ]+", re.I)


def syl(t):
    return max(1, len(VOY.findall(t)))


def word_time(a, b, text, word):
    i = text.find(word)
    if i < 0: raise ValueError((text, word))
    return a + (b - a) * syl(text[:i]) / syl(text) if i else a


out = {}
for vid, lines in V.items():
    src = load(D / f'{vid}.mp3')
    pieces = []; segs = []; srcmap = []
    t = OFF
    for name, who, parts in lines:
        st = t
        for j, (a, b, _txt) in enumerate(parts):
            if j: t += min(INNER_MAX, a - parts[j - 1][1])
            pieces.append((a, b, t)); srcmap.append((name, a, b, t))
            t += b - a
        segs.append({'id': name, 'k': who, 's': round(st, 3), 'e': round(t, 3), 'txt': ' '.join(p[2] for p in parts)})
        t += GAP
    end = t - GAP
    tempo = round(min(1.05, max(1.0, end / 17.3)), 3)
    N = int((end + 0.6) * SR); voice = np.zeros(N, np.float32)
    for a, b, st in pieces:
        seg = src[int(a * SR):int(b * SR)].copy()
        r = int(0.012 * SR); seg[:r] *= np.linspace(0, 1, r); seg[-r:] *= np.linspace(1, 0, r)
        i0 = int(st * SR); voice[i0:i0 + len(seg)] += seg
    raw = ROOT / 'out' / f'duo3-{vid}-voix-brut.wav'; sf.write(str(raw), voice, SR)
    wav = ROOT / 'out' / f'duo3-{vid}-voix.wav'
    if tempo > 1.0:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-af', f'rubberband=tempo={tempo}', '-ar', str(SR), '-ac', '1', str(wav)], check=True)
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-ar', str(SR), '-ac', '1', str(wav)], check=True)
    v, _ = sf.read(str(wav), dtype='float32'); v *= 0.5 / np.abs(v).max(); sf.write(str(wav), v, SR)
    sc = lambda x: round(x / tempo, 3)
    for s_ in segs: s_['s'] = sc(s_['s']); s_['e'] = sc(s_['e'])

    def mont(name, x):  # temps source -> temps montage
        for n, a, b, st in srcmap:
            if n == name and a - 0.02 <= x <= b + 0.02: return sc(st + (x - a))
        raise ValueError((vid, name, x))
    M = {}
    for key, name, word in MARKS[vid]:
        if key in EXACT.get(vid, {}):
            M[key] = mont(name, EXACT[vid][key]); continue
        parts = dict((l[0], l[2]) for l in lines)[name]
        for a, b, txt in parts:
            if word in txt:
                M[key] = mont(name, word_time(a, b, txt, word)); break
        else:
            raise ValueError((vid, key, word))
    H5 = segs[-1]
    fin = round(H5['e'] + 0.2, 2)
    T = round(fin + 2.25, 2)
    nf = int(T * FPS) + 1; hop = SR // FPS
    vv = np.zeros(nf * hop, np.float32); vv[:min(len(v), len(vv))] = v[:len(vv)]
    rms = np.array([np.sqrt((vv[i * hop:(i + 1) * hop] ** 2).mean()) for i in range(nf)])
    mouth = {'homme': [0.0] * nf, 'femme': [0.0] * nf}
    for s_ in segs:
        f0, f1 = int(s_['s'] * FPS), int(s_['e'] * FPS) + 1
        seg = rms[f0:f1]; mx = np.percentile(seg, 95) + 1e-6
        for j, x in enumerate(seg): mouth[s_['k']][f0 + j] = round(float(min(1, x / mx)), 2)
    out[vid] = {'segs': segs, 'm': M, 'mh': mouth['homme'], 'mf': mouth['femme'], 'duree': T, 'fin': fin, 'tempo': tempo}
    print(vid, 'tempo', tempo, 'fin voix', H5['e'], 'carte', fin, 'durée', T)
    for s_ in segs: print('  ', s_['id'], s_['s'], s_['e'], s_['txt'])
    print('  ', M)

ts = '// généré par voix/duo3/build_duo3.py\nexport type DuoData = {segs: {id: string; k: string; s: number; e: number; txt: string}[]; m: Record<string, number>; mh: number[]; mf: number[]; duree: number; fin: number; tempo: number};\n'
for vid, d in out.items():
    ts += f'export const D3_{vid.upper()}: DuoData = {json.dumps(d, ensure_ascii=False)};\n'
(ROOT / 'src' / 'duo3_data.ts').write_text(ts)
