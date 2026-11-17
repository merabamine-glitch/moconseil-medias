// Moteur des duos éducatifs « style Game Boy » (série du 17/11/2026) : thèmes bleu et sable/or, panneau photo,
// tampons, cartes, tableau blanc, carte de la Méditerranée, voiture, poste de douane, billet, dôme, carte de fin.
// Mêmes principes que les duos validés (duo.tsx bleu, duo2.tsx sable/or) : personnages chibi aux côtés,
// bouche calée image par image, accessoires au centre, textes en haut, fin en cercle.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair, L_logo_couleur} from './assets';
import {Chibi, ChibiPose, Mouth} from './chibi';
import type {DuoData} from './duo3_data';
import {C, clamp, ease, easeIn, prog, s, SANS, useSpring} from './kit';
import {MAP} from './map_med';

export const W = 1080;
export const H = 1920;
export const SOL = 1660;
export const NUIT = '#0E1726';
export const TERRE = '#C4512B';
export const OR_F = '#8C6418';
export const VERT = '#2E7D4F';
export type Theme = 'bleu' | 'or';

export const TH = {
  bleu: {
    txt: '#FFFFFF', accent: '#F2DDA2', eyebrow: '#F2DDA2', alerte: '#FF7A4D', cadre: '#F2DDA2',
    shadow: 'drop-shadow(0 6px 18px rgba(0,0,0,0.55))',
  },
  or: {
    txt: NUIT, accent: OR_F, eyebrow: TERRE, alerte: TERRE, cadre: NUIT,
    shadow: 'drop-shadow(0 4px 0 rgba(255,250,235,0.9))',
  },
};
export const big = (th: Theme): React.CSSProperties => ({fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: TH[th].txt, filter: TH[th].shadow});
export const eyebrow = (th: Theme): React.CSSProperties => ({fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: TH[th].eyebrow, filter: th === 'bleu' ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' : undefined});

export const win = (f: number, a: number, b: number) => f >= s(a) && f < s(b);
export const ramp = (f: number, a: number, b: number, e = ease) => interpolate(f, [s(a), s(b)], [0, 1], {...clamp, easing: e});
export const seg = (d: DuoData, id: string) => d.segs.find((x) => x.id === id)!;

/* ——— fond, rayons, estrade ——— */
export const Fond: React.FC<{theme: Theme; cy?: number}> = ({theme, cy = 620}) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: theme === 'bleu'
        ? 'radial-gradient(ellipse 95% 70% at 50% 40%, #2C64B0 0%, #1A3F78 38%, #10264A 70%, #0A1428 100%)'
        : 'radial-gradient(ellipse 90% 65% at 50% 38%, #FFF6DC 0%, #F5DE9E 34%, #E2B55A 66%, #B8842C 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: theme === 'bleu' ? 0.16 : 0.35}}>
        <g transform={`translate(${W / 2} ${cy}) rotate(${f * 0.25})`}>
          {Array.from({length: 18}).map((_, i) => <path key={i} d="M0 0 L-70 -1400 L70 -1400 Z" fill={theme === 'bleu' ? '#F2DDA2' : '#FFFFFF'} transform={`rotate(${i * 20})`} />)}
        </g>
      </svg>
    </>
  );
};
export const Estrade: React.FC<{theme: Theme}> = ({theme}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: theme === 'bleu'
      ? 'linear-gradient(180deg, #E9CF8E 0%, #C9A24B 30%, #8A6A2A 100%)'
      : 'linear-gradient(180deg, #8C6418 0%, #6E4C12 45%, #3E2A0A 100%)'}} />
    <div style={{position: 'absolute', left: 0, top: SOL - 6, width: W, height: 12, background: '#FFF4D2', boxShadow: '0 0 30px rgba(255,244,210,0.9)'}} />
  </>
);

/* ——— textes du haut ——— */
export const Bloc: React.FC<{at: number; out: number; y?: number; children: React.ReactNode}> = ({at, out, y = 140, children}) => {
  const f = useCurrentFrame();
  if (f < s(at) - 1 || f > s(out)) return null;
  const o = 1 - ramp(f, out - 0.18, out, easeIn);
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', opacity: o, transform: `translateY(${-(1 - o) * 30}px)`}}>{children}</div>;
};
/** mot-choc en deux lignes (« PAS DU TOUT ! », « NON ! ») */
export const Impact: React.FC<{theme: Theme; at: number; out: number; l1: string; l2?: string; size?: number}> = ({theme, at, out, l1, l2, size = 150}) => {
  const hit = useSpring(s(at), 9, 200);
  const st = (c: string): React.CSSProperties => ({...big(theme), fontSize: size, color: c, transform: `scale(${0.5 + 0.5 * hit}) rotate(${-4 * hit}deg)`});
  return (
    <Bloc at={at} out={out}>
      <div style={st(l2 ? TH[theme].txt : TH[theme].alerte)}>{l1}</div>
      {l2 && <div style={st(TH[theme].alerte)}>{l2}</div>}
    </Bloc>
  );
};

/* ——— tampon frappé ——— */
export const Tampon: React.FC<{at: number; until?: number; x: number; y: number; txt: string; color: string; rot?: number; size?: number}> = ({at, until = 99, x, y, txt, color, rot = -10, size = 58}) => {
  const f = useCurrentFrame();
  if (f < s(at) || f >= s(until)) return null;
  const p = interpolate(f, [s(at), s(at) + 5], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= s(at) + 5 ? 1 - 0.05 * Math.exp(-(f - s(at) - 5) / 3) * Math.cos((f - s(at) - 5) / 1.6) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(2.2 - 1.2 * p) * settle}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{padding: '12px 30px', border: `8px solid ${color}`, borderRadius: 16, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 4, color, background: 'rgba(255,255,255,0.94)', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{txt}</div>
    </div>
  );
};

/* ——— icônes (trait épais, style Game Boy) ——— */
export const Ico: React.FC<{k: string; size?: number; color?: string}> = ({k, size = 60, color = C.or}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {k === 'meuble' && (<><path d="M12 30v-8a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v8" {...p} /><path d="M6 32a4 4 0 0 1 8 0v6h36v-6a4 4 0 0 1 8 0v14H6z" {...p} /><path d="M12 46v6M52 46v6" {...p} /></>)}
      {k === 'voiture' && (<><path d="M6 42v-8l6-2 7-10h22l9 10 8 2v8z" {...p} /><circle cx={19} cy={44} r={6} {...p} /><circle cx={45} cy={44} r={6} {...p} /></>)}
      {k === 'douane' && (<><path d="M10 56V14" {...p} /><path d="M6 56h10" {...p} /><path d="M10 20h46v8H10" {...p} /><path d="M22 20l-6 8M34 20l-6 8M46 20l-6 8M56 20l-4 8" {...p} /></>)}
      {k === 'doc' && (<><path d="M14 6h26l10 10v42H14z" {...p} /><path d="M40 6v10h10" {...p} /><path d="M22 28h20M22 37h20M22 46h12" {...p} /></>)}
      {k === 'personne' && (<><circle cx={32} cy={20} r={10} {...p} /><path d="M12 56c0-12 9-20 20-20s20 8 20 20" {...p} /></>)}
      {k === 'avion' && (<><path d="M6 34l50-14c4-1 6 3 2 5L20 40z" {...p} /><path d="M24 30l-6-14h6l12 10M26 38l4 12h6l2-16" {...p} /></>)}
      {k === 'pompe' && (<><path d="M14 56V12a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v44" {...p} /><path d="M10 56h34" {...p} /><path d="M20 16h14v12H20z" {...p} /><path d="M40 24h6l6 8v16a4 4 0 0 1-8 0v-8h-4" {...p} /></>)}
      {k === 'prise' && (<><path d="M20 6v14M44 6v14" {...p} /><path d="M12 20h40v12a20 20 0 0 1-40 0z" {...p} /><path d="M32 52v8" {...p} /><path d="M34 26l-6 9h8l-6 9" {...p} /></>)}
      {k === 'feuille' && (<><path d="M14 50C14 24 30 12 54 10c0 26-14 40-40 40z" {...p} /><path d="M14 50l22-22" {...p} /></>)}
      {k === 'check' && <path d="M12 34l13 13 27-30" {...p} />}
      {k === 'croix' && <path d="M16 16l32 32M48 16L16 48" {...p} />}
    </svg>
  );
};
/** carte blanche « étiquette » avec icône (meubles, voiture, douane…) */
export const Carte: React.FC<{k: string; l: string; at: number; out: number; x: number; y: number; r?: number; mark?: 'x' | 'ok'; markAt?: number}> = ({k, l, at, out, x, y, r = 0, mark, markAt = 99}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), 10, 170);
  const o = 1 - ramp(f, out, out + 0.22, easeIn);
  const mp = useSpring(s(markAt), 9, 200);
  if (f < s(at) || o <= 0) return null;
  const wob = Math.sin(f / 9 + x) * 4;
  return (
    <div style={{position: 'absolute', left: x, top: y + wob, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${p * (1 - 0.3 * (1 - o))})`, opacity: o}}>
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px 14px 16px', borderRadius: 14, background: '#FFFFFF', border: `5px solid ${NUIT}`, boxShadow: `0 10px 0 ${NUIT}`, whiteSpace: 'nowrap'}}>
        <Ico k={k} size={54} color={C.or} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NUIT, letterSpacing: -1}}>{l}</span>
        {mark && f >= s(markAt) && (
          <div style={{position: 'absolute', right: -26, top: -26, width: 64, height: 64, borderRadius: 64, background: mark === 'x' ? TERRE : VERT, border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${mp})`}}>
            <Ico k={mark === 'x' ? 'croix' : 'check'} size={40} color="#FFFFFF" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ——— panneau photo (vraies photos de la banque) ——— */
export type Slide = {at: number; src: string; l?: string; tint?: string; mark?: 'x' | 'q'};
export const PW = 880, PH = 480, PY = 760;
export const Panneau: React.FC<{theme: Theme; at: number; out: number; slides: Slide[]; children?: React.ReactNode}> = ({theme, at, out, slides, children}) => {
  const f = useCurrentFrame();
  const inP = useSpring(s(at), 12, 160);
  const outP = ramp(f, out, out + 0.25, easeIn);
  if (f < s(at) || outP >= 1) return null;
  let cur = 0;
  slides.forEach((sl, i) => { if (f >= s(sl.at)) cur = i; });
  const cadre = TH[theme].cadre;
  return (
    <div style={{position: 'absolute', left: W / 2, top: PY, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * inP) * (1 - 0.3 * outP)}) rotate(${(1 - inP) * -6}deg)`, opacity: Math.min(1, inP * 2) * (1 - outP)}}>
      <div style={{position: 'relative', width: PW, height: PH, borderRadius: 30, overflow: 'hidden', border: `8px solid ${cadre}`, boxShadow: theme === 'bleu' ? '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(242,221,162,0.4)' : `0 14px 0 ${NUIT}, 0 30px 70px rgba(80,50,0,0.35)`, background: NUIT}}>
        {slides.map((sl, i) => {
          if (i < cur - 1 || i > cur) return null;
          const same = i > 0 && slides[i - 1].src === sl.src;
          const p = i === cur && !same && i > 0 ? prog(f, s(sl.at), 8, Easing.bezier(0.6, 0, 0.2, 1)) : 1;
          const k0 = same ? slides.findIndex((x) => x.src === sl.src && x.at <= sl.at) : i;
          const k = interpolate(f, [s(slides[k0].at), s(slides[k0].at) + 90], [1.18, 1.03], clamp);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: i === cur ? `inset(0 0 0 ${(1 - p) * 100}%)` : undefined}}>
              <Img src={staticFile(sl.src)} style={{width: PW, height: PH, objectFit: 'cover', transform: `scale(${k})`, filter: 'saturate(1.2) contrast(1.06)'}} />
              {sl.tint && <AbsoluteFill style={{background: sl.tint, opacity: prog(f, s(sl.at), 6)}} />}
              <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,40,0.5) 0%, rgba(10,20,40,0) 35%)'}} />
              {sl.l && (
                <div style={{position: 'absolute', left: 26, top: 22, padding: '10px 26px', borderRadius: 999, background: '#F2DDA2', border: `4px solid ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NUIT, transform: `scale(${same && slides[i - 1].l === sl.l ? 1 : prog(f, s(sl.at) + 4, 8)})`, transformOrigin: 'left center'}}>{sl.l}</div>
              )}
              {sl.mark === 'x' && <div style={{position: 'absolute', left: PW / 2, top: PH / 2 + 20, transform: `translate(-50%,-50%) scale(${2 - prog(f, s(sl.at), 5)}) rotate(-12deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 250, color: '#FFFFFF', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>✕</div>}
              {sl.mark === 'q' && <div style={{position: 'absolute', left: PW / 2, top: PH / 2 + 10, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * prog(f, s(sl.at) + 3, 8)}) rotate(${6 * Math.sin(f / 5)}deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 300, color: '#F2DDA2', lineHeight: 1, textShadow: `0 8px 0 ${NUIT}`}}>?</div>}
            </div>
          );
        })}
        {children}
      </div>
    </div>
  );
};

/* ——— tableau blanc (schémas) ——— */
export const Board: React.FC<{at: number; out: number; y?: number; w?: number; h?: number; children: React.ReactNode}> = ({at, out, y = PY, w = 900, h = 500, children}) => {
  const f = useCurrentFrame();
  const inP = useSpring(s(at), 12, 150);
  const o = ramp(f, out, out + 0.25, easeIn);
  if (f < s(at) || o >= 1) return null;
  return (
    <div style={{position: 'absolute', left: W / 2, top: y, transform: `translate(-50%,-50%) translateY(${(1 - inP) * 240}px) scale(${1 - 0.25 * o})`, opacity: Math.min(1, inP * 1.6) * (1 - o)}}>
      <div style={{position: 'relative', width: w, height: h, borderRadius: 28, background: '#FFFDF6', border: `6px solid ${NUIT}`, boxShadow: `0 12px 0 ${NUIT}, 0 30px 60px rgba(0,0,0,0.3)`, overflow: 'hidden'}}>{children}</div>
    </div>
  );
};
/** élément qui « pop » à un instant donné */
export const Pop: React.FC<{at: number; x: number; y: number; children: React.ReactNode; rot?: number; soft?: boolean}> = ({at, x, y, children, rot = 0, soft = false}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), soft ? 16 : 9, soft ? 170 : 190);
  const sl = prog(f, s(at), 9);
  if (f < s(at)) return null;
  if (soft) return <div style={{position: 'absolute', left: x, top: y, opacity: sl, transform: `translate(-50%,-50%) translateX(${(1 - sl) * 60}px) scale(${0.9 + 0.1 * p})`}}>{children}</div>;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p}) rotate(${rot * (1 - p)}deg)`}}>{children}</div>;
};
export const Pastille: React.FC<{ok?: boolean; size?: number}> = ({ok = true, size = 64}) => (
  <div style={{width: size, height: size, borderRadius: size, background: ok ? VERT : TERRE, border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Ico k={ok ? 'check' : 'croix'} size={size * 0.62} color="#FFFFFF" />
  </div>
);

/* ——— carte de la Méditerranée dans un cadre : épingles + trajet ——— */
type XY = [number, number];
export const CarteMed: React.FC<{theme: Theme; at: number; out: number; from: XY; to: XY; draw: [number, number]; travel?: [number, number]; mobile?: React.ReactNode; labelFrom?: string; labelTo?: string; bend?: number; badge?: {at: number; node: React.ReactNode; dx?: number; dy?: number}; children?: React.ReactNode}> = ({theme, at, out, from, to, draw, travel, mobile, labelFrom, labelTo, bend = -260, badge, children}) => {
  const f = useCurrentFrame();
  const inP = useSpring(s(at), 12, 160);
  const outP = ramp(f, out, out + 0.25, easeIn);
  if (f < s(at) || outP >= 1) return null;
  const z = Math.min(0.4, (PH - 140) / Math.max(1, Math.abs(to[1] - from[1])), (PW - 300) / Math.max(1, Math.abs(to[0] - from[0]))), cx = (from[0] + to[0]) / 2, cy = (from[1] + to[1]) / 2;
  const tx = PW / 2 - cx * z, ty = PH / 2 - cy * z;
  const mx = cx + bend, my = cy;
  const u = ramp(f, draw[0], draw[1], Easing.bezier(0.4, 0, 0.2, 1));
  const v = travel ? ramp(f, travel[0], travel[1], Easing.bezier(0.45, 0, 0.4, 1)) : 0;
  const q = (t: number): XY => [(1 - t) ** 2 * from[0] + 2 * (1 - t) * t * mx + t * t * to[0], (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * my + t * t * to[1]];
  const [px, py] = q(v);
  const scr = (P: XY): XY => [tx + P[0] * z, ty + P[1] * z];
  const pin = (P: XY, l: string | undefined, k: number) => {
    const [x, y] = scr(P);
    const pp = prog(f, s(at) + 6 + k * 5, 10, Easing.bezier(0.3, 1.6, 0.5, 1));
    return (
      <div key={k} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${pp})`}}>
        <div style={{width: 34, height: 34, borderRadius: 34, background: '#F2DDA2', border: `5px solid ${NUIT}`, boxShadow: `0 0 ${18 + 8 * Math.sin(f / 4 + k)}px rgba(242,221,162,0.9)`}} />
        {l && <div style={{position: 'absolute', left: 46, top: -10, padding: '6px 18px', borderRadius: 999, background: '#FFFFFF', border: `4px solid ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 32, color: NUIT, whiteSpace: 'nowrap'}}>{l}</div>}
      </div>
    );
  };
  const [mxS, myS] = scr([px, py]);
  return (
    <div style={{position: 'absolute', left: W / 2, top: PY, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * inP) * (1 - 0.3 * outP)}) rotate(${(1 - inP) * 6}deg)`, opacity: Math.min(1, inP * 2) * (1 - outP)}}>
      <div style={{position: 'relative', width: PW, height: PH, borderRadius: 30, overflow: 'hidden', border: `8px solid ${TH[theme].cadre}`, boxShadow: theme === 'bleu' ? '0 30px 80px rgba(0,0,0,0.55)' : `0 14px 0 ${NUIT}, 0 30px 70px rgba(80,50,0,0.35)`, background: theme === 'bleu' ? '#0F2340' : '#1B3354'}}>
        <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${tx} ${ty}) scale(${z})`}>
            {MAP.land.map((d, i) => <path key={i} d={d} fill="#27426A" stroke="rgba(233,207,142,0.3)" strokeWidth={1.6 / z} />)}
            {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#34588A" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />)}
            <path d={MAP.algerie} fill="#3A6297" stroke={C.orClair} strokeWidth={2.6 / z} />
            <defs>
              <mask id={`trajet${Math.round(at * 100)}`} maskUnits="userSpaceOnUse" x={-5000} y={-5000} width={20000} height={20000}>
                <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} fill="none" stroke="#FFFFFF" strokeWidth={30 / z} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
              </mask>
            </defs>
            <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} fill="none" stroke="#F6E3AE" strokeWidth={9 / z} strokeLinecap="round" strokeDasharray={`${22 / z} ${16 / z}`} mask={`url(#trajet${Math.round(at * 100)})`} />
          </g>
        </svg>
        {pin(from, labelFrom, 0)}
        {pin(to, labelTo, 1)}
        {badge && f >= s(badge.at) && (() => {
          const [bx, by] = scr(to);
          const bp = prog(f, s(badge.at), 9, Easing.bezier(0.3, 1.6, 0.5, 1));
          return <div style={{position: 'absolute', left: bx + (badge.dx ?? 0), top: by + (badge.dy ?? -110), transform: `translate(-50%,-50%) scale(${bp})`}}>{badge.node}</div>;
        })()}
        {mobile && travel && f >= s(travel[0]) && (
          <div style={{position: 'absolute', left: mxS, top: myS, transform: `translate(-50%,-50%) translateY(${Math.sin(f / 3) * 4}px) scale(${prog(f, s(travel[0]), 6) * (1 - 0.0 * v)})`}}>{mobile}</div>
        )}
        {children}
      </div>
    </div>
  );
};

/* ——— avion qui traverse l'écran ——— */
export const Avion: React.FC<{at: number; y?: number; dur?: number}> = ({at, y = 700, dur = 1.2}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + dur, Easing.bezier(0.4, 0, 0.6, 1));
  if (p <= 0 || p >= 1) return null;
  const x = -140 + p * (W + 280);
  const yy = y - Math.sin(p * Math.PI) * 120;
  return (
    <svg width={160} height={160} viewBox="-70 -70 140 140" style={{position: 'absolute', left: x - 80, top: yy - 80, transform: `rotate(${-14 + p * 20}deg)`}}>
      <path d="M -50 6 L 40 -4 Q 60 -6 60 2 Q 58 8 40 8 L -50 14 Z" fill="#FFFFFF" stroke={NUIT} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -6 2 L -28 -34 L -14 -34 L 18 2 Z M -6 10 L -24 42 L -10 42 L 16 10 Z M -44 6 L -56 -14 L -46 -14 L -34 6 Z" fill={C.or} stroke={NUIT} strokeWidth={4} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <line key={i} x1={-70 - i * 26} y1={4 + i * 6} x2={-56 - i * 26} y2={4 + i * 6} stroke={C.or} strokeWidth={5} strokeLinecap="round" />)}
    </svg>
  );
};

/* ——— voiture vectorielle (vue de profil, tournée vers la droite) ——— */
export const Voiture: React.FC<{x: number; y: number; scale?: number; color?: string; roll?: number; bounce?: number; tilt?: number; glow?: number}> = ({x, y, scale = 1, color = '#24627F', roll = 0, bounce = 0, tilt = 0, glow = 0}) => {
  const st = {stroke: NUIT, strokeWidth: 7, strokeLinejoin: 'round' as const};
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} -48) rotate(${roll * 57.3})`}>
      <circle r={50} fill="#1E2633" {...st} />
      <circle r={24} fill="#C9CED6" stroke={NUIT} strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * Math.PI / 2) * 22} y2={Math.sin(i * Math.PI / 2) * 22} stroke={NUIT} strokeWidth={5} />)}
    </g>
  );
  return (
    <svg width={620 * scale} height={360 * scale} viewBox="-310 -320 620 360" style={{position: 'absolute', left: x - 310 * scale, top: y - 320 * scale, overflow: 'visible'}}>
      <ellipse cx={0} cy={2} rx={270} ry={20} fill="rgba(14,23,38,0.2)" />
      <g transform={`translate(0 ${-bounce}) rotate(${tilt} 0 -40)`}>
        <path d="M -260 -60 Q -258 -118 -205 -124 L -140 -130 L -82 -205 Q -70 -220 -46 -220 L 92 -220 Q 120 -220 138 -198 L 190 -132 L 238 -122 Q 268 -114 268 -82 L 268 -52 Q 268 -30 246 -30 L -238 -30 Q -260 -30 -260 -52 Z" fill={color} {...st} />
        <path d="M -122 -130 L -74 -192 Q -66 -202 -52 -202 L 2 -202 L 2 -130 Z" fill={glow > 0 ? `rgb(${159 + 90 * glow},${211 + 30 * glow},${232 - 60 * glow})` : '#9FD3E8'} {...st} strokeWidth={6} />
        <path d="M 22 -202 L 90 -202 Q 108 -202 120 -186 L 164 -130 L 22 -130 Z" fill={glow > 0 ? `rgb(${159 + 90 * glow},${211 + 30 * glow},${232 - 60 * glow})` : '#9FD3E8'} {...st} strokeWidth={6} />
        <path d="M 12 -128 L 12 -40" stroke={NUIT} strokeWidth={5} />
        <rect x={-38} y={-104} width={30} height={10} rx={5} fill={NUIT} />
        <rect x={50} y={-104} width={30} height={10} rx={5} fill={NUIT} />
        <path d="M 236 -110 Q 262 -108 264 -88 L 238 -88 Z" fill="#FFE7A6" stroke={NUIT} strokeWidth={5} />
        <rect x={-262} y={-104} width={18} height={30} rx={5} fill="#E2574C" stroke={NUIT} strokeWidth={5} />
        <path d="M -250 -64 L 262 -64" stroke="rgba(255,255,255,0.35)" strokeWidth={8} strokeLinecap="round" />
        {wheel(-150)}
        {wheel(165)}
      </g>
    </svg>
  );
};

/* ——— poste de douane : guérite + barrière qui se lève ——— */
export const Douane: React.FC<{x: number; y: number; scale?: number; open?: number; flip?: boolean; L?: number}> = ({x, y, scale = 1, open = 0, flip = false, L = 400}) => {
  const st = {stroke: NUIT, strokeWidth: 7, strokeLinejoin: 'round' as const};
  return (
    <svg width={760 * scale} height={520 * scale} viewBox="-380 -500 760 520" style={{position: 'absolute', left: x - 380 * scale, top: y - 500 * scale, overflow: 'visible'}}>
      <ellipse cx={flip ? 40 : -40} cy={6} rx={340} ry={20} fill="rgba(14,23,38,0.2)" />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        {/* guérite */}
        <rect x={-330} y={-330} width={220} height={330} rx={10} fill="#FBF7EE" {...st} />
        <path d="M -350 -330 L -90 -330 L -110 -390 L -330 -390 Z" fill="#24627F" {...st} />
        <rect x={-300} y={-290} width={160} height={110} rx={10} fill="#9FD3E8" {...st} strokeWidth={6} />
        <rect x={-300} y={-150} width={160} height={150} rx={8} fill="#E9DFC9" {...st} strokeWidth={6} />
        <rect x={-355} y={-470} width={270} height={78} rx={12} fill="#2E7D4F" {...st} />
        {/* poteau + barrière */}
        <rect x={-80} y={-200} width={44} height={200} rx={8} fill="#E9DFC9" {...st} />
        <g transform={`rotate(${-80 * open} -58 -170)`}>
          <rect x={-58} y={-190} width={L} height={40} rx={20} fill="#FFFFFF" {...st} />
          {Array.from({length: Math.floor(L / 80)}).map((_, i) => <path key={i} d={`M ${-30 + i * 80} -188 l 40 0 l -20 36 l -40 0 z`} fill={TERRE} />)}
          <rect x={-58} y={-190} width={L} height={40} rx={20} fill="none" {...st} />
        </g>
        <circle cx={-58} cy={-170} r={16} fill={NUIT} />
      </g>
      <text x={flip ? 220 : -220} y={-416} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={50} fill="#FFFFFF" letterSpacing={4}>DOUANE</text>
    </svg>
  );
};

/* ——— billet d'avion ——— */
export const Billet: React.FC<{at: number; out: number; x?: number; y?: number}> = ({at, out, x = W / 2, y = PY}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), 11, 160);
  const o = 1 - ramp(f, out, out + 0.25, easeIn);
  if (f < s(at) || o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${-5 + 5 * (1 - p)}deg) scale(${p})`, opacity: o}}>
      <div style={{display: 'flex', width: 820, height: 330, borderRadius: 24, background: '#FFFFFF', border: `6px solid ${NUIT}`, boxShadow: `0 12px 0 ${NUIT}, 0 30px 60px rgba(0,0,0,0.35)`, overflow: 'hidden'}}>
        <div style={{flex: 1, padding: '26px 34px'}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: TERRE, textTransform: 'uppercase'}}>Carte d’embarquement</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 30}}>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, color: NUIT, letterSpacing: -2}}>EUR</span>
            <Ico k="avion" size={86} color={C.or} />
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, color: NUIT, letterSpacing: -2}}>ALG</span>
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: '#5A6478', marginTop: 14}}>Aller simple · Retour définitif</div>
        </div>
        <div style={{width: 150, borderLeft: `5px dashed ${NUIT}`, background: '#F2DDA2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8}}>
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 90, height: 6 + (i % 3) * 3, background: NUIT, borderRadius: 2}} />)}
        </div>
      </div>
    </div>
  );
};

/* ——— dôme protecteur et nuage d'orage ——— */
export const Dome: React.FC<{x: number; y: number; p: number; w?: number; h?: number; hitAt?: number[]}> = ({x, y, p, w = 560, h = 520, hitAt = []}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const flash = hitAt.reduce((a, t) => a + (f >= s(t) ? Math.exp(-(f - s(t)) / 3) : 0), 0);
  return (
    <svg width={w + 80} height={h + 60} viewBox={`${-w / 2 - 40} ${-h - 20} ${w + 80} ${h + 60}`} style={{position: 'absolute', left: x - w / 2 - 40, top: y - h - 20, overflow: 'visible'}}>
      <defs>
        <radialGradient id="domeG" cx="50%" cy="80%" r="70%">
          <stop offset="0%" stopColor="#FFF4D2" stopOpacity={0.05} />
          <stop offset="70%" stopColor="#F2DDA2" stopOpacity={0.45 + 0.4 * flash} />
          <stop offset="100%" stopColor="#E9CF8E" stopOpacity={0.75} />
        </radialGradient>
      </defs>
      <g transform={`scale(${p}) `} style={{transformOrigin: '0px 0px'}}>
        <path d={`M ${-w / 2} 0 A ${w / 2} ${h} 0 0 1 ${w / 2} 0 Z`} fill="url(#domeG)" stroke="#FFFFFF" strokeWidth={12 + 8 * flash} style={{filter: 'drop-shadow(0 0 18px rgba(255,244,210,0.9))'}} />
        <path d={`M ${-w / 2 + 70} -60 A ${w / 2 - 70} ${h - 90} 0 0 1 ${-30} ${-h + 40}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
};
export const Nuage: React.FC<{x: number; y: number; p: number; bolts?: {t: number; len: number}[]}> = ({x, y, p, bolts = []}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  return (
    <svg width={520} height={700} viewBox="-260 -160 520 700" style={{position: 'absolute', left: x - 260, top: y - 160, overflow: 'visible', opacity: Math.min(1, p * 1.5)}}>
      {bolts.map(({t, len}, i) => {
        const k = f - s(t);
        if (k < 0 || k > 9) return null;
        return <path key={i} d={`M -10 40 L 34 ${40 + len * 0.42} L -14 ${40 + len * 0.5} L 18 ${40 + len}`} fill="none" stroke="#FFE45C" strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" opacity={k < 6 ? 1 : 0.4} style={{filter: 'drop-shadow(0 0 12px rgba(255,228,92,0.9))'}} />;
      })}
      <g transform={`scale(${0.6 + 0.4 * p}) translate(${Math.sin(f / 12) * 6} 0)`}>
        {[[-120, 20, 80], [-40, -30, 100], [70, -10, 90], [150, 30, 70], [0, 40, 110]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#5C6B80" stroke={NUIT} strokeWidth={7} />)}
        {[[-120, 20, 72], [-40, -30, 92], [70, -10, 82], [150, 30, 62], [0, 40, 102]].map(([cx, cy, r], i) => <circle key={'b' + i} cx={cx} cy={cy} r={r} fill="#5C6B80" />)}
        {[[-60, -50, 40], [60, -30, 34]].map(([cx, cy, r], i) => <circle key={'c' + i} cx={cx} cy={cy} r={r} fill="#73839A" />)}
      </g>
    </svg>
  );
};

/* ——— personnages : chorégraphie commune, réglable par vidéo ——— */
const mouthOf = (v: number, f: number, speaking: boolean): Mouth => {
  if (!speaking || v < 0.12) return speaking ? 'ferme' : 'sourire';
  if (v < 0.42) return 'e';
  return Math.floor(f / 3) % 2 ? 'a' : 'o';
};
const blinkAt = (f: number, seed: string, period: number) => {
  const k = Math.floor(f / period);
  const start = k * period + Math.floor(random(seed + k) * (period - 8));
  return f >= start && f < start + 4 ? 1 : 0;
};
export type Humeur = 'inquiet' | 'confiant' | 'question' | 'pensif';
export const Duo: React.FC<{d: DuoData; hx?: number; fx?: number; scale?: number; h1?: Humeur; hOver?: (f: number) => Partial<ChibiPose> & {x?: number; y?: number; sc?: number}; fOver?: (f: number) => Partial<ChibiPose>}> = ({d, hx = 190, fx = 890, scale = 0.66, h1 = 'inquiet', hOver, fOver}) => {
  const f = useCurrentFrame();
  const H1 = seg(d, 'H1'), F2 = seg(d, 'F2'), H3 = seg(d, 'H3'), F4 = seg(d, 'F4'), H5 = seg(d, 'H5');
  const breathe = (k: number) => Math.sin(f / 14 + k) * 3;
  const hv = d.mh[f] ?? 0, fv = d.mf[f] ?? 0;
  const talkArms = (k: number, v: number) => 18 + 22 * Math.abs(k ? Math.cos(f / 6) : Math.sin(f / 6)) * (v > 0.3 ? 1 : 0.3);
  const shock = f >= s(F2.s) && f < s(F2.s + 0.6) ? Math.exp(-(f - s(F2.s)) / 5) * Math.cos((f - s(F2.s)) / 2) : 0;
  const joy = win(f, H5.s + 0.15, 30);
  const q = win(f, H3.s, H3.e + 0.15);
  const h1Late = win(f, H1.s + (H1.e - H1.s) * 0.55, H1.e + 0.2);
  const ho = hOver ? hOver(f) : {};
  const hPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(hv, f, hv > 0),
    blink: blinkAt(f, 'h3', 92),
    brow: q ? 1 : joy ? 1 : win(f, F2.s, F2.s + 0.8) ? 1 : win(f, H1.s, H1.e) ? (h1 === 'inquiet' ? -1 : h1 === 'question' ? 1 : 0) : 0,
    lookX: win(f, F2.s, F2.e) ? 0.9 : q ? 0.6 : win(f, F4.s, F4.e) ? 0.75 : joy ? 0.3 : 0.2,
    lookY: q ? 0.6 : win(f, F4.s, F4.e) ? -0.5 : win(f, H1.s, H1.e) && h1 === 'pensif' ? -0.6 : 0,
    armL: joy ? 150 * ramp(f, H5.s + 0.15, H5.s + 0.35) : q ? 70 : win(f, H1.s, H1.e) ? (h1 === 'confiant' && h1Late ? 125 : talkArms(0, hv)) : 0,
    armR: joy ? 150 * ramp(f, H5.s + 0.15, H5.s + 0.35) : q ? 70 : win(f, H1.s, H1.e) ? (h1 === 'confiant' && h1Late ? 125 : talkArms(1, hv)) : 0,
    tilt: q ? -7 : win(f, H1.s, H1.e) && h1 === 'pensif' ? 5 : Math.sin(f / 3) * 3 * hv,
    squash: shock * 1.1,
    fx: q ? 'question' : joy && f < s(d.fin - 0.2) ? 'etoiles' : win(f, F2.s + 0.15, F2.s + 1.4) ? 'sueur' : h1Late && h1 === 'inquiet' ? 'sueur' : h1Late && h1 === 'question' ? 'question' : undefined,
    fxT: q ? ramp(f, H3.s, H3.s + 0.35) : h1Late && h1 === 'question' ? ramp(f, H1.e - 0.6, H1.e - 0.3) : (f % 50) / 50,
    bounce: (joy ? Math.abs(Math.sin((f - s(H5.s)) / 4)) * 40 : 0) + breathe(0),
    ...ho,
  };
  const fIn = interpolate(f, [s(F2.s - 0.35), s(F2.s + 0.05)], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1)});
  const fxPos = interpolate(fIn, [0, 1], [1320, fx]);
  const jump = Math.sin(fIn * Math.PI) * 250;
  const land = f >= s(F2.s + 0.05) ? Math.exp(-(f - s(F2.s + 0.05)) / 4) * Math.cos((f - s(F2.s + 0.05)) / 2) : 0;
  const point = (a: number, b: number) => (win(f, a, b) ? 140 * ramp(f, a, a + 0.2) : 0);
  const fCheer = win(f, H5.s + 0.5, 30);
  const fo = fOver ? fOver(f) : {};
  const fPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(fv, f, fv > 0),
    blink: blinkAt(f, 'f3', 104),
    brow: win(f, F2.s, F2.s + 1) ? 1 : 0,
    lookX: win(f, F2.s, F2.s + 1) ? -0.9 : win(f, H3.s, H3.e) ? -1 : fCheer ? -0.6 : -0.3,
    lookY: win(f, F2.s + 1, F2.e) || win(f, F4.s, F4.e) ? -0.6 : 0,
    armR: win(f, F2.s, F2.s + 0.9) ? 110 + 20 * Math.sin(f / 2.2) : Math.max(point(F2.s + 0.9, F2.e - 0.1), point((F4.s + F4.e) / 2, F4.e - 0.1)) || (fCheer ? 125 + 20 * Math.sin(f / 3) : 0),
    armL: point(F4.s + 0.1, (F4.s + F4.e) / 2) || (fCheer ? 125 + 20 * Math.cos(f / 3) : 0),
    tilt: Math.sin(f / 3 + 1) * 3 * fv,
    squash: land * 1.2 - (fIn > 0 && fIn < 1 ? 0.6 : 0),
    fx: win(f, F2.s, F2.s + 0.9) ? 'exclam' : fCheer && f < s(d.fin - 0.2) ? 'etoiles' : undefined,
    fxT: win(f, F2.s, F2.s + 0.9) ? ramp(f, F2.s, F2.s + 0.3) : ((f + 25) % 50) / 50,
    bounce: jump + (fCheer ? Math.abs(Math.sin((f - s(H5.s)) / 4 + 1)) * 30 : 0) + breathe(2),
    ...fo,
  };
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {f >= s(F2.s - 0.35) && <Chibi kind="femme" x={fxPos} y={SOL} scale={scale} pose={fPose} />}
      <Chibi kind="homme" x={ho.x ?? hx} y={ho.y ?? SOL} scale={(ho.sc ?? 1) * scale} pose={hPose} />
    </svg>
  );
};

/* ——— carte de fin : bleu nuit et or, ou sable et or ——— */
export const FinCarte: React.FC<{theme: Theme; at: number; cx?: number; cy?: number}> = ({theme, at, cx = W / 2, cy = 1250}) => {
  const f = useCurrentFrame();
  const fin = ramp(f, at, at + 0.45, Easing.bezier(0.7, 0, 0.2, 1));
  const btn = useSpring(s(at + 0.25), 12, 150);
  if (fin <= 0) return null;
  const bleu = theme === 'bleu';
  return (
    <AbsoluteFill style={{clipPath: `circle(${fin * 150}% at ${(cx / W) * 100}% ${(cy / H) * 100}%)`, background: bleu ? 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)' : 'radial-gradient(circle at 50% 34%, #FFF8E4 0%, #F6E3AE 45%, #E2B55A 100%)'}}>
      <div style={{position: 'absolute', left: W / 2, top: H * 0.28, transform: 'translate(-50%,-50%)'}}><Img src={bleu ? L_logo_clair : L_logo_couleur} style={{width: 640}} /></div>
      <div style={{position: 'absolute', top: H * 0.42, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: bleu ? C.orClair : NUIT}}>Le trait d’union avec votre Algérie</div>
      <div style={{position: 'absolute', top: H * 0.54, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', whiteSpace: 'nowrap', border: `5px solid ${NUIT}`, boxShadow: `0 10px 0 ${NUIT}`}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NUIT}}>Réservez votre appel découverte</span>
      </div>
      <div style={{position: 'absolute', top: H * 0.63, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 42, color: bleu ? C.orClair : OR_F, letterSpacing: 2, opacity: prog(f, s(at + 0.5), 10)}}>moconseildz.com</div>
    </AbsoluteFill>
  );
};
