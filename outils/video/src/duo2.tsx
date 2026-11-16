// Duo « style Game Boy Color » n°2 — explication : signé chez le notaire ≠ propriétaire (16/11/2026).
// Fond sable et or (demande d'Amine), maison construite en code qui s'écroule puis se reconstruit, vraies photos dans le panneau.
// Fait vérifié : ordonnance 75-74 du 12/11/1975, art. 15 et 16 (JORADP n° 92 du 18/11/1975).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Chibi, ChibiPose, Mouth} from './chibi';
import {D2, D2_MOUTH_F, D2_MOUTH_H, D2_SEGS} from './duo2_data';
import {L_logo_couleur} from './assets';
import {Accent, C, clamp, ease, easeIn, Particles, prog, s, SANS, useSpring, Word} from './kit';
import {Maison, Poussiere} from './maison';

const W = 1080;
const H = 1920;
const SOL = 1660;
export const DUO2_DUREE = 21.15;
export const DUO2_FRAMES = s(DUO2_DUREE);
const NUIT = '#0E1726';
const TERRE = '#C4512B';
const OR_F = '#8C6418';
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: NUIT, filter: 'drop-shadow(0 4px 0 rgba(255,250,235,0.9))'};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 7, textTransform: 'uppercase', color: TERRE};

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
const win = (f: number, a: number, b: number) => f >= s(a) && f < s(b);
const ramp = (f: number, a: number, b: number, e = ease) => interpolate(f, [s(a), s(b)], [0, 1], {...clamp, easing: e});
const SEG = (id: string) => D2_SEGS.find((x) => x.id === id)!;
const F2 = SEG('F2'), H3 = SEG('H3'), F4 = SEG('F4'), H5 = SEG('H5');
const FIN = 18.95; // ouverture de la carte de fin depuis la porte

/* tampon frappé (sur le panneau) */
const Tampon: React.FC<{at: number; until?: number; x: number; y: number; txt: string; color: string; rot?: number}> = ({at, until = 99, x, y, txt, color, rot = -10}) => {
  const f = useCurrentFrame();
  if (f < s(at) || f >= s(until)) return null;
  const p = interpolate(f, [s(at), s(at) + 5], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= s(at) + 5 ? 1 - 0.05 * Math.exp(-(f - s(at) - 5) / 3) * Math.cos((f - s(at) - 5) / 1.6) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(2.2 - 1.2 * p) * settle}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{padding: '12px 30px', border: `8px solid ${color}`, borderRadius: 16, fontFamily: SANS, fontWeight: 800, fontSize: 58, letterSpacing: 4, color, background: 'rgba(255,255,255,0.93)', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{txt}</div>
    </div>
  );
};

/* panneau photo (vraies photos de la banque) */
type Slide = {at: number; src: string; l?: string; tint?: string; mark?: 'q' | 'x'};
const SLIDES: Slide[] = [
  {at: 0.15, src: 'img/s2-signature.jpg', l: 'Chez le notaire'},
  {at: D2.f2_tant - 0.1, src: 'img/archives-etagere.jpg'},
  {at: D2.f2_conservation, src: 'img/archives-etagere.jpg', l: 'Conservation foncière'},
  {at: D2.f2_propriete, src: 'img/archives-etagere.jpg', l: 'Conservation foncière', tint: 'rgba(196,81,43,0.45)', mark: 'x'},
  {at: H3.s, src: 'img/s2-signature.jpg', tint: 'rgba(14,23,38,0.35)', mark: 'q'},
  {at: F4.s, src: 'img/cachet-bois.jpg', l: 'Publication'},
];
const PW = 880, PH = 500, PY = 690;
const Panneau: React.FC = () => {
  const f = useCurrentFrame();
  const inP = useSpring(s(0.15), 12, 160);
  const outP = ramp(f, D2.f4_suivez - 0.25, D2.f4_suivez, easeIn);
  if (f < s(0.15) || outP >= 1) return null;
  let cur = 0;
  SLIDES.forEach((sl, i) => { if (f >= s(sl.at)) cur = i; });
  return (
    <div style={{position: 'absolute', left: W / 2, top: PY, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * inP) * (1 - 0.3 * outP)}) rotate(${(1 - inP) * -6}deg)`, opacity: Math.min(1, inP * 2) * (1 - outP)}}>
      <div style={{position: 'relative', width: PW, height: PH, borderRadius: 30, overflow: 'hidden', border: `8px solid ${NUIT}`, boxShadow: `0 14px 0 ${NUIT}, 0 30px 70px rgba(80,50,0,0.35)`, background: NUIT}}>
        {SLIDES.map((sl, i) => {
          if (i < cur - 1 || i > cur) return null;
          const same = i > 0 && SLIDES[i - 1].src === sl.src;
          const p = i === cur && !same ? prog(f, s(sl.at), 8, Easing.bezier(0.6, 0, 0.2, 1)) : 1;
          const k0 = same ? SLIDES.findIndex((x) => x.src === sl.src && x.at <= sl.at) : i;
          const k = interpolate(f, [s(SLIDES[k0].at), s(SLIDES[k0].at) + 90], [1.18, 1.03], clamp);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: i === cur ? `inset(0 0 0 ${(1 - p) * 100}%)` : undefined}}>
              <Img src={staticFile(sl.src)} style={{width: PW, height: PH, objectFit: 'cover', transform: `scale(${k})`, filter: 'saturate(1.25) contrast(1.08)'}} />
              {sl.tint && <AbsoluteFill style={{background: sl.tint, opacity: prog(f, s(sl.at), 6)}} />}
              <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,40,0.5) 0%, rgba(10,20,40,0) 35%)'}} />
              {sl.l && (
                <div style={{position: 'absolute', left: 26, top: 22, padding: '10px 26px', borderRadius: 999, background: '#F2DDA2', border: `4px solid ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NUIT, transform: `scale(${same ? 1 : prog(f, s(sl.at) + 4, 8)})`, transformOrigin: 'left center'}}>{sl.l}</div>
              )}
              {sl.mark === 'x' && <div style={{position: 'absolute', left: PW / 2, top: PH / 2 + 20, transform: `translate(-50%,-50%) scale(${2 - prog(f, s(sl.at), 5)}) rotate(-12deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 250, color: '#FFFFFF', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>✕</div>}
              {sl.mark === 'q' && <div style={{position: 'absolute', left: PW / 2, top: PH / 2 + 10, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * prog(f, s(sl.at) + 3, 8)}) rotate(${6 * Math.sin(f / 5)}deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 300, color: '#F2DDA2', lineHeight: 1, textShadow: `0 8px 0 ${NUIT}`}}>?</div>}
            </div>
          );
        })}
        <Tampon at={D2.h1_notaire} until={D2.f2_tant - 0.1} x={PW - 230} y={PH - 120} txt="SIGNÉ ✓" color="#24627F" rot={-9} />
        <Tampon at={D2.f4_proprietaire - 0.2} x={PW - 250} y={PH - 120} txt="PUBLIÉ ✓" color="#2E7D4F" rot={-8} />
      </div>
    </div>
  );
};

/* frise en 3 étapes : signé → publié → titre enregistré */
const Frise: React.FC = () => {
  const f = useCurrentFrame();
  const a = D2.f4_suivez - 0.15;
  const inP = useSpring(s(a), 12, 150);
  const out = ramp(f, H5.s + 0.6, H5.s + 0.9, easeIn);
  const steps = [{l: 'Acte signé', at: a + 0.15}, {l: 'Acte publié', at: D2.f4_suivez + 0.45}, {l: 'Titre enregistré', at: D2.f4_titre}];
  const pops = [useSpring(s(steps[0].at), 9, 200), useSpring(s(steps[1].at), 9, 200), useSpring(s(steps[2].at), 9, 200)];
  if (f < s(a) || out >= 1) return null;
  return (
    <div style={{position: 'absolute', left: W / 2, top: 700, transform: `translate(-50%,-50%) translateY(${(1 - inP) * 260}px) scale(${1 - 0.2 * out})`, opacity: Math.min(1, inP * 1.6) * (1 - out)}}>
      <div style={{width: 900, padding: '34px 36px 30px', borderRadius: 26, background: '#FFFDF6', border: `6px solid ${NUIT}`, boxShadow: `0 12px 0 ${NUIT}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative'}}>
          <div style={{position: 'absolute', left: 70, right: 70, top: 44, height: 10, borderRadius: 6, background: '#E8DCC6'}} />
          <div style={{position: 'absolute', left: 70, top: 44, height: 10, borderRadius: 6, background: C.or, width: `${(760 - 0) * Math.min(1, ramp(f, steps[0].at, steps[1].at) * 0.5 + ramp(f, steps[1].at, steps[2].at) * 0.5)}px`}} />
          {steps.map((st, i) => {
            const on = f >= s(st.at);
            const pop = pops[i];
            return (
              <div key={i} style={{width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1}}>
                <div style={{width: 96, height: 96, borderRadius: 96, background: on ? `linear-gradient(160deg, #F2DDA2, ${C.or})` : '#FFFFFF', border: `6px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.8 + 0.2 * pop : 0.85})`}}>
                  {on ? <svg width={52} height={52} viewBox="0 0 32 32"><path d="M6 17l7 7 13-15" fill="none" stroke={NUIT} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NUIT}}>{i + 1}</span>}
                </div>
                <div style={{marginTop: 16, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: NUIT, textAlign: 'center', lineHeight: 1.1}}>{st.l}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* texte du haut */
const Bloc: React.FC<{at: number; out: number; y?: number; children: React.ReactNode}> = ({at, out, y = 140, children}) => {
  const f = useCurrentFrame();
  if (f < s(at) - 2 || f > s(out) + 8) return null;
  const o = 1 - ramp(f, out, out + 0.2, easeIn);
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', opacity: o, transform: `translateY(${-(1 - o) * 30}px)`}}>{children}</div>;
};

export const DuoSigne: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const breathe = (k: number) => Math.sin(f / 14 + k) * 3;
  /* — maison : construite à la signature, écroulée à « Pas encore », reconstruite à « publication » — */
  const build1 = ramp(f, D2.h1_signe + 0.2, D2.h1_moi + 0.15, Easing.linear);
  const crashT = ramp(f, D2.f2_pas + 0.05, D2.f2_pas + 1.15, Easing.linear);
  const rebuilding = f >= t(D2.f4_publication);
  const build2 = ramp(f, D2.f4_publication, D2.f4_titre, Easing.linear);
  const build = rebuilding ? build2 : f >= t(D2.f2_pas) ? 1 : build1;
  const crash = rebuilding ? 0 : f >= t(D2.f2_pas) ? crashT : 0;
  const doorOpen = ramp(f, D2.h5_publie, D2.h5_publie + 0.45);
  const glow = ramp(f, D2.f4_titre, D2.f4_titre + 0.4);
  const HX = 540, HY = SOL - 6, HS = 1.08;
  /* — homme — */
  const hv = D2_MOUTH_H[f] ?? 0;
  const walk = ramp(f, D2.h5_publie + 0.25, FIN + 0.05, Easing.bezier(0.4, 0, 0.6, 1));
  const hxBase = 175;
  const hx = interpolate(walk, [0, 1], [hxBase, HX]);
  const hScale = 1 - 0.45 * walk;
  const hOpacity = 1 - ramp(f, FIN - 0.2, FIN + 0.05);
  const joy = win(f, D2.h1_moi - 0.1, F2.s + 0.1);
  const shock = f >= t(D2.f2_pas) && f < t(D2.f2_pas + 0.5) ? Math.exp(-(f - t(D2.f2_pas)) / 5) * Math.cos((f - t(D2.f2_pas)) / 2) : 0;
  const hPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(hv, f, hv > 0),
    blink: blinkAt(f, 'h2', 90),
    brow: joy ? 1 : win(f, D2.f2_pas, H3.e) ? 1 : win(f, H5.s, 21) ? 0 : 0,
    lookX: win(f, F2.s, F2.e) ? 0.9 : win(f, H3.s, H3.s + 0.8) ? 0.6 : win(f, F4.s, F4.e) ? 0.8 : walk > 0 ? 0.5 : 0.2,
    lookY: win(f, H3.s, H3.s + 0.8) ? 0.7 : 0,
    armL: joy ? 150 * ramp(f, D2.h1_moi - 0.1, D2.h1_moi + 0.1) : win(f, H3.s + 0.6, H3.e) ? 70 : win(f, D2.h5_publie, FIN) ? 140 * ramp(f, D2.h5_publie, D2.h5_publie + 0.2) : win(f, 0.4, D2.h1_moi) ? 18 + 20 * Math.abs(Math.sin(f / 6)) * (hv > 0.3 ? 1 : 0.3) : 0,
    armR: joy ? 150 * ramp(f, D2.h1_moi - 0.1, D2.h1_moi + 0.1) : win(f, H3.s + 0.6, H3.e) ? 70 : win(f, H5.s, D2.h5_publie) ? 60 : win(f, 0.4, D2.h1_moi) ? 18 + 20 * Math.abs(Math.cos(f / 6)) * (hv > 0.3 ? 1 : 0.3) : 0,
    tilt: win(f, H3.s, H3.e) ? -7 : Math.sin(f / 3) * 3 * hv,
    squash: shock * 1.1,
    fx: joy ? 'etoiles' : win(f, D2.f2_pas + 0.2, D2.f2_tant + 0.4) ? 'sueur' : win(f, H3.s, H3.e) ? 'question' : win(f, D2.h5_publie, FIN - 0.3) ? 'coeurs' : undefined,
    fxT: win(f, H3.s, H3.e) ? ramp(f, H3.s, H3.s + 0.35) : (f % 50) / 50,
    bounce: (joy ? Math.abs(Math.sin((f - t(D2.h1_moi)) / 4)) * 50 : 0) + (walk > 0 && walk < 1 ? Math.abs(Math.sin(f / 2.5)) * 22 : 0) + breathe(0),
  };
  /* — femme : entre en sautant à « Pas encore » — */
  const fIn = interpolate(f, [t(F2.s - 0.35), t(F2.s + 0.05)], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1)});
  const fxPos = interpolate(fIn, [0, 1], [1320, 905]);
  const jump = Math.sin(fIn * Math.PI) * 260;
  const fv = D2_MOUTH_F[f] ?? 0;
  const land = f >= t(F2.s + 0.05) ? Math.exp(-(f - t(F2.s + 0.05)) / 4) * Math.cos((f - t(F2.s + 0.05)) / 2) : 0;
  const point = (a: number, b: number) => (win(f, a, b) ? 140 * ramp(f, a, a + 0.2) : 0);
  const fPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(fv, f, fv > 0),
    blink: blinkAt(f, 'f2', 100),
    brow: win(f, F2.s, F2.s + 1) ? 1 : 0,
    lookX: win(f, F2.s, D2.f2_tant) ? -0.9 : win(f, H3.s, H3.e) ? -1 : win(f, FIN - 0.6, 21) ? -0.6 : -0.3,
    lookY: win(f, D2.f2_tant, F2.e) || win(f, F4.s, D2.f4_suivez) ? -0.6 : 0,
    armR: win(f, F2.s, D2.f2_tant) ? 110 + 20 * Math.sin(f / 2.2) : Math.max(point(D2.f2_conservation, F2.e - 0.2), point(D2.f4_suivez, F4.e - 0.2)),
    armL: point(F4.s + 0.1, D2.f4_suivez) || (win(f, D2.h5_moi, 21) ? 120 + 25 * Math.sin(f / 3) : 0),
    tilt: Math.sin(f / 3 + 1) * 3 * fv,
    squash: land * 1.2 - (fIn > 0 && fIn < 1 ? 0.6 : 0),
    fx: win(f, F2.s, F2.s + 0.9) ? 'exclam' : undefined,
    fxT: ramp(f, F2.s, F2.s + 0.3),
    bounce: jump + breathe(2),
  };
  const shake = win(f, D2.f2_pas + 0.1, D2.f2_pas + 0.5) ? Math.sin(f * 3) * 9 : 0;
  const hit = useSpring(t(D2.f2_pas), 9, 200);
  const fin = ramp(f, FIN, FIN + 0.45, Easing.bezier(0.7, 0, 0.2, 1));
  const btn = useSpring(t(FIN + 0.25), 12, 150);
  const doorX = HX + (205 + 55 - 260) * HS, doorY = HY - (520 - 435) * HS - 40;
  return (
    <AbsoluteFill style={{background: '#F6E7BE', transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo2-bande-son.wav')} />
      {/* fond sable et or, lumineux et contrasté */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 65% at 50% 38%, #FFF6DC 0%, #F5DE9E 34%, #E2B55A 66%, #B8842C 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
        <g transform={`translate(${W / 2} 620) rotate(${f * 0.25})`}>
          {Array.from({length: 18}).map((_, i) => <path key={i} d="M0 0 L-70 -1400 L70 -1400 Z" fill="#FFFFFF" transform={`rotate(${i * 20})`} />)}
        </g>
      </svg>
      <Panneau />
      <Frise />
      {/* estrade bronze */}
      <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: 'linear-gradient(180deg, #8C6418 0%, #6E4C12 45%, #3E2A0A 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: SOL - 6, width: W, height: 12, background: '#FFF4D2', boxShadow: '0 0 30px rgba(255,244,210,0.9)'}} />
      {/* maison */}
      <Maison x={HX} y={HY} scale={HS} build={build} crash={crash} door={doorOpen} glow={glow} seed="duo2" />
      <Poussiere x={HX} y={HY} t={ramp(f, D2.f2_pas + 0.15, D2.f2_pas + 1.4, Easing.linear)} />
      {/* textes du haut */}
      <Bloc at={0.38} out={F2.s - 0.1}>
        <div style={eyebrow}><Word at={t(0.4)}>Chez le notaire</Word></div>
        <div style={{...big, fontSize: 84, marginTop: 14}}><Word at={t(D2.h1_signe)}>J’ai signé :</Word></div>
        <div><Accent at={t(D2.h1_moi)} size={136} color={OR_F} stroke="none">c’est à moi !</Accent></div>
      </Bloc>
      <Bloc at={D2.f2_pas} out={D2.f2_tant - 0.08}>
        <div style={{...big, fontSize: 140, color: TERRE, transform: `scale(${0.5 + 0.5 * hit}) rotate(${-4 * hit}deg)`}}>PAS</div>
        <div style={{...big, fontSize: 124, color: TERRE, transform: `scale(${0.5 + 0.5 * hit}) rotate(${-4 * hit}deg)`}}>ENCORE !</div>
      </Bloc>
      <Bloc at={D2.f2_tant} out={D2.f2_propriete - 0.08}>
        <div style={eyebrow}><Word at={t(D2.f2_tant)}>Tant que l’acte</Word></div>
        <div style={{...big, fontSize: 80, marginTop: 12}}><Word at={t(D2.f2_tant + 0.3)}>n’est pas</Word></div>
        <div><Accent at={t(D2.f2_publie)} size={140} color={OR_F} stroke="none">publié…</Accent></div>
      </Bloc>
      <Bloc at={D2.f2_propriete} out={H3.s - 0.08}>
        <div style={{...big, fontSize: 84}}><Word at={t(D2.f2_propriete)}>la propriété</Word></div>
        <div style={{...big, fontSize: 84, color: TERRE}}><Word at={t(D2.f2_transferee - 0.3)}>n’est pas transférée.</Word></div>
      </Bloc>
      <Bloc at={H3.s} out={F4.s - 0.08}>
        <div style={{...big, fontSize: 130}}><Word at={t(D2.h3_serieux)}>Sérieux ?</Word></div>
        <div style={{...big, fontSize: 64, marginTop: 8}}><Word at={t(D2.h3_signature)}>La signature </Word><Word at={t(D2.h3_suffit)}>ne suffit pas ?</Word></div>
      </Bloc>
      <Bloc at={F4.s} out={D2.f4_suivez - 0.08}>
        <div style={{...big, fontSize: 80}}><Word at={t(D2.f4_publication)}>C’est la publication</Word></div>
        <div><Accent at={t(D2.f4_proprietaire)} size={92} color={OR_F} stroke="none">qui vous rend propriétaire.</Accent></div>
      </Bloc>
      <Bloc at={D2.f4_suivez} out={H5.s - 0.08}>
        <div style={eyebrow}><Word at={t(D2.f4_suivez)}>Suivez votre dossier</Word></div>
        <div><Accent at={t(D2.f4_titre - 0.2)} size={96} color={OR_F} stroke="none">jusqu’au titre enregistré.</Accent></div>
      </Bloc>
      <Bloc at={H5.s} out={FIN}>
        <div style={{...big, fontSize: 88}}><Word at={t(D2.h5_signe)}>Signé, </Word><Word at={t(D2.h5_bien)}>c’est bien.</Word></div>
        <div><Accent at={t(D2.h5_publie)} size={110} color={OR_F} stroke="none">Publié, c’est à moi !</Accent></div>
      </Bloc>
      {/* personnages */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {f >= t(F2.s - 0.35) && <Chibi kind="femme" x={fxPos} y={SOL} scale={0.64} pose={fPose} />}
        <g opacity={hOpacity}><Chibi kind="homme" x={hx} y={SOL - 30 * walk} scale={0.64 * hScale} pose={hPose} /></g>
      </svg>
      <Particles at={t(D2.f4_titre)} dur={s(1.0)} cx={HX} cy={1250} mode="out" n={80} spread={560} seed="d2a" />
      <Particles at={t(D2.h5_publie)} dur={s(1.0)} cx={HX} cy={1300} mode="out" n={90} spread={600} seed="d2b" />
      {/* carte de fin sable et or, ouverte depuis la porte */}
      {fin > 0 && (
        <AbsoluteFill style={{clipPath: `circle(${fin * 150}% at ${(doorX / W) * 100}% ${(doorY / H) * 100}%)`, background: 'radial-gradient(circle at 50% 34%, #FFF8E4 0%, #F6E3AE 45%, #E2B55A 100%)'}}>
          <div style={{position: 'absolute', left: W / 2, top: H * 0.28, transform: 'translate(-50%,-50%)'}}><Img src={L_logo_couleur} style={{width: 640}} /></div>
          <div style={{position: 'absolute', top: H * 0.42, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: NUIT}}>Le trait d’union avec votre Algérie</div>
          <div style={{position: 'absolute', top: H * 0.54, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', whiteSpace: 'nowrap', border: `5px solid ${NUIT}`, boxShadow: `0 10px 0 ${NUIT}`}}>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: NUIT}}>Réservez votre appel découverte</span>
          </div>
          <div style={{position: 'absolute', top: H * 0.63, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 42, color: OR_F, letterSpacing: 2, opacity: prog(f, t(FIN + 0.5), 10)}}>moconseildz.com</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
