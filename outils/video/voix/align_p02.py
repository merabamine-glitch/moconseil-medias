import numpy as np, soundfile as sf, librosa, json, sys
from kokoro_onnx import Kokoro
SR=16000
k=Kokoro('/home/claude/tts/kokoro-v1.0.onnx','/home/claude/tts/voices-v1.0.bin')
E,_=librosa.load('/home/claude/p02/voix16.wav',sr=SR)
chunks=[(0.11,1.83,"Votre société est en Algérie"),(2.15,3.25,"et vous vivez en Europe ?"),
(3.76,5.87,"Chaque mois, des déclarations à déposer"),(6.10,8.08,"et personne sur place pour tenir les délais."),
(8.67,9.49,"Tenir ces délais,"),(9.82,12.21,"c'est exactement ce que fait M et O Conseil."),
(12.67,14.34,"Avec le Pack Suivi de Société,"),(14.66,17.21,"notre expert-comptable dépose vos déclarations,"),
(17.49,19.08,"sans que vous ayez à vous déplacer."),(19.63,21.34,"Chaque mois, ce que vous obtenez,"),
(21.58,22.81,"c'est une société à jour."),(23.19,25.28,"Vous restez chez vous, nous gérons le reste."),
(25.72,27.36,"Réservez votre appel découverte.")]
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
json.dump(out,open('/home/claude/p02/align.json','w'),ensure_ascii=False,indent=1)
