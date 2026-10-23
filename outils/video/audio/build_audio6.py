import numpy as np, soundfile as sf, json, re, subprocess
SR=48000
A=[tuple(map(float,p)) for p in re.findall(r"\[([\d.]+), ([\d.]+)\]", open('/home/claude/video-mo/src/warp.ts').read().split('ANCHORS')[1].split('];')[0])]
def Wp(x):
    if x<=A[0][0]: return A[0][1]+(x-A[0][0])
    for i in range(1,len(A)):
        if x<=A[i][0]:
            a0,b0=A[i-1]; a1,b1=A[i]; return b0+(x-a0)*(b1-b0)/(a1-a0)
    a,b=A[-1]; return b+(x-a)
subprocess.run(['ffmpeg','-v','error','-y','-i','/home/claude/voix/voix.mp3','-ar',str(SR),'-ac','1','/home/claude/voix/voix48.wav'],check=True)
v,_=sf.read('/home/claude/voix/voix48.wav',dtype='float32')
T=31.5; N=int(T*SR)
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
b=Wp(4.3)
while b<Wp(25.0):
    i=int(b*SR); L=int(0.25*SR); tt=np.arange(L)/SR
    k_=np.sin(2*np.pi*(55+90*np.exp(-tt*30))*tt)*np.exp(-tt*14)
    pulse[i:i+L]+=0.12*k_[:N-i]
    b+=beat
# hats offbeat
h=np.zeros(N,np.float32); b=Wp(4.3)+beat/2
while b<Wp(25.0):
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
events=[jet(0.0,3.9),whoosh(Wp(2.92),0.45,True,0.22),shimmer(Wp(3.2),0.07),whoosh(Wp(4.2),0.5,False,0.12)]
for tw in [4.37,5.45,6.40,7.45]: events.append(whoosh(Wp(tw-0.18),0.36,True,0.10))
events+=[pop(Wp(8.08),880,0.08),whoosh(Wp(8.95),0.45,True,0.16),whoosh(Wp(12.82),0.5,False,0.12),
         whoosh(Wp(13.2),0.4,False,0.12),boom(Wp(13.38)),whoosh(Wp(15.5),0.5,True,0.18),
         pop(Wp(15.85),700,0.08),pop(Wp(17.0),760,0.08),rise(Wp(16.95),0.75)]
for k in range(10): events.append(pop(Wp(18.29+k*0.045),1700+60*k,0.035))
events+=[pop(Wp(18.47),520,0.12),whoosh(Wp(19.12),0.45,False,0.13),whoosh(Wp(20.25),0.35,True,0.08)]
for tc in [22.0,22.3,22.6,22.9]: events.append(pop(tc+0.13,1500,0.07))
events+=[whoosh(Wp(22.15),0.5,True,0.16),whoosh(Wp(24.95),0.8),shimmer(Wp(25.45),0.08),pop(Wp(27.85),880,0.09)]
for i,s in events: sfx[i:i+len(s)]+=s[:N-i]
sfx*=0.316  # v6 : bruitages à -10 dB = moitié moins forts à l oreille (demande d Amine)
mix=voice*1.0+music+sfx
mix/=max(1e-6,np.abs(mix).max())/0.89
sf.write('/home/claude/video-mo/out/bande-son-v6.wav',mix,SR)


