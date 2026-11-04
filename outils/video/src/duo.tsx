// Duo « style Game Boy Color » — Pack Conciergerie, 20 s (04/11/2026). Voix d'Amine (ElevenLabs Homme + Femme).
// Personnages vectoriels articulés (chibi.tsx) ; bouche calée image par image sur la voix (duo_data.ts).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Chibi, ChibiPose, Mouth} from './chibi';
import {MOUTH_F, MOUTH_H, DUO_DUREE} from './duo_data';
import {L_logo_clair, L_logo_couleur} from './assets';
import {Accent, C, clamp, ease, easeIn, Particles, prog, s, SANS, useSpring, Word} from './kit';

const W = 1080;
const H = 1920;
const SOL = 1660;
const OR_TEXTE = '#9C7726';
export const DUO_FRAMES = s(DUO_DUREE);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: C.blanc, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.55))'};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 7, textTransform: 'uppercase', color: '#F2DDA2', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))'};

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

/* icônes or */
const Ico: React.FC<{k: string; size?: number}> = ({k, size = 60}) => {
  const p = {fill: 'none', stroke: C.or, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {k === 'facture' && (<><path d="M14 6h28l10 10v42H14z" {...p} /><path d="M42 6v10h10" {...p} /><path d="M22 28h22M22 38h22M22 48h12" {...p} /></>)}
      {k === 'compteur' && (<><circle cx={32} cy={34} r={22} {...p} /><path d="M32 34l10-10" {...p} /><path d="M18 34h4M42 34h4M32 18v4" {...p} /></>)}
      {k === 'courrier' && (<><rect x={6} y={14} width={52} height={36} rx={4} {...p} /><path d="M8 17l24 19 24-19" {...p} /></>)}
    </svg>
  );
};
const Carte: React.FC<{k: string; l: string; at: number; x: number; y: number; r: number; out: number}> = ({k, l, at, x, y, r, out}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), 10, 160);
  const o = 1 - ramp(f, out, out + 0.25, easeIn);
  if (f < s(at)) return null;
  const wob = Math.sin(f / 9 + x) * 4;
  return (
    <div style={{position: 'absolute', left: x, top: y + wob, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${p * (1 - 0.3 * (1 - o))})`, opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px 16px 18px', borderRadius: 14, background: '#FFFFFF', border: `5px solid ${C.nuit}`, boxShadow: `0 10px 0 ${C.nuit}`, whiteSpace: 'nowrap'}}>
        <Ico k={k} size={56} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.marine, letterSpacing: -1}}>{l}</span>
      </div>
    </div>
  );
};
const Avion: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 1.1, Easing.bezier(0.4, 0, 0.6, 1));
  if (p <= 0 || p >= 1) return null;
  const x = -120 + p * (W + 240);
  const y = 720 - Math.sin(p * Math.PI) * 120;
  return (
    <svg width={140} height={140} viewBox="-70 -70 140 140" style={{position: 'absolute', left: x - 70, top: y - 70, transform: `rotate(${-14 + p * 20}deg)`}}>
      <path d="M -50 6 L 40 -4 Q 60 -6 60 2 Q 58 8 40 8 L -50 14 Z" fill="#FFFFFF" stroke={C.nuit} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -6 2 L -28 -34 L -14 -34 L 18 2 Z M -6 10 L -24 42 L -10 42 L 16 10 Z M -44 6 L -56 -14 L -46 -14 L -34 6 Z" fill={C.or} stroke={C.nuit} strokeWidth={4} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <line key={i} x1={-70 - i * 26} y1={4 + i * 6} x2={-56 - i * 26} y2={4 + i * 6} stroke={C.or} strokeWidth={5} strokeLinecap="round" />)}
    </svg>
  );
};
/* compte rendu */
const Rapport: React.FC<{at: number; out: number}> = ({at, out}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), 12, 140);
  const o = 1 - ramp(f, out, out + 0.25, easeIn);
  if (f < s(at)) return null;
  const lines = ['Factures réglées', 'Courrier relevé', 'Compteur vérifié'];
  return (
    <div style={{position: 'absolute', left: W / 2, top: PY, transform: `translate(-50%,-50%) translateY(${(1 - p) * 300}px) rotate(${-2 + (1 - p) * 8}deg)`, opacity: Math.min(1, p * 2) * o}}>
      <div style={{width: 600, borderRadius: 14, background: '#FFFFFF', border: `5px solid ${C.nuit}`, boxShadow: `0 12px 0 ${C.nuit}`, overflow: 'hidden'}}>
        <div style={{background: C.marine, padding: '18px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{...eyebrow, color: C.orClair, fontSize: 26, letterSpacing: 5}}>Compte rendu</span>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.blanc}}>chaque mois</span>
        </div>
        {lines.map((l, i) => {
          const q = prog(f, s(at) + 6 + i * 5, 8);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 30px', opacity: q, transform: `translateX(${(1 - q) * 30}px)`}}>
              <div style={{width: 44, height: 44, borderRadius: 44, background: C.or, border: `4px solid ${C.nuit}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={24} height={24} viewBox="0 0 32 32"><path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.marine}}>{l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* panneau photo derrière les personnages : illustre chaque réplique */
const SLIDES: {at: number; src?: string; l?: string; tint?: string}[] = [
  {at: 0.9, src: 'img/s5-factures.jpg', l: 'Facture'},
  {at: 2.2, src: 'img/r10-logement.jpg', l: 'Compteur'},
  {at: 3.75, src: 'img/s5-papiers.jpg', l: 'Courrier'},
  {at: 5.65, src: 'img/duo-aeroport.jpg', l: 'L’avion ?'},
  {at: 6.4, src: 'img/s2-algerie-cote.jpg', l: 'Alger'},
  {at: 7.45, src: 'img/duo-aeroport.jpg', tint: 'rgba(196,81,43,0.55)'},
  {at: 8.69, src: 'img/t-conciergerie.jpg', l: 'Pack Conciergerie'},
  {at: 10.37, src: 'img/maqam.jpg', l: 'Sur place, en Algérie'},
  {at: 12.45, src: 'img/s2-classeurs.jpg'},
  {at: 15.05, src: 'img/s2-chez-vous.jpg', l: 'Chez vous'},
];
const PW = 900, PH = 540, PY = 700;
const Panneau: React.FC = () => {
  const f = useCurrentFrame();
  const inP = useSpring(s(0.85), 12, 140);
  const outP = ramp(f, 16.5, 16.8, easeIn);
  if (f < s(0.85)) return null;
  let cur = 0;
  SLIDES.forEach((sl, i) => { if (f >= s(sl.at)) cur = i; });
  return (
    <div style={{position: 'absolute', left: W / 2, top: PY, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${(1 - inP) * 70}deg) scale(${(0.7 + 0.3 * inP) * (1 - 0.3 * outP)})`, opacity: 1 - outP}}>
      <div style={{position: 'relative', width: PW, height: PH, borderRadius: 30, overflow: 'hidden', border: '8px solid #F2DDA2', boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(242,221,162,0.45)', background: C.nuit}}>
        {SLIDES.map((sl, i) => {
          if (i < cur - 1 || i > cur) return null;
          const p = i === cur ? prog(f, s(sl.at), 8, Easing.bezier(0.6, 0, 0.2, 1)) : 1;
          const k = interpolate(f, [s(sl.at), s(sl.at) + 60], [1.18, 1.04], clamp);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: i === cur ? `inset(0 0 0 ${(1 - p) * 100}%)` : undefined}}>
              <Img src={staticFile(sl.src!)} style={{width: PW, height: PH, objectFit: 'cover', transform: `scale(${k})`, filter: 'saturate(1.25) contrast(1.08)'}} />
              {sl.tint && <AbsoluteFill style={{background: sl.tint}} />}
              <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,40,0.55) 0%, rgba(10,20,40,0) 35%)'}} />
              {sl.l && (
                <div style={{position: 'absolute', left: 28, top: 24, padding: '10px 26px', borderRadius: 999, background: '#F2DDA2', border: `4px solid ${C.nuit}`, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.nuit, transform: `scale(${prog(f, s(sl.at) + 4, 8)})`, transformOrigin: 'left center'}}>{sl.l}</div>
              )}
              {sl.tint && (
                <div style={{position: 'absolute', left: PW / 2, top: PH / 2, transform: `translate(-50%,-50%) scale(${2 - prog(f, s(sl.at), 5)}) rotate(-12deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 260, color: '#FFFFFF', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>✕</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* texte du haut : bloc qui entre et sort */
const Bloc: React.FC<{at: number; out: number; y?: number; children: React.ReactNode}> = ({at, out, y = 150, children}) => {
  const f = useCurrentFrame();
  if (f < s(at) - 2 || f > s(out) + 8) return null;
  const o = 1 - ramp(f, out, out + 0.22, easeIn);
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', opacity: o, transform: `translateY(${-(1 - o) * 30}px)`}}>{children}</div>;
};

export const DuoConciergerie: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const breathe = (k: number) => Math.sin(f / 14 + k) * 3;
  /* — homme — */
  const hSpeak = MOUTH_H[f] > 0 || win(f, 0.5, 7.17) || win(f, 14.23, 14.89);
  const hx = interpolate(f, [t(7.1), t(7.6)], [540, 285], {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
  const hv = MOUTH_H[f] ?? 0;
  const flinch = [0.95, 2.2, 3.75].reduce((acc, a) => acc + (f >= s(a) ? Math.exp(-(f - s(a)) / 4) * Math.cos((f - s(a)) / 2.2) : 0), 0);
  const roll = ramp(f, 5.6, 6.3);
  const hPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(hv, f, hv > 0),
    blink: blinkAt(f, 'h', 92),
    brow: win(f, 0.6, 5.4) ? -1 : win(f, 6.3, 8.2) ? 1 : win(f, 14.1, 15.0) ? 1 : 0,
    lookX: win(f, 5.6, 6.3) ? Math.cos(roll * Math.PI * 2) : win(f, 7.2, 14.1) ? 1 : win(f, 15.0, 16.4) ? 0.8 : 0,
    lookY: win(f, 5.6, 6.3) ? Math.sin(roll * Math.PI * 2) * 0.9 - 0.2 : 0,
    armL: win(f, 6.3, 7.2) ? 135 * ramp(f, 6.3, 6.5) : win(f, 14.2, 14.95) ? 70 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : win(f, 0.6, 5.5) ? 18 + 22 * Math.abs(Math.sin(f / 6)) * (hv > 0.3 ? 1 : 0.3) : 0,
    armR: win(f, 6.3, 7.2) ? 135 * ramp(f, 6.3, 6.5) : win(f, 14.2, 14.95) ? 70 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : win(f, 0.6, 5.5) ? 18 + 22 * Math.abs(Math.cos(f / 6)) * (hv > 0.3 ? 1 : 0.3) : 0,
    tilt: win(f, 5.1, 5.6) ? -6 : win(f, 15.1, 16.4) ? 4 : Math.sin(f / 3) * 3 * hv,
    squash: flinch * 0.9,
    fx: win(f, 1.2, 5.5) ? 'sueur' : win(f, 14.23, 15.0) ? 'question' : win(f, 15.1, 16.4) ? 'coeurs' : win(f, 16.6, 18.5) ? 'etoiles' : undefined,
    fxT: win(f, 1.2, 5.5) ? ((f - s(1.2)) % 40) / 40 : win(f, 14.23, 15.0) ? ramp(f, 14.23, 14.6) : ((f % 60) / 60),
    bounce: (win(f, 16.45, 19.8) ? Math.abs(Math.sin((f - t(16.45)) / 5)) * 30 : 0) + breathe(0),
  };
  /* — femme — */
  const fIn = interpolate(f, [t(7.12), t(7.55)], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1)});
  const fx = interpolate(fIn, [0, 1], [1320, 785]);
  const jump = Math.sin(fIn * Math.PI) * 200;
  const fv = MOUTH_F[f] ?? 0;
  const land = f >= t(7.55) ? Math.exp(-(f - t(7.55)) / 4) * Math.cos((f - t(7.55)) / 2) : 0;
  const point = (a: number, b: number) => (win(f, a, b) ? 140 * ramp(f, a, a + 0.2) : 0);
  const fPose: ChibiPose = {
    sticker: true,
    mouth: mouthOf(fv, f, fv > 0),
    blink: blinkAt(f, 'f', 104),
    brow: win(f, 7.4, 8.4) ? 1 : 0,
    lookX: win(f, 7.4, 8.6) ? -0.9 : win(f, 8.6, 14.1) ? -0.3 : win(f, 14.1, 15.1) ? -1 : 0,
    lookY: win(f, 8.7, 13.9) ? -0.6 : 0,
    armR: win(f, 7.45, 8.5) ? 115 + 18 * Math.sin(f / 2.2) : Math.max(point(8.7, 10.2), point(12.45, 13.9)) || (win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0),
    armL: Math.max(point(10.37, 12.2), point(15.05, 16.3)) || (win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0),
    tilt: win(f, 15.05, 16.4) ? -5 : Math.sin(f / 3 + 1) * 3 * fv,
    squash: land * 1.2 - (fIn > 0 && fIn < 1 ? 0.6 : 0),
    fx: win(f, 7.45, 8.5) ? 'exclam' : win(f, 16.6, 18.5) ? 'etoiles' : undefined,
    fxT: win(f, 7.45, 8.5) ? ramp(f, 7.45, 7.75) : ((f + 30) % 60) / 60,
    bounce: jump + (win(f, 16.45, 19.8) ? Math.abs(Math.sin((f - t(16.45)) / 5 + 1)) * 30 : 0) + breathe(2),
  };
  const shake = win(f, 7.5, 7.75) ? Math.sin(f * 3) * 8 : 0;
  const titleHit = useSpring(t(7.5), 9, 200);
  const packHit = useSpring(t(9.45), 11, 170);
  const logoP = useSpring(t(10.37), 12, 150);
  const btn = useSpring(t(16.75), 12, 150);
  const fin = ramp(f, 18.45, 18.85, Easing.bezier(0.7, 0, 0.2, 1));
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo-bande-son.wav')} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 70% at 50% 40%, #2C64B0 0%, #1A3F78 38%, #10264A 70%, #0A1428 100%)'}} />
      {/* rayons d'or qui tournent lentement */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.16}}>
        <g transform={`translate(${W / 2} 560) rotate(${f * 0.25})`}>
          {Array.from({length: 18}).map((_, i) => <path key={i} d="M0 0 L-70 -1400 L70 -1400 Z" fill="#F2DDA2" transform={`rotate(${i * 20})`} />)}
        </g>
      </svg>
      <Panneau />
      {/* sol : estrade dorée */}
      <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: 'linear-gradient(180deg, #E9CF8E 0%, #C9A24B 30%, #8A6A2A 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: SOL - 6, width: W, height: 12, background: '#FFF4D2', boxShadow: '0 0 30px rgba(255,244,210,0.9)'}} />
      {/* textes du haut */}
      <Bloc at={0.5} out={5.45}>
        <div style={{...eyebrow}}>Vous vivez en Europe…</div>
        <div style={{...big, fontSize: 80, marginTop: 14}}>et tout se passe</div>
        <div style={{marginTop: -4}}><Accent at={t(1.2)} size={130} color="#F2DDA2" stroke="none">en Algérie.</Accent></div>
      </Bloc>
      <Bloc at={5.6} out={7.25}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(5.65)}>Je </Word><Word at={t(5.75)}>prends </Word><Word at={t(5.9)}>l’avion</Word>
        </div>
        <div><Accent at={t(6.4)} size={150} color="#F2DDA2" stroke="none">pour Alger ?</Accent></div>
      </Bloc>
      <Bloc at={7.45} out={8.6}>
        <div style={{...big, fontSize: 150, transform: `scale(${0.5 + 0.5 * titleHit}) rotate(${-4 * titleHit}deg)`, color: C.blanc}}>SURTOUT</div>
        <div style={{...big, fontSize: 150, transform: `scale(${0.5 + 0.5 * titleHit}) rotate(${-4 * titleHit}deg)`, color: '#FF7A4D'}}>PAS !</div>
      </Bloc>
      <Bloc at={8.69} out={10.25}>
        <div style={{...eyebrow}}><Word at={t(8.69)}>Avec le pack</Word></div>
        <div style={{transform: `scale(${f < t(9.45) ? 0 : 0.6 + 0.4 * packHit})`, marginTop: 6}}>
          <Accent at={t(9.45)} size={150} color="#F2DDA2" stroke="none">Conciergerie</Accent>
        </div>
      </Bloc>
      <Bloc at={10.37} out={12.35} y={90}>
        <div style={{display: 'flex', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * logoP})`, opacity: Math.min(1, logoP * 1.5)}}>
          <Img src={L_logo_clair} style={{width: 330}} />
        </div>
        <div style={{...big, fontSize: 60, marginTop: 10}}>
          <Word at={t(11.0)}>s’en </Word><Word at={t(11.15)}>occupe </Word><Word at={t(11.5)}>sur place.</Word>
        </div>
      </Bloc>
      <Rapport at={12.45} out={14.1} />
      <Bloc at={14.2} out={15.0}>
        <div style={{...big, fontSize: 140}}><Word at={t(14.23)}>Et </Word><Word at={t(14.45)}>moi ?</Word></div>
      </Bloc>
      <Bloc at={15.05} out={16.36}>
        <div style={{...big, fontSize: 96}}><Word at={t(15.09)}>Vous </Word><Word at={t(15.3)}>restez</Word></div>
        <div><Accent at={t(15.6)} size={150} color="#F2DDA2" stroke="none">chez vous.</Accent></div>
      </Bloc>
      <Bloc at={16.68} out={19.9} y={250}>
        <div style={{display: 'flex', justifyContent: 'center'}}><Img src={L_logo_clair} style={{width: 420}} /></div>
        <div style={{marginTop: 50, display: 'inline-block', transform: `scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '30px 56px', border: `5px solid ${C.nuit}`, boxShadow: `0 10px 0 ${C.nuit}`}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réservez votre appel découverte</span>
        </div>
        <div style={{marginTop: 30, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: '#F2DDA2', opacity: prog(f, t(17.0), 10)}}>moconseildz.com</div>
      </Bloc>
      <Avion at={5.85} />
      {/* personnages */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <Chibi kind="homme" x={hx} y={SOL} scale={1.0} pose={hPose} />
        {f >= t(7.1) && <Chibi kind="femme" x={fx} y={SOL} scale={1.0} pose={fPose} />}
      </svg>
      <Particles at={t(16.5)} dur={s(1.2)} cx={W / 2} cy={1000} mode="out" n={110} spread={620} seed="duo" />
      {/* carte de fin nuit et or */}
      {fin > 0 && (
        <AbsoluteFill style={{clipPath: `circle(${fin * 130}% at 50% 60%)`, background: 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)'}}>
          <div style={{position: 'absolute', left: W / 2, top: H * 0.27, transform: 'translate(-50%,-50%)'}}><Img src={L_logo_clair} style={{width: 640}} /></div>
          <div style={{position: 'absolute', top: H * 0.43, width: '100%', display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center'}}>
            <div style={{width: 70, height: 2, background: C.or}} /><div style={{...eyebrow, color: C.orClair}}>Pack Conciergerie</div><div style={{width: 70, height: 2, background: C.or}} />
          </div>
          <div style={{position: 'absolute', top: H * 0.55, left: '50%', transform: 'translate(-50%,-50%)', background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réserver un appel découverte →</span>
          </div>
          <div style={{position: 'absolute', top: H * 0.63, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.orClair, letterSpacing: 2}}>moconseildz.com</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
