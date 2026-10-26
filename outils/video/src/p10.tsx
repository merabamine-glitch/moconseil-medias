// Vidéo « Pack Retour Définitif » — 15 s, voix « Femme » (une seule prise), motion design éditorial.
// Direction (26/10/2026, liberté totale donnée par Amine) : page crème, typographie mixte Manrope 800 / Cormorant italique,
// collage de photos, objets au premier plan avec flou de mouvement, valise 3D, plan humain (vidéo IA d'Amine), carte de fin nuit et or.
// Temps en images (30 i/s) calés mot à mot sur voix/align_p10.json (+ 0,3 s de décalage).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, Img} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {C, SANS, SERIF, clamp, LogoBurst} from './kit';
import * as P from './photos';
import * as A from './assets';
import {Valise} from './valise3d';

export const P10_FRAMES = 450;
const W = 1080, H = 1920;
const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const IN3 = Easing.bezier(0.32, 0, 0.67, 0);
const OR_TXT = '#9C7726';
const pr = (f: number, a: number, d: number, e = EXPO) => interpolate(f, [a, a + d], [0, 1], {...clamp, easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const GOLD_GRAD = 'linear-gradient(100deg, #8E6B22 0%, #C9A24B 35%, #F1D99A 50%, #C9A24B 65%, #8E6B22 100%)';

/* ---------- briques ---------- */

/** Mot qui entre en flou net (sans glissement), puis sort en flou. */
const BW: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out = 9999, children, style}) => {
  const f = useCurrentFrame();
  const a = pr(f, at, 5, Easing.out(Easing.quad));
  const o = pr(f, out, 5, IN3);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', opacity: a * (1 - o), filter: `blur(${(1 - a) * 9 + o * 12}px)`, transform: `translateY(${-o * 14}px)`, ...style}}>
      {children}
    </span>
  );
};

/** Lettres qui montent d'une fente (masque), décalées. */
const Rise: React.FC<{at: number; text: string; stagger?: number; dur?: number; style?: React.CSSProperties; letterStyle?: React.CSSProperties; out?: number}> = ({at, text, stagger = 1.2, dur = 13, style, letterStyle, out = 9999}) => {
  const f = useCurrentFrame();
  const o = pr(f, out, 6, IN3);
  return (
    <div style={{display: 'flex', justifyContent: 'center', overflow: 'hidden', paddingTop: '0.16em', marginTop: '-0.16em', paddingBottom: '0.08em', marginBottom: '-0.08em', opacity: 1 - o, filter: `blur(${o * 10}px)`, ...style}}>
      {text.split('').map((ch, i) => {
        const k = pr(f, at + i * stagger, dur);
        return (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${(1 - k) * 135}%)`, opacity: k > 0 ? 1 : 0, ...letterStyle}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const Grain: React.FC<{opacity?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({opacity = 0.07, blend = 'multiply'}) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 2);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${P.P_r10_grain})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${Math.floor(random('gx' + k) * 512)}px ${Math.floor(random('gy' + k) * 512)}px`,
        opacity,
        mixBlendMode: blend,
        pointerEvents: 'none',
      }}
    />
  );
};

const DotGrid: React.FC<{color: string; opacity: number; drift?: number}> = ({color, opacity, drift = 0.5}) => {
  const f = useCurrentFrame();
  const off = (f * drift) % 72;
  return (
    <svg width={W} height={H + 80} style={{position: 'absolute', left: 0, top: -off, opacity}}>
      <defs>
        <pattern id={'dots' + color.replace('#', '')} width={72} height={72} patternUnits="userSpaceOnUse">
          <circle cx={36} cy={36} r={2.6} fill={color} />
        </pattern>
      </defs>
      <rect width={W} height={H + 80} fill={`url(#dots${color.replace('#', '')})`} />
    </svg>
  );
};

const Paper: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 70% at 50% 42%, #FDFBF6 0%, #F4EFE6 58%, #E7DCC7 100%)'}}>
    <DotGrid color="#B08A3A" opacity={0.3} />
  </AbsoluteFill>
);

const shadowCard = '0 34px 70px rgba(14,23,38,0.28), 0 10px 22px rgba(14,23,38,0.16)';

/** Carte photo qui arrive (et repart) avec flou de mouvement. */
const PhotoCard: React.FC<{
  src: string; w: number; h: number;
  from: [number, number, number]; to: [number, number, number]; at: number; dur?: number;
  exit?: [number, number, number]; exitAt?: number; label?: string;
}> = ({src, w, h, from, to, at, dur = 14, exit, exitAt = 9999, label}) => {
  const f = useCurrentFrame();
  const pos = (fr: number) => {
    const k = pr(fr, at, dur);
    let x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k), r = lerp(from[2], to[2], k);
    if (exit) {
      const e = pr(fr, exitAt, 9, IN3);
      x = lerp(x, exit[0], e); y = lerp(y, exit[1], e); r = lerp(r, exit[2], e);
    }
    return [x, y, r];
  };
  if (f < at) return null;
  const [x, y, r] = pos(f);
  const [x0, y0] = pos(f - 1);
  const v = Math.hypot(x - x0, y - y0);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: `blur(${Math.min(16, v * 0.09)}px)`, borderRadius: 26, overflow: 'hidden', boxShadow: shadowCard, border: '10px solid #FFFDF8'}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      {label ? (
        <div style={{position: 'absolute', left: 18, bottom: 18, padding: '10px 20px', borderRadius: 999, background: 'rgba(255,253,248,0.94)', fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.nuit, textTransform: 'uppercase'}}>{label}</div>
      ) : null}
    </div>
  );
};

/** Étiquette de bagage (premier plan, filée). */
const Ticket: React.FC<{x: number; y: number; scale: number; rot: number; blur: number}> = ({x, y, scale, rot, blur}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 560, height: 250, transform: `rotate(${rot}deg) scale(${scale})`, filter: `blur(${blur}px)`, borderRadius: 24, background: 'linear-gradient(135deg, #FFFDF8 0%, #F3E7CC 100%)', boxShadow: '0 30px 60px rgba(14,23,38,0.3)', display: 'flex', overflow: 'hidden'}}>
    <div style={{width: 150, background: GOLD_GRAD, borderRight: '4px dashed rgba(14,23,38,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 34, height: 34, borderRadius: 34, background: '#F4EFE6', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.3)'}} />
    </div>
    <div style={{flex: 1, padding: '28px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: OR_TXT}}>RETOUR · ALGÉRIE</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 116, letterSpacing: -3, color: C.nuit, lineHeight: 1}}>ALG</div>
    </div>
  </div>
);

/* ---------- plan 1 : l'accroche ---------- */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const out = pr(f, 51, 6, IN3);
  // avion : courbe de Bézier vers la fenêtre (Alger)
  const pt = (k: number) => {
    const p0 = [930, 180], p1 = [980, 620], p2 = [560, 760];
    const u = 1 - k;
    return [u * u * p0[0] + 2 * u * k * p1[0] + k * k * p2[0], u * u * p0[1] + 2 * u * k * p1[1] + k * k * p2[1]];
  };
  const kp = interpolate(f, [0, 40], [0, 1], {...clamp, easing: Easing.bezier(0.35, 0.1, 0.4, 1)});
  const [px, py] = pt(kp);
  const [qx, qy] = pt(Math.min(1, kp + 0.02));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI + 90;
  const ps = lerp(1.35, 0.28, kp);
  const pOp = 1 - pr(f, 33, 8, IN3);
  const trail = Array.from({length: 40}, (_, i) => pt((kp * i) / 39));
  const winZoom = interpolate(f, [0, 56], [1.16, 1.0], {...clamp, easing: Easing.out(Easing.quad)});
  const arch = pr(f, 0, 18);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 14}px)`}}>
      {/* fenêtre en arche sur Alger */}
      <div style={{position: 'absolute', left: 150, top: 470, width: 780, height: 860, borderRadius: '390px 390px 40px 40px', border: `3px solid ${C.or}`, opacity: 0.75 * arch, transform: `scale(${lerp(0.96, 1, arch)})`}} />
      <div style={{position: 'absolute', left: 175, top: 495, width: 730, height: 810, borderRadius: '365px 365px 26px 26px', overflow: 'hidden', boxShadow: shadowCard}}>
        <OffthreadVideo src={staticFile('video/s5-maqam-jardin.mp4')} startFrom={24} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${winZoom})`}} />
      </div>
      {/* trajectoire dorée */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: pOp}}>
        <polyline points={trail.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.or} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
      </svg>
      <Img src={P.P_avion} style={{position: 'absolute', left: px - 170, top: py - 171, width: 340, height: 342, opacity: pOp, transform: `rotate(${ang}deg) scale(${ps})`, filter: `drop-shadow(${46 * ps}px ${60 * ps}px ${10 + 8 * ps}px rgba(14,23,38,0.22))`}} />
      {/* texte */}
      <div style={{position: 'absolute', top: 290, width: W, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 86, color: C.nuit, letterSpacing: -0.5}}>
        <BW at={11}>Vous </BW><BW at={13}>rentrez </BW><BW at={22}>vivre </BW><BW at={29}>en</BW>
      </div>
      <div style={{position: 'absolute', top: 1300, width: W, display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
        <Rise at={31} text="ALGÉRIE" stagger={0.6} dur={10} style={{fontFamily: SANS, fontWeight: 800, fontSize: 184, letterSpacing: -7, color: C.nuit, lineHeight: 1.05}} />
        <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 196, color: OR_TXT, marginLeft: 10, opacity: pr(f, 43, 5), transform: `scale(${lerp(1.6, 1, pr(f, 43, 10))})`, display: 'inline-block'}}>?</span>
      </div>
    </AbsoluteFill>
  );
};

/** Trois étiquettes qui filent au premier plan (transition 1 → 2). */
const Whip: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const items = [
    {y: 380, s: 1.05, r: -8, d: 0},
    {y: 900, s: 1.45, r: 6, d: 1.5},
    {y: 1420, s: 0.9, r: -4, d: 3},
  ];
  return (
    <>
      {items.map((it, i) => {
        const k = interpolate(f, [at + it.d, at + it.d + 11], [0, 1], {...clamp, easing: INOUT});
        if (k <= 0 || k >= 1) return null;
        const x = lerp(1250, -1000, k);
        const v = Math.sin(Math.PI * k);
        return <Ticket key={i} x={x} y={it.y - 125} scale={it.s} rot={it.r} blur={4 + 16 * v} />;
      })}
    </>
  );
};

/* ---------- plan 2 : les cinq chantiers ---------- */
const WORDS: {w: string; at: number; serif?: boolean}[] = [
  {w: 'Logement,', at: 54},
  {w: 'voiture,', at: 66, serif: true},
  {w: 'banque,', at: 89},
  {w: 'santé,', at: 109, serif: true},
  {w: 'école…', at: 121},
];

const BankCard: React.FC<{at: number; exitAt: number}> = ({at, exitAt}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = pr(f, at, 16);
  const e = pr(f, exitAt, 9, IN3);
  const ry = lerp(84, -10, k);
  const x = lerp(-420, 40, k) + lerp(0, -900, e);
  const y = 230 + lerp(0, -300, e);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 560, height: 352, perspective: 1400, filter: `blur(${(1 - k) * 8 + e * 14}px)`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 30, transform: `rotateY(${ry}deg) rotate(-9deg)`, background: 'linear-gradient(135deg, #24385c 0%, #0E1726 55%, #1B2A41 100%)', boxShadow: shadowCard, position: 'relative', overflow: 'hidden'}}>
        <svg width={560} height={352} style={{position: 'absolute', left: 0, top: 0, opacity: 0.35}}>
          {Array.from({length: 9}).map((_, i) => (
            <path key={i} d={`M -20 ${60 + i * 34} C 160 ${20 + i * 34}, 380 ${120 + i * 34}, 600 ${50 + i * 34}`} stroke="#C9A24B" strokeWidth={1.4} fill="none" />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 46, top: 96, width: 92, height: 72, borderRadius: 14, background: GOLD_GRAD, boxShadow: 'inset 0 0 0 2px rgba(14,23,38,0.25)'}}>
          <div style={{position: 'absolute', left: 30, top: 0, width: 2, height: 72, background: 'rgba(14,23,38,0.3)'}} />
          <div style={{position: 'absolute', left: 60, top: 0, width: 2, height: 72, background: 'rgba(14,23,38,0.3)'}} />
          <div style={{position: 'absolute', left: 0, top: 35, width: 92, height: 2, background: 'rgba(14,23,38,0.3)'}} />
        </div>
        <svg width={60} height={60} style={{position: 'absolute', left: 160, top: 102}}>
          {[12, 22, 32].map((r) => <path key={r} d={`M ${10} ${30 - r * 0.7} A ${r} ${r} 0 0 1 ${10} ${30 + r * 0.7}`} stroke="#E9CF8E" strokeWidth={4} fill="none" strokeLinecap="round" transform={`translate(${r * 0.6} 0)`} />)}
        </svg>
        <div style={{position: 'absolute', left: 46, bottom: 44, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: '#E9CF8E'}}>DEVISES · DINARS</div>
        <div style={{position: 'absolute', right: 40, bottom: 36, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 52, color: '#E9CF8E'}}>dz</div>
      </div>
    </div>
  );
};

const Ecg: React.FC<{at: number; exitAt: number}> = ({at, exitAt}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = pr(f, at, 14, Easing.bezier(0.45, 0, 0.25, 1));
  const e = pr(f, exitAt, 7, IN3);
  const d = 'M -20 0 L 300 0 L 340 -10 L 370 20 L 405 -150 L 445 110 L 480 -30 L 510 0 L 700 0 L 725 -40 L 750 0 L 1100 0';
  const len = 1700;
  return (
    <svg width={W} height={400} style={{position: 'absolute', left: 0, top: 945, overflow: 'visible', opacity: 1 - e, filter: `blur(${e * 10}px)`}}>
      <g transform="translate(0 160) scale(1 0.75)">
        <path d={d} fill="none" stroke="rgba(201,162,75,0.25)" strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} style={{filter: 'blur(8px)'}} />
        <path d={d} fill="none" stroke={OR_TXT} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
      </g>
    </svg>
  );
};

const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const idx = WORDS.reduce((acc, w, i) => (f >= w.at ? i : acc), 0);
  const slide = WORDS.map((w, i) => pr(f, w.at - 2, 8)).reduce((a, b) => a + b, 0) - 1;
  const inn = pr(f, 52, 8);
  const out = pr(f, 136, 6, IN3);
  return (
    <div style={{position: 'absolute', top: 712, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: inn * (1 - out), filter: `blur(${out * 8}px)`}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: OR_TXT}}>CHANTIER</div>
      <div style={{height: 52, overflow: 'hidden', fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.nuit, lineHeight: '52px'}}>
        <div style={{transform: `translateY(${-Math.max(0, slide) * 52}px)`}}>
          {WORDS.map((_, i) => <div key={i}>0{i + 1}</div>)}
        </div>
      </div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: 'rgba(14,23,38,0.4)'}}>/ 05</div>
      <span style={{display: 'none'}}>{idx}</span>
    </div>
  );
};

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const EX = 136;
  return (
    <AbsoluteFill>
      <Ecg at={106} exitAt={EX} />
      <PhotoCard src={P.P_r10_logement} w={460} h={575} from={[1250, -80, 14]} to={[580, 150, -6]} at={52} exit={[1300, -200, 10]} exitAt={EX} />
      <BankCard at={86} exitAt={EX + 1} />
      <PhotoCard src={P.P_r10_voiture} w={450} h={565} from={[-620, 1450, -10]} to={[48, 1160, 5]} at={63} exit={[-700, 1700, -8]} exitAt={EX + 1} />
      <PhotoCard src={P.P_r10_ecole} w={450} h={565} from={[1250, 1550, 14]} to={[582, 1170, 6]} at={118} exit={[1300, 1800, 12]} exitAt={EX} />
      <Counter />
      {WORDS.map((w, i) => {
        const next = WORDS[i + 1]?.at ?? EX + 2;
        return (
          <div key={w.w} style={{position: 'absolute', top: 800, width: W, textAlign: 'center'}}>
            <BW at={w.at} out={next - 1} style={w.serif ? {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 200, color: OR_TXT, letterSpacing: -2, lineHeight: 1.1} : {fontFamily: SANS, fontWeight: 800, fontSize: 168, color: C.nuit, letterSpacing: -6, lineHeight: 1.25}}>
              {w.w}
            </BW>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- plan 3 : le pack, puis l'interlocuteur unique ---------- */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  // « porté » vers le haut : 1 → 0,36, flou au milieu du mouvement
  const c = pr(f, 199, 13, INOUT);
  const blur = Math.sin(Math.PI * c) * 7;
  const sc = lerp(1, 0.36, c);
  const ty = lerp(0, 255 - 905, c);
  const pre = pr(f, 194, 6, IN3);
  const under = pr(f, 186, 12, Easing.bezier(0.45, 0, 0.2, 1));
  const out = pr(f, 286, 7, IN3);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
      <div style={{position: 'absolute', top: 520, width: W, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 88, color: C.nuit, opacity: 1 - pre, filter: `blur(${pre * 10}px)`}}>
        <BW at={143}>avec </BW><BW at={145}>le </BW>
        <BW at={150} style={{fontWeight: 700, fontSize: 116, color: OR_TXT}}>Pack</BW>
      </div>
      <div style={{position: 'absolute', left: 0, top: 650, width: W, height: 510, transform: `translateY(${ty}px) scale(${sc})`, transformOrigin: '50% 50%', filter: `blur(${blur}px)`}}>
        <Rise at={174} text="RETOUR" stagger={1.4} style={{fontFamily: SANS, fontWeight: 800, fontSize: 236, letterSpacing: -9, color: C.nuit, lineHeight: 1}} />
        <Rise at={179} text="DÉFINITIF" stagger={1.1} style={{fontFamily: SANS, fontWeight: 800, fontSize: 168, letterSpacing: -6, lineHeight: 1.05, marginTop: 4}} letterStyle={{background: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}} />
        <div style={{margin: '18px auto 0', width: 640 * under, height: 8, borderRadius: 8, background: GOLD_GRAD}} />
      </div>
    </AbsoluteFill>
  );
};

const ArchLine: React.FC = () => {
  const f = useCurrentFrame();
  const k = pr(f, 142, 40, Easing.bezier(0.45, 0, 0.2, 1));
  const out = pr(f, 196, 10, IN3);
  const d = 'M 130 1330 L 130 840 A 410 410 0 0 1 950 840 L 950 1330';
  const len = 2280;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 0.55 * (1 - out)}}>
      <path d={d} fill="none" stroke={C.or} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
    </svg>
  );
};

const HUB = {x: 540, y: 865};
const R = 300;
const SATS = [
  {l: 'Logement', i: 'home'},
  {l: 'Voiture', i: 'car'},
  {l: 'Banque', i: 'card'},
  {l: 'Santé', i: 'pulse'},
  {l: 'École', i: 'school'},
];
const Icon: React.FC<{k: string}> = ({k}) => {
  const st = {fill: 'none', stroke: C.nuit, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={34} height={34} viewBox="0 0 24 24">
      {k === 'home' && <><path d="M3 11 L12 4 L21 11" {...st} /><path d="M6 10 V20 H18 V10" {...st} /><path d="M10 20 V15 H14 V20" {...st} /></>}
      {k === 'car' && <><path d="M4 16 V12 L6.5 7 H17.5 L20 12 V16 Z" {...st} /><circle cx={7.5} cy={16.5} r={1.8} {...st} /><circle cx={16.5} cy={16.5} r={1.8} {...st} /><path d="M4 12 H20" {...st} /></>}
      {k === 'card' && <><rect x={3} y={6} width={18} height={13} rx={2.5} {...st} /><path d="M3 10.5 H21" {...st} /><path d="M6.5 15 H10" {...st} /></>}
      {k === 'pulse' && <path d="M2 12 H7 L9 7 L12.5 17 L15 10 L16.5 12 H22" {...st} />}
      {k === 'school' && <><path d="M2 9 L12 4.5 L22 9 L12 13.5 Z" {...st} /><path d="M6 11 V16 C8.5 18.5 15.5 18.5 18 16 V11" {...st} /></>}
    </svg>
  );
};

const Hub: React.FC = () => {
  const f = useCurrentFrame();
  const hubIn = spring({frame: f - 203, fps: 30, config: {damping: 13, stiffness: 150, mass: 0.8}});
  const ring = pr(f, 206, 22);
  const rot = Math.max(0, f - 206) * 0.13;
  const pull = pr(f, 282, 11, IN3);
  const hubOut = pr(f, 290, 6, IN3);
  return (
    <AbsoluteFill>
      {/* orbite pointillée */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: ring * (1 - pull)}}>
        <g transform={`translate(${HUB.x} ${HUB.y}) rotate(${rot}) scale(${lerp(0.7, 1, ring) * (1 - pull)})`}>
          <circle r={R} fill="none" stroke={C.or} strokeWidth={3} strokeDasharray="3 15" strokeLinecap="round" />
          <circle r={R + 46} fill="none" stroke="rgba(176,138,58,0.25)" strokeWidth={1.5} />
        </g>
      </svg>
      {/* rayons de coordination */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {SATS.map((_, i) => {
          const a = ((-90 + 72 * i + rot) * Math.PI) / 180;
          const r1 = 132, r2 = R * (1 - pull);
          const k = pr(f, 240 + i * 3, 10, Easing.bezier(0.45, 0, 0.2, 1));
          const x1 = HUB.x + Math.cos(a) * r1, y1 = HUB.y + Math.sin(a) * r1;
          const x2 = HUB.x + Math.cos(a) * Math.max(r1, r2), y2 = HUB.y + Math.sin(a) * Math.max(r1, r2);
          const dot = ((f - 250 - i * 3) % 24) / 24;
          return (
            <g key={i} opacity={1 - pull}>
              <line x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke={C.or} strokeWidth={4} strokeLinecap="round" />
              {f > 250 + i * 3 && k >= 1 ? <circle cx={lerp(x1, x2, dot)} cy={lerp(y1, y2, dot)} r={7} fill="#F1D99A" style={{filter: 'drop-shadow(0 0 8px rgba(233,207,142,0.95))'}} /> : null}
            </g>
          );
        })}
      </svg>
      {/* satellites */}
      {SATS.map((s, i) => {
        const a = ((-90 + 72 * i + rot) * Math.PI) / 180;
        const r = R * (1 - pull);
        const x = HUB.x + Math.cos(a) * r, y = HUB.y + Math.sin(a) * r;
        const pop = spring({frame: f - (217 + i * 3), fps: 30, config: {damping: 12, stiffness: 170, mass: 0.7}});
        const chk = spring({frame: f - (257 + i * 4), fps: 30, config: {damping: 10, stiffness: 200, mass: 0.6}});
        return (
          <div key={s.l} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${pop * (1 - pull * 0.8)})`, opacity: 1 - pull}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '16px 28px 16px 18px', borderRadius: 999, background: '#FFFDF8', boxShadow: '0 18px 40px rgba(14,23,38,0.2), 0 4px 10px rgba(14,23,38,0.12)', whiteSpace: 'nowrap'}}>
              <div style={{width: 52, height: 52, borderRadius: 52, background: 'rgba(201,162,75,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon k={s.i} /></div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.nuit}}>{s.l}</div>
            </div>
            <div style={{position: 'absolute', right: -12, top: -14, width: 44, height: 44, borderRadius: 44, background: GOLD_GRAD, transform: `scale(${chk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(14,23,38,0.25)'}}>
              <svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" fill="none" stroke={C.nuit} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        );
      })}
      {/* moyeu : l'interlocuteur unique */}
      <div style={{position: 'absolute', left: HUB.x - 125, top: HUB.y - 125, width: 250, height: 250, borderRadius: 250, transform: `scale(${hubIn * lerp(1, 0.3, pull) * (1 - hubOut)})`, background: '#FFFDF8', boxShadow: `0 0 0 5px ${C.or}, 0 0 0 16px rgba(201,162,75,0.18), 0 30px 60px rgba(14,23,38,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img src={A.L_logo_couleur} style={{width: 200, height: 118, objectFit: 'contain'}} />
      </div>
    </AbsoluteFill>
  );
};

const HubText: React.FC = () => (
  <>
    <div style={{position: 'absolute', top: 1250, width: W, textAlign: 'center', lineHeight: 1.05}}>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 84, color: C.nuit}}>
        <BW at={203} out={236}>un </BW><BW at={212} out={236}>seul</BW>
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 104, letterSpacing: -4, color: C.nuit}}>
        <BW at={217} out={237}>interlocuteur</BW>
      </div>
    </div>
    <div style={{position: 'absolute', top: 1250, width: W, textAlign: 'center', lineHeight: 1.05}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 104, letterSpacing: -4, color: C.nuit}}>
        <BW at={240} out={282}>coordonne</BW>
      </div>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 96, color: OR_TXT}}>
        <BW at={257} out={282}>tout </BW><BW at={264} out={282}>votre </BW><BW at={273} out={282}>retour.</BW>
      </div>
    </div>
  </>
);

/* ---------- plan 4 : la valise, puis l'arrivée ---------- */
const TAG = {x: 715, y: 845, w: 210, h: 128};
const S4a: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame() + off;
  const fall = interpolate(f, [282, 296], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const yLand = -0.18;
  const y = lerp(3.4, yLand, fall);
  const sq = f >= 296 ? Math.exp(-(f - 296) / 4) * Math.cos((f - 296) * 0.9) : 0;
  const swing = f >= 296 ? 0.45 * Math.exp(-(f - 296) / 9) * Math.sin((f - 296) * 0.55) : 0.05;
  const rotY = lerp(-0.25, 0.5, pr(f, 282, 20));
  const push = pr(f, 299, 12, INOUT);
  const shadow = interpolate(fall, [0, 1], [0.15, 1]);
  const dust = pr(f, 296, 14);
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.5, push)})`, transformOrigin: `${TAG.x}px ${TAG.y}px`, filter: `blur(${push * 6}px)`}}>
      <div style={{position: 'absolute', left: 540 - 330 * shadow, top: 1405, width: 660 * shadow, height: 80, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,23,38,0.38) 0%, rgba(14,23,38,0) 70%)', opacity: shadow}} />
      {f >= 296 ? <div style={{position: 'absolute', left: 540 - 420 * (0.6 + dust), top: 1418 - 50 * (0.6 + dust), width: 840 * (0.6 + dust), height: 100 * (0.6 + dust), borderRadius: '50%', border: `3px solid rgba(201,162,75,${0.6 * (1 - dust)})`}} /> : null}
      <ThreeCanvas width={W} height={H} camera={{fov: 28, position: [0, 0.35, 6.2]}}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[2.5, 3, 4]} intensity={2.4} color="#fff3dc" />
        <directionalLight position={[-3, 1, -2]} intensity={0.8} color="#cfe0ff" />
        <Valise rotY={rotY} rotX={0.12} y={y} squash={sq} tagSwing={swing} scale={0.8} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const PosezText: React.FC = () => {
  const f = useCurrentFrame();
  const push = pr(f, 299, 12, INOUT);
  return (
    <div style={{position: 'absolute', top: 236, width: W, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 92, color: C.nuit, opacity: 1 - push, filter: `blur(${push * 8}px)`}}>
      <BW at={293}>Vous </BW><BW at={296}>posez</BW>
    </div>
  );
};

/** L'étiquette devient le monde : une fenêtre sur la vidéo d'arrivée grandit jusqu'au plein cadre. */
const S4b: React.FC = () => {
  const f = useCurrentFrame();
  const g = pr(f, 300, 12, INOUT);
  const x = lerp(TAG.x - TAG.w / 2, 0, g), y = lerp(TAG.y - TAG.h / 2, 0, g);
  const w = lerp(TAG.w, W, g), h = lerp(TAG.h, H, g);
  const rad = lerp(24, 0, g);
  const push = interpolate(f, [300, 360], [1.12, 1.0], {...clamp, easing: Easing.out(Easing.quad)});
  if (f < 300) return null;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: rad, overflow: 'hidden', boxShadow: g < 1 ? shadowCard : 'none'}}>
        <div style={{position: 'absolute', left: -x, top: -y, width: W, height: H}}>
          <OffthreadVideo src={staticFile('video/r10-arrivee.mp4')} startFrom={66} muted style={{width: W, height: H, objectFit: 'cover', transform: `scale(${push})`}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 905, width: W, textAlign: 'center', lineHeight: 1.02}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 124, letterSpacing: -5, color: C.nuit, textShadow: '0 0 40px rgba(255,250,240,0.9), 0 0 12px rgba(255,250,240,0.8)'}}>
          <BW at={305} out={321}>vos </BW><BW at={308} out={321}>valises…</BW>
        </div>
      </div>
      <div style={{position: 'absolute', top: 840, width: W, textAlign: 'center', lineHeight: 1.0}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 116, letterSpacing: -5, color: C.nuit, textShadow: '0 0 40px rgba(255,250,240,0.9), 0 0 12px rgba(255,250,240,0.8)'}}>
          <BW at={324}>nous </BW><BW at={335}>gérons</BW>
        </div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 150, color: '#6E4C0E', marginTop: -6, textShadow: '0 0 40px rgba(255,250,240,0.95), 0 0 12px rgba(255,250,240,0.85)'}}>
          <BW at={340}>le </BW><BW at={344}>reste.</BW>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- plan 5 : carte de fin ---------- */
const IRIS = {x: 760, y: 1480};
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const k = pr(f, 354, 13, Easing.bezier(0.7, 0, 0.3, 1));
  const r = lerp(0, 2300, k);
  const btn = spring({frame: f - 371, fps: 30, config: {damping: 11, stiffness: 160, mass: 0.8}});
  const shine = pr(f, 393, 14, Easing.inOut(Easing.quad));
  if (f < 354) return null;
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at ${IRIS.x}px ${IRIS.y}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 38%, #22355a 0%, #0E1726 62%, #0A111D 100%)'}}>
        <DotGrid color="#C9A24B" opacity={0.16} drift={0.3} />
      </AbsoluteFill>
      <Img src={A.L_logo_clair} style={{position: 'absolute', left: 540 - 250, top: 380, width: 500, height: 295, opacity: pr(f, 358, 8), transform: `scale(${lerp(0.9, 1, pr(f, 358, 14))})`}} />
      <LogoBurst at={366} x={540} y={527} rx={320} ry={185} />
      <div style={{position: 'absolute', top: 790, width: W, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 104, color: C.orClair, lineHeight: 1}}>
          <BW at={360}>Pack</BW>
        </div>
        <Rise at={362} text="Retour Définitif" stagger={0.7} style={{fontFamily: SANS, fontWeight: 800, fontSize: 104, letterSpacing: -3.5, color: '#FFFFFF', lineHeight: 1.15, marginTop: 6}} />
      </div>
      <div style={{position: 'absolute', left: 540 - 450, top: 1150, width: 900, height: 156, borderRadius: 999, background: GOLD_GRAD, transform: `scale(${lerp(0.5, 1, btn)})`, opacity: Math.min(1, btn * 1.5), boxShadow: '0 24px 60px rgba(201,162,75,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit, letterSpacing: -0.5}}>Réservez votre appel découverte</div>
        <div style={{position: 'absolute', top: -40, left: lerp(-300, 1100, shine), width: 140, height: 240, transform: 'rotate(20deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)', opacity: shine > 0 && shine < 1 ? 1 : 0}} />
      </div>
      <div style={{position: 'absolute', top: 1360, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.orClair, letterSpacing: 0.5}}>
        <BW at={386}>moconseildz.com</BW>
      </div>
      <Grain opacity={0.08} blend="overlay" />
    </AbsoluteFill>
  );
};

export const Pack10RetourDefinitif: React.FC = () => (
  <AbsoluteFill style={{background: C.pierre}}>
    <Paper />
    <Sequence from={0} durationInFrames={60}><S1 /></Sequence>
    <Sequence from={0} durationInFrames={150}><S2 /></Sequence>
    <Sequence from={0} durationInFrames={300}><ArchLine /><Title /></Sequence>
    <Sequence from={0} durationInFrames={300}><Hub /><HubText /></Sequence>
    <Sequence from={276} durationInFrames={40}><S4a off={276} /></Sequence>
    <Sequence from={0} durationInFrames={316}><PosezText /></Sequence>
    <Sequence from={0} durationInFrames={370}><S4b /></Sequence>
    <Sequence from={0} durationInFrames={64}><Whip at={48} /></Sequence>
    <Grain opacity={0.07} />
    <Sequence from={0} durationInFrames={450}><S5 /></Sequence>
  </AbsoluteFill>
);
