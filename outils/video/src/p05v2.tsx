// Série « Un pack en 30 secondes » — vidéo 5 : Pack Conciergerie, v2 (refonte du 26/10/2026, demandes d'Amine de 18h47).
// Voix « Homme » ElevenLabs (Eleven v3, balises), deux pauses raccourcies, accélérée x1,12 : 28,2 s (voix/align_p05.json).
// Temps écrits en secondes de la voix finale. Plan 1 : vidéo d'Amine (Maqam Echahid depuis le Jardin d'Essai) ;
// plan 2 : vidéo fournie par Amine (bureau en Europe), recadrée sous son filigrane et agrandie x2 (FSRCNN).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, Particles, prog, s, SANS, Spark, useSpring, Word} from './kit';
import {Mask, Photo, Pin} from './scenes4';

const W = 1080;
const H = 1920;
const HALF = 960;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};
const shadowW = 'drop-shadow(0 4px 18px rgba(0,0,0,0.6))';

type Sc = React.FC<{st: number; dur: number}>;
const useT = (st: number) => (x: number) => s(x) - s(st);

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

/* ===================================================== 1. Accroche : Alger (vidéo d'Amine, Maqam Echahid, ciel bleuté) — aucune animation ajoutée sur le premier plan (règle d'Amine, 26/10) */
const B1: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const z = interpolate(f, [0, dur], [1.12, 1.0], {...clamp, easing: Easing.bezier(0.2, 0.7, 0.3, 1)});
  // filé horizontal vers l'Europe
  const whip = interpolate(f, [t(1.16), t(1.16) + 7], [0, 1], {...clamp, easing: Easing.bezier(0.6, 0, 0.9, 0.6)});
  return (
    <AbsoluteFill style={{background: C.nuit, overflow: 'hidden', transform: `translateX(${-whip * W * 0.9}px)`, filter: `blur(${whip * 26}px)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${z})`, transformOrigin: '50% 40%'}}>
        <OffthreadVideo src={staticFile('video/s5-maqam-jardin.mp4')} muted style={{width: W, height: H, objectFit: 'cover'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.32) 0%, rgba(14,23,38,0.12) 22%, rgba(14,23,38,0) 32%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.35) 0%, rgba(14,23,38,0) 30%)'}} />
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...big, fontSize: 104}}>
          <Word at={t(0.1)}>Vos </Word>
          <Word at={t(0.4)}>affaires</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(0.66)} size={176} color={C.orClair} stroke="none">
            en Algérie…
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 2. … et vous vivez en Europe ? Facture, logement, courrier, rendez-vous : il faut appeler un proche */
const VID = {y: 470, w: W, h: Math.round((1296 * W) / 1144)};
const CARDS = [
  {k: 'facture' as const, l: 'Facture', at: 3.1, x: 300, y: 1150, r: -4},
  {k: 'logement' as const, l: 'Logement', at: 3.82, x: 790, y: 1255, r: 3.5},
  {k: 'courrier' as const, l: 'Courrier', at: 4.44, x: 285, y: 1390, r: 2.5},
  {k: 'rdv' as const, l: 'Rendez-vous', at: 5.02, x: 760, y: 1505, r: -3},
];
const B2: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 7], [1, 0], {...clamp, easing: Easing.bezier(0.1, 0.6, 0.3, 1)});
  const z = interpolate(f, [0, dur], [1.0, 1.06], clamp);
  const swap = prog(f, t(5.74), 8, easeIn);
  const dim = prog(f, t(6.4), 14);
  const out = interpolate(f, [t(7.86), t(8.1)], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `translateX(${enter * W * 0.9}px)`, filter: `blur(${enter * 26 + out * 18}px)`, opacity: 1 - out}}>
      {/* bandes haut et bas : nuit et marine, halo or (charte), plus de fond gris */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.nuit} 0%, ${C.marine} 22%, ${C.marine} 78%, ${C.nuit} 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 14% at 50% 12%, rgba(201,162,75,0.28) 0%, rgba(201,162,75,0) 100%), radial-gradient(ellipse 70% 10% at 50% 94%, rgba(201,162,75,0.22) 0%, rgba(201,162,75,0) 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: VID.y, width: VID.w, height: VID.h, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0px, #000 90px, #000 calc(100% - 140px), rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0px, #000 90px, #000 calc(100% - 140px), rgba(0,0,0,0) 100%)'}}>
        <div style={{width: '100%', height: '100%', transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
          <OffthreadVideo src={staticFile('video/s5-bureau-europe.mp4')} muted style={{width: VID.w, height: VID.h, objectFit: 'cover'}} />
        </div>
        <AbsoluteFill style={{background: `rgba(14,23,38,${0.35 * dim})`}} />
      </div>
      {/* les affaires nommées tombent sur le bureau, sur chaque mot */}
      {CARDS.map((c, i) => {
        const a = t(c.at) - 2;
        const p = interpolate(f, [a, a + 9], [0, 1], {...clamp, easing: Easing.bezier(0.3, 1.3, 0.5, 1)});
        if (f < a) return null;
        const side = i % 2 ? 1 : -1;
        return (
          <div key={i} style={{position: 'absolute', left: c.x + side * (1 - p) * 500, top: c.y - (1 - p) * 120, transform: `translate(-50%,-50%) rotate(${c.r + (1 - p) * side * 25}deg) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 2)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 36px 20px 24px', borderRadius: 10, background: 'linear-gradient(180deg, #FCFAF5 0%, #F4EFE6 100%)', borderLeft: `9px solid ${C.or}`, boxShadow: '0 22px 50px rgba(14,23,38,0.55)', whiteSpace: 'nowrap'}}>
              <Ico k={c.k} size={64} />
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.marine, letterSpacing: -1}}>{c.l}</span>
            </div>
          </div>
        );
      })}
      {/* texte du haut : Europe, puis « il faut appeler un proche » */}
      <div style={{position: 'absolute', top: 205, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW, opacity: 1 - swap, transform: `translateY(${-swap * 30}px)`}}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(1.71)}>et </Word>
          <Word at={t(1.74)}>vous </Word>
          <Word at={t(1.9)}>vivez</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(2.25)} size={150} color={C.orClair} stroke="none">
            en Europe ?
          </Accent>
        </div>
      </div>
      {swap > 0 && (
        <div style={{position: 'absolute', top: 190, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
          <div style={{...eyebrow, color: C.orClair, fontSize: 32}}>
            <Word at={t(5.8)}>À chaque fois,</Word>
          </div>
          <div style={{...big, fontSize: 88, marginTop: 12}}>
            <Word at={t(6.43)}>il </Word>
            <Word at={t(6.53)}>faut </Word>
            <Word at={t(6.73)}>appeler</Word>
          </div>
          <div style={{marginTop: 2}}>
            <Accent at={t(6.98)} size={150} color={C.orClair} stroke="none">
              un proche.
            </Accent>
          </div>
        </div>
      )}
    </AbsoluteFill>
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
      <Spark at={t(11.3)} x={W / 2} y={HALF} scale={0.9} out={t(11.9)} />
      <Particles at={t(11.3)} dur={s(0.7)} cx={W / 2} cy={HALF} mode="out" n={90} spread={420} seed="c3" boxW={500} boxH={20} />
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
      <Label text="Europe" y={250} op={lab} />
      <div style={{position: 'absolute', left: W / 2, top: 1210, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 600, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1440, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.blanc, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`, filter: shadowW}}>
        Une équipe en Europe, une équipe en Algérie
      </div>
      <Label text="Algérie" y={1630} op={lab} />
    </AbsoluteFill>
  );
};

/* ===================================================== 4. Le pack : factures, courrier, logement, rendez-vous */
const WIN = {x: 70, y: 400, w: 940, h: 640};
const SHOTS = [
  {at: 12.55, src: P.P_s5_factures, w: 1600, h: 2841, ox: 0.5, oy: 0.62},
  {at: 15.41, src: P.P_s5_papiers, w: 1600, h: 2400, ox: 0.5, oy: 0.55},
  {at: 16.64, src: P.P_s5_cles, w: 1600, h: 2400, ox: 0.5, oy: 0.5},
];
const CHECKS = [
  {l: 'Factures réglées', at: 14.45},
  {l: 'Courrier relevé et numérisé', at: 15.41},
  {l: 'Logement contrôlé', at: 16.64},
  {l: 'Rendez-vous assurés', at: 17.39},
];
const B4: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const shrink = interpolate(f, [12, 26], [0, 1], {...clamp, easing: inOut});
  const box = {
    x: interpolate(shrink, [0, 1], [0, WIN.x]),
    y: interpolate(shrink, [0, 1], [0, WIN.y]),
    w: interpolate(shrink, [0, 1], [W, WIN.w]),
    h: interpolate(shrink, [0, 1], [H, WIN.h]),
  };
  const push = interpolate(f, [t(19.6), t(19.9)], [0, 1], {...clamp, easing: inOut});
  const veil = prog(f, t(17.9), 10);
  const titleHit = useSpring(t(13.46), 11, 170);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`, transform: `translateX(${-push * W}px)`}}>
      <AbsoluteFill style={{background: C.pierre}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)'}} />
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center'}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(12.67)}>Avec le pack</Word>
        </div>
        <div style={{marginTop: 4, transform: `scale(${f < t(13.46) ? 0 : 0.6 + 0.4 * titleHit})`}}>
          <Accent at={t(13.46)} size={124} color={C.marine} stroke="none">
            Conciergerie
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', boxShadow: `0 40px 80px rgba(27,42,65,${0.28 * shrink})`}}>
        {SHOTS.map((sh, i) => {
          const a = t(sh.at - 0.12);
          const wp = i === 0 ? 1 : interpolate(f, [a, a + 12], [0, 1], {...clamp, easing: inOut});
          if (wp <= 0) return null;
          const z = interpolate(f, [Math.max(0, a), a + 12, a + 90], [1.16, 1.07, 1.0], {...clamp, easing: ease});
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - wp) * 100}% 0 0 0)`}}>
              <Photo src={sh.src} w={sh.w} h={sh.h} fw={box.w} fh={box.h} ox={sh.ox} oy={sh.oy} zoom={z} />
            </div>
          );
        })}
        <AbsoluteFill style={{background: `rgba(14,23,38,${0.62 * veil})`}} />
        <div style={{position: 'absolute', inset: 18, border: `2px solid rgba(233,207,142,${0.75 * shrink})`, pointerEvents: 'none'}} />
        <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', color: C.blanc}}>
          <div style={{...big, fontSize: 84}}>
            <Word at={t(17.96)}>Sans </Word>
            <Word at={t(18.23)}>vous</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={t(18.75)} size={150} color={C.orClair} stroke="none">
              déplacer.
            </Accent>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 1110}}>
        {CHECKS.map((c, i) => {
          const p = prog(f, t(c.at), 12);
          const tick = prog(f, t(c.at) + 4, 10);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: i * 118, display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * 50}px)`, whiteSpace: 'nowrap'}}>
              <div style={{width: 64, height: 64, borderRadius: 64, background: tick > 0 ? C.or : C.pierre, border: `4px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * tick})`, flexShrink: 0}}>
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                </svg>
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.marine, letterSpacing: -1}}>{c.l}</div>
            </div>
          );
        })}
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
        <Photo src={P.P_s2_classeurs} w={1600} h={2400} zoom={z} ox={0.5} oy={0.6} filter="saturate(0.85)" />
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
        <div style={{position: 'absolute', left: W / 2, top: 1070, transform: `translate(-50%,-50%) translateY(${(1 - sheetIn) * 700}px) rotate(${-1.5 + (1 - sheetIn) * 6}deg)`}}>
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
          </div>
        </div>
        {/* les justificatifs glissent sous la feuille */}
        {PROOFS.map((pr, i) => {
          const a = t(pr.at);
          const p = interpolate(f, [a, a + 10], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.9, 0.3, 1)});
          if (f < a) return null;
          return (
            <div key={i} style={{position: 'absolute', left: pr.x, top: 1615 + (1 - p) * 500, transform: `translate(-50%,-50%) rotate(${pr.r * (0.4 + 0.6 * p)}deg)`, opacity: Math.min(1, p * 2)}}>
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

/* ===================================================== 6. Pendant que vous restez chez vous… nous gérons le reste */
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
        <div style={{...big, fontSize: 84}}>
          <Word at={t(24.17)}>Pendant </Word>
          <Word at={t(24.39)}>que </Word>
          <Word at={t(24.52)}>vous</Word>
        </div>
        <div style={{...big, fontSize: 84}}>
          <Word at={t(24.67)}>restez </Word>
          <Word at={t(24.88)}>chez </Word>
          <Word at={t(25.02)}>vous…</Word>
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

/* ===================================================== montage */
export const P05V2_DUREE = 29.5;
const PLAN: [number, number, Sc][] = [
  [0, 1.45, B1],
  [1.2, 8.12, B2],
  [7.9, 12.7, B3],
  [12.45, 20.0, B4],
  [19.6, 24.3, B5],
  [23.95, 26.95, B6],
  [26.6, P05V2_DUREE, B7],
];

export const Pack05ConciergerieV2: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {PLAN.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp st={a} dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
