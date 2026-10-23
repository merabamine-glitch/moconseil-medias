import numpy as np, soundfile as sf, librosa, json, sys
from kokoro_onnx import Kokoro
SR=16000
k=Kokoro('/home/claude/tts/kokoro-v1.0.onnx','/home/claude/tts/voices-v1.0.bin')
E,_=librosa.load('/home/claude/voix/voix16.wav',sr=SR)
chunks=[(0.12,1.28,"Vous vivez à l'étranger"),(1.96,4.16,"mais votre projet, lui, est en Algérie."),
(4.66,9.36,"Créer une société, acheter un bien, régler une succession, préparer votre retour"),
(9.84,12.04,"Sur place, chaque démarche demande du temps,"),(12.28,12.90,"et surtout,"),(13.04,14.12,"quelqu'un de confiance."),
(14.50,16.54,"M et O Conseil, c'est ce trait d'union."),(16.94,17.82,"Une équipe en Europe,"),(18.04,18.96,"une équipe en Algérie."),
(19.32,19.96,"Dix packs,"),(20.12,23.06,"un seul interlocuteur, et un suivi, à chaque étape."),(23.48,24.36,"Vous restez chez vous,"),
(24.74,25.52,"nous gérons le reste."),(26.02,27.00,"M et O Conseil"),(27.32,29.04,"le trait d'union avec votre Algérie.")]
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
json.dump(out,open('/home/claude/voix/align.json','w'),ensure_ascii=False,indent=1)
