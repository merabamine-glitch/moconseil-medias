// Série « Un pack en 30 secondes » — vidéo 2 : Pack Suivi de Société, v2 (refonte du 26/10/2026, porte qualité).
// Voix « Femme » ElevenLabs, prise 1 (27,48 s). Temps en secondes absolues de la voix (voix/align_p02.json).
// Storyboard : STORYBOARD_P02_V2.md. Photos réelles en haute définition uniquement, charte stricte.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, Particles, prog, s, SANS, SERIF, Spark, useSpring, Word} from './kit';
import {Mask, Photo, Pin} from './scenes4';

const W = 1080;
const H = 1920;
const HALF = 960;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};
const shadowW = 'drop-shadow(0 4px 18px rgba(0,0,0,0.55))';

type Sc = React.FC<{st: number; dur: number}>;
const useT = (st: number) => (x: number) => s(x - st);

const GoldLine: React.FC<{y: number; w?: number; glow?: number}> = ({y, w = W, glow = 1}) => (
  <div
    style={{
      position: 'absolute', left: (W - w) / 2, top: y - 3, height: 6, width: w, borderRadius: 6,
      background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 50%, ${C.orFonce})`,
      boxShadow: `0 0 ${24 * glow}px rgba(233,207,142,0.9), 0 0 ${64 * glow}px rgba(201,162,75,0.6)`,
    }}
  />
);

const Label: React.FC<{text: string; y: number; op: number; dark?: boolean}> = ({text, y, op, dark}) => (
  <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center', opacity: op}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px 8px 16px', borderRadius: 999, background: dark ? 'rgba(244,239,230,0.9)' : 'rgba(14,23,38,0.62)'}}>
      <Pin size={36} color={dark ? C.or : C.orClair} />
      <div style={{...eyebrow, fontSize: 26, color: dark ? C.marine : C.blanc}}>{text}</div>
    </div>
  </div>
);

/** Plaque de laiton « Siège social · Alger » : arrive vers la caméra, se pose, reflet (objet du plan 1, v3 du 26/10). */
const Plaque: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at - 10, at], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.85, 0.55)});
  if (f < at - 10) return null;
  const settle = f >= at ? 1 - 0.045 * Math.exp(-(f - at) / 3.2) * Math.cos((f - at) / 1.5) : 1;
  const sc = (2.1 - 1.1 * p) * settle;
  const rx = 58 * (1 - p);
  const shine = interpolate(f, [at + 14, at + 34], [-40, 150], clamp);
  const screw = (l: number, t: number) => (
    <div style={{position: 'absolute', left: l, top: t, width: 20, height: 20, borderRadius: 20, background: 'radial-gradient(circle at 35% 30%, #F6E3AE 0%, #C9A24B 45%, #7E5E1A 100%)', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.45), 0 1px 1px rgba(255,240,200,0.6)'}}>
      <div style={{position: 'absolute', left: 4, top: 9, width: 12, height: 2, background: 'rgba(90,64,14,0.85)', transform: 'rotate(-35deg)'}} />
    </div>
  );
  const engr: React.CSSProperties = {color: '#5E4511', textShadow: '0 1.5px 0 rgba(255,244,210,0.75), 0 -1px 0 rgba(60,40,5,0.4)'};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', perspective: 1200}}>
      {/* ombre portée */}
      <div style={{position: 'absolute', left: 30, right: 30, top: 200, height: 90, borderRadius: 90, background: 'rgba(14,23,38,0.55)', filter: `blur(${18 + 30 * (1 - p)}px)`, opacity: 0.8 * p, transform: `scale(${sc})`}} />
      <div
        style={{
          position: 'relative', width: 600, height: 250, borderRadius: 10, overflow: 'hidden',
          transform: `scale(${sc}) rotateX(${rx}deg)`, opacity: Math.min(1, p * 2), filter: `blur(${(1 - p) * 9}px)`,
          background: 'linear-gradient(135deg, #8E6B22 0%, #C9A24B 16%, #F2DDA2 33%, #C9A24B 50%, #A8822F 66%, #E9CF8E 84%, #9C7726 100%)',
          boxShadow: 'inset 0 2px 0 rgba(255,246,220,0.7), inset 0 -3px 0 rgba(60,40,5,0.35), 0 34px 70px rgba(0,0,0,0.55)',
        }}
      >
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0) 3px)'}} />
        <div style={{position: 'absolute', inset: 16, border: '2px solid rgba(110,82,20,0.55)', borderRadius: 4, boxShadow: '0 1px 0 rgba(255,244,210,0.5)'}} />
        {screw(26, 26)}{screw(554, 26)}{screw(26, 204)}{screw(554, 204)}
        <div style={{position: 'absolute', top: 46, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 10, ...engr}}>SIÈGE SOCIAL</div>
        <div style={{position: 'absolute', top: 92, left: 200, width: 200, height: 2, background: 'rgba(94,69,17,0.6)', boxShadow: '0 1px 0 rgba(255,244,210,0.6)'}} />
        <div style={{position: 'absolute', top: 96, width: '100%', textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 104, lineHeight: 1.05, ...engr}}>Alger</div>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '24%', background: 'linear-gradient(100deg, rgba(255,250,235,0) 0%, rgba(255,250,235,0.65) 50%, rgba(255,250,235,0) 100%)', mixBlendMode: 'screen'}} />
      </div>
    </div>
  );
};

/* ===================================================== 1 + 2. Accroche : Alger (vidéo d'Amine) et la plaque du siège social, puis la tour Eiffel */
const B1: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  // action dès la première image : recul rapide et léger basculement
  const pull = interpolate(f, [0, 22], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const z = 1.45 - 0.39 * pull + interpolate(f, [22, t(2.15)], [0, 0.03], clamp);
  const rot = -3 * (1 - pull);
  // coupe à « et vous »
  const sp = interpolate(f, [t(2.12), t(2.12) + 11], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1)});
  const line = prog(f, t(2.12) + 6, 10, inOut);
  const lab = prog(f, t(2.6), 10);
  const txt1 = 1 - prog(f, t(2.05), 7, easeIn);
  // sortie : zoom traversant dans le trait d'or
  const out = interpolate(f, [t(3.52), t(3.78)], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{background: C.nuit, overflow: 'hidden', transform: `scale(${1 + out * 2.2})`, transformOrigin: `50% ${HALF}px`, filter: `blur(${out * 14}px)`}}>
      {/* Algérie : vidéo d'Amine (Djamaâ El Djazaïr, Alger), 4K ramenée à 1566 × 2784 et ralentie à 0,85 : recul sans agrandissement */}
      {f < s(2.55) && (
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${z}) rotate(${rot}deg)`}}>
            <OffthreadVideo src={staticFile('video/s2-alger-djamaa.mp4')} muted style={{width: W, height: H, objectFit: 'cover'}} />
          </div>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.5) 0%, rgba(14,23,38,0.22) 30%, rgba(14,23,38,0) 46%)'}} />
          <div style={{opacity: txt1}}>
            <Plaque at={t(0.62)} x={W / 2 + 40} y={1390} />
          </div>
        </AbsoluteFill>
      )}
      {/* Europe : la tour Eiffel entière (pointe visible) tombe en plein cadre — v2b, demande d'Amine du 26/10 */}
      {sp > 0 && (
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', transform: `translateY(${-(1 - sp) * H}px)`, filter: `blur(${(1 - sp) * 18}px)`}}>
          <AbsoluteFill style={{background: C.pierre}} />
          <div style={{position: 'absolute', inset: 0, WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 380px, rgba(0,0,0,1) 650px)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 380px, rgba(0,0,0,1) 650px)'}}>
            <Photo src={P.P_s2_europe_paris} w={1600} h={2400} ox={0.5} oy={0} dy={420} zoom={1.0 + 0.05 * prog(f, t(2.12), s(1.6))} />
          </div>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.45) 0%, rgba(14,23,38,0) 30%)'}} />
        </div>
      )}
      {/* texte 1 */}
      <div style={{position: 'absolute', top: 236, right: 64, textAlign: 'right', color: C.blanc, opacity: txt1, filter: shadowW}}>
        <div style={{...big, fontSize: 100}}>
          <Word at={t(0.11)}>Votre </Word>
          <Word at={t(0.5)}>société</Word>
        </div>
        <div style={{...big, fontSize: 100, marginTop: 4}}>
          <Word at={t(1.13)}>est en</Word>
        </div>
        <div style={{marginTop: 2, marginRight: -6}}>
          <Accent at={t(1.42)} size={176} color={C.orClair} stroke="none">
            Algérie…
          </Accent>
        </div>
      </div>
      {/* texte 2 */}
      <div style={{position: 'absolute', top: 228, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(2.15)}>et </Word>
          <Word at={t(2.31)}>vous </Word>
          <Word at={t(2.41)}>vivez</Word>
        </div>
        <div style={{marginTop: 6}}>
          <Accent at={t(2.67)} size={150} color={OR_TEXTE} stroke="none">
            en Europe ?
          </Accent>
        </div>
      </div>
      {line > 0 && <GoldLine y={HALF} w={W * line} />}
      {(() => {
        const c = interpolate(f, [t(2.55), t(3.45)], [-0.1, 1.1], clamp);
        return c > -0.1 && c < 1.1 ? <div style={{position: 'absolute', left: c * W - 90, top: HALF - 9, width: 180, height: 18, borderRadius: 18, background: 'radial-gradient(ellipse at center, rgba(255,246,220,1) 0%, rgba(246,227,174,0.8) 35%, rgba(201,162,75,0) 75%)', filter: 'blur(1px)'}} /> : null;
      })()}
      <Spark at={t(2.2)} x={W / 2} y={HALF} scale={0.8} out={t(2.8)} />
      <Label text="Europe" y={HALF - 92} op={lab} />
      <Label text="Algérie" y={HALF + 44} op={lab} />
    </AbsoluteFill>
  );
};

/* ===================================================== 3. Le problème : chaque mois, des déclarations nommées */
const CHIPS = [
  {code: 'G50', l: 'TVA et IRG', at: 4.61},
  {code: 'G29', l: 'Salaires', at: 4.97},
  {code: 'CNAS', l: 'Salariés', at: 5.3},
  {code: 'CASNOS', l: 'Gérant', at: 5.62},
];
const B3: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const open = interpolate(f, [0, 9], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.3, 1)});
  const z = interpolate(f, [0, dur], [1.12, 1.03], {...clamp, easing: ease});
  const push = interpolate(f, [t(5.93), t(6.2)], [0, 1], {...clamp, easing: inOut});
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0)`, transform: `translateX(${-push * W}px)`, background: C.pierre}}>
      <Photo src={P.P_s2_piles} w={1600} h={2400} zoom={z} ox={0.35} oy={0.5} filter="saturate(0.78) contrast(1.03)" />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.95) 0%, rgba(244,239,230,0.88) 27%, rgba(244,239,230,0) 46%)'}} />
      <div style={{position: 'absolute', top: 175, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 34}}>
          <Word at={t(3.76)}>Chaque mois</Word>
        </div>
        <div style={{...big, fontSize: 96, marginTop: 18}}>
          <Word at={t(4.52)}>des </Word>
          <Word at={t(4.61)}>déclarations</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(5.39)} size={160} color={OR_TEXTE} stroke="none">
            à déposer…
          </Accent>
        </div>
      </div>
      {/* feuilles qui tombent une à une et s'empilent (objets en mouvement, v3) */}
      {CHIPS.map((c, i) => {
        const land = t(c.at) + 2;
        const p = interpolate(f, [land - 11, land], [0, 1], {...clamp, easing: Easing.bezier(0.55, 0, 0.9, 0.45)});
        if (f < land - 11) return null;
        const settle = f >= land ? 0.035 * Math.exp(-(f - land) / 2.6) * Math.cos((f - land) / 1.3) : 0;
        const yEnd = 1040 + i * 124;
        const xEnd = W / 2 + [-34, 30, -18, 40][i];
        const rEnd = [-4.5, 3.2, -2.2, 5][i];
        const side = i % 2 ? 1 : -1; // lancées depuis les côtés : jamais sur le titre
        const x = xEnd + side * (1 - p) * 1150;
        const y = yEnd - Math.sin(Math.PI * (1 - p) * 0.5) * 220 * (1 - p);
        const r = rEnd + (1 - p) * [-34, 30, -26, 36][i];
        const sc = (1.18 - 0.18 * p) * (1 - settle);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${sc})`}}>
            <div
              style={{
                position: 'relative', width: 660, height: 156, borderRadius: 6, overflow: 'hidden',
                background: 'linear-gradient(180deg, #FCFAF5 0%, #F4EFE6 100%)',
                boxShadow: `0 ${8 + 22 * (1 - p)}px ${18 + 40 * (1 - p)}px rgba(14,23,38,${0.32 + 0.1 * p}), inset 0 0 0 1px rgba(27,42,65,0.06)`,
              }}
            >
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: C.or}} />
              <div style={{position: 'absolute', right: 0, top: 0, width: 34, height: 34, background: 'linear-gradient(225deg, rgba(14,23,38,0) 50%, #E3D9C6 50%)', boxShadow: '-2px 2px 4px rgba(14,23,38,0.12)'}} />
              <div style={{position: 'absolute', left: 42, right: 120, top: 120, height: 3, borderRadius: 3, background: 'rgba(27,42,65,0.10)'}} />
              <div style={{position: 'absolute', left: 42, right: 260, top: 132, height: 3, borderRadius: 3, background: 'rgba(27,42,65,0.08)'}} />
              <div style={{position: 'absolute', left: 42, top: 26, display: 'flex', alignItems: 'baseline', gap: 24, whiteSpace: 'nowrap'}}>
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, color: OR_TEXTE, letterSpacing: 1}}>{c.code}</span>
                <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.marine, letterSpacing: -0.5}}>{c.l}</span>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ===================================================== 4. … et personne sur place pour tenir les délais */
const B4: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 9], [1, 0], {...clamp, easing: inOut});
  const z = interpolate(f, [0, dur], [1.04, 1.13], clamp);
  const chip = useSpring(t(7.75), 13, 160);
  const chipOp = prog(f, t(7.75), 8);
  const line = prog(f, t(8.32), 9, Easing.bezier(0.6, 0, 0.2, 1));
  const toNight = prog(f, t(8.5), 5);
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.nuit}}>
      <AbsoluteFill style={{opacity: 1 - toNight}}>
        <Photo src={P.P_s2_bureau_vide} w={1600} h={2133} zoom={z} ox={0.55} oy={0.55} filter="grayscale(1) contrast(1.05)" />
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.82) 0%, rgba(14,23,38,0.55) 38%, rgba(14,23,38,0.25) 60%, rgba(14,23,38,0.6) 100%)'}} />
        <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(6.1)}>et </Word>
            <Word at={t(6.26)}>personne</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Accent at={t(6.67)} size={176} color={C.orClair} stroke="none">
              sur place
            </Accent>
          </div>
          <div style={{...big, fontSize: 70, marginTop: 22, letterSpacing: -2}}>
            <Word at={t(7.29)}>pour </Word>
            <Word at={t(7.31)}>tenir </Word>
            <Word at={t(7.71)}>les </Word>
            <Word at={t(7.8)}>délais.</Word>
          </div>
        </div>
        {/* l'échéance, nommée */}
        <div style={{position: 'absolute', top: 1270, left: '50%', transform: `translateX(-50%) scale(${0.85 + 0.15 * chip})`, opacity: chipOp}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(244,239,230,0.97)', borderLeft: `8px solid ${C.or}`, padding: '26px 50px 26px 34px', borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>
            <svg width={70} height={74} viewBox="0 0 70 74">
              <rect x={4} y={10} width={62} height={60} rx={8} fill="none" stroke={C.or} strokeWidth={5} />
              <line x1={4} y1={28} x2={66} y2={28} stroke={C.or} strokeWidth={5} />
              <line x1={20} y1={3} x2={20} y2={17} stroke={C.or} strokeWidth={5} strokeLinecap="round" />
              <line x1={50} y1={3} x2={50} y2={17} stroke={C.or} strokeWidth={5} strokeLinecap="round" />
              <circle cx={22} cy={45} r={4} fill={C.or} /><circle cx={35} cy={45} r={4} fill={C.or} /><circle cx={48} cy={45} r={4} fill={C.or} />
              <circle cx={22} cy={58} r={4} fill={C.or} /><circle cx={35} cy={58} r={4} fill={C.marine} />
            </svg>
            <div>
              <div style={{...eyebrow, fontSize: 24, color: OR_TEXTE, letterSpacing: 5}}>Chaque mois</div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, color: C.marine, letterSpacing: -1, lineHeight: 1.1}}>une date limite</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {line > 0 && <GoldLine y={HALF - 3} w={W * line} />}
    </AbsoluteFill>
  );
};

/* ===================================================== 5. Plan signature : Tenir ces délais, c'est exactement ce que fait M et O Conseil */
const B5: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const photoIn = prog(f, 1, 12, ease);
  const reveal = prog(f, t(11.2), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const lab = prog(f, t(11.6), 12);
  const sub = prog(f, t(11.85), 14);
  const out = interpolate(f, [t(12.42), t(12.68)], [0, 1], {...clamp, easing: easeIn});
  const glow = 0.7 + 0.3 * Math.sin(f / 5);
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `scale(${1 + out * 0.5})`, filter: `blur(${out * 20}px)`, opacity: 1 - out}}>
      <AbsoluteFill style={{opacity: photoIn}}>
        <Photo src={P.P_mains} w={1333} h={2000} zoom={1.2 - 0.12 * k} rot={-2 + 2 * k} oy={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(14,23,38,0.62)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 45% at 50% 50%, rgba(14,23,38,0) 0%, rgba(14,23,38,0.45) 100%)'}} />
      <GoldLine y={HALF - 3} glow={glow} />
      <Spark at={t(11.2)} x={W / 2} y={HALF} scale={0.9} out={t(11.8)} />
      <Particles at={t(11.2)} dur={s(0.7)} cx={W / 2} cy={HALF} mode="out" n={90} spread={420} seed="q1" boxW={500} boxH={20} />
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <Mask at={0} out={t(9.72)} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(8.67)}>Tenir </Word>
            <Word at={t(8.98)}>ces</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={t(9.16)} size={176} color={C.orClair} stroke="none">
              délais,
            </Accent>
          </div>
        </Mask>
      </div>
      <div style={{position: 'absolute', top: 620, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
        <div style={{...big, fontSize: 78}}>
          <Word at={t(9.82)}>c’est </Word>
          <Word at={t(10.32)}>exactement</Word>
        </div>
        <div style={{...big, fontSize: 78, marginTop: 4}}>
          <Word at={t(10.67)}>ce </Word>
          <Word at={t(10.81)}>que </Word>
          <Word at={t(10.98)}>fait</Word>
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

/* ===================================================== 6. Le pack : notre expert-comptable dépose vos déclarations */
const WIN = {x: 70, y: 400, w: 940, h: 640};
const SHOTS = [
  {at: 12.7, src: P.P_s2_signature, w: 1600, h: 2397, ox: 0.45, oy: 0.42},
  {at: 16.3, src: P.P_s2_classeur, w: 2000, h: 1333, ox: 0.5, oy: 0.5},
];
const CHECKS = [
  {l: 'Comptabilité tenue', at: 15.03},
  {l: 'G50 et G29 déposées', at: 15.89},
  {l: 'CNAS et CASNOS à jour', at: 16.36},
  {l: 'Bilan annuel déposé', at: 16.85},
];
const B6: Sc = ({st, dur}) => {
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
  const push = interpolate(f, [t(19.18), t(19.48)], [0, 1], {...clamp, easing: inOut});
  const veil = prog(f, t(17.45), 10);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`, transform: `translateX(${-push * W}px)`}}>
      <AbsoluteFill style={{background: C.pierre}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)'}} />
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center'}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(12.67)}>Avec le pack</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(13.3)} size={110} color={C.marine} stroke="none">
            Suivi de Société
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', boxShadow: `0 40px 80px rgba(27,42,65,${0.28 * shrink})`}}>
        {SHOTS.map((sh, i) => {
          const a = t(sh.at - 0.14);
          const wp = i === 0 ? 1 : interpolate(f, [a, a + 12], [0, 1], {...clamp, easing: inOut});
          if (wp <= 0) return null;
          const z = i === 0 ? interpolate(f, [0, t(16.3)], [1.14, 1.0], clamp) : interpolate(f, [a, a + 12, a + 70], [1.16, 1.06, 1.0], {...clamp, easing: ease});
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
            <Word at={t(17.49)}>Sans </Word>
            <Word at={t(17.87)}>vous</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={t(18.5)} size={150} color={C.orClair} stroke="none">
              déplacer.
            </Accent>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 110, top: 1110}}>
        {CHECKS.map((c, i) => {
          const p = prog(f, t(c.at), 12);
          const tick = prog(f, t(c.at) + 4, 10);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: i * 118, display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateX(${(1 - p) * 50}px)`, whiteSpace: 'nowrap'}}>
              <div style={{width: 64, height: 64, borderRadius: 64, background: tick > 0 ? C.or : C.pierre, border: `4px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * tick})`, flexShrink: 0}}>
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                </svg>
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: C.marine, letterSpacing: -1}}>{c.l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 7. Chaque mois, ce que vous obtenez : une société à jour */
const MOIS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const Seal: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const hit = at + 5;
  const p = interpolate(f, [at, hit], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= hit ? 1 - 0.035 * Math.exp(-(f - hit) / 3) * Math.cos((f - hit) / 1.6) : 1;
  const flash = interpolate(f, [hit, hit + 2, hit + 14], [0, 1, 0], clamp);
  if (f < at) return null;
  const sc = (1.75 - 0.75 * p) * settle;
  const r = 128;
  const txt = 'SOCIÉTÉ À JOUR · ALGÉRIE · ';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${sc}) rotate(-10deg)`, opacity: Math.min(1, p * 1.5)}}>
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${16 * flash}px rgba(246,227,174,${flash}))`}}>
        <defs>
          <path id="seal2" d={`M 0 0 m -${r - 26} 0 a ${r - 26} ${r - 26} 0 1 1 ${2 * (r - 26)} 0 a ${r - 26} ${r - 26} 0 1 1 -${2 * (r - 26)} 0`} />
          <radialGradient id="seal2g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(150)">
            <stop offset="0" stopColor="#F6E3AE" />
            <stop offset="0.7" stopColor="#C9A24B" />
            <stop offset="1" stopColor="#9C7726" />
          </radialGradient>
        </defs>
        <circle r={r + 14} fill="rgba(14,23,38,0.6)" />
        <circle r={r} fill="none" stroke="url(#seal2g)" strokeWidth={8} />
        <circle r={r - 52} fill="none" stroke="url(#seal2g)" strokeWidth={3} />
        <text fill="#F2DDA2" fontFamily="Manrope" fontWeight={800} fontSize={24} letterSpacing={4}>
          <textPath href="#seal2" startOffset="0">{txt}</textPath>
        </text>
        <path d="M-34 4l22 22 46-52" fill="none" stroke="#F2DDA2" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
const B7: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: inOut});
  const z = interpolate(f, [0, dur], [1.04, 1.13], clamp);
  const hit = t(22.42) + 5;
  const shake = f >= hit && f < hit + 6 ? (random('q7' + f) - 0.5) * 10 * (1 - (f - hit) / 6) : 0;
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.pierre}}>
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <Photo src={P.P_s2_classeurs} w={1600} h={2400} zoom={z} ox={0.5} oy={0.6} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.95) 0%, rgba(244,239,230,0.86) 36%, rgba(244,239,230,0) 56%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.5) 0%, rgba(14,23,38,0) 28%)'}} />
      <div style={{position: 'absolute', top: 165, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(19.63)}>Chaque mois,</Word>
        </div>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32, marginTop: 10}}>
          <Word at={t(20.23)}>ce que vous obtenez</Word>
        </div>
        <div style={{...big, fontSize: 100, marginTop: 26}}>
          <Word at={t(21.71)}>une </Word>
          <Word at={t(21.88)}>société</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(22.34)} size={176} color={OR_TEXTE} stroke="none">
            à jour.
          </Accent>
        </div>
      </div>
      {/* les 12 mois, cochés un par un */}
      <div style={{position: 'absolute', top: 905, left: 60, width: 960, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
        {MOIS.map((m, i) => {
          const at = t(19.95 + i * 0.19);
          const p = prog(f, at, 8);
          const tick = prog(f, at + 3, 7);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(244,239,230,0.97)', borderRadius: 12, padding: '16px 18px', boxShadow: '0 12px 30px rgba(14,23,38,0.25)', opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
              <div style={{width: 40, height: 40, borderRadius: 40, flexShrink: 0, background: tick > 0 ? C.or : 'transparent', border: `3px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={22} height={22} viewBox="0 0 32 32">
                  <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                </svg>
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.marine, letterSpacing: -0.5}}>{m}</div>
            </div>
          );
        })}
      </div>
      <Seal at={t(22.42)} x={W - 250} y={1560} />
    </AbsoluteFill>
  );
};

/* ===================================================== 8. Vous restez chez vous, nous gérons le reste (écho de l'accroche) */
const B8: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const topIn = interpolate(f, [0, 11], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1)});
  const botIn = interpolate(f, [t(23.05), t(23.05) + 11], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1)});
  const line = prog(f, 6, 12, inOut);
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  const lab = prog(f, 10, 10);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HALF, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - topIn) * 100}% 0)`}}>
        <Photo src={P.P_s2_chez_vous} w={1600} h={2400} fw={W} fh={HALF} ox={0.5} oy={0.38} zoom={1.1 - 0.05 * k} />
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.96) 0%, rgba(244,239,230,0.92) 42%, rgba(244,239,230,0.4) 62%, rgba(244,239,230,0) 78%)'}} />
        <div style={{position: 'absolute', top: 228, width: '100%', textAlign: 'center', color: C.marine}}>
          <div style={{...big, fontSize: 96}}>
            <Word at={t(23.19)}>Vous </Word>
            <Word at={t(23.42)}>restez</Word>
          </div>
          <div style={{...big, fontSize: 96}}>
            <Word at={t(23.68)}>chez </Word>
            <Word at={t(23.88)}>vous.</Word>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: HALF, width: W, height: H - HALF, overflow: 'hidden', clipPath: `inset(${(1 - botIn) * 100}% 0 0 0)`}}>
        <Photo src={P.P_s2_algerie_cote} w={1600} h={2133} fw={W} fh={H - HALF} ox={0.5} oy={0.62} zoom={1.12 - 0.06 * k} />
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.72) 0%, rgba(14,23,38,0.35) 40%, rgba(14,23,38,0) 65%)'}} />
        <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', color: C.blanc, filter: shadowW}}>
          <div style={{...big, fontSize: 96}}>
            <Word at={t(24.13)}>Nous </Word>
            <Word at={t(24.3)}>gérons</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Accent at={t(24.85)} size={170} color={C.orClair} stroke="none">
              le reste.
            </Accent>
          </div>
        </div>
      </div>
      {line > 0 && <GoldLine y={HALF} w={W * line} />}
      <Label text="Europe" y={HALF - 92} op={lab * topIn} />
      <Label text="Algérie" y={HALF + 44} op={lab * botIn} />
    </AbsoluteFill>
  );
};

/* ===================================================== 9. Carte de fin nuit et or (reprise de la bible) */
const B9: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(25.85), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const pack = prog(f, t(26.5), 14);
  const btn = useSpring(t(26.25), 12, 150);
  const url = prog(f, t(26.8), 14);
  const shine = interpolate(f, [t(27.4), t(28.2)], [-30, 130], clamp);
  const breathe = 1 + 0.012 * Math.sin(f / 18);
  const glowAlg = 0.65 + 0.35 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${bg * 150}% at 50% 50%)`, background: C.nuit}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)'}} />
      </AbsoluteFill>
      <Particles at={t(25.75)} dur={s(0.6)} cx={W / 2} cy={H * 0.24} mode="in" n={90} spread={800} seed="q9" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.24, transform: `translate(-50%,-50%) scale(${(0.9 + 0.1 * reveal) * breathe})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 680, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.385, width: '100%', textAlign: 'center'}}>
        <div style={{...big, fontSize: 60, fontWeight: 700, letterSpacing: -1, color: 'rgba(255,255,255,0.92)'}}>
          <Word at={t(26.0)}>Le </Word>
          <Word at={t(26.08)}>trait </Word>
          <Word at={t(26.16)}>d’union </Word>
          <Word at={t(26.24)}>avec </Word>
          <Word at={t(26.32)}>votre</Word>
        </div>
        <div style={{marginTop: 4, filter: `drop-shadow(0 0 ${22 * glowAlg}px rgba(233,207,142,0.55))`}}>
          <Accent at={t(26.4)} size={160} color={C.orClair} stroke="none">
            Algérie.
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.6, width: '100%', display: 'flex', justifyContent: 'center', opacity: pack, transform: `translateY(${(1 - pack) * 20}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 70, height: 2, background: C.or}} />
          <div style={{...eyebrow, color: C.orClair, fontSize: 32, letterSpacing: 6}}>Pack Suivi de Société</div>
          <div style={{width: 70, height: 2, background: C.or}} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute', top: H * 0.72, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`,
          background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`,
          borderRadius: 999, padding: '34px 64px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(201,162,75,0.35)', whiteSpace: 'nowrap',
        }}
      >
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
export const P02V2_DUREE = 29.5;
const PLAN: [number, number, Sc][] = [
  [0, 3.8, B1],
  [3.62, 6.22, B3],
  [5.93, 8.62, B4],
  [8.5, 12.7, B5],
  [12.4, 19.5, B6],
  [19.18, 23.47, B7],
  [22.95, 25.8, B8],
  [25.55, P02V2_DUREE, B9],
];

export const Pack02SuiviV2: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {PLAN.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp st={a} dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
