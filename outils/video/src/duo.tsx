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
const SOL = 1610;
const OR_TEXTE = '#9C7726';
export const DUO_FRAMES = s(DUO_DUREE);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: C.marine};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 7, textTransform: 'uppercase', color: OR_TEXTE};

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
    <div style={{position: 'absolute', left: W / 2, top: 560, transform: `translate(-50%,-50%) translateY(${(1 - p) * 300}px) rotate(${-2 + (1 - p) * 8}deg)`, opacity: Math.min(1, p * 2) * o}}>
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
/* texte du haut : bloc qui entre et sort */
const Bloc: React.FC<{at: number; out: number; y?: number; children: React.ReactNode}> = ({at, out, y = 300, children}) => {
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
  const hPose: ChibiPose = {
    mouth: mouthOf(MOUTH_H[f] ?? 0, f, hSpeak && (MOUTH_H[f] ?? 0) > 0),
    blink: blinkAt(f, 'h', 92),
    brow: win(f, 0.6, 5.4) ? -1 : win(f, 6.3, 8.2) ? 1 : win(f, 14.1, 15.0) ? 1 : 0,
    lookX: win(f, 7.2, 14.1) ? 1 : win(f, 14.1, 15.0) ? 0 : win(f, 15.0, 16.4) ? 0.8 : 0,
    lookY: win(f, 5.2, 5.6) ? -1 : 0,
    armL: win(f, 6.3, 7.2) ? 135 * ramp(f, 6.3, 6.5) : win(f, 14.2, 14.95) ? 70 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0,
    armR: win(f, 6.3, 7.2) ? 135 * ramp(f, 6.3, 6.5) : win(f, 14.2, 14.95) ? 70 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0,
    tilt: win(f, 5.1, 5.6) ? -6 : win(f, 15.1, 16.4) ? 4 : 0,
    bounce: (win(f, 16.45, 19.8) ? Math.abs(Math.sin((f - t(16.45)) / 5)) * 26 : 0) + breathe(0),
  };
  if (win(f, 5.1, 5.6)) hPose.blink = 1; // soupir
  if (win(f, 15.1, 16.3)) {
    hPose.blink = 1; hPose.mouth = 'sourire';
  }
  /* — femme — */
  const fIn = interpolate(f, [t(7.12), t(7.55)], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1)});
  const fx = interpolate(fIn, [0, 1], [1320, 785]);
  const jump = Math.sin(fIn * Math.PI) * 200;
  const fv = MOUTH_F[f] ?? 0;
  const fPose: ChibiPose = {
    mouth: mouthOf(fv, f, fv > 0),
    blink: blinkAt(f, 'f', 104),
    brow: win(f, 7.4, 8.4) ? 1 : 0,
    lookX: win(f, 7.4, 14.1) ? -0.9 : win(f, 14.1, 15.1) ? -1 : 0,
    armR: win(f, 7.45, 8.5) ? 120 : win(f, 10.3, 11.9) ? 95 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0,
    armL: win(f, 7.45, 8.5) ? 0 : win(f, 15.05, 16.4) ? 60 : win(f, 16.45, 19.8) ? 130 * ramp(f, 16.45, 16.7) : 0,
    tilt: win(f, 15.05, 16.4) ? -5 : 0,
    bounce: jump + (win(f, 16.45, 19.8) ? Math.abs(Math.sin((f - t(16.45)) / 5 + 1)) * 26 : 0) + breathe(2),
  };
  const shake = win(f, 7.5, 7.75) ? Math.sin(f * 3) * 8 : 0;
  const titleHit = useSpring(t(7.5), 9, 200);
  const packHit = useSpring(t(9.45), 11, 170);
  const logoP = useSpring(t(10.37), 12, 150);
  const btn = useSpring(t(16.75), 12, 150);
  const fin = ramp(f, 18.45, 18.85, Easing.bezier(0.7, 0, 0.2, 1));
  return (
    <AbsoluteFill style={{background: C.pierre, transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo-bande-son.wav')} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 45% at 50% 38%, #FFFFFF 0%, rgba(255,255,255,0) 70%)'}} />
      {/* motif discret : losanges or */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.07}}>
        {Array.from({length: 9}).map((_, i) => Array.from({length: 12}).map((__, j) => (
          <rect key={i + '-' + j} x={60 + i * 120 + (j % 2) * 60} y={60 + j * 120} width={14} height={14} fill={C.or} transform={`rotate(45 ${67 + i * 120 + (j % 2) * 60} ${67 + j * 120})`} />
        )))}
      </svg>
      {/* sol */}
      <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: C.sable}} />
      <div style={{position: 'absolute', left: 0, top: SOL - 4, width: W, height: 8, background: C.or}} />
      {/* textes du haut */}
      <Bloc at={0.5} out={5.45}>
        <div style={{...eyebrow}}>Vous vivez en Europe…</div>
        <div style={{...big, fontSize: 80, marginTop: 14}}>et tout se passe</div>
        <div style={{marginTop: -4}}><Accent at={t(1.2)} size={130} color={OR_TEXTE} stroke="none">en Algérie.</Accent></div>
      </Bloc>
      <Bloc at={5.6} out={7.25}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(5.65)}>Je </Word><Word at={t(5.75)}>prends </Word><Word at={t(5.9)}>l’avion</Word>
        </div>
        <div><Accent at={t(6.4)} size={150} color={OR_TEXTE} stroke="none">pour Alger ?</Accent></div>
      </Bloc>
      <Bloc at={7.45} out={8.6}>
        <div style={{...big, fontSize: 150, transform: `scale(${0.5 + 0.5 * titleHit}) rotate(${-4 * titleHit}deg)`, color: C.marine}}>SURTOUT</div>
        <div style={{...big, fontSize: 150, transform: `scale(${0.5 + 0.5 * titleHit}) rotate(${-4 * titleHit}deg)`, color: OR_TEXTE}}>PAS !</div>
      </Bloc>
      <Bloc at={8.69} out={10.25}>
        <div style={{...eyebrow}}><Word at={t(8.69)}>Avec le pack</Word></div>
        <div style={{transform: `scale(${f < t(9.45) ? 0 : 0.6 + 0.4 * packHit})`, marginTop: 6}}>
          <Accent at={t(9.45)} size={150} color={C.marine} stroke="none">Conciergerie</Accent>
        </div>
      </Bloc>
      <Bloc at={10.37} out={12.35}>
        <div style={{display: 'flex', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * logoP})`, opacity: Math.min(1, logoP * 1.5)}}>
          <Img src={L_logo_couleur} style={{width: 520}} />
        </div>
        <div style={{...big, fontSize: 70, marginTop: 24}}>
          <Word at={t(11.0)}>s’en </Word><Word at={t(11.15)}>occupe </Word><Word at={t(11.5)}>sur place.</Word>
        </div>
      </Bloc>
      <Rapport at={12.45} out={14.1} />
      <Bloc at={14.2} out={15.0}>
        <div style={{...big, fontSize: 140}}><Word at={t(14.23)}>Et </Word><Word at={t(14.45)}>moi ?</Word></div>
      </Bloc>
      <Bloc at={15.05} out={16.36}>
        <div style={{...big, fontSize: 96}}><Word at={t(15.09)}>Vous </Word><Word at={t(15.3)}>restez</Word></div>
        <div><Accent at={t(15.6)} size={150} color={OR_TEXTE} stroke="none">chez vous.</Accent></div>
      </Bloc>
      <Bloc at={16.68} out={19.9} y={250}>
        <div style={{display: 'flex', justifyContent: 'center'}}><Img src={L_logo_couleur} style={{width: 420}} /></div>
        <div style={{marginTop: 50, display: 'inline-block', transform: `scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '30px 56px', border: `5px solid ${C.nuit}`, boxShadow: `0 10px 0 ${C.nuit}`}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réservez votre appel découverte</span>
        </div>
        <div style={{marginTop: 30, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.marine, opacity: prog(f, t(17.0), 10)}}>moconseildz.com</div>
      </Bloc>
      {/* cartes autour de l'homme */}
      <Carte k="facture" l="Facture" at={0.95} x={180} y={1000} r={-5} out={7.0} />
      <Carte k="compteur" l="Compteur" at={2.2} x={895} y={930} r={4} out={7.0} />
      <Carte k="courrier" l="Courrier" at={3.75} x={185} y={1290} r={3} out={7.0} />
      <Avion at={5.85} />
      {/* personnages */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <Chibi kind="homme" x={hx} y={SOL} scale={1.06} pose={hPose} />
        {f >= t(7.1) && <Chibi kind="femme" x={fx} y={SOL} scale={1.06} pose={fPose} />}
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
