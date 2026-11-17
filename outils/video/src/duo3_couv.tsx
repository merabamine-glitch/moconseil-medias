// Couvertures des 4 duos éducatifs (17/11/2026), version épurée validée le 16/11 : un message, un visuel.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Douane, Estrade, H, Ico, NUIT, OR_F, SOL, TERRE, Theme, Voiture, W} from './duoedu';
import {C, SANS} from './kit';
import {Maison} from './maison';
import {MAP} from './map_med';

const fond = (th: Theme) => (th === 'bleu'
  ? 'radial-gradient(ellipse 95% 70% at 50% 42%, #2C64B0 0%, #1A3F78 40%, #10264A 75%, #0A1428 100%)'
  : 'radial-gradient(ellipse 95% 70% at 50% 42%, #FFF6DC 0%, #F5DE9E 40%, #E2B55A 78%, #C4923A 100%)');
const T: React.FC<{th: Theme; l1: string; l2: string; c2?: string; s1?: number; s2?: number}> = ({th, l1, l2, c2, s1 = 150, s2 = 130}) => {
  const base: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -4, lineHeight: 0.98, color: th === 'bleu' ? '#FFFFFF' : NUIT};
  return (
    <div style={{position: 'absolute', top: 320, width: '100%', textAlign: 'center'}}>
      <div style={{...base, fontSize: s1}}>{l1}</div>
      <div style={{...base, fontSize: s2, marginTop: 14, color: c2 ?? (th === 'bleu' ? '#F2DDA2' : OR_F)}}>{l2}</div>
    </div>
  );
};

/* 1 : créer sa société sans vivre en Algérie — la route France → Alger */
const C1: React.FC = () => {
  const A = MAP.villes.paris, B = MAP.villes.alger;
  const FW = 900, FH = 820, FX = 90, FY = 760;
  const z = 0.42, cx = (A[0] + B[0]) / 2, cy = (A[1] + B[1]) / 2, tx = FW / 2 - cx * z + 40, ty = FH / 2 - cy * z;
  return (
    <AbsoluteFill style={{background: fond('bleu')}}>
      <T th="bleu" l1="Ma société" l2="sans vivre en Algérie ?" s1={150} s2={96} />
      <div style={{position: 'absolute', left: FX, top: FY, width: FW, height: FH, borderRadius: 36, overflow: 'hidden', border: '8px solid #F2DDA2', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', background: '#0F2340'}}>
      <svg width={FW} height={FH} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${tx} ${ty}) scale(${z})`}>
          {MAP.land.map((d, i) => <path key={i} d={d} fill="#27426A" stroke="rgba(233,207,142,0.3)" strokeWidth={1.6 / z} />)}
          {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#34588A" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />)}
          <path d={MAP.algerie} fill="#3A6297" stroke={C.orClair} strokeWidth={2.6 / z} />
          <path d={`M${A[0]} ${A[1]} Q${cx - 260} ${cy} ${B[0]} ${B[1]}`} fill="none" stroke="#F6E3AE" strokeWidth={12 / z} strokeLinecap="round" strokeDasharray={`${26 / z} ${18 / z}`} />
          {[A, B].map((P, i) => <circle key={i} cx={P[0]} cy={P[1]} r={22 / z} fill="#F2DDA2" stroke={NUIT} strokeWidth={6 / z} />)}
        </g>
      </svg>
      </div>
      <div style={{position: 'absolute', left: 540 - 150, top: 1170, transform: 'translate(-50%,-50%) rotate(-6deg)', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px 14px 16px', borderRadius: 16, background: '#FFFFFF', border: `5px solid ${NUIT}`, boxShadow: `0 10px 0 ${NUIT}`}}>
        <Ico k="doc" size={64} color={C.or} /><span style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: NUIT}}>Procuration</span>
      </div>
    </AbsoluteFill>
  );
};
/* 2 : EURL ou SARL */
const Badge: React.FC<{l: string}> = ({l}) => (
  <div style={{padding: '14px 36px', borderRadius: 26, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, border: `7px solid ${NUIT}`, boxShadow: `0 12px 0 ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 118, color: NUIT, letterSpacing: 1}}>{l}</div>
);
const C2: React.FC = () => (
  <AbsoluteFill style={{background: fond('or')}}>
    <T th="or" l1="Seul ou" l2="à plusieurs ?" s1={150} s2={136} />
    <div style={{position: 'absolute', top: 1000, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26}}>
      <Badge l="EURL" />
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 80, color: NUIT}}>ou</span>
      <Badge l="SARL" />
    </div>
    <Estrade theme="or" />
    <Maison x={540} y={SOL - 6} scale={0.62} build={1} seed="c2" />
  </AbsoluteFill>
);
/* 3 : dédouanement, présence obligatoire */
const C3: React.FC = () => (
  <AbsoluteFill style={{background: fond('bleu')}}>
    <T th="bleu" l1="Douane :" l2="pas de procuration" c2="#FF7A4D" s1={160} s2={104} />
    <Estrade theme="bleu" />
    <Douane x={560} y={SOL - 4} scale={1.25} flip L={300} />
  </AbsoluteFill>
);
/* 4 : ramener sa voiture */
const C4: React.FC = () => (
  <AbsoluteFill style={{background: fond('or')}}>
    <T th="or" l1="Ma voiture" l2="en Algérie ?" s1={160} s2={140} />
    <div style={{position: 'absolute', left: 540, top: 1000, transform: 'translate(-50%,-50%) rotate(-5deg)', padding: '16px 40px', border: `9px solid ${TERRE}`, borderRadius: 20, background: 'rgba(255,253,246,0.96)', fontFamily: SANS, fontWeight: 800, fontSize: 72, color: TERRE, letterSpacing: 2, whiteSpace: 'nowrap'}}>MOINS DE 5 ANS</div>
    <Estrade theme="or" />
    <Voiture x={540} y={SOL - 4} scale={1.35} />
  </AbsoluteFill>
);

export const DuoEduCouv: React.FC<{n?: number}> = ({n = 1}) => (n === 1 ? <C1 /> : n === 2 ? <C2 /> : n === 3 ? <C3 /> : <C4 />);
