import numpy as np, soundfile as sf, json, re, subprocess
SR=48000
def Wp(x): return x
subprocess.run(['ffmpeg','-v','error','-y','-i','/home/claude/p01/pack-01-creation.mp3','-ar',str(SR),'-ac','1','/home/claude/p01/voix48.wav'],check=True)
v,_=sf.read('/home/claude/p01/voix48.wav',dtype='float32')
T=35.5; N=int(T*SR)
voice=np.zeros(N,np.float32); voice[:len(v)]=v[:N]
voice*=0.5/np.abs(voice).max()
info=[]
t=np.arange(N)/SR
rng=np.random.default_rng(7)
# music pad: chords (A minor-ish warm): Am, F, C, G, 4 bars over 30s
def note(f): return 440*2**((f-69)/12)
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]
pad=np.zeros(N,np.float32); seg=T/8
for c in range(8):
    ch=chords[c%4]; s0=int(c*seg*SR); s1=int((c+1)*seg*SR)+int(0.6*SR); s1=min(s1,N); tt=np.arange(s1-s0)/SR
    env=np.minimum(1,tt/1.2)*np.minimum(1,(s1-s0)/SR-tt+0.01)
    env=np.clip(env,0,1)
    for m in ch+[ch[0]-12]:
        f=note(m); w=np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt+0.5)+0.15*np.sin(2*np.pi*3*f*tt)
        w*=1+0.1*np.sin(2*np.pi*0.3*tt)
        pad[s0:s1]+=0.035*env*w
# soft pulse (kick-like) at 100 bpm from 4.3s to 25s
bpm=100; beat=60/bpm
pulse=np.zeros(N,np.float32)
b=3.4
while b<29.2:
    i=int(b*SR); L=int(0.25*SR); tt=np.arange(L)/SR
    k_=np.sin(2*np.pi*(55+90*np.exp(-tt*30))*tt)*np.exp(-tt*14)
    pulse[i:i+L]+=0.12*k_[:N-i]
    b+=beat
# hats offbeat
h=np.zeros(N,np.float32); b=3.4+beat/2
while b<29.2:
    i=int(b*SR); L=int(0.05*SR); nz=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*80)
    nz=np.diff(np.concatenate([[0],nz]))
    h[i:i+L]+=0.02*nz[:N-i]; b+=beat
music=pad+pulse+h
# fade music out at end, duck under voice
env=np.ones(N); env[-int(2.5*SR):]=np.linspace(1,0,int(2.5*SR)); env[:int(0.8*SR)]=np.linspace(0,1,int(0.8*SR))
vabs=np.convolve(np.abs(voice),np.ones(int(0.25*SR))/int(0.25*SR),mode='same')
duck=1-0.55*np.clip(vabs/0.03,0,1)
music*=env*duck*0.85
# sfx
def whoosh(t0,d=0.7,up=True,g=0.18):
    i=int(t0*SR); L=int(d*SR); nz=rng.standard_normal(L)
    # simple band movement via cumulative filtering
    out=np.zeros(L); y=0; 
    cut=np.linspace(0.02,0.35,L) if up else np.linspace(0.35,0.02,L)
    for n in range(L): y=y+cut[n]*(nz[n]-y); out[n]=y
    e=np.sin(np.pi*np.arange(L)/L)**2
    return i,(g*out*e).astype(np.float32)
def pop(t0,f=880,g=0.12):
    i=int(t0*SR); L=int(0.12*SR); tt=np.arange(L)/SR
    return i,(g*np.sin(2*np.pi*f*tt*(1+0.5*np.exp(-tt*40)))*np.exp(-tt*35)).astype(np.float32)
def shimmer(t0,g=0.06):
    i=int(t0*SR); L=int(1.4*SR); tt=np.arange(L)/SR; o=np.zeros(L)
    for f in [1318,1760,2093,2637]: o+=np.sin(2*np.pi*f*tt)*np.exp(-tt*(2.5+f/1500))
    return i,(g*o*np.minimum(1,tt/0.02)).astype(np.float32)
sfx=np.zeros(N,np.float32)
def jet(t0=0.0,d=3.3,g=0.32):
    i=int(t0*SR); L=int(d*SR); tt=np.arange(L)/SR
    nz=rng.standard_normal(L)
    # passage au-dessus : montée très rapide, pic à 0,25 s, puis éloignement
    env=np.minimum(1,tt/0.12)*np.exp(-np.maximum(0,tt-0.25)*1.15)
    cut=0.30*np.exp(-tt*0.9)+0.03   # le souffle s'assourdit en s'éloignant
    out=np.zeros(L); y=0.0; y2=0.0
    for n in range(L):
        y=y+cut[n]*(nz[n]-y); y2=y2+cut[n]*(y-y2); out[n]=y2
    rumble=np.sin(2*np.pi*(70-20*tt/d)*tt)*0.35+np.sin(2*np.pi*(118-35*tt/d)*tt)*0.2
    whine=0.05*np.sin(2*np.pi*np.cumsum(2400-900*np.minimum(1,tt/1.2))/SR)*np.exp(-tt*1.6)
    sig=(out*3.2+rumble*0.5+whine)*env
    return i,(g*sig/np.abs(sig).max()).astype(np.float32)
def boom(t0,g=0.22):
    i=int(t0*SR); L=int(0.9*SR); tt=np.arange(L)/SR
    return i,(g*np.sin(2*np.pi*(48+40*np.exp(-tt*12))*tt)*np.exp(-tt*4.5)).astype(np.float32)
def rise(t0,d=0.7,g=0.035):
    i=int(t0*SR); L=int(d*SR); tt=np.arange(L)/SR
    f=600+700*tt/d
    return i,(g*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)).astype(np.float32)
def stamp(t0,g=0.42):
    i=int(t0*SR); L=int(0.5*SR); tt=np.arange(L)/SR
    body=np.sin(2*np.pi*(62+70*np.exp(-tt*28))*tt)*np.exp(-tt*16)
    nz=rng.standard_normal(L); y=0; out=np.zeros(L)
    for n in range(L): y=y+0.25*(nz[n]-y); out[n]=y
    click=out*np.exp(-tt*55)*1.6
    thud=np.sin(2*np.pi*140*tt)*np.exp(-tt*38)*0.5
    return i,(g*(body+click+thud)/2.2).astype(np.float32)
events=[whoosh(2.0,0.45,True,0.22),whoosh(3.3,0.45,False,0.14)]
for tc in [4.93,5.38,6.03,7.21]: events.append(pop(tc,820,0.07))
events+=[whoosh(7.52,0.5,False,0.10),rise(8.8,0.45),whoosh(8.9,0.45,True,0.15),boom(11.71,0.2),
         whoosh(12.84,0.5,False,0.13),pop(13.12,700,0.08),rise(13.95,0.6),pop(14.05,760,0.08),
         whoosh(15.08,0.45,True,0.16),whoosh(15.45,0.45,False,0.08)]
for tc in [17.8,19.0,20.45,22.2]: events.append(pop(tc+0.13,1500,0.07))
for tw in [18.33,19.9,21.66]: events.append(whoosh(tw-0.18,0.36,True,0.09))
events+=[stamp(20.12),whoosh(20.14,0.6,False,0.05),whoosh(23.2,0.5,False,0.08),whoosh(24.85,0.5,True,0.16),boom(27.52,0.26),
         whoosh(29.08,0.45,True,0.14),whoosh(31.2,0.7,True,0.18),pop(31.95,880,0.09)]
for i,s in events: sfx[i:i+len(s)]+=s[:N-i]
sfx*=0.316  # v6 : bruitages à -10 dB = moitié moins forts à l oreille (demande d Amine)
mix=voice*1.0+music+sfx
mix/=max(1e-6,np.abs(mix).max())/0.89
sf.write('/home/claude/video-mo/out/p01-bande-son.wav',mix,SR)


