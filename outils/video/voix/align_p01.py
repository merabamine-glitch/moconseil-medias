import numpy as np, soundfile as sf, librosa, json, sys
from kokoro_onnx import Kokoro
SR=16000
k=Kokoro('/home/claude/tts/kokoro-v1.0.onnx','/home/claude/tts/voices-v1.0.bin')
E,_=librosa.load('/home/claude/p01/voix16.wav',sr=SR)
chunks=[(0.08,3.01,"Vous voulez créer votre société en Algérie, sans quitter l'Europe ?"),
(3.41,8.85,"À distance, il faut enchaîner notaire, banque, registre du commerce et impôts, sans personne sur place."),
(9.18,12.75,"Être cette personne sur place, c'est exactement ce que fait M et O Conseil"),
(13.02,13.83,"une équipe en Europe,"),(14.01,14.83,"une équipe en Algérie."),
(15.18,19.62,"Avec le Pack Création de Société, nous faisons rédiger vos statuts, déposons votre capital,"),
(19.90,24.61,"immatriculons votre société et ouvrons votre compte professionnel, sans que vous ayez à vous déplacer."),
(24.96,28.92,"À la fin, ce que vous obtenez, c'est votre société immatriculée et prête à démarrer."),
(29.22,31.05,"Vous restez chez vous, nous gérons le reste."),(31.33,33.05,"Réservez votre appel découverte gratuit.")]
def synth(t):
    a,sr=k.create(t,voice='ff_siwis',speed=1.0,lang='fr-fr')
    a=librosa.resample(a,orig_sr=sr,target_sr=SR)
    a,_=librosa.effects.trim(a,top_db=35); return a
HOP=160
def feat(a):
    m=librosa.feature.mfcc(y=a,sr=SR,n_mfcc=20,hop_length=HOP,n_fft=512)[1:]
    m=np.vstack([m,librosa.feature.delta(m)])
    return (m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
out=[]
for s,e,txt in chunks:
    seg=E[int(s*SR):int(e*SR)]
    words=txt.split()
    K=synth(txt); FK=feat(K); FE=feat(seg)
    D,wp=librosa.sequence.dtw(FK,FE,metric='cosine'); wp=wp[::-1]
    def k2e(fr):
        idx=wp[wp[:,0]>=fr]
        return idx[0,1] if len(idx) else wp[-1,1]
    starts=[]
    for i in range(1,len(words)):
        P=synth(' '.join(words[:i])); FP=feat(P)
        D2,wp2=librosa.sequence.dtw(FP,FK,metric='cosine',subseq=True)
        # subseq: FP fully, FK open-start/end; take end on FK
        endk=wp2[0,1]
        starts.append(k2e(endk)*HOP/SR+s)
    ws=[s]+starts
    out.append({'chunk':txt,'start':s,'end':e,'words':[(w,round(t,2)) for w,t in zip(words,ws)]})
    print(f"{s:.2f}-{e:.2f}: "+'  '.join(f"{w}@{t:.2f}" for w,t in zip(words,ws)),flush=True)
json.dump(out,open('/home/claude/p01/align.json','w'),ensure_ascii=False,indent=1)
