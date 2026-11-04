// Série « Un pack en 30 secondes » — vidéo 5 : Pack Conciergerie, v3 (refonte du 04/11/2026 : carte vectorielle, bureau plein écran sans bande, carrousel 3D, compte rendu 3D).
// Temps écrits sur la voix v2 (align_p05.json) ; recalés sur la nouvelle voix par Wp5 (warp_p05v3.ts).
// Voix « Homme » ElevenLabs (Eleven v3, balises), deux pauses raccourcies, accélérée x1,12 : 28,2 s (voix/align_p05.json).
// Temps écrits en secondes de la voix finale. Plan 1 : vidéo d'Amine (Maqam Echahid depuis le Jardin d'Essai) ;
// plan 2 : vidéo fournie par Amine (bureau en Europe), recadrée sous son filigrane et agrandie x2 (FSRCNN).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, LogoBurst, Particles, prog, s, SANS, useSpring, Word} from './kit';
import {Mask, Photo, Pin} from './scenes4';
import {MAP} from './map_med';
import {Wp5} from './warp_p05v3';

const W = 1080;
const H = 1920;
const HALF = 960;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};
const shadowW = 'drop-shadow(0 4px 18px rgba(0,0,0,0.6))';

type Sc = React.FC<{st: number; dur: number}>;
const useT = (st: number) => (x: number) => s(Wp5(x)) - s(Wp5(st));

const GoldLine: React.FC<{y: number; w?: number; glow?: number}> = ({y, w = W, glow = 1}) => (
  <div style={{position: 'absolute', left: (W - w) / 2, top: y - 3, height: 6, width: w, borderRadius: 6, background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 50%, ${C.orFonce})`, boxShadow: `0 0 ${24 * glow}px rgba(233,207,142,0.9), 0 0 ${64 * glow}px rgba(201,162,75,0.6)`}} />
);

const Label: React.FC<{text: string; y: number; op: number}> = ({text, y, op}) => (
  <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center', opacity: op}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px 8px 16px', borderRadius: 999, background: 'rgba(14,23,38,0.62)'}}>
      <Pin size={36} color={C.orClair} />
      <div style={{...eyebrow, fontSize: 26, color: C.blanc}}>{text}</div>
    </div>
  </div>
);

/* ------------------------------------------------ icônes (traits or, sobres) */
const Ico: React.FC<{k: 'facture' | 'logement' | 'courrier' | 'rdv' | 'photo'; size?: number; color?: string}> = ({k, size = 60, color = C.or}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {k === 'facture' && (<><path d="M14 6h28l10 10v42H14z" {...p} /><path d="M42 6v10h10" {...p} /><path d="M22 28h22M22 38h22M22 48h12" {...p} /></>)}
      {k === 'logement' && (<><path d="M8 30L32 10l24 20" {...p} /><path d="M14 26v30h36V26" {...p} /><path d="M27 56V40h10v16" {...p} /></>)}
      {k === 'courrier' && (<><rect x={6} y={14} width={52} height={36} rx={4} {...p} /><path d="M8 17l24 19 24-19" {...p} /></>)}
      {k === 'rdv' && (<><rect x={8} y={12} width={48} height={44} rx={6} {...p} /><path d="M8 26h48M20 6v12M44 6v12" {...p} /><path d="M24 41l6 6 12-13" {...p} /></>)}
      {k === 'photo' && (<><rect x={6} y={14} width={52} height={38} rx={5} {...p} /><circle cx={32} cy={33} r={10} {...p} /><path d="M22 14l4-6h12l4 6" {...p} /></>)}
    </svg>
  );
};

/* ===================================================== 1. Accroche : Alger (vidéo d'Amine, Maqam Echahid, ciel bleuté) — aucune animation ajoutée sur le premier plan (règle d'Amine, 26/10)
   v3 : la fin du plan se referme en cercle sur l'épingle d'Alger de la carte (raccord « zoom arrière »). */
const B1: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const z = interpolate(f, [0, dur], [1.12, 1.0], {...clamp, easing: Easing.bezier(0.2, 0.7, 0.3, 1)});
  const iris = interpolate(f, [t(1.55), t(1.88)], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.3, 1)});
  const rad = interpolate(iris, [0, 1], [1150, 46]);
  const ring = prog(f, t(1.6), 8);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{clipPath: `circle(${rad}px at 50% 50%)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${z * (1 - 0.55 * iris)})`, transformOrigin: '50% 50%'}}>
          <OffthreadVideo src={staticFile('video/s5-maqam-jardin.mp4')} muted style={{width: W, height: H, objectFit: 'cover'}} />
        </div>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.32) 0%, rgba(14,23,38,0.12) 22%, rgba(14,23,38,0) 32%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.35) 0%, rgba(14,23,38,0) 30%)'}} />
        <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW, opacity: 1 - iris * 2}}>
          <div style={{...big, fontSize: 104}}>
            <Word at={t(0.0)}>Vos </Word>
            <Word at={t(0.45)}>affaires</Word>
          </div>
          <div style={{marginTop: 2}}>
            <Accent at={t(0.85)} size={176} color={C.orClair} stroke="none">
              en Algérie…
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
      {iris > 0 && (
        <div style={{position: 'absolute', left: W / 2 - rad - 6, top: H / 2 - rad - 6, width: 2 * rad + 12, height: 2 * rad + 12, borderRadius: '50%', border: `6px solid ${C.orClair}`, boxShadow: '0 0 30px rgba(233,207,142,0.8)', opacity: ring}} />
      )}
    </AbsoluteFill>
  );
};


/* ===================================================== 1b. Carte : « … et vous vivez en Europe ? »
   v3 : carte vectorielle (Natural Earth, nette à tout zoom) ; trois arcs d'or partent d'Alger vers Paris, Genève et Bruxelles,
   la caméra suit puis plonge dans l'épingle de Genève, qui s'ouvre sur le bureau. */
const CITY = MAP.villes;
const ARCS: {k: keyof typeof CITY; l: string; d: number; side: number}[] = [
  {k: 'paris', l: 'Paris', d: 0, side: -1.6},
  {k: 'geneve', l: 'Genève', d: 3, side: 1.3},
  {k: 'bruxelles', l: 'Bruxelles', d: 6, side: 1.1},
];
const arcPath = (a: readonly number[], b: readonly number[], bend: number) => {
  const mx = (a[0] + b[0]) / 2 + bend;
  const my = (a[1] + b[1]) / 2;
  return {d: `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`, q: [mx, my]};
};
const qPt = (a: readonly number[], q: number[], b: readonly number[], u: number) => [
  (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * q[0] + u * u * b[0],
  (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * q[1] + u * u * b[1],
];
const BMAP: Sc = ({st}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  // caméra : centre (cx, cy) en pixels de carte, zoom z
  const k1 = interpolate(f, [t(1.62), t(2.62)], [0, 1], {...clamp, easing: inOut});
  const k2 = interpolate(f, [t(2.8), t(3.15)], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.9, 0.4)});
  const A = CITY.alger;
  const G = CITY.geneve;
  let cx = interpolate(k1, [0, 1], [A[0], 1150]);
  let cy = interpolate(k1, [0, 1], [A[1], 1650]);
  let z = interpolate(k1, [0, 1], [1.9, 0.8]);
  cx = interpolate(k2, [0, 1], [cx, G[0]]);
  cy = interpolate(k2, [0, 1], [cy, G[1]]);
  z = z * Math.pow(6, k2);
  const tx = W / 2 - cx * z;
  const ty = H / 2 - cy * z;
  const scr = (p: readonly number[]) => [tx + p[0] * z, ty + p[1] * z];
  const fadeIn = prog(f, t(1.5), 6);
  const textOut = prog(f, t(2.95), 6, easeIn);
  return (
    <AbsoluteFill style={{background: C.nuit, opacity: fadeIn}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #1E3150 0%, #13203A 45%, #0A111E 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="arcG" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#A8822F" />
            <stop offset="1" stopColor="#F6E3AE" />
          </linearGradient>
          <filter id="glowA" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g transform={`translate(${tx} ${ty}) scale(${z})`}>
          {MAP.land.map((d, i) => <path key={i} d={d} fill="#22385A" stroke="rgba(233,207,142,0.22)" strokeWidth={1.4 / z} />)}
          {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#2B456B" stroke="rgba(233,207,142,0.55)" strokeWidth={2 / z} />)}
          <path d={MAP.algerie} fill="#2E4A70" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />
          {ARCS.map((a, i) => {
            const B = CITY[a.k];
            const {d, q} = arcPath(A, B, a.side * 260);
            const u = interpolate(f, [t(1.85) + a.d, t(2.5) + a.d], [0, 1], {...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1)});
            if (u <= 0) return null;
            const head = qPt(A, q, B, u);
            return (
              <g key={i} filter="url(#glowA)">
                <path d={d} fill="none" stroke="url(#arcG)" strokeWidth={7 / z} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
                {u < 1 && <circle cx={head[0]} cy={head[1]} r={12 / z} fill="#FFF4D2" />}
              </g>
            );
          })}
        </g>
      </svg>
      {/* épingles (taille constante à l'écran) */}
      {[{k: 'alger' as const, l: 'Alger', at: t(1.62), side: 1}, ...ARCS.map((a) => ({k: a.k, l: a.l, at: t(2.5) + a.d, side: a.side}))].map((p, i) => {
        const P = scr(CITY[p.k]);
        const pop = useSpring(p.at, 10, 180);
        const lab = prog(f, p.at + 3, 8);
        if (f < p.at) return null;
        const pulse = (f - p.at) % 24 / 24;
        return (
          <div key={i} style={{position: 'absolute', left: P[0], top: P[1], opacity: 1 - k2}}>
            <div style={{position: 'absolute', left: -40 * (1 + pulse * 1.4), top: -40 * (1 + pulse * 1.4), width: 80 * (1 + pulse * 1.4), height: 80 * (1 + pulse * 1.4), borderRadius: '50%', border: `3px solid rgba(233,207,142,${0.7 * (1 - pulse)})`}} />
            <div style={{position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: C.orClair, boxShadow: '0 0 24px rgba(246,227,174,0.95)', transform: `scale(${pop})`}} />
            <div style={{position: 'absolute', top: -28, [p.side > 0 ? 'left' : 'right']: 34, opacity: lab, transform: `translateX(${(1 - lab) * 20 * p.side}px)`, whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: 999, background: 'rgba(14,23,38,0.72)', border: '2px solid rgba(233,207,142,0.6)', ...eyebrow, fontSize: 28, letterSpacing: 4, color: C.blanc}}>
              {p.l}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 1060, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.85))', opacity: 1 - textOut, transform: `scale(${1 + textOut * 0.3})`}}>
        <div style={{...big, fontSize: 100}}>
          <Word at={t(1.71)}>et </Word>
          <Word at={t(1.74)}>vous </Word>
          <Word at={t(1.9)}>vivez</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(2.25)} size={170} color={C.orClair} stroke="none">
            en Europe ?
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 2. Facture, logement, courrier, rendez-vous : il faut appeler un proche
   v3 (04/11, demande d'Amine) : vidéo du bureau en plein écran, plus aucune bande opaque sur l'homme ; texte posé en bas,
   sur un dégradé léger qui ne touche que le bureau ; étiquettes projetées en 3D depuis le fond. Plus de chevauchement de textes. */
const VS = H / 1296; // échelle plein écran
const VW = Math.round(1144 * VS);
const VXO = -408; // cadrage centré sur l'homme
const CARDS = [
  {k: 'facture' as const, l: 'Facture', at: 3.1, x: 270, y: 880, r: -5},
  {k: 'logement' as const, l: 'Logement', at: 3.82, x: 815, y: 1000, r: 4},
  {k: 'courrier' as const, l: 'Courrier', at: 4.44, x: 255, y: 1130, r: 3},
  {k: 'rdv' as const, l: 'Rendez-vous', at: 5.02, x: 790, y: 1250, r: -3.5},
];
const B2: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const iris = interpolate(f, [t(3.02), t(3.3)], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1)});
  const ringOp = interpolate(iris, [0, 0.08, 0.7, 1], [0, 1, 1, 0]);
  const z = interpolate(f, [0, dur], [1.08, 1.0], clamp);
  const out = interpolate(f, [t(7.9), t(8.12)], [0, 1], {...clamp, easing: easeIn});
  const grad = prog(f, t(5.6), 10);
  // à « il faut appeler un proche » : les étiquettes vibrent comme un téléphone
  const buzz = f >= t(6.73) && f < t(7.3) ? Math.sin(f * 2.6) * 5 * (1 - (f - t(6.73)) / (t(7.3) - t(6.73))) : 0;
  return (
    <AbsoluteFill style={{clipPath: `circle(${iris * 1150}px at 50% 50%)`, filter: `blur(${out * 14}px)`, opacity: 1 - out}}>
      <AbsoluteFill style={{background: C.nuit}} />
      <div style={{position: 'absolute', left: VXO, top: 0, width: VW, height: H, transform: `scale(${z * (1.25 - 0.25 * iris)})`, transformOrigin: '948px 420px'}}>
        <OffthreadVideo src={staticFile('video/s5-bureau-europe.mp4')} muted style={{width: VW, height: H, objectFit: 'cover'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.25) 0%, rgba(14,23,38,0) 12%)'}} />
      <AbsoluteFill style={{background: `linear-gradient(to top, rgba(14,23,38,${0.82 * grad}) 0%, rgba(14,23,38,${0.55 * grad}) 22%, rgba(14,23,38,0) 42%)`}} />
      <div style={{position: 'absolute', inset: 0, perspective: 1300, perspectiveOrigin: '50% 40%'}}>
        {CARDS.map((c, i) => {
          const a = t(c.at) - 3;
          const p = interpolate(f, [a, a + 11], [0, 1], {...clamp, easing: Easing.bezier(0.15, 0.9, 0.3, 1.08)});
          if (f < a) return null;
          const side = c.x < W / 2 ? -1 : 1;
          const land = interpolate(f, [a + 9, a + 11, a + 16], [0, 1, 0], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: c.x, top: c.y, transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) translate3d(${(1 - p) * side * -260 + buzz * (i % 2 ? 1 : -1)}px, ${(1 - p) * -160}px, ${(1 - p) * -1600}px) rotateX(${(1 - p) * 55}deg) rotateY(${(1 - p) * side * 50}deg) rotate(${c.r}deg) scale(${1 + land * 0.06})`, opacity: Math.min(1, p * 2.5), filter: `blur(${(1 - p) * 10}px)`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 36px 20px 24px', borderRadius: 12, background: 'linear-gradient(180deg, #FFFFFF 0%, #F4EFE6 100%)', borderLeft: `9px solid ${C.or}`, boxShadow: `0 ${30 - 10 * p}px ${70 - 20 * p}px rgba(14,23,38,0.55)`, whiteSpace: 'nowrap'}}>
                <Ico k={c.k} size={64} />
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.marine, letterSpacing: -1}}>{c.l}</span>
              </div>
            </div>
          );
        })}
      </div>
      {ringOp > 0 && <div style={{position: 'absolute', boxSizing: 'border-box', left: W / 2 - iris * 1150, top: H / 2 - iris * 1150, width: 2 * iris * 1150, height: 2 * iris * 1150, borderRadius: '50%', border: `7px solid ${C.orClair}`, boxShadow: 'inset 0 0 30px rgba(233,207,142,0.8)', opacity: ringOp}} />}
      <div style={{position: 'absolute', top: 1360, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...eyebrow, color: C.orClair, fontSize: 32}}>
          <Word at={t(5.8)}>À chaque fois,</Word>
        </div>
        <div style={{...big, fontSize: 88, marginTop: 10}}>
          <Word at={t(6.43)}>il </Word>
          <Word at={t(6.53)}>faut </Word>
          <Word at={t(6.73)}>appeler</Word>
        </div>
        <div style={{marginTop: -4}}>
          <Accent at={t(6.98)} size={140} color={C.orClair} stroke="none">
            un proche.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};



/* éclair d'or le long du trait (« EXACTEMENT ») : reflet horizontal, jamais de cercle autour d'un mot */
const Shock: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 18, Easing.bezier(0.1, 0.8, 0.3, 1));
  if (f < at || p >= 1) return null;
  const a = Math.sin(p * Math.PI);
  return (
    <>
      <div style={{position: 'absolute', left: x - 700 * (0.3 + p), top: y - 70, width: 1400 * (0.3 + p), height: 140, background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,244,210,${0.9 * a}) 0%, rgba(233,207,142,${0.45 * a}) 35%, rgba(233,207,142,0) 70%)`}} />
      <div style={{position: 'absolute', left: x - 30, top: y - 160 * (0.4 + p), width: 60, height: 320 * (0.4 + p), background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,244,210,${0.7 * a}) 0%, rgba(233,207,142,0) 70%)`}} />
    </>
  );
};

/* ===================================================== 3. Plan signature : Être votre représentant sur place, c'est exactement ce que nous faisons chez M et O Conseil */
const B3: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const photoIn = prog(f, 0, 12, ease);
  const reveal = prog(f, t(11.3), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const lab = prog(f, t(11.6), 12);
  const sub = prog(f, t(11.85), 14);
  const out = interpolate(f, [t(12.4), t(12.66)], [0, 1], {...clamp, easing: easeIn});
  const glow = 0.7 + 0.3 * Math.sin(f / 5);
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, opacity: Math.min(1, photoIn * 1.4) * (1 - out), transform: `scale(${1 + out * 0.5})`, filter: `blur(${out * 20}px)`}}>
      <Photo src={P.P_mains} w={1333} h={2000} zoom={1.22 - 0.12 * k} rot={-2 + 2 * k} oy={0.5} />
      <AbsoluteFill style={{background: 'rgba(14,23,38,0.62)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 45% at 50% 50%, rgba(14,23,38,0) 0%, rgba(14,23,38,0.45) 100%)'}} />
      <GoldLine y={HALF - 3} glow={glow} w={W * prog(f, 2, 14, inOut)} />
      <LogoBurst at={t(11.3) + 8} x={W / 2} y={1205} rx={360} ry={175} />
      <Particles at={t(11.3) + 6} dur={s(0.8)} cx={W / 2} cy={1200} mode="out" n={80} spread={460} seed="c3" boxW={560} boxH={200} />
      <div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <Mask at={0} out={t(9.42)} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(8.05)}>Être </Word>
            <Word at={t(8.17)}>votre</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Accent at={t(8.45)} size={140} color={C.orClair} stroke="none">
              représentant
            </Accent>
          </div>
          <div style={{...big, fontSize: 80, marginTop: 6}}>
            <Word at={t(8.89)}>sur </Word>
            <Word at={t(9.09)}>place,</Word>
          </div>
        </Mask>
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...big, fontSize: 78}}>
          <Word at={t(9.45)}>c’est </Word>
          <Word at={t(9.79)}>exactement</Word>
        </div>
        <div style={{...big, fontSize: 64, marginTop: 6, letterSpacing: -2}}>
          <Word at={t(10.39)}>ce </Word>
          <Word at={t(10.5)}>que </Word>
          <Word at={t(10.58)}>nous </Word>
          <Word at={t(10.72)}>faisons </Word>
          <Word at={t(10.97)}>chez</Word>
        </div>
      </div>
      <Shock at={t(9.79) + 2} x={W / 2} y={HALF - 3} />
      <Label text="Europe" y={250} op={lab} />
      <div style={{position: 'absolute', left: W / 2, top: 1210, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 600, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1478, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.blanc, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`, filter: shadowW}}>
        Une équipe en Europe, une équipe en Algérie
      </div>
      <Label text="Algérie" y={1630} op={lab} />
    </AbsoluteFill>
  );
};

/* ===================================================== 4. Le pack : factures, courrier, logement — carrousel 3D
   v3 : trois cartes photo sur un anneau en perspective ; l'anneau tourne sur chaque service dit, un tampon d'or se pose ;
   puis l'anneau s'ouvre en éventail sous « Sans vous déplacer ». */
const RING = [
  {src: P.P_s5_factures, w: 1600, h: 2841, oy: 0.62, k: 'facture' as const, l: 'Factures', st: 'RÉGLÉES', at: 14.82},
  {src: P.P_s5_papiers, w: 1600, h: 2400, oy: 0.55, k: 'courrier' as const, l: 'Courrier', st: 'RELEVÉ', at: 16.04},
  {src: P.P_s5_cles, w: 1600, h: 2400, oy: 0.5, k: 'logement' as const, l: 'Logement', st: 'CONTRÔLÉ', at: 17.39},
];
const CW = 560;
const CH = 760;
const Stamp: React.FC<{at: number; txt: string}> = ({at, txt}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= at + 5 ? 1 - 0.04 * Math.exp(-(f - at - 5) / 3) * Math.cos((f - at - 5) / 1.6) : 1;
  const flash = interpolate(f, [at + 5, at + 7, at + 18], [0, 1, 0], clamp);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', right: 26, top: 26, transform: `scale(${(1.9 - 0.9 * p) * settle}) rotate(-12deg)`, opacity: Math.min(1, p * 1.6), transformOrigin: '70% 30%'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 10, border: `5px solid ${C.orClair}`, background: 'rgba(14,23,38,0.78)', boxShadow: `0 0 ${30 * flash}px rgba(246,227,174,${flash})`}}>
        <svg width={38} height={38} viewBox="0 0 32 32"><path d="M5 17l7 7 15-16" fill="none" stroke={C.orClair} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 4, color: C.orClair}}>{txt}</span>
      </div>
    </div>
  );
};
const B4: Sc = ({st}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const push = interpolate(f, [t(19.6), t(19.9)], [0, 1], {...clamp, easing: inOut});
  const titleHit = useSpring(t(13.46), 11, 170);
  const enter = interpolate(f, [t(12.6), t(13.5)], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
  // rotation de l'anneau : 0° (factures), -120° (courrier), -240° (logement)
  const r1 = interpolate(f, [t(15.25), t(15.6)], [0, 1], {...clamp, easing: inOut});
  const r2 = interpolate(f, [t(16.5), t(16.85)], [0, 1], {...clamp, easing: inOut});
  const spinIn = (1 - enter) * 200;
  const rot = -120 * r1 - 120 * r2 + spinIn;
  const fan = interpolate(f, [t(17.85), t(18.3)], [0, 1], {...clamp, easing: inOut});
  const R = 470;
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`, transform: `translateX(${-push * W}px)`, background: C.nuit}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 55% at 50% 52%, #24395A 0%, #15233B 45%, #0A111E 100%)'}} />
      {/* sol réfléchissant */}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(201,162,75,0.08) 70%, rgba(0,0,0,0) 85%)'}} />
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center'}}>
        <div style={{...eyebrow, color: C.orClair, fontSize: 32}}>
          <Word at={t(12.67)}>Avec le pack</Word>
        </div>
        <div style={{marginTop: 4, transform: `scale(${f < t(13.46) ? 0 : 0.6 + 0.4 * titleHit})`, filter: 'drop-shadow(0 0 26px rgba(233,207,142,0.45))'}}>
          <Accent at={t(13.46)} size={136} color={C.orClair} stroke="none">
            Conciergerie
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: W / 2, top: 1040 - fan * 60, perspective: 1700, transformStyle: 'preserve-3d'}}>
        {RING.map((c, i) => {
          const a = ((i * 120 + rot) % 360 + 540) % 360 - 180; // angle autour de l'anneau, 0 = face caméra
          const rad = (a * Math.PI) / 180;
          // position anneau
          const xR = Math.sin(rad) * R;
          const zR = Math.cos(rad) * R - R;
          // position éventail : -1, 0, 1
          const slot = Math.abs(a) < 60 ? 0 : a > 0 ? 1 : -1;
          const xF = slot * 330;
          const zF = slot === 0 ? 0 : -120;
          const x = interpolate(fan, [0, 1], [xR, xF]);
          const zz = interpolate(fan, [0, 1], [zR, zF]);
          const ry = interpolate(fan, [0, 1], [a * 0.42, -slot * 18]);
          const sc = interpolate(fan, [0, 1], [1, 0.62]);
          const front = Math.max(0, Math.cos(rad));
          const op = Math.min(1, enter * 1.5);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${(1 - enter) * 500}px, ${zz}px) rotateY(${ry}deg) scale(${sc})`, zIndex: Math.round(100 + zz), opacity: op}}>
              <div style={{position: 'absolute', left: -CW / 2, top: -CH / 2, width: CW, height: CH, borderRadius: 22, overflow: 'hidden', border: `3px solid rgba(233,207,142,${0.45 + 0.55 * front})`, boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 ${40 * front}px rgba(201,162,75,${0.35 * front})`, backfaceVisibility: 'hidden'}}>
                <Photo src={c.src} w={c.w} h={c.h} fw={CW} fh={CH} oy={c.oy} zoom={1.05} />
                <AbsoluteFill style={{background: `rgba(10,17,30,${0.55 * (1 - front) * (1 - fan)})`}} />
                <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,17,30,0.88) 0%, rgba(10,17,30,0) 38%)'}} />
                <div style={{position: 'absolute', left: 30, bottom: 30, display: 'flex', alignItems: 'center', gap: 16}}>
                  <Ico k={c.k} size={58} color={C.orClair} />
                  <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: C.blanc, letterSpacing: -1}}>{c.l}</span>
                </div>
                <Stamp at={t(c.at)} txt={c.st} />
              </div>
              {/* reflet */}
              <div style={{position: 'absolute', left: -CW / 2, top: CH / 2 + 10, width: CW, height: CH * 0.35, borderRadius: 22, overflow: 'hidden', transform: 'scaleY(-1)', opacity: 0.18 * (1 - fan), WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0) 60%)', backfaceVisibility: 'hidden'}}>
                <Photo src={c.src} w={c.w} h={c.h} fw={CW} fh={CH * 0.35} oy={0.98} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1330, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(17.96)}>Sans </Word>
          <Word at={t(18.23)}>vous</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(18.75)} size={160} color={C.orClair} stroke="none">
            déplacer.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};


/* ===================================================== 5. Chaque mois : un compte rendu précis, avec tous les justificatifs */
const Seal: React.FC<{at: number; x: number; y: number; txt: string; k?: number}> = ({at, x, y, txt, k = 1}) => {
  const f = useCurrentFrame();
  const hit = at + 5;
  const p = interpolate(f, [at, hit], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= hit ? 1 - 0.035 * Math.exp(-(f - hit) / 3) * Math.cos((f - hit) / 1.6) : 1;
  const flash = interpolate(f, [hit, hit + 2, hit + 14], [0, 1, 0], clamp);
  if (f < at) return null;
  const sc = (1.75 - 0.75 * p) * settle * k;
  const r = 128;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${sc}) rotate(-10deg)`, opacity: Math.min(1, p * 1.5)}}>
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${16 * flash}px rgba(246,227,174,${flash}))`}}>
        <defs>
          <path id="seal5" d={`M 0 0 m -${r - 26} 0 a ${r - 26} ${r - 26} 0 1 1 ${2 * (r - 26)} 0 a ${r - 26} ${r - 26} 0 1 1 -${2 * (r - 26)} 0`} />
          <radialGradient id="seal5g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(150)">
            <stop offset="0" stopColor="#F6E3AE" />
            <stop offset="0.7" stopColor="#C9A24B" />
            <stop offset="1" stopColor="#9C7726" />
          </radialGradient>
        </defs>
        <circle r={r + 14} fill="rgba(14,23,38,0.72)" />
        <circle r={r} fill="none" stroke="url(#seal5g)" strokeWidth={8} />
        <circle r={r - 52} fill="none" stroke="url(#seal5g)" strokeWidth={3} />
        <text fill="#F2DDA2" fontFamily="Manrope" fontWeight={800} fontSize={23} letterSpacing={3.4}>
          <textPath href="#seal5" startOffset="0">{txt}</textPath>
        </text>
        <path d="M-34 4l22 22 46-52" fill="none" stroke="#F2DDA2" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
const LINES = [
  {k: 'facture' as const, l: 'Factures réglées', at: 21.31},
  {k: 'courrier' as const, l: 'Courrier numérisé', at: 21.55},
  {k: 'logement' as const, l: 'Logement contrôlé', at: 21.78},
  {k: 'rdv' as const, l: 'Rendez-vous tenus', at: 22.02},
];
const PROOFS = [
  {k: 'facture' as const, l: 'Facture acquittée', at: 22.59, x: 230, r: -7},
  {k: 'courrier' as const, l: 'Courrier scanné', at: 22.82, x: 540, r: 3},
  {k: 'photo' as const, l: 'Photo du bien', at: 23.05, x: 850, r: 8},
];
const B5: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: inOut});
  const sheetIn = useSpring(t(20.9), 14, 120);
  const hit = t(23.45) + 5;
  const shake = f >= hit && f < hit + 6 ? (random('c5' + f) - 0.5) * 10 * (1 - (f - hit) / 6) : 0;
  const z = interpolate(f, [0, dur], [1.08, 1.0], clamp);
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.pierre}}>
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <Photo src={P.P_s2_classeurs} w={1600} h={2400} zoom={z} ox={0.5} oy={0.6} filter="saturate(0.85) blur(5px)" />
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.97) 0%, rgba(244,239,230,0.9) 24%, rgba(244,239,230,0.35) 48%, rgba(14,23,38,0.35) 100%)'}} />
        <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', color: C.marine}}>
          <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
            <Word at={t(19.86)}>Chaque mois,</Word>
            <Word at={t(20.3)}> ce que vous obtenez</Word>
          </div>
          <div style={{...big, fontSize: 92, marginTop: 20}}>
            <Word at={t(21.23)}>un </Word>
            <Word at={t(21.31)}>compte </Word>
            <Word at={t(21.52)}>rendu</Word>
          </div>
          <div style={{marginTop: 0}}>
            <Accent at={t(21.78)} size={150} color={OR_TEXTE} stroke="none">
              précis.
            </Accent>
          </div>
        </div>
        {/* la feuille du compte rendu */}
        <div style={{position: 'absolute', left: W / 2, top: 1070, perspective: 1400}}>
          <div style={{transform: `translate(-50%,-50%) translateY(${(1 - sheetIn) * 420}px) rotateX(${(1 - sheetIn) * 72 + 6}deg) rotateZ(${-1.5 + (1 - sheetIn) * 4}deg)`, transformOrigin: '50% 100%'}}>
          <div style={{position: 'relative', width: 820, height: 560, borderRadius: 8, background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F2E8 100%)', boxShadow: '0 40px 90px rgba(14,23,38,0.45)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 104, background: C.marine, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px'}}>
              <span style={{...eyebrow, fontSize: 30, color: C.orClair, letterSpacing: 5}}>Compte rendu</span>
              <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.blanc}}>Novembre</span>
            </div>
            {LINES.map((ln, i) => {
              const p = prog(f, t(ln.at), 9);
              const tick = prog(f, t(ln.at) + 3, 8);
              return (
                <div key={i} style={{position: 'absolute', left: 44, top: 140 + i * 100, display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                  <Ico k={ln.k} size={52} color={C.or} />
                  <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.marine, letterSpacing: -0.5, width: 520}}>{ln.l}</span>
                  <div style={{width: 46, height: 46, borderRadius: 46, background: tick > 0 ? C.or : 'transparent', border: `3px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width={24} height={24} viewBox="0 0 32 32"><path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} /></svg>
                  </div>
                </div>
              );
            })}
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${interpolate(f, [t(22.0), t(22.6)], [-40, 140], clamp)}%`, width: '30%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)'}} />
          </div>
          </div>
        </div>
        {/* les justificatifs glissent sous la feuille */}
        {PROOFS.map((pr, i) => {
          const a = t(pr.at);
          const p = interpolate(f, [a, a + 10], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.9, 0.3, 1)});
          if (f < a) return null;
          return (
            <div key={i} style={{position: 'absolute', left: pr.x, top: 1615 + (1 - p) * 300, transform: `translate(-50%,-50%) perspective(1200px) translateZ(${(1 - p) * 900}px) rotateY(${(1 - p) * (i - 1) * -40}deg) rotateX(${(1 - p) * -30}deg) rotate(${pr.r * (0.4 + 0.6 * p)}deg)`, opacity: Math.min(1, p * 2)}}>
              <div style={{width: 290, padding: '26px 18px', borderRadius: 8, background: '#FCFAF5', boxShadow: '0 20px 44px rgba(14,23,38,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderTop: `8px solid ${C.or}`}}>
                <Ico k={pr.k} size={70} color={C.or} />
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.marine, whiteSpace: 'nowrap'}}>{pr.l}</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Seal at={t(23.45)} x={W - 112} y={1405} k={0.78} txt="JUSTIFICATIFS JOINTS · M&O · " />
    </AbsoluteFill>
  );
};

/* ===================================================== 6. Vous restez chez vous, nous gérons le reste */
const B6: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const open = interpolate(f, [0, 11], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1)});
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 120}% at 50% 55%)`}}>
      <Photo src={P.P_s2_chez_vous} w={1600} h={2400} ox={0.5} oy={0.55} zoom={1.12 - 0.07 * k} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.97) 0%, rgba(244,239,230,0.92) 28%, rgba(244,239,230,0.3) 46%, rgba(244,239,230,0) 58%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.82) 0%, rgba(14,23,38,0.45) 26%, rgba(14,23,38,0) 44%)'}} />
      <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 96}}>
          <Word at={t(24.52)}>Vous </Word>
          <Word at={t(24.67)}>restez</Word>
        </div>
        <div style={{...big, fontSize: 96}}>
          <Word at={t(24.88)}>chez </Word>
          <Word at={t(25.02)}>vous,</Word>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1290, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...big, fontSize: 96}}>
          <Word at={t(25.47)}>nous </Word>
          <Word at={t(25.69)}>gérons</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(26.04)} size={170} color={C.orClair} stroke="none">
            le reste.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 7. Carte de fin nuit et or (bible) */
const B7: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(26.85), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const pack = prog(f, t(27.45), 14);
  const btn = useSpring(t(27.05), 12, 150);
  const url = prog(f, t(27.7), 14);
  const shine = interpolate(f, [t(28.1), t(28.9)], [-30, 130], clamp);
  const breathe = 1 + 0.012 * Math.sin(f / 18);
  const glowAlg = 0.65 + 0.35 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${bg * 150}% at 50% 50%)`, background: C.nuit}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)'}} />
      </AbsoluteFill>
      <Particles at={t(26.75)} dur={s(0.6)} cx={W / 2} cy={H * 0.24} mode="in" n={90} spread={800} seed="c7" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.24, transform: `translate(-50%,-50%) scale(${(0.9 + 0.1 * reveal) * breathe})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 680, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.385, width: '100%', textAlign: 'center'}}>
        <div style={{...big, fontSize: 60, fontWeight: 700, letterSpacing: -1, color: 'rgba(255,255,255,0.92)'}}>
          <Word at={t(27.0)}>Le </Word>
          <Word at={t(27.08)}>trait </Word>
          <Word at={t(27.16)}>d’union </Word>
          <Word at={t(27.24)}>avec </Word>
          <Word at={t(27.32)}>votre</Word>
        </div>
        <div style={{marginTop: 4, filter: `drop-shadow(0 0 ${22 * glowAlg}px rgba(233,207,142,0.55))`}}>
          <Accent at={t(27.4)} size={160} color={C.orClair} stroke="none">
            Algérie.
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.6, width: '100%', display: 'flex', justifyContent: 'center', opacity: pack, transform: `translateY(${(1 - pack) * 20}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 70, height: 2, background: C.or}} />
          <div style={{...eyebrow, color: C.orClair, fontSize: 32, letterSpacing: 6}}>Pack Conciergerie</div>
          <div style={{width: 70, height: 2, background: C.or}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.72, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(201,162,75,0.35)', whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réserver un appel découverte →</span>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '22%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)'}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.785, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.orClair, letterSpacing: 2, opacity: url, transform: `translateY(${(1 - url) * 20}px)`}}>
        moconseildz.com
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== montage (ordre = superposition : la carte sous l'accroche, le bureau au-dessus de la carte) */
export const OFF = 14; // images de Maqam avant le début de la voix
export const P05V3_DUREE = 29.5;
const PLAN: [number, number, Sc, boolean?][] = [
  [1.5, 3.32, BMAP],
  [0, 1.95, B1, true],
  [2.9, 8.12, B2],
  [7.9, 12.7, B3],
  [12.45, 20.0, B4],
  [19.6, 24.3, B5],
  [23.95, 26.95, B6],
  [26.6, P05V3_DUREE, B7],
];
export const P05V3_FRAMES = s(Wp5(P05V3_DUREE)) + OFF;

export const Pack05ConciergerieV3: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {PLAN.map(([a, b, Comp, first], i) => {
      const from = first ? 0 : s(Wp5(a)) + OFF;
      const to = s(Wp5(b)) + OFF;
      return (
        <Sequence key={i} from={from} durationInFrames={to - from}>
          <Comp st={first ? -OFF / 30 : a} dur={to - from} />
        </Sequence>
      );
    })}
    <Finish />
  </AbsoluteFill>
);
