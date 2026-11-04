import numpy as np, soundfile as sf, librosa, json, sys
from kokoro_onnx import Kokoro
SR=16000
k=Kokoro('/home/claude/tts/kokoro-v1.0.onnx','/home/claude/tts/voices-v1.0.bin')
E,_=librosa.load('/tmp/claude-0/-home-claude/1cbd4eaf-0c59-5fca-a876-ad1cdf6e7727/scratchpad/p05/voix16.wav',sr=SR)
chunks=[(0.14,1.87,"Vous avez des affaires en Algérie"),(2.13,3.01,"et vous vivez en Europe ?"),
(3.93,6.31,"Une facture, un logement, du courrier,"),(6.42,7.07,"un rendez-vous"),
(7.56,9.22,"à chaque fois, il faut appeler un proche."),(9.46,11.04,"Être votre représentant sur place,"),
(11.12,13.69,"c'est exactement ce que nous faisons chez M et O Conseil !"),(14.02,14.73,"Avec le Pack"),
(14.95,15.47,"Conciergerie !"),(15.78,16.81,"Nous réglons vos factures,"),(16.95,17.99,"relevons votre courrier"),
(18.07,19.23,"et veillons sur votre logement,"),(19.47,20.80,"sans que vous ayez à vous déplacer."),
(21.02,22.33,"Chaque mois, ce que vous obtenez,"),(22.41,23.62,"c'est un compte rendu précis,"),
(23.87,24.98,"avec tous les justificatifs."),(25.38,26.16,"Vous restez chez vous,"),
(26.39,27.22,"nous gérons le reste."),(27.48,28.75,"Réservez votre appel découverte !")]
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
json.dump(out,open('/home/claude/moconseil-medias/outils/video/voix/align_p05v3.json','w'),ensure_ascii=False,indent=1)
