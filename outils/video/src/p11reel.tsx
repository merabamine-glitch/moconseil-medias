// Présentation M&O — conseillère réelle (HeyGen, formule payante) en 3 plans de 1,8 à 2,5 s, animations entre les plans (04/11/2026).
// Même grammaire que la vidéo Pixar Succession : fenêtre dorée, carte, cartes photo, signature, compteur, frise, carte de fin nuit et or.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import {Accent, C, clamp, easeIn, Particles, prog, s, SANS, useSpring, Word, LogoBurst} from './kit';
import {MAP} from './map_med';
import {REEL_VOIX, RT} from './reel_data';

const W = 1080;
const H = 1920;
const OFF = 12; // images avant la voix (0,4 s)
export const P11_DUREE = Math.round((0.4 + REEL_VOIX + 1.3) * 10) / 10;
export const P11_FRAMES = s(P11_DUREE);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04, color: C.blanc};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 7, textTransform: 'uppercase', color: C.orClair};
const shadow = 'drop-shadow(0 6px 24px rgba(0,0,0,0.7))';
type Sc = React.FC<{a: number; b: number}>;
const tt = (x: number) => s(RT(x)) + OFF; // temps de la source HeyGen → image du montage
const rel = (a: number) => (x: number) => s(RT(x)) - s(RT(a));

const Fond: React.FC<{src: string; blur?: number; veil?: number; zoom?: [number, number]; dur: number; oy?: number}> = ({src, blur = 0, veil = 0.45, zoom = [1.12, 1.0], dur, oy = 50}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: `50% ${oy}%`, transform: `scale(${z})`, filter: `blur(${blur}px) saturate(1.25) contrast(1.05)`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(10,16,30,${veil + 0.25}) 0%, rgba(10,16,30,${veil * 0.4}) 40%, rgba(10,16,30,${veil * 0.6}) 70%, rgba(10,16,30,${veil + 0.2}) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 40% at 50% 55%, rgba(233,207,142,0.18) 0%, rgba(233,207,142,0) 70%)'}} />
    </AbsoluteFill>
  );
};

/* plan de la conseillère : fenêtre dorée ; la vidéo démarre au temps exact de la voix (lèvres synchrones) */
const Conseillere: React.FC<{t0: number; dur: number; y?: number; w?: number; tilt?: number; from?: 'bas' | 'gauche' | 'droite' | 'zoom'; face?: boolean; lead?: number}> = ({t0, dur, y = 1120, w = 860, tilt = -1.5, from = 'bas', face, lead = 0}) => {
  const f = useCurrentFrame();
  const p = useSpring(0, 13, 150);
  const h = Math.round((w * 1440) / 1080);
  const enter = 1 - p;
  const tx = from === 'gauche' ? -enter * 900 : from === 'droite' ? enter * 900 : 0;
  const ty = from === 'bas' ? enter * 700 : 0;
  const sc = from === 'zoom' ? 0.6 + 0.4 * p : 1;
  const z = interpolate(f, [0, dur], face ? [1.18, 1.28] : [1.0, 1.06], clamp);
  return (
    <div style={{position: 'absolute', left: W / 2, top: y, transform: `translate(-50%,-50%) translate(${tx}px, ${ty}px) rotate(${tilt * p}deg) scale(${sc})`}}>
      <div style={{position: 'relative', width: w, height: h, borderRadius: 34, overflow: 'hidden', border: `7px solid ${C.orClair}`, boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(233,207,142,0.45)'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: face ? '50% 30%' : '50% 40%'}}>
          <Img src={staticFile('img/reel-premiere-image.jpg')} style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover'}} />
          <Sequence from={lead} layout="none">
            <OffthreadVideo src={staticFile('video/reel-presentation.mp4')} startFrom={s(RT(t0))} muted style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover'}} />
          </Sequence>
        </div>
      </div>
    </div>
  );
};

const Titre: React.FC<{y?: number; children: React.ReactNode; out?: number}> = ({y = 230, children, out}) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - prog(f, out, 6, easeIn) : 1;
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', filter: shadow, opacity: o}}>{children}</div>;
};

const Tampon: React.FC<{at: number; x: number; y: number; txt: string; color?: string; rot?: number; size?: number}> = ({at, x, y, txt, color = C.or, rot = -10, size = 1}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= at + 5 ? 1 - 0.05 * Math.exp(-(f - at - 5) / 3) * Math.cos((f - at - 5) / 1.6) : 1;
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(2 - p) * settle * size}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{padding: '14px 30px', border: `7px solid ${color}`, borderRadius: 14, fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 5, color, background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{txt}</div>
    </div>
  );
};

/* ---------- plans ---------- */
// R1 — accroche : la conseillère (aucune animation ajoutée, règle du premier plan)
const R1: Sc = () => {
  const r = (x: number) => tt(x);
  return (
    <AbsoluteFill>
      <Fond src="img/europe.jpg" blur={7} veil={0.5} dur={s(2.5)} />
      <Titre y={150}>
        <div style={{...big, fontSize: 92}}><Word at={r(0.1)}>Vous vivez </Word></div>
        <div><Accent at={r(0.55)} size={140} color={C.orClair} stroke="none">à l’étranger ?</Accent></div>
      </Titre>
      <Conseillere t0={0.08} dur={s(2.5)} y={1200} w={820} from="zoom" lead={OFF} face />
    </AbsoluteFill>
  );
};
// R2 — carte : le projet est en Algérie
const R2: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const A = MAP.villes.alger, G = MAP.villes.geneve, Pa = MAP.villes.paris, B = MAP.villes.bruxelles;
  const z = interpolate(f, [0, s(1.6)], [0.8, 0.7], clamp);
  const cx = 1180, cy = 2000;
  const tx = W / 2 - cx * z, ty = H / 2 - cy * z + 120;
  const wipe = prog(f, 0, 7, Easing.bezier(0.6, 0, 0.2, 1));
  const lit = prog(f, r(3.52), 8);
  return (
    <AbsoluteFill style={{clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #22406B 0%, #142540 50%, #0A111E 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="g11"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g transform={`translate(${tx} ${ty}) scale(${z})`}>
          {MAP.land.map((d, i) => <path key={i} d={d} fill="#27426A" stroke="rgba(233,207,142,0.3)" strokeWidth={1.6 / z} />)}
          {MAP.europe.map((d, i) => <path key={'e' + i} d={d} fill="#34588A" stroke="rgba(233,207,142,0.7)" strokeWidth={2.2 / z} />)}
          <path d={MAP.algerie} fill={lit > 0 ? `rgba(201,162,75,${0.25 + 0.5 * lit})` : '#3A6297'} stroke={C.orClair} strokeWidth={(2.6 + 3 * lit) / z} filter={lit > 0 ? 'url(#g11)' : undefined} />
          {[Pa, G, B].map((P, i) => {
            const u = prog(f, 2 + i * 3, 16, Easing.bezier(0.4, 0, 0.2, 1));
            const mx = (A[0] + P[0]) / 2 + [-420, 330, 560][i], my = (A[1] + P[1]) / 2;
            return <path key={i} filter="url(#g11)" d={`M${A[0]} ${A[1]} Q${mx} ${my} ${P[0]} ${P[1]}`} fill="none" stroke="#F6E3AE" strokeWidth={8 / z} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />;
          })}
          {[A, Pa, G, B].map((P, i) => <circle key={i} cx={P[0]} cy={P[1]} r={(i === 0 ? 22 + 10 * lit : 16) / z + (4 * Math.sin(f / 4 + i)) / z} fill={C.orClair} />)}
        </g>
      </svg>
      <Titre y={170}>
        <div style={{...big, fontSize: 90}}><Word at={0}>Votre projet, </Word><Word at={r(2.95)}>lui,</Word></div>
        <div><Accent at={r(3.52)} size={150} color={C.orClair} stroke="none">est en Algérie.</Accent></div>
      </Titre>
    </AbsoluteFill>
  );
};
// R3 — quatre projets, quatre cartes photo synchronisées
const Carte: React.FC<{at: number; x: number; y: number; src: string; txt: string; rot: number}> = ({at, x, y, src, txt, rot}) => {
  const f = useCurrentFrame();
  const p = useSpring(at, 11, 160);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - p) * 70}deg) rotate(${rot * p}deg) scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 1.5)}}>
      <div style={{width: 440, height: 540, borderRadius: 26, overflow: 'hidden', border: `6px solid ${C.orClair}`, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', position: 'relative', background: C.nuit}}>
        <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: 440, height: 540, objectFit: 'cover', filter: 'saturate(1.25) contrast(1.05)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '70px 26px 26px', background: 'linear-gradient(180deg, rgba(14,23,38,0) 0%, rgba(14,23,38,0.92) 60%)'}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: C.blanc}}>{txt}</div>
        </div>
      </div>
    </div>
  );
};
const R3: Sc = ({a}) => {
  const r = rel(a);
  return (
    <AbsoluteFill>
      <Fond src="img/s2-algerie-pont.jpg" blur={10} veil={0.6} dur={s(4.4)} zoom={[1.0, 1.12]} />
      <Carte at={r(4.67)} x={300} y={700} src="img/t-creation.jpg" txt="Créer une société" rot={-4} />
      <Carte at={r(6.0)} x={780} y={760} src="img/t-immobilier.jpg" txt="Acheter un bien" rot={3} />
      <Carte at={r(6.9)} x={300} y={1300} src="img/t-succession.jpg" txt="Régler une succession" rot={3} />
      <Carte at={r(8.2)} x={780} y={1360} src="img/t-retour.jpg" txt="Préparer votre retour" rot={-3} />
    </AbsoluteFill>
  );
};
// R4 — sur place, chaque démarche demande du temps : pages du calendrier qui défilent
const R4: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const mois = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT'];
  const k = Math.min(mois.length - 1, Math.floor(Math.max(0, f - r(10.6)) / 5));
  const p = useSpring(0, 12, 150);
  return (
    <AbsoluteFill>
      <Fond src="img/s2-piles.jpg" blur={4} veil={0.55} dur={s(2.4)} />
      <Titre y={190}>
        <div style={eyebrow}><Word at={r(9.85)}>Sur place,</Word></div>
        <div style={{...big, fontSize: 84, marginTop: 14}}><Word at={r(10.6)}>chaque démarche</Word></div>
        <div><Accent at={r(11.3)} size={124} color={C.orClair} stroke="none">demande du temps.</Accent></div>
      </Titre>
      <div style={{position: 'absolute', left: W / 2, top: 1180, transform: `translate(-50%,-50%) scale(${p}) rotate(-3deg)`}}>
        <div style={{width: 520, height: 560, borderRadius: 28, background: '#FFFFFF', boxShadow: '0 40px 90px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
          <div style={{background: C.marine, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: 6, color: C.orClair}}>{mois[k]}</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, padding: 30}}>
            {Array.from({length: 28}).map((_, i) => {
              const on = f >= r(10.6) + i * 1.2;
              return <div key={i} style={{height: 46, borderRadius: 10, background: on ? (i % 9 === 4 ? '#C4512B' : '#E4DCCB') : '#F4EFE6'}} />;
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// R5 — la conseillère : quelqu'un de confiance
const R5: Sc = ({a}) => {
  const r = rel(a);
  return (
    <AbsoluteFill>
      <Fond src="img/poignee.jpg" blur={7} veil={0.5} dur={s(1.9)} zoom={[1.05, 1.15]} />
      <Titre y={170}>
        <div style={{...big, fontSize: 88}}><Word at={r(12.3)}>et surtout</Word></div>
        <div><Accent at={r(13.0)} size={122} color={C.orClair} stroke="none">quelqu’un de confiance.</Accent></div>
      </Titre>
      <Conseillere t0={12.13} dur={s(1.9)} y={1200} w={800} from="droite" tilt={1.5} />
    </AbsoluteFill>
  );
};
// R6 — signature : M et O Conseil, le trait d'union
const R6: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const line = prog(f, r(15.4), 18, Easing.bezier(0.45, 0, 0.2, 1));
  const logo = useSpring(r(14.51), 12, 150);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, #26406A 0%, #16243A 45%, #0A101C 100%)'}}>
      <Particles at={r(14.51)} dur={s(1.2)} cx={W / 2} cy={700} mode="out" n={60} spread={700} seed="r6" />
      <LogoBurst at={r(14.6)} x={W / 2} y={700} rx={420} ry={180} />
      <div style={{position: 'absolute', left: W / 2, top: 700, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * logo})`, opacity: logo}}>
        <Img src={L_logo_clair} style={{width: 640, display: 'block'}} />
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="gl6"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d="M150 1180 C 380 1080, 700 1280, 930 1180" fill="none" stroke="#F6E3AE" strokeWidth={10} strokeLinecap="round" filter="url(#gl6)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
        {[150, 930].map((x, i) => <circle key={i} cx={x} cy={1180} r={22 * prog(f, r(15.4) + i * 16, 6)} fill={C.orClair} />)}
      </svg>
      <div style={{position: 'absolute', left: 150, top: 1250, transform: 'translateX(-50%)', ...eyebrow, color: C.blanc, opacity: prog(f, r(15.4), 8)}}>Europe</div>
      <div style={{position: 'absolute', left: 930, top: 1250, transform: 'translateX(-50%)', ...eyebrow, color: C.blanc, opacity: prog(f, r(15.4) + 16, 8)}}>Algérie</div>
      <Titre y={1420}>
        <div style={{...big, fontSize: 84}}><Word at={r(15.5)}>c’est ce</Word></div>
        <div><Accent at={r(15.8)} size={150} color={C.orClair} stroke="none">trait d’union.</Accent></div>
      </Titre>
    </AbsoluteFill>
  );
};
// R7 — deux équipes : écran partagé Europe / Algérie
const R7: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const top = prog(f, 0, 10, Easing.bezier(0.6, 0, 0.2, 1));
  const bot = prog(f, r(18.05), 10, Easing.bezier(0.6, 0, 0.2, 1));
  const zt = interpolate(f, [0, s(2.4)], [1.12, 1.0], clamp);
  return (
    <AbsoluteFill style={{background: C.nuit}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H / 2, overflow: 'hidden', clipPath: `inset(0 ${(1 - top) * 100}% 0 0)`}}>
        <Img src={staticFile('img/s2-europe-paris.jpg')} style={{width: W, height: H / 2, objectFit: 'cover', transform: `scale(${zt})`, filter: 'saturate(1.25)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,30,0.55) 0%, rgba(10,16,30,0.05) 55%, rgba(10,16,30,0.6) 100%)'}} />
        <Titre y={150}><div style={eyebrow}>Une équipe</div><div><Accent at={r(17.4)} size={130} color={C.orClair} stroke="none">en Europe</Accent></div></Titre>
      </div>
      <div style={{position: 'absolute', left: 0, top: H / 2, width: W, height: H / 2, overflow: 'hidden', clipPath: `inset(0 0 0 ${(1 - bot) * 100}%)`}}>
        <Img src={staticFile('img/frontdemer.jpg')} style={{width: W, height: H / 2, objectFit: 'cover', transform: `scale(${1.12 - 0.1 * bot})`, filter: 'saturate(1.25)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,30,0.5) 0%, rgba(10,16,30,0.05) 45%, rgba(10,16,30,0.65) 100%)'}} />
        <Titre y={560}><div style={eyebrow}>Une équipe</div><div><Accent at={r(18.4)} size={130} color={C.orClair} stroke="none">en Algérie</Accent></div></Titre>
      </div>
      <div style={{position: 'absolute', left: 0, top: H / 2 - 5, height: 10, width: `${100 * top}%`, background: `linear-gradient(90deg, ${C.orFonce}, ${C.orClair})`, boxShadow: '0 0 30px rgba(233,207,142,0.8)'}} />
    </AbsoluteFill>
  );
};
// R8 — 10 packs qui convergent vers un seul interlocuteur
const PACKS = ['Création de Société', 'Nationalité', 'Suivi de Société', 'Logement & Installation', 'Scolarisation', 'Achat Immobilier', 'Succession', 'Compte Bancaire', 'Conciergerie', 'Retour Définitif'];
const R8: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const n = Math.round(interpolate(f, [r(19.33), r(19.33) + 14], [1, 10], clamp));
  const conv = prog(f, r(20.1), 16, Easing.bezier(0.5, 0, 0.2, 1));
  const one = useSpring(r(20.1) + 12, 10, 170);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #26406A 0%, #142540 50%, #0A111E 100%)'}}>
      {PACKS.map((p, i) => {
        const ang = (i / PACKS.length) * Math.PI * 2 + f / 60;
        const R0 = 360;
        const app = useSpring(r(19.33) + i * 1.4, 12, 170);
        const x = W / 2 + Math.cos(ang) * R0 * (1 - conv);
        const y = 980 + Math.sin(ang) * R0 * 1.25 * (1 - conv);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${app * (1 - 0.7 * conv)})`, opacity: 1 - conv * 0.9}}>
            <div style={{padding: '14px 24px', borderRadius: 999, background: '#FFFFFF', border: `4px solid ${C.or}`, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.marine, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>{p}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: W / 2, top: 980, transform: `translate(-50%,-50%) scale(${1 - conv})`, opacity: 1 - conv}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 300, color: C.orClair, lineHeight: 1, filter: shadow}}>{n}</div>
      </div>
      <div style={{position: 'absolute', left: W / 2, top: 980, transform: `translate(-50%,-50%) scale(${one})`}}>
        <div style={{width: 280, height: 280, borderRadius: 280, background: `linear-gradient(160deg, ${C.orClair}, ${C.or})`, border: '8px solid #FFFFFF', boxShadow: '0 0 80px rgba(233,207,142,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={150} height={150} viewBox="0 0 64 64"><circle cx={32} cy={22} r={12} fill={C.marine} /><path d="M10 58c2-14 12-20 22-20s20 6 22 20z" fill={C.marine} /></svg>
        </div>
      </div>
      <Titre y={190}>
        <div><Accent at={r(19.33)} size={150} color={C.orClair} stroke="none">10 packs,</Accent></div>
      </Titre>
      <Titre y={1420}>
        <div style={{...big, fontSize: 90}}><Word at={r(20.1)}>un seul </Word><Word at={r(20.4)}>interlocuteur</Word></div>
      </Titre>
    </AbsoluteFill>
  );
};
// R9 — un suivi à chaque étape : frise qui se coche
const R9: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const steps = ['Appel découverte', 'Dossier', 'Démarches', 'Comptes rendus', 'Résultat'];
  return (
    <AbsoluteFill>
      <Fond src="img/dossier.jpg" blur={6} veil={0.6} dur={s(1.8)} />
      <Titre y={190}>
        <div style={{...big, fontSize: 84}}><Word at={r(21.45)}>et un suivi</Word></div>
        <div><Accent at={r(21.9)} size={130} color={C.orClair} stroke="none">à chaque étape.</Accent></div>
      </Titre>
      <div style={{position: 'absolute', left: 250, top: 760, width: 8, height: 4 * 190, background: 'rgba(255,255,255,0.25)', borderRadius: 4}} />
      <div style={{position: 'absolute', left: 250, top: 760, width: 8, height: 4 * 190 * prog(f, r(21.6), 34), background: C.orClair, borderRadius: 4, boxShadow: '0 0 20px rgba(233,207,142,0.8)'}} />
      {steps.map((st, i) => {
        const at = r(21.6) + i * 8;
        const p = useSpring(at, 10, 180);
        return (
          <div key={i} style={{position: 'absolute', left: 254, top: 760 + i * 190, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center'}}>
            <div style={{width: 90, height: 90, borderRadius: 90, background: f >= at ? `linear-gradient(160deg, ${C.orClair}, ${C.or})` : '#2A3B57', border: '5px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * p})`, boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>
              {f >= at && <svg width={46} height={46} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={C.nuit} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <div style={{position: 'absolute', left: 120, whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.blanc, opacity: prog(f, at, 6), filter: shadow}}>{st}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// R10 — la conseillère : vous restez chez vous, nous gérons le reste
const R10: Sc = ({a}) => {
  const r = rel(a);
  return (
    <AbsoluteFill>
      <Fond src="img/residence.jpg" blur={6} veil={0.5} dur={s(2.0)} />
      <Titre y={160}>
        <div style={{...big, fontSize: 92}}><Word at={r(23.48)}>Vous restez </Word><Word at={r(23.9)}>chez vous.</Word></div>
        <div><Accent at={r(24.75)} size={130} color={C.orClair} stroke="none">Nous gérons le reste.</Accent></div>
      </Titre>
      <Conseillere t0={23.28} dur={s(2.0)} y={1210} w={800} from="bas" tilt={-1} face />
    </AbsoluteFill>
  );
};
// R11 — carte de fin nuit et or (sobre)
const R11: Sc = ({a}) => {
  const f = useCurrentFrame();
  const r = rel(a);
  const open = prog(f, 0, 12, Easing.bezier(0.7, 0, 0.2, 1));
  const reveal = prog(f, r(26.03), 18, Easing.bezier(0.6, 0, 0.2, 1));
  const btn = useSpring(r(27.34) + 6, 12, 150);
  const shine = interpolate(f, [r(28.3), r(29.1)], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 140}% at 50% 55%)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #26406A 0%, #16243A 40%, #0E1726 72%, #0A101C 100%)'}} />
      <Particles at={r(26.03)} dur={s(0.8)} cx={W / 2} cy={H * 0.26} mode="in" n={90} spread={800} seed="r11" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.27, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}><Img src={L_logo_clair} style={{width: 640, display: 'block'}} /></div>
      </div>
      <div style={{position: 'absolute', top: H * 0.42, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.blanc, opacity: prog(f, r(27.34), 10)}}>Le trait d’union avec votre Algérie</div>
      <div style={{position: 'absolute', top: H * 0.55, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', overflow: 'hidden', whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 40px rgba(233,207,142,0.45)'}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.nuit}}>Réservez votre appel découverte</span>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '22%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)'}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.63, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.orClair, letterSpacing: 2, opacity: prog(f, r(27.34) + 10, 10)}}>moconseildz.com</div>
    </AbsoluteFill>
  );
};

// [début, fin] en temps de la source HeyGen ; la dernière scène tient jusqu'à la fin
const PLAN: [number, number, Sc][] = [
  [0, 2.95, R1], [2.93, 4.62, R2], [4.6, 9.6, R3], [9.58, 12.15, R4], [12.13, 14.35, R5], [14.33, 16.75, R6],
  [16.73, 19.15, R7], [19.13, 21.42, R8], [21.4, 23.3, R9], [23.28, 25.85, R10], [25.83, 99, R11],
];
export const Pack11Reel: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    <Audio src={staticFile('audio/p11-bande-son.wav')} />
    {PLAN.map(([a, b, Comp], i) => {
      const from = i === 0 ? 0 : tt(a);
      const to = i === PLAN.length - 1 ? P11_FRAMES : tt(b);
      return (
        <Sequence key={i} from={from} durationInFrames={to - from}>
          <Comp a={a} b={b} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
