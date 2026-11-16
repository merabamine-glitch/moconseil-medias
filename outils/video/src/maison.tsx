// Maison vectorielle construite par code (16/11/2026) : se construit pièce par pièce, s'écroule, se reconstruit, porte qui s'ouvre.
// Style « Game Boy Color net » : contours nuit épais, aplats, ombres portées pleines (même grammaire que chibi.tsx).
import React from 'react';
import {random} from 'remotion';

const N = '#0E1726';
type Piece = {id: string; x: number; y: number; w: number; h: number; fill: string; order: number; r?: number; kind?: 'rect' | 'roofL' | 'roofR' | 'arch' | 'win' | 'plant'};

// repère local : maison de 520 x 520, sol à y = 520, centre x = 260
const pieces = (): Piece[] => {
  const p: Piece[] = [];
  p.push({id: 'dalle', x: -20, y: 500, w: 560, h: 24, fill: '#B8A27A', order: 0});
  // murs en blocs (4 rangées x 5 colonnes), blanc cassé
  let o = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      p.push({id: `b${r}${c}`, x: 20 + c * 96, y: 500 - (r + 1) * 70, w: 96, h: 70, fill: (r + c) % 2 ? '#FBF7EE' : '#F3ECDD', order: o + r * 0.9 + c * 0.12});
    }
  }
  o = 5;
  p.push({id: 'corniche', x: 6, y: 208, w: 508, h: 18, fill: '#C9A24B', order: o});
  p.push({id: 'toitG', x: 0, y: 70, w: 260, h: 140, fill: '#C4512B', order: o + 0.6, kind: 'roofL'});
  p.push({id: 'toitD', x: 260, y: 70, w: 260, h: 140, fill: '#B5472A', order: o + 0.8, kind: 'roofR'});
  p.push({id: 'chem', x: 370, y: 60, w: 50, h: 80, fill: '#E9DFC9', order: o + 1.1});
  p.push({id: 'porte', x: 205, y: 370, w: 110, h: 130, fill: '#24627F', order: o + 1.6, kind: 'arch'});
  p.push({id: 'fen1', x: 60, y: 270, w: 100, h: 90, fill: '#9FD3E8', order: o + 1.9, kind: 'win'});
  p.push({id: 'fen2', x: 360, y: 270, w: 100, h: 90, fill: '#9FD3E8', order: o + 2.1, kind: 'win'});
  p.push({id: 'pl1', x: -30, y: 440, w: 60, h: 60, fill: '#56634A', order: o + 2.5, kind: 'plant'});
  p.push({id: 'pl2', x: 490, y: 440, w: 60, h: 60, fill: '#56634A', order: o + 2.7, kind: 'plant'});
  return p;
};
const PIECES = pieces();
const MAXO = Math.max(...PIECES.map((q) => q.order));

const Shape: React.FC<{q: Piece; door: number; glow: number}> = ({q, door, glow}) => {
  const st = {stroke: N, strokeWidth: 6, strokeLinejoin: 'round' as const};
  if (q.kind === 'roofL') return <path d={`M ${q.x} ${q.y + q.h} L ${q.x + q.w} ${q.y} L ${q.x + q.w} ${q.y + q.h} Z`} fill={q.fill} {...st} />;
  if (q.kind === 'roofR') return <path d={`M ${q.x} ${q.y} L ${q.x + q.w} ${q.y + q.h} L ${q.x} ${q.y + q.h} Z`} fill={q.fill} {...st} />;
  if (q.kind === 'arch') {
    const r = q.w / 2;
    const d = `M ${q.x} ${q.y + q.h} L ${q.x} ${q.y + r} A ${r} ${r} 0 0 1 ${q.x + q.w} ${q.y + r} L ${q.x + q.w} ${q.y + q.h} Z`;
    return (
      <g>
        <path d={d} fill="#FFE7A6" {...st} />
        {/* battant qui pivote (porte qui s'ouvre) */}
        <g transform={`translate(${q.x} 0) scale(${1 - 0.85 * door} 1) translate(${-q.x} 0)`}>
          <path d={d} fill={q.fill} {...st} />
          <circle cx={q.x + q.w - 22} cy={q.y + q.h * 0.62} r={7} fill="#E9CF8E" stroke={N} strokeWidth={3} />
        </g>
      </g>
    );
  }
  if (q.kind === 'win') {
    return (
      <g>
        <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={8} fill={glow > 0 ? `rgb(${159 + 96 * glow},${211 + 20 * glow},${232 - 80 * glow})` : q.fill} {...st} />
        <path d={`M ${q.x + q.w / 2} ${q.y} V ${q.y + q.h} M ${q.x} ${q.y + q.h / 2} H ${q.x + q.w}`} stroke={N} strokeWidth={5} />
        <rect x={q.x - 26} y={q.y - 4} width={22} height={q.h + 8} rx={4} fill="#24627F" {...st} strokeWidth={4} />
        <rect x={q.x + q.w + 4} y={q.y - 4} width={22} height={q.h + 8} rx={4} fill="#24627F" {...st} strokeWidth={4} />
      </g>
    );
  }
  if (q.kind === 'plant') {
    return (
      <g>
        <path d={`M ${q.x + 10} ${q.y + 30} h ${q.w - 20} l -6 ${q.h - 30} h ${-(q.w - 32)} z`} fill="#C4512B" {...st} strokeWidth={4} />
        <circle cx={q.x + q.w / 2} cy={q.y + 14} r={24} fill={q.fill} {...st} strokeWidth={4} />
        <circle cx={q.x + q.w / 2 - 16} cy={q.y + 24} r={14} fill="#6E7D5C" {...st} strokeWidth={4} />
      </g>
    );
  }
  return <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.id === 'dalle' ? 6 : 4} fill={q.fill} {...st} />;
};

/** build : 0 → 1 construction ; crash : 0 → 1 écroulement ; door : 0 → 1 ouverture ; glow : fenêtres allumées */
export const Maison: React.FC<{x: number; y: number; scale?: number; build: number; crash?: number; door?: number; glow?: number; seed?: string}> = ({x, y, scale = 1, build, crash = 0, door = 0, glow = 0, seed = 'm'}) => {
  return (
    <svg width={760 * scale} height={760 * scale} viewBox="-120 -160 760 760" style={{position: 'absolute', left: x - 380 * scale, top: y - 680 * scale, overflow: 'visible'}}>
      <ellipse cx={260} cy={530} rx={330} ry={26} fill="rgba(14,23,38,0.18)" />
      {PIECES.map((q) => {
        // construction : chaque pièce tombe du ciel puis rebondit
        const t0 = (q.order / (MAXO + 1)) * 0.82;
        const u = Math.min(1, Math.max(0, (build - t0) / 0.18));
        if (u <= 0) return null;
        const bounce = u < 1 ? (1 - u) * -260 + Math.sin(u * Math.PI) * -18 : 0;
        const sc = 0.6 + 0.4 * Math.min(1, u * 1.4);
        // écroulement : chute avec rotation, dispersion latérale
        const k = random(seed + q.id);
        const c = q.id === 'dalle' ? 0 : Math.max(0, crash - k * 0.25) / 0.75;
        const dx = c * (k - 0.5) * 520;
        const dy = c * c * (620 - q.y) * (0.9 + k * 0.4);
        const rot = c * (k - 0.5) * 220;
        const op = crash > 0 ? 1 - Math.max(0, c - 0.85) / 0.15 : 1;
        const cx = q.x + q.w / 2;
        const cy = q.y + q.h / 2;
        return (
          <g key={q.id} opacity={op} transform={`translate(${dx} ${bounce + dy}) rotate(${rot} ${cx} ${cy}) translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`}>
            <Shape q={q} door={door} glow={glow} />
          </g>
        );
      })}
    </svg>
  );
};

/* poussière à l'écroulement */
export const Poussiere: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <svg width={900} height={500} viewBox="-450 -400 900 500" style={{position: 'absolute', left: x - 450, top: y - 400, overflow: 'visible'}}>
      {Array.from({length: 18}).map((_, i) => {
        const a = (i / 18) * Math.PI - Math.PI;
        const r = 60 + t * (180 + random('p' + i) * 160);
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.5 + 40} r={(30 + random('q' + i) * 30) * (1 - t * 0.5)} fill="#E8DCC4" stroke="#B8A27A" strokeWidth={4} opacity={1 - t} />;
      })}
    </svg>
  );
};
