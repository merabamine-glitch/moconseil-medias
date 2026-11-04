// Post éducatif « Succession : la fredha » — conseillère Pixar (HeyGen) en plans de 1 à 2 s, animations entre les plans (04/11/2026).
// Charte vive et contrastée : fonds nuit profonds, or lumineux, photos saturées, terre cuite pour l'alerte. Voix HeyGen (pixar-voix.wav).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import {Accent, C, clamp, ease, easeIn, Particles, prog, s, SANS, useSpring, Word, LogoBurst} from './kit';
import {MAP} from './map_med';

const W = 1080;
const H = 1920;
const OFF = 12; // images avant la voix
export const P07_DUREE = 19.9;
export const P07_FRAMES = s(P07_DUREE);
const TERRE = '#C4512B';
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: C.blanc};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 7, textTransform: 'uppercase', color: C.orClair};
const shadow = 'drop-shadow(0 6px 24px rgba(0,0,0,0.7))';
type Sc = React.FC<{a: number; b: number}>;
// Recalage sur la coupe v2 (coupes alignées sur les images : lèvres synchrones). Paires [temps v1, temps v2].
const A7: [number, number][] = [[0, 0], [0.04, 0.02], [1.68, 1.65], [2.93, 2.91], [4.83, 4.83], [5.55, 5.54], [7.59, 7.59], [9.0, 8.97], [10.87, 10.85], [11.58, 11.54], [12.45, 12.44], [13.25, 13.22], [14.93, 14.9], [15.91, 15.87], [16.67, 16.63], [18.21, 18.16], [30, 29.95]];
const W7 = (x: number): number => {
  for (let i = 1; i < A7.length; i++) if (x <= A7[i][0]) { const [a0, b0] = A7[i - 1], [a1, b1] = A7[i]; return b0 + ((x - a0) * (b1 - b0)) / (a1 - a0); }
  return x;
};

const tt = (x: number) => s(W7(x)) + OFF; // temps voix → image

/* fond photo saturé, flou ou net, avec voile nuit et lueur or */
const Fond: React.FC<{src: string; blur?: number; veil?: number; zoom?: [number, number]; dur: number; oy?: number}> = ({src, blur = 0, veil = 0.45, zoom = [1.12, 1.0], dur, oy = 50}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: `50% ${oy}%`, transform: `scale(${z})`, filter: `blur(${blur}px) saturate(1.2)`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(10,16,30,${veil + 0.25}) 0%, rgba(10,16,30,${veil * 0.4}) 40%, rgba(10,16,30,${veil * 0.6}) 70%, rgba(10,16,30,${veil + 0.2}) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 40% at 50% 55%, rgba(233,207,142,0.18) 0%, rgba(233,207,142,0) 70%)'}} />
    </AbsoluteFill>
  );
};

/* plan de la conseillère : fenêtre dorée (formule HeyGen payante depuis le 04/11/2026 : plus de logo affiché) */
const Conseillere: React.FC<{t0: number; dur: number; y?: number; w?: number; tilt?: number; from?: 'bas' | 'gauche' | 'droite' | 'zoom'; face?: boolean; lead?: number}> = ({t0, dur, y = 1040, w = 900, tilt = -1.5, from = 'bas', face, lead = 0}) => {
  const f = useCurrentFrame();
  const p = useSpring(0, 13, 150);
  const h = Math.round((w * 1576) / 1440);
  const enter = 1 - p;
  const tx = from === 'gauche' ? -enter * 900 : from === 'droite' ? enter * 900 : 0;
  const ty = from === 'bas' ? enter * 700 : 0;
  const sc = from === 'zoom' ? 0.6 + 0.4 * p : 1;
  const z = interpolate(f, [0, dur], face ? [1.32, 1.42] : [1.0, 1.06], clamp);
  return (
    <div style={{position: 'absolute', left: W / 2, top: y, transform: `translate(-50%,-50%) translate(${tx}px, ${ty}px) rotate(${tilt * p}deg) scale(${sc})`}}>
      <div style={{position: 'relative', width: w, height: h, borderRadius: 34, overflow: 'hidden', border: `7px solid ${C.orClair}`, boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(233,207,142,0.45)'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: face ? '50% 38%' : '50% 45%'}}>
          <Img src={staticFile('img/px-premiere-image.jpg')} style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover'}} />
          <Sequence from={lead} layout="none">
            <OffthreadVideo src={staticFile('video/pixar-fredha.mp4')} startFrom={s(W7(t0))} muted style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover'}} />
          </Sequence>
        </div>
      </div>
    </div>
  );
};

const Titre: React.FC<{y?: number; children: React.ReactNode; out?: number}> = ({y = 230, children, out}) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - prog(f, out, 6, easeIn) : 1;
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', filter: shadow, opacity: o}}>{children}</div>;
};

/* ---------- plans ---------- */
const P1: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => tt(x);
  return (
    <AbsoluteFill>
      <Fond src="img/px-succession.jpg" blur={6} veil={0.5} dur={s(2)} />
      <Particles at={0} dur={s(2)} cx={W / 2} cy={1000} mode="out" n={50} spread={700} seed="p1" />
      <Titre y={170}>
        <div style={{...big, fontSize: 84}}><Word at={r(0.04)}>Vous </Word><Word at={r(0.25)}>héritez </Word><Word at={r(0.55)}>d’un bien</Word></div>
        <div><Accent at={r(1.0)} size={140} color={C.orClair} stroke="none">en Algérie ?</Accent></div>
      </Titre>
      <Conseillere t0={0} dur={s(2)} y={1180} w={860} from="zoom" lead={OFF} />
    </AbsoluteFill>
  );
};
const P2: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const A = MAP.villes.alger, G = MAP.villes.geneve, Pa = MAP.villes.paris, B = MAP.villes.bruxelles;
  const z = interpolate(f, [0, s(1.3)], [0.95, 0.82], clamp);
  const cx = 1150, cy = 1650;
  const tx = W / 2 - cx * z, ty = H / 2 - cy * z + 60;
  const wipe = prog(f, 0, 7, Easing.bezier(0.6, 0, 0.2, 1));
  return (
    <AbsoluteFill style={{clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #22406B 0%, #142540 50%, #0A111E 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="g7"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g transform={`translate(${tx} ${ty}) scale(${z})`}>
          {MAP.land.map((d, i) => <path key={i} d={d} fill="#27426A" stroke="rgba(233,207,142,0.3)" strokeWidth={1.6 / z} />)}
          {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#34588A" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />)}
          <path d={MAP.algerie} fill="#3A6297" stroke={C.orClair} strokeWidth={2.6 / z} />
          {[Pa, G, B].map((P, i) => {
            const u = prog(f, 3 + i * 3, 18, Easing.bezier(0.4, 0, 0.2, 1));
            const mx = (A[0] + P[0]) / 2 + [-420, 330, 560][i], my = (A[1] + P[1]) / 2;
            return <path key={i} filter="url(#g7)" d={`M${A[0]} ${A[1]} Q${mx} ${my} ${P[0]} ${P[1]}`} fill="none" stroke="#F6E3AE" strokeWidth={8 / z} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />;
          })}
          {[A, Pa, G, B].map((P, i) => <circle key={i} cx={P[0]} cy={P[1]} r={(16 + 6 * Math.sin(f / 4 + i)) / z} fill={C.orClair} />)}
        </g>
      </svg>
      <Titre y={1300}>
        <div style={{...big, fontSize: 96}}><Word at={r(1.68)}>et vous vivez</Word></div>
        <div><Accent at={r(2.05)} size={150} color={C.orClair} stroke="none">à l’étranger ?</Accent></div>
      </Titre>
    </AbsoluteFill>
  );
};
const P3: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const doc = useSpring(r(4.83), 11, 170);
  const swap = prog(f, r(4.78), 6);
  return (
    <AbsoluteFill>
      <Fond src="img/px-cachet.jpg" blur={swap > 0 ? 0 : 8} veil={0.5} dur={s(3)} zoom={[1.1, 1.0]} />
      {swap < 1 && (
        <div style={{opacity: 1 - swap}}>
          <Titre y={190}>
            <div style={eyebrow}><Word at={r(2.93)}>Première étape,</Word></div>
            <div style={{...big, fontSize: 88, marginTop: 14}}><Word at={r(3.6)}>souvent oubliée</Word></div>
          </Titre>
          <Conseillere t0={2.93} dur={s(2)} y={1150} w={880} from="droite" tilt={1.5} face />
        </div>
      )}
      {f >= r(4.78) && (
        <>
          <LogoBurst at={r(4.95)} x={W / 2} y={820} rx={430} ry={150} />
          <Titre y={600}>
            <div style={{transform: `scale(${0.4 + 0.6 * doc})`}}><Accent at={r(4.83)} size={260} color={C.orClair} stroke="none">la fredha.</Accent></div>
            <div style={{...eyebrow, marginTop: 30, color: C.blanc, opacity: prog(f, r(5.05), 8)}}>acte de notoriété</div>
          </Titre>
        </>
      )}
    </AbsoluteFill>
  );
};
const Tampon: React.FC<{at: number; x: number; y: number; txt: string; color?: string; rot?: number; size?: number}> = ({at, x, y, txt, color = C.or, rot = -10, size = 1}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= at + 5 ? 1 - 0.05 * Math.exp(-(f - at - 5) / 3) * Math.cos((f - at - 5) / 1.6) : 1;
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(2 - p) * settle * size}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{padding: '14px 30px', border: `7px solid ${color}`, borderRadius: 14, fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 5, color, background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{txt}</div>
    </div>
  );
};
const P4: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const sheet = useSpring(0, 13, 130);
  const heirs = ['Héritier 1', 'Héritier 2', 'Héritier 3', 'Héritier 4'];
  return (
    <AbsoluteFill>
      <Fond src="img/s2-signature.jpg" blur={3} veil={0.55} dur={s(3.5)} />
      <Titre y={170}>
        <div style={eyebrow}><Word at={r(5.55)}>Établie chez un notaire</Word></div>
      </Titre>
      <div style={{position: 'absolute', left: W / 2, top: 820, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - sheet) * 60}deg) translateY(${(1 - sheet) * 400}px) rotate(-2deg)`}}>
        <div style={{width: 760, height: 560, borderRadius: 16, background: 'linear-gradient(180deg,#FFFFFF,#F7F1E4)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
          <div style={{background: C.marine, padding: '26px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{...eyebrow, fontSize: 30, letterSpacing: 5}}>Fredha</span>
            <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.blanc}}>Acte de notoriété</span>
          </div>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{margin: '34px 40px 0', height: 16, borderRadius: 8, width: `${[88, 70, 80, 60, 74][i]}%`, background: '#E4DCCB', opacity: prog(f, 6 + i * 3, 8)}} />)}
        </div>
      </div>
      <Tampon at={r(6.55)} x={790} y={1010} txt="NOTAIRE ✓" />
      {/* arbre des héritiers */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {heirs.map((_, i) => {
          const u = prog(f, r(7.59) + i * 4, 10);
          const x = 165 + i * 250;
          return <path key={i} d={`M540 1120 C540 1200 ${x} 1180 ${x} 1260`} fill="none" stroke={C.orClair} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />;
        })}
      </svg>
      {heirs.map((h, i) => {
        const p = useSpring(r(7.59) + 6 + i * 4, 10, 180);
        const x = 165 + i * 250;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 1350, transform: `translate(-50%,-50%) scale(${p})`, textAlign: 'center'}}>
            <div style={{width: 130, height: 130, borderRadius: 130, background: `linear-gradient(160deg, ${C.orClair}, ${C.or})`, border: '6px solid #FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              <svg width={70} height={70} viewBox="0 0 64 64"><circle cx={32} cy={22} r={12} fill={C.marine} /><path d="M10 58c2-14 12-20 22-20s20 6 22 20z" fill={C.marine} /></svg>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.blanc, marginTop: 12, filter: shadow}}>{h}</div>
          </div>
        );
      })}
      <Titre y={1500}>
        <div style={{...big, fontSize: 76}}><Word at={r(7.59)}>Tous les </Word><Word at={r(7.9)}>héritiers,</Word></div>
        <div><Accent at={r(8.2)} size={110} color={C.orClair} stroke="none">listés.</Accent></div>
      </Titre>
    </AbsoluteFill>
  );
};
const P5: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const swap = r(10.4);
  const lock = useSpring(swap + 2, 9, 170);
  const shake = f >= r(10.87) && f < r(10.87) + 6 ? Math.sin(f * 3) * 9 : f >= r(11.58) && f < r(11.58) + 6 ? Math.sin(f * 3) * 9 : 0;
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      {f < swap ? (
        <>
          <Fond src="img/px-immeuble.jpg" blur={8} veil={0.55} dur={s(2)} />
          <Titre y={200}><div style={{...big, fontSize: 110}}><Word at={r(9.0)}>Sans </Word><Word at={r(9.3)}>lui…</Word></div></Titre>
          <Conseillere t0={8.38} dur={s(2)} y={1120} w={880} from="gauche" />
        </>
      ) : (
        <>
          <Fond src="img/px-immeuble.jpg" veil={0.35} dur={s(2.6)} zoom={[1.0, 1.1]} oy={40} />
          <AbsoluteFill style={{background: `rgba(196,81,43,${0.18 * lock})`}} />
          <div style={{position: 'absolute', left: W / 2, top: 820 - (1 - lock) * 600, transform: 'translate(-50%,-50%)'}}>
            <svg width={300} height={340} viewBox="0 0 300 340" style={{filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}}>
              <path d="M75 150 V100 a75 75 0 0 1 150 0 V150" fill="none" stroke="#E9CF8E" strokeWidth={34} strokeLinecap="round" />
              <rect x={30} y={140} width={240} height={190} rx={34} fill="url(#lg)" stroke="#9C7726" strokeWidth={6} />
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6E3AE" /><stop offset="1" stopColor="#C9A24B" /></linearGradient></defs>
              <circle cx={150} cy={220} r={24} fill={C.nuit} /><rect x={140} y={230} width={20} height={52} rx={8} fill={C.nuit} />
            </svg>
          </div>
          <Titre y={240}>
            <div style={{...big, fontSize: 100}}>Le bien reste</div>
            <div><Accent at={swap + 4} size={170} color={C.orClair} stroke="none">bloqué.</Accent></div>
          </Titre>
          <Tampon at={r(10.87)} x={330} y={1240} txt="VENTE ✕" color={TERRE} rot={-8} size={1.15} />
          <Tampon at={r(11.58)} x={750} y={1400} txt="PARTAGE ✕" color={TERRE} rot={6} size={1.15} />
        </>
      )}
    </AbsoluteFill>
  );
};
const P6: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const swap = r(12.6);
  const A = MAP.villes.alger, G = MAP.villes.geneve;
  const u = prog(f, swap + 4, s(1.4), Easing.bezier(0.45, 0, 0.25, 1));
  const z = 0.8, cx = 1210, cy = 1960, tx = W / 2 - cx * z, ty = H / 2 - cy * z;
  const mx = (A[0] + G[0]) / 2 + 380, my = (A[1] + G[1]) / 2;
  const px = (1 - u) * (1 - u) * G[0] + 2 * (1 - u) * u * mx + u * u * A[0];
  const py = (1 - u) * (1 - u) * G[1] + 2 * (1 - u) * u * my + u * u * A[1];
  return (
    <AbsoluteFill>
      {(
        <>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 50%, #22406B 0%, #142540 50%, #0A111E 100%)'}} />
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <g transform={`translate(${tx} ${ty}) scale(${z})`}>
              {MAP.land.map((d, i) => <path key={i} d={d} fill="#27426A" stroke="rgba(233,207,142,0.3)" strokeWidth={1.6 / z} />)}
              {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#34588A" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />)}
              <path d={MAP.algerie} fill="#3A6297" stroke={C.orClair} strokeWidth={2.6 / z} />
              <path d={`M${G[0]} ${G[1]} Q${mx} ${my} ${A[0]} ${A[1]}`} fill="none" stroke="#F6E3AE" strokeWidth={7 / z} strokeDasharray={`${18 / z} ${14 / z}`} opacity={0.9} />
              {[G, A].map((P, i) => <circle key={i} cx={P[0]} cy={P[1]} r={18 / z} fill={C.orClair} />)}
            </g>
          </svg>
          {/* la procuration voyage de l'Europe vers l'Algérie */}
          <div style={{position: 'absolute', left: tx + px * z, top: ty + py * z, transform: `translate(-50%,-50%) rotate(${-8 + u * 16}deg) scale(${1 + Math.sin(u * Math.PI) * 0.15})`}}>
            <div style={{width: 250, padding: '18px 20px', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 20px 50px rgba(0,0,0,0.55)', borderTop: `10px solid ${C.or}`}}>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.marine}}>Procuration</div>
              {[0, 1, 2].map((i) => <div key={i} style={{marginTop: 12, height: 9, borderRadius: 5, background: '#E4DCCB', width: `${[90, 70, 80][i]}%`}} />)}
            </div>
          </div>
          <Titre y={190}>
            <div style={eyebrow}><Word at={r(12.45)}>Bonne nouvelle</Word></div>
            <div style={{...big, fontSize: 84, marginTop: 12}}><Word at={r(13.25)}>Préparée </Word><Word at={r(13.6)}>à distance,</Word></div>
            <div><Accent at={r(14.93)} size={140} color={C.orClair} stroke="none">par procuration.</Accent></div>
          </Titre>
          <Tampon at={r(15.25)} x={W / 2} y={1500} txt="SANS DÉPLACEMENT ✓" />
        </>
      )}
    </AbsoluteFill>
  );
};
const P7: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  return (
    <AbsoluteFill>
      <Fond src="img/px-succession.jpg" blur={8} veil={0.55} dur={s(2.2)} zoom={[1.05, 1.15]} />
      <Titre y={210}><div style={{...big, fontSize: 120}}><Word at={r(15.91)}>Besoin </Word><Word at={r(16.15)}>d’aide ?</Word></div></Titre>
      <Conseillere t0={15.28} dur={s(2.2)} y={1130} w={880} from="bas" tilt={1} />
    </AbsoluteFill>
  );
};
const P8: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = (x: number) => s(W7(x)) - s(W7(a));
  const open = prog(f, 0, 12, Easing.bezier(0.7, 0, 0.2, 1));
  const reveal = prog(f, 6, 20, Easing.bezier(0.6, 0, 0.2, 1));
  const btn = useSpring(r(17.45), 12, 150);
  const shine = interpolate(f, [r(18.0), r(18.8)], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 140}% at 50% 55%)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #26406A 0%, #16243A 40%, #0E1726 72%, #0A101C 100%)'}} />
      <Particles at={4} dur={s(0.8)} cx={W / 2} cy={H * 0.26} mode="in" n={90} spread={800} seed="p8" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.27, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}><Img src={L_logo_clair} style={{width: 640, display: 'block'}} /></div>
      </div>
      <div style={{position: 'absolute', top: H * 0.43, width: '100%', display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center', opacity: prog(f, 12, 10)}}>
        <div style={{width: 70, height: 2, background: C.or}} /><div style={eyebrow}>Pack Succession</div><div style={{width: 70, height: 2, background: C.or}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.55, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', overflow: 'hidden', whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 40px rgba(233,207,142,0.45)'}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réservez votre appel découverte</span>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '22%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)'}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.63, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.orClair, letterSpacing: 2, opacity: prog(f, r(17.7), 10)}}>moconseildz.com</div>
    </AbsoluteFill>
  );
};

const PLAN: [number, number, Sc][] = [
  [0, 1.68, P1], [1.66, 2.95, P2], [2.93, 5.55, P3], [5.53, 8.4, P4], [8.38, 12.45, P5], [12.43, 15.3, P6], [15.28, 17.6, P7], [17.25, P07_DUREE, P8],
];
export const Pack07Fredha: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    <Audio src={staticFile('audio/p07-bande-son.wav')} />
    {PLAN.map(([a, b, Comp], i) => {
      const from = i === 0 ? 0 : tt(a);
      const to = i === PLAN.length - 1 ? P07_FRAMES : tt(b);
      return (
        <Sequence key={i} from={from} durationInFrames={to - from}>
          <Comp a={i === 0 ? -OFF / 30 : a} b={b} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
