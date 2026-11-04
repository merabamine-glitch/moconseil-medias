// Personnages M&O « style Game Boy Color », dessinés en vectoriel (nets à toute taille) — 04/11/2026.
// Grosse tête, petit corps, charte marine / or / pierre. Articulés : clignement, regard, sourcils, bouche (5 formes), bras.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const K = '#0F1B2D'; // contour nuit
const OUT = 7;
export type Mouth = 'sourire' | 'ferme' | 'a' | 'o' | 'e';
export type ChibiPose = {
  blink?: number; // 0 ouvert → 1 fermé
  lookX?: number; // -1 gauche → 1 droite
  lookY?: number; // -1 haut → 1 bas
  brow?: number; // 0 normal → 1 levés (surpris), -1 froncés
  mouth?: Mouth;
  armL?: number; // angle en degrés, 0 = bras le long du corps, 150 = main levée
  armR?: number;
  tilt?: number; // inclinaison de la tête
  bounce?: number; // petit saut (px)
};
type Kind = 'femme' | 'homme';
const PAL = {
  peau: '#F0C49E', peauOmbre: '#DDA37A', joue: '#EFA08E',
  cheveuxF: '#5B3420', cheveuxFClair: '#80502F', cheveuxH: '#2B1B12', cheveuxHClair: '#4A3022',
  blazer: '#1B2A41', blazerClair: '#2E4A70', chemise: '#FFFFFF', chemiseOmbre: '#E6E0D4', or: '#C9A24B', orClair: '#F2DDA2',
  pantalon: '#0F1B2D', chaussure: '#24324A', bouche: '#8E3B24', langue: '#D9715C',
};

const Arm: React.FC<{side: 1 | -1; angle: number}> = ({side, angle}) => (
  <g transform={`translate(${side * 112} -318) rotate(${-side * (12 + angle)})`}>
    <rect x={-27} y={-10} width={54} height={150} rx={27} fill={PAL.blazer} stroke={K} strokeWidth={OUT} />
    <rect x={-27} y={112} width={54} height={18} fill={PAL.chemise} stroke={K} strokeWidth={OUT * 0.8} />
    <circle cx={0} cy={158} r={31} fill={PAL.peau} stroke={K} strokeWidth={OUT} />
    <path d={`M ${-side * 6} 140 q ${-side * 22} 6 ${-side * 26} 22`} fill="none" stroke={PAL.peauOmbre} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Eye: React.FC<{x: number; p: ChibiPose}> = ({x, p}) => {
  const bl = Math.max(0, Math.min(1, p.blink ?? 0));
  const lx = (p.lookX ?? 0) * 11;
  const ly = (p.lookY ?? 0) * 8;
  if (bl > 0.85) return <path d={`M ${x - 28} -540 q 28 14 56 0`} fill="none" stroke={K} strokeWidth={8} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} -545) scale(1 ${1 - bl})`}>
      <ellipse cx={0} cy={0} rx={33} ry={43} fill="#FFFFFF" stroke={K} strokeWidth={5} />
      <g transform={`translate(${lx} ${ly})`}>
        <ellipse cx={0} cy={4} rx={24} ry={33} fill={K} />
        <ellipse cx={-8} cy={-10} rx={9} ry={11} fill="#FFFFFF" />
        <circle cx={9} cy={14} r={4.5} fill="#FFFFFF" />
      </g>
    </g>
  );
};

const MouthShape: React.FC<{m: Mouth}> = ({m}) => {
  const y = -462;
  if (m === 'ferme') return <path d={`M -22 ${y} q 22 8 44 0`} fill="none" stroke={PAL.bouche} strokeWidth={7} strokeLinecap="round" />;
  if (m === 'sourire') return <path d={`M -34 ${y - 6} q 34 34 68 0`} fill="none" stroke={PAL.bouche} strokeWidth={7} strokeLinecap="round" />;
  if (m === 'o') return <ellipse cx={0} cy={y + 4} rx={17} ry={22} fill={PAL.bouche} stroke={K} strokeWidth={4} />;
  if (m === 'e') return <path d={`M -36 ${y - 4} q 36 22 72 0 q -36 8 -72 0 z`} fill={PAL.bouche} stroke={K} strokeWidth={4} strokeLinejoin="round" />;
  return (
    <g>
      <path d={`M -32 ${y - 8} q 32 52 64 0 z`} fill={PAL.bouche} stroke={K} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={0} cy={y + 10} rx={16} ry={8} fill={PAL.langue} />
    </g>
  );
};

export const Chibi: React.FC<{kind: Kind; pose?: ChibiPose; scale?: number; x?: number; y?: number}> = ({kind, pose = {}, scale = 1, x = 0, y = 0}) => {
  const f = kind === 'femme';
  const hair = f ? PAL.cheveuxF : PAL.cheveuxH;
  const hairL = f ? PAL.cheveuxFClair : PAL.cheveuxHClair;
  const brow = (pose.brow ?? 0) * 12;
  return (
    <g transform={`translate(${x} ${y - (pose.bounce ?? 0)}) scale(${scale})`}>
      {/* ombre au sol */}
      <ellipse cx={0} cy={6 + (pose.bounce ?? 0) / scale} rx={130 - (pose.bounce ?? 0) * 0.4} ry={16} fill="rgba(15,27,45,0.18)" />
      {/* jambes */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 38 - 27} y={-120} width={54} height={112} rx={20} fill={PAL.pantalon} stroke={K} strokeWidth={OUT} />
          <ellipse cx={s * 44} cy={-6} rx={40} ry={18} fill={PAL.chaussure} stroke={K} strokeWidth={OUT} />
        </g>
      ))}
      {/* cheveux arrière (femme) */}
      {f && (
        <g transform={`rotate(${pose.tilt ?? 0} 0 -340)`}>
          <path d="M -215 -560 C -230 -430 -205 -350 -150 -320 L 150 -320 C 205 -350 230 -430 215 -560 Z" fill={hair} stroke={K} strokeWidth={OUT} strokeLinejoin="round" />
        </g>
      )}
      {/* bras derrière le corps quand ils sont baissés */}
      {/* corps */}
      <path d="M -118 -332 Q -128 -220 -110 -108 L 110 -108 Q 128 -220 118 -332 Q 0 -360 -118 -332 Z" fill={PAL.blazer} stroke={K} strokeWidth={OUT} strokeLinejoin="round" />
      <path d="M -46 -340 L 0 -238 L 46 -340 Z" fill={PAL.chemise} stroke={K} strokeWidth={5} strokeLinejoin="round" />
      {!f && <path d="M -10 -330 L 0 -300 L 10 -330" fill="none" stroke={PAL.chemiseOmbre} strokeWidth={5} />}
      <path d="M -46 -340 L 0 -238 L -26 -212 L -78 -320 Z" fill={PAL.blazerClair} stroke={K} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 46 -340 L 0 -238 L 26 -212 L 78 -320 Z" fill={PAL.blazerClair} stroke={K} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={0} cy={-170} r={9} fill={PAL.or} stroke={K} strokeWidth={4} />
      <circle cx={62} cy={-288} r={11} fill={PAL.or} stroke={K} strokeWidth={4} />
      <circle cx={59} cy={-291} r={4} fill={PAL.orClair} />
      {/* tête */}
      <g transform={`rotate(${pose.tilt ?? 0} 0 -340)`}>
        <rect x={-30} y={-372} width={60} height={40} fill={PAL.peauOmbre} stroke={K} strokeWidth={OUT} />
        {[-1, 1].map((s) => <ellipse key={s} cx={s * 196} cy={-530} rx={30} ry={38} fill={PAL.peau} stroke={K} strokeWidth={OUT} />)}
        <ellipse cx={0} cy={-555} rx={200} ry={188} fill={PAL.peau} stroke={K} strokeWidth={OUT} />
        {/* joues */}
        {[-1, 1].map((s) => <ellipse key={s} cx={s * 118} cy={-478} rx={30} ry={17} fill={PAL.joue} opacity={0.75} />)}
        {/* barbe naissante (homme) */}
        {!f && <path d="M -176 -500 Q -150 -390 0 -372 Q 150 -390 176 -500 Q 120 -440 0 -432 Q -120 -440 -176 -500 Z" fill={PAL.cheveuxH} opacity={0.11} />}
        {/* boucles d'oreille (femme) */}
        {f && [-1, 1].map((s) => <circle key={s} cx={s * 200} cy={-484} r={11} fill="none" stroke={PAL.or} strokeWidth={6} />)}
        <Eye x={-74} p={pose} />
        <Eye x={74} p={pose} />
        {/* sourcils */}
        {[-1, 1].map((s) => (
          <path key={s} d={`M ${s * 44} -612 q ${s * 30} -18 ${s * 62} -2`} transform={`translate(0 ${-brow}) ${pose.brow && pose.brow < 0 ? `rotate(${s * 10} ${s * 74} -612)` : ''}`} fill="none" stroke={f ? PAL.cheveuxF : PAL.cheveuxH} strokeWidth={f ? 9 : 12} strokeLinecap="round" />
        ))}
        <path d="M -6 -505 q 8 10 0 18" fill="none" stroke={PAL.peauOmbre} strokeWidth={6} strokeLinecap="round" />
        <MouthShape m={pose.mouth ?? 'sourire'} />
        {/* cheveux avant */}
        {f ? (
          <g>
            <path d="M -206 -560 C -215 -700 -110 -760 0 -758 C 120 -756 215 -700 206 -560 C 180 -610 140 -640 80 -650 C 30 -600 -60 -580 -140 -600 C -170 -590 -192 -575 -206 -560 Z" fill={hair} stroke={K} strokeWidth={OUT} strokeLinejoin="round" />
            <path d="M -120 -712 C -60 -742 30 -742 90 -718" fill="none" stroke={hairL} strokeWidth={14} strokeLinecap="round" />
            <path d="M -206 -560 C -214 -500 -210 -440 -196 -400" fill="none" stroke={K} strokeWidth={OUT} />
            <path d="M 206 -560 C 214 -500 210 -440 196 -400" fill="none" stroke={K} strokeWidth={OUT} />
          </g>
        ) : (
          <g>
            <path d="M -198 -570 C -230 -640 -190 -720 -120 -738 C -100 -790 -20 -790 10 -760 C 60 -800 150 -770 160 -716 C 220 -700 230 -620 198 -570 C 170 -630 120 -640 70 -620 C 30 -650 -40 -650 -80 -622 C -120 -640 -170 -630 -198 -570 Z" fill={hair} stroke={K} strokeWidth={OUT} strokeLinejoin="round" />
            <path d="M -110 -712 q 20 -24 50 -10 M -10 -738 q 26 -22 56 -6 M 80 -716 q 24 -18 52 0" fill="none" stroke={hairL} strokeWidth={10} strokeLinecap="round" />
          </g>
        )}
      </g>
      <Arm side={-1} angle={pose.armL ?? 0} />
      <Arm side={1} angle={pose.armR ?? 0} />
    </g>
  );
};

/* ---------------------------------------------------------------- planche de présentation */
const FONT = '"Manrope", sans-serif';
const POSES: {t: string; p: ChibiPose}[] = [
  {t: 'Repos', p: {}},
  {t: 'Parle', p: {mouth: 'a'}},
  {t: 'Cligne', p: {blink: 1, mouth: 'ferme'}},
  {t: 'Regard', p: {lookX: 1, lookY: -0.6, mouth: 'ferme', brow: 0.4}},
  {t: 'Surprise', p: {mouth: 'o', brow: 1, armL: 60, armR: 60}},
  {t: 'Main levée', p: {mouth: 'e', armR: 125, brow: 0.5}},
];
export const ChibiPlanche: React.FC = () => (
  <AbsoluteFill style={{background: '#F4EFE6'}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <text x={540} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} letterSpacing={6} fill="#9C7726">PERSONNAGES M&amp;O</text>
      <text x={540} y={205} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#1B2A41">style Game Boy Color, net</text>
      <rect x={0} y={1020} width={1080} height={8} fill="#C9A24B" />
      <Chibi kind="femme" x={290} y={1020} scale={0.95} pose={{mouth: 'sourire', armR: 40}} />
      <Chibi kind="homme" x={790} y={1020} scale={0.95} pose={{mouth: 'sourire', armL: 40, lookX: -0.5}} />
      {POSES.map((po, i) => {
        const cx = 95 + (i % 6) * 178;
        return (
          <g key={i}>
            <Chibi kind={i % 2 ? 'homme' : 'femme'} x={cx} y={1620} scale={0.4} pose={po.p} />
            <text x={cx} y={1690} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#1B2A41">{po.t}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);

/* petite animation de démonstration (4 s) : clignement, regard qui tourne, main levée, bouche */
export const ChibiDemo: React.FC = () => {
  const f = useCurrentFrame();
  const blink = [30, 75, 105].some((b) => f >= b && f < b + 5) ? 1 : 0;
  const roll = interpolate(f, [40, 70], [0, Math.PI * 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lookX = f >= 40 && f < 70 ? Math.cos(roll) : 0;
  const lookY = f >= 40 && f < 70 ? Math.sin(roll) : 0;
  const arm = interpolate(f, [80, 92, 110, 120], [0, 150, 150, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mouths: Mouth[] = ['a', 'e', 'o', 'ferme', 'a', 'sourire'];
  const talking = f % 60 < 40;
  const mouth = talking ? mouths[Math.floor(f / 4) % mouths.length] : 'sourire';
  const bounce = Math.abs(Math.sin(f / 7)) * (f > 80 && f < 110 ? 18 : 0);
  return (
    <AbsoluteFill style={{background: '#F4EFE6'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect x={0} y={1350} width={1080} height={8} fill="#C9A24B" />
        <Chibi kind="femme" x={300} y={1350} pose={{blink, lookX, lookY, mouth, armR: arm * 0.83, bounce, brow: arm > 100 ? 0.6 : 0}} />
        <Chibi kind="homme" x={790} y={1350} pose={{blink: [50, 95].some((b) => f >= b && f < b + 5) ? 1 : 0, lookX: -0.7, mouth: 'sourire', armL: 20}} />
      </svg>
    </AbsoluteFill>
  );
};
