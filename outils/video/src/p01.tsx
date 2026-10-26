// Série « Un pack en 40 secondes » — vidéo 1 : Pack Création de Société (voix masculine ElevenLabs du 23/10/2026)
// Temps en secondes absolues de la voix (alignement /home/claude/p01/align.json, contrôlé par les pauses).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, Sequence, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, Particles, prog, s, SANS, SERIF, Spark, useSpring, Word} from './kit';
import {Mask, Photo, Pin} from './scenes4';

const W = 1080;
const H = 1920;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};
const HALF = 957;

type Sc = React.FC<{st: number; dur: number}>;
const useT = (st: number) => (x: number) => s(x - st);

/* ===================================================== 1. Accroche : votre société en Algérie */
const A1: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const z = interpolate(f, [0, t(2.1)], [1.2, 1.05], {...clamp, easing: Easing.bezier(0.3, 0.1, 0.3, 1)});
  const r = interpolate(f, [0, t(2.1)], [-2.5, 0], {...clamp, easing: ease});
  const ty = interpolate(f, [0, t(2.1)], [60, -10], clamp);
  const whip = interpolate(f, [t(2.03), t(2.38)], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.4)});
  return (
    <AbsoluteFill style={{background: C.pierre, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateY(${whip * H}px)`, filter: `blur(${whip * 26}px)`}}>
        <AbsoluteFill style={{transform: `scale(${z}) rotate(${r}deg) translateY(${ty}px)`}}>
          <Photo src={P.P_creation} w={1067} h={1600} ox={0.5} oy={0.5} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.92) 0%, rgba(244,239,230,0.8) 30%, rgba(244,239,230,0) 50%)'}} />
        <div style={{position: 'absolute', top: 245, width: '100%', textAlign: 'center', color: C.marine}}>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(0.08)}>Vous </Word>
            <Word at={t(0.44)}>voulez </Word>
            <Word at={t(0.7)}>créer</Word>
          </div>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(0.9)}>votre </Word>
            <Word at={t(1.05)}>société</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Word at={t(1.3)} style={{...big, fontSize: 92}}>en </Word>
            <Accent at={t(1.47)} size={160} color={OR_TEXTE} stroke="underline" strokeColor={C.or}>
              Algérie…
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ===================================================== 2. … sans quitter l'Europe ? */
const A2: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.bezier(0.1, 0.6, 0.3, 1)});
  const z = interpolate(f, [0, dur], [1.14, 1.04], {...clamp, easing: ease});
  const push = interpolate(f, [t(3.36), t(3.68)], [0, 1], {...clamp, easing: inOut});
  return (
    <AbsoluteFill style={{transform: `translateY(${-enter * H}px) translateX(${-push * W}px)`, filter: `blur(${enter * 26}px)`, background: C.nuit}}>
      <Photo src={P.P_europe} w={1200} h={2133} zoom={z} filter="saturate(0.9) contrast(1.04)" />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.78) 0%, rgba(14,23,38,0.45) 32%, rgba(14,23,38,0) 52%)'}} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.5))'}}>
        <div style={{...big, fontSize: 100}}>
          <Word at={t(2.15)}>sans </Word>
          <Word at={t(2.4)}>quitter</Word>
        </div>
        <div style={{marginTop: 8}}>
          <Accent at={t(2.62)} size={176} color={C.orClair} stroke="underline" strokeColor={C.or}>
            l’Europe ?
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 3. Le problème : tout enchaîner à distance */
const CHIPS = [
  {l: 'Notaire', at: 4.91},
  {l: 'Banque', at: 5.36},
  {l: 'Registre du commerce', at: 6.01},
  {l: 'Impôts', at: 7.19},
];
const A3: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 9], [1, 0], {...clamp, easing: inOut});
  const z = interpolate(f, [0, dur], [1.02, 1.07], clamp);
  const dark = prog(f, t(7.6), 12);
  const head = 1 - prog(f, t(7.55), 8, easeIn);
  const line = prog(f, t(8.92), 9, Easing.bezier(0.6, 0, 0.2, 1));
  const toNight = prog(f, t(9.1), 5);
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.nuit}}>
      <AbsoluteFill style={{opacity: 1 - toNight}}>
        <Photo src={P.P_papiers} w={1333} h={2000} zoom={z} oy={0.45} filter={`saturate(${1 - 0.7 * dark})`} />
        <AbsoluteFill style={{background: `rgba(14,23,38,${0.66 * dark})`}} />
        {/* en-tête */}
        <div style={{position: 'absolute', top: 100, width: '100%', textAlign: 'center', color: C.marine, opacity: head, filter: `blur(${(1 - head) * 10}px)`}}>
          <div style={{...eyebrow, color: OR_TEXTE, fontSize: 34}}>
            <Word at={t(3.45)}>À distance</Word>
          </div>
          <div style={{...big, fontSize: 74, marginTop: 14}}>
            <Word at={t(4.1)}>il faut </Word>
            <Word at={t(4.49)}>enchaîner</Word>
          </div>
        </div>
        {/* étiquettes */}
        <div style={{position: 'absolute', top: 1060, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          {CHIPS.map((c, i) => {
            const p = prog(f, t(c.at), 12);
            const sp = useSpring(t(c.at), 13, 170);
            const out = prog(f, t(7.55) + i * 1.5, 9, easeIn);
            return (
              <div
                key={i}
                style={{
                  opacity: Math.min(1, p * 1.5) * (1 - out),
                  transform: `translateX(${(i % 2 ? 1 : -1) * (1 - sp) * 90}px) scale(${0.9 + 0.1 * sp}) translateY(${-out * 40}px)`,
                  filter: `blur(${out * 8}px)`,
                  display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(244,239,230,0.96)',
                  borderLeft: `8px solid ${C.or}`, padding: '20px 40px 20px 30px', borderRadius: 14,
                  boxShadow: '0 18px 40px rgba(14,23,38,0.35)',
                }}
              >
                <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: C.or, lineHeight: 1}}>{`0${i + 1}`}</span>
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.marine, letterSpacing: -1}}>{c.l}</span>
              </div>
            );
          })}
        </div>
        {/* … sans personne sur place ? */}
        <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.5))'}}>
          <div style={{...big, fontSize: 84}}>
            <Word at={t(7.62)}>sans</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Accent at={t(7.98)} size={196} color={C.orClair} stroke="underline" strokeColor={C.or}>
              personne
            </Accent>
          </div>
          <div style={{...big, fontSize: 100, marginTop: 18}}>
            <Word at={t(8.34)}>sur </Word>
            <Word at={t(8.47)}>place ?</Word>
          </div>
        </div>
      </AbsoluteFill>
      {/* trait d'or : transition vers le plan signature */}
      <div
        style={{
          position: 'absolute', left: 0, top: HALF, height: 6, width: W * line, borderRadius: 6,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 60%, ${C.orClair})`,
          boxShadow: '0 0 24px rgba(233,207,142,0.9), 0 0 60px rgba(201,162,75,0.6)', opacity: line > 0 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

/* ===================================================== 4. Plan signature : M et O Conseil */
const A4: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const photoIn = prog(f, 1, 12, ease);
  const reveal = prog(f, t(11.71), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const lab = prog(f, t(12.2), 12);
  const out = interpolate(f, [t(12.86), t(13.12)], [0, 1], {...clamp, easing: easeIn});
  const glow = 0.7 + 0.3 * Math.sin(f / 5);
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `scale(${1 + out * 0.5})`, filter: `blur(${out * 20}px)`, opacity: 1 - out}}>
      <AbsoluteFill style={{opacity: photoIn}}>
        <Photo src={P.P_mains} w={1333} h={2000} zoom={1.2 - 0.12 * k} rot={-2 + 2 * k} oy={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(14,23,38,0.62)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 45% at 50% 50%, rgba(14,23,38,0) 0%, rgba(14,23,38,0.45) 100%)'}} />
      <div
        style={{
          position: 'absolute', left: 0, top: HALF, height: 6, width: W,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 50%, ${C.orFonce})`,
          boxShadow: `0 0 ${26 * glow}px rgba(233,207,142,0.9), 0 0 ${70 * glow}px rgba(201,162,75,0.6)`,
        }}
      />
      <Spark at={t(11.71)} x={W / 2} y={HALF + 3} scale={0.9} out={t(12.3)} />
      <Particles at={t(11.71)} dur={s(0.7)} cx={W / 2} cy={HALF} mode="out" n={90} spread={420} seed="p1" boxW={500} boxH={20} />
      {/* bloc 1 : Être cette personne sur place, */}
      <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.55))'}}>
        <Mask at={0} out={t(10.5)} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 84}}>
            <Word at={t(9.2)}>Être </Word>
            <Word at={t(9.49)}>cette </Word>
            <Word at={t(9.66)}>personne</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={t(9.98)} size={160} color={C.orClair} stroke="underline" strokeColor={C.or}>
              sur place,
            </Accent>
          </div>
        </Mask>
      </div>
      {/* bloc 2 : c'est exactement ce que fait */}
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.55))'}}>
        <div style={{...big, fontSize: 78}}>
          <Word at={t(10.6)}>c’est </Word>
          <Word at={t(10.85)}>exactement</Word>
        </div>
        <div style={{...big, fontSize: 78, marginTop: 4}}>
          <Word at={t(11.28)}>ce </Word>
          <Word at={t(11.4)}>que </Word>
          <Word at={t(11.57)}>fait</Word>
        </div>
      </div>
      {/* étiquettes */}
      <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))'}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Europe</div>
      </div>
      <div style={{position: 'absolute', top: 1590, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))'}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Algérie</div>
      </div>
      {/* logo : net, sans halo */}
      <div style={{position: 'absolute', left: W / 2, top: 1235, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 600, display: 'block'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 5. Une équipe en Europe, une équipe en Algérie */
const A5: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 9], [0, 1], {...clamp, easing: ease});
  const k = interpolate(f, [0, dur], [0, 1], {...clamp, easing: Easing.bezier(0.25, 0.6, 0.3, 1)});
  const link = prog(f, t(13.95), 18, inOut);
  const pinTop = useSpring(t(13.08), 12, 170);
  const pinBot = useSpring(t(14.01), 12, 170);
  const tr = interpolate(f, [t(14.75), t(14.95), t(15.15)], [0, 1, 0], clamp);
  const Y0 = 640;
  const Y1 = 1265;
  return (
    <AbsoluteFill style={{opacity: enter, transform: `scale(${1.15 - 0.15 * enter})`}}>
      <Photo src={P.P_carte} w={2000} h={1333} rot={(-7 + 7 * k) * 0.5} zoom={1.32 - 0.22 * k} ox={0.47} oy={0.5} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.82) 0%, rgba(14,23,38,0.5) 24%, rgba(14,23,38,0) 40%, rgba(14,23,38,0) 58%, rgba(14,23,38,0.55) 72%, rgba(14,23,38,0.85) 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={W / 2} y1={Y0} x2={W / 2} y2={Y0 + (Y1 - Y0) * link} stroke={C.orClair} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
        {link > 0 && <circle cx={W / 2} cy={Y0 + (Y1 - Y0) * link} r={9} fill={C.orClair} />}
        <circle cx={W / 2} cy={Y0} r={11 * pinTop} fill={C.or} stroke={C.orClair} strokeWidth={3} />
        <circle cx={W / 2} cy={Y1} r={11 * pinBot} fill={C.or} stroke={C.orClair} strokeWidth={3} />
        {tr > 0 && tr < 1 && <circle cx={W / 2} cy={Y0 + (Y1 - Y0) * tr} r={14} fill="#F6E3AE" style={{filter: 'drop-shadow(0 0 14px rgba(246,227,174,1))'}} />}
      </svg>
      <div style={{position: 'absolute', top: 205, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{transform: `scale(${pinTop})`, display: 'inline-block'}}>
          <Pin size={62} />
        </div>
        <div style={{...big, fontSize: 84, marginTop: 6}}>
          <Word at={t(13.04)}>Une </Word>
          <Word at={t(13.21)}>équipe </Word>
          <Word at={t(13.38)}>en</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(13.46)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
            Europe,
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1300, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{transform: `scale(${pinBot})`, display: 'inline-block'}}>
          <Pin size={62} />
        </div>
        <div style={{...big, fontSize: 84, marginTop: 6}}>
          <Word at={t(14.01)}>une </Word>
          <Word at={t(14.21)}>équipe </Word>
          <Word at={t(14.38)}>en</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(14.45)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
            Algérie.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 6. Le pack : ce que nous faisons */
const WIN = {x: 70, y: 400, w: 940, h: 640};
/** Tampon « Société immatriculée · Algérie » frappé sur une feuille, avec un léger nuage de poussière (v2, 26/10/2026). */
const PaperSeal: React.FC<{at: number; fw: number; fh: number; zoom: number}> = ({at, fw, fh, zoom}) => {
  const f = useCurrentFrame();
  const hit = at + 5;
  const p = interpolate(f, [at, hit], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const settle = f >= hit ? 1 - 0.035 * Math.exp(-(f - hit) / 3) * Math.cos((f - hit) / 1.6) : 1;
  const sc = (1.75 - 0.75 * p) * settle;
  const shake = f >= hit && f < hit + 6 ? (random('ps' + f) - 0.5) * 9 * (1 - (f - hit) / 6) : 0;
  const shadow = 1 - p;
  const r = 128;
  const txt = 'SOCIÉTÉ IMMATRICULÉE · ALGÉRIE · ';
  const ink = 'url(#inkg)';
  const inkTxt = '#7E5E1A';
  const cx = fw / 2;
  const cy = fh / 2;
  const puff = interpolate(f, [hit, hit + 26], [0, 1], {...clamp, easing: Easing.bezier(0.15, 0.7, 0.3, 1)});
  const puffOp = f < hit ? 0 : interpolate(f, [hit, hit + 3, hit + 26], [0, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: fw, height: fh, overflow: 'hidden', transform: `translate(${shake}px, ${shake * 0.6}px) scale(${zoom})`}}>
      {/* feuille */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #F7F2E8 0%, #EFE7D7 60%, #E2D6BE 100%)'}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(to bottom, rgba(27,42,65,0) 0px, rgba(27,42,65,0) 45px, rgba(27,42,65,0.06) 46px)', opacity: 0.8}} />
      <svg width={fw} height={fh} style={{position: 'absolute', left: 0, top: 0, opacity: 0.09}}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} /></filter>
        <rect width={fw} height={fh} filter="url(#grain)" />
      </svg>
      {/* fumée très légère */}
      {Array.from({length: 18}).map((_, i) => {
        const a = (i / 18) * Math.PI * 2 + random('pa' + i) * 0.4;
        const d = 175 + 90 * puff * (0.6 + 0.6 * random('pd' + i));
        const size = 70 + 90 * puff * (0.6 + 0.8 * random('ps' + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: cx + Math.cos(a) * d - size / 2, top: cy + Math.sin(a) * d * 0.8 - size / 2 - 10 * puff,
              width: size, height: size, borderRadius: size, background: 'rgba(140,128,110,0.55)',
              opacity: 0.32 * puffOp * (0.6 + 0.4 * random('po' + i)), filter: 'blur(16px)',
            }}
          />
        );
      })}
      {Array.from({length: 14}).map((_, i) => {
        const a = random('da' + i) * Math.PI * 2;
        const d = 140 + 160 * puff * (0.5 + random('dd' + i));
        return (
          <div key={'d' + i} style={{position: 'absolute', left: cx + Math.cos(a) * d, top: cy + Math.sin(a) * d * 0.8, width: 4, height: 4, borderRadius: 4, background: 'rgba(120,105,80,0.8)', opacity: 0.6 * puffOp}} />
        );
      })}
      {/* ombre du tampon qui descend */}
      {f >= at && f < hit && (
        <div style={{position: 'absolute', left: cx - 150 * sc, top: cy - 150 * sc + 30, width: 300 * sc, height: 300 * sc, borderRadius: 999, background: 'rgba(14,23,38,0.25)', filter: 'blur(30px)', opacity: shadow}} />
      )}
      {f >= at && (
        <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${sc * 1.32}) rotate(-8deg)`, opacity: Math.min(1, p * 1.5)}}>
          <svg width={320} height={320} viewBox="-160 -160 320 320" style={{overflow: 'visible'}}>
            <defs>
              <path id="psc" d={`M 0 0 m -${r - 26} 0 a ${r - 26} ${r - 26} 0 1 1 ${2 * (r - 26)} 0 a ${r - 26} ${r - 26} 0 1 1 -${2 * (r - 26)} 0`} />
              <linearGradient id="inkg" x1="-130" y1="-130" x2="130" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#C9A24B" />
                <stop offset="0.5" stopColor="#9C7726" />
                <stop offset="1" stopColor="#7E5E1A" />
              </linearGradient>
              <filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.95" result="m" />
                <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
                <feDisplacementMap in="c" in2="n" scale={2.2} />
              </filter>
            </defs>
            <g filter="url(#ink)" opacity={0.97}>
              <circle r={r} fill="none" stroke={ink} strokeWidth={9} />
              <circle r={r - 52} fill="none" stroke={ink} strokeWidth={3.5} />
              <text fill={inkTxt} fontFamily="Manrope" fontWeight={800} fontSize={21} letterSpacing={3}>
                <textPath href="#psc" startOffset="0">{txt}</textPath>
              </text>
              <path d="M-34 4l22 22 46-52" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

const SHOTS = [
  {at: 15.18, src: P.P_stylo, w: 901, h: 1600, ox: 0.5, oy: 0.3},
  {at: 18.33, src: P.P_dossier, w: 1333, h: 2000, ox: 0.5, oy: 0.45},
  {at: 19.9, src: '', w: 0, h: 0, ox: 0.5, oy: 0.5, seal: true}, // v2 (26/10) : tampon frappé sur papier, demande d'Amine
  {at: 21.66, src: P.P_bancaire, w: 1067, h: 1600, ox: 0.3, oy: 0.78},
];
const CHECKS = [
  {l: 'Statuts rédigés', at: 17.8},
  {l: 'Capital déposé', at: 19.0},
  {l: 'Registre du commerce', at: 20.45},
  {l: 'Compte professionnel', at: 22.2},
];
const A6: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const shrink = interpolate(f, [10, 24], [0, 1], {...clamp, easing: inOut});
  const box = {
    x: interpolate(shrink, [0, 1], [0, WIN.x]),
    y: interpolate(shrink, [0, 1], [0, WIN.y]),
    w: interpolate(shrink, [0, 1], [W, WIN.w]),
    h: interpolate(shrink, [0, 1], [H, WIN.h]),
  };
  const push = interpolate(f, [t(24.88), t(25.2)], [0, 1], {...clamp, easing: inOut});
  const veil = prog(f, t(23.22), 10);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`, transform: `translateX(${-push * W}px)`}}>
      <AbsoluteFill style={{background: C.pierre}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)'}} />
      {/* en-tête */}
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center'}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(15.4)}>Avec le pack</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(15.82)} size={104} color={C.marine} stroke="none">
            Création de Société
          </Accent>
        </div>
      </div>
      {/* fenêtre photo */}
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', boxShadow: `0 40px 80px rgba(27,42,65,${0.28 * shrink})`}}>
        {SHOTS.map((sh, i) => {
          const a = t(sh.at - 0.14);
          const wp = i === 0 ? 1 : interpolate(f, [a, a + 12], [0, 1], {...clamp, easing: inOut});
          if (wp <= 0) return null;
          const z = i === 0 ? interpolate(f, [0, t(18.33)], [1.12, 1.0], clamp) : interpolate(f, [a, a + 12, a + 60], [1.18, 1.06, 1.0], {...clamp, easing: ease});
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - wp) * 100}% 0 0 0)`}}>
              {(sh as any).seal ? (
                <PaperSeal at={t(19.95)} fw={box.w} fh={box.h} zoom={z} />
              ) : (
                <Photo src={sh.src} w={sh.w} h={sh.h} fw={box.w} fh={box.h} ox={sh.ox} oy={sh.oy} zoom={z} />
              )}
            </div>
          );
        })}
        <AbsoluteFill style={{background: `rgba(14,23,38,${0.62 * veil})`}} />
        <div style={{position: 'absolute', inset: 18, border: `2px solid rgba(233,207,142,${0.75 * shrink})`, pointerEvents: 'none'}} />
        {/* sans que vous ayez à vous déplacer */}
        <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', color: C.blanc}}>
          <div style={{...big, fontSize: 84}}>
            <Word at={t(23.25)}>Sans </Word>
            <Word at={t(23.67)}>vous</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={t(24.15)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
              déplacer.
            </Accent>
          </div>
        </div>
      </div>
      {/* ce que comprend le pack */}
      <div style={{position: 'absolute', left: 120, top: 1105}}>
        {CHECKS.map((c, i) => {
          const p = prog(f, t(c.at), 12);
          const tick = prog(f, t(c.at) + 4, 10);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: i * 118, display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateX(${(1 - p) * 50}px)`, whiteSpace: 'nowrap'}}>
              <div
                style={{
                  width: 64, height: 64, borderRadius: 64, background: tick > 0 ? C.or : C.pierre, border: `4px solid ${C.or}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * tick})`, flexShrink: 0,
                }}
              >
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                </svg>
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.marine, letterSpacing: -1}}>{c.l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 7. Ce que vous obtenez */
const Seal: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 6], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.5)});
  const flash = interpolate(f, [at + 5, at + 7, at + 16], [0, 1, 0], clamp);
  if (f < at) return null;
  const sc = 1.7 - 0.7 * p;
  const rot = -14 + 4 * p;
  const r = 128;
  const txt = 'SOCIÉTÉ IMMATRICULÉE · ALGÉRIE · ';
  return (
    <div style={{position: 'absolute', left: W / 2 + 225, top: 1545, transform: `translate(-50%,-50%) scale(${sc}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.4)}}>
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${18 * flash}px rgba(246,227,174,${flash}))`}}>
        <defs>
          <path id="sealc" d={`M 0 0 m -${r - 26} 0 a ${r - 26} ${r - 26} 0 1 1 ${2 * (r - 26)} 0 a ${r - 26} ${r - 26} 0 1 1 -${2 * (r - 26)} 0`} />
          <radialGradient id="sealg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(150)">
            <stop offset="0" stopColor="#F6E3AE" />
            <stop offset="0.7" stopColor="#C9A24B" />
            <stop offset="1" stopColor="#9C7726" />
          </radialGradient>
        </defs>
        <circle r={r + 14} fill="rgba(14,23,38,0.55)" />
        <circle r={r} fill="none" stroke="url(#sealg)" strokeWidth={8} />
        <circle r={r - 52} fill="none" stroke="url(#sealg)" strokeWidth={3} />
        <text fill="#F2DDA2" fontFamily="Manrope" fontWeight={800} fontSize={21} letterSpacing={3}>
          <textPath href="#sealc" startOffset="0">{txt}</textPath>
        </text>
        <path d="M-34 4l22 22 46-52" fill="none" stroke="#F2DDA2" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const A7: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: inOut});
  const z = interpolate(f, [0, dur], [1.02, 1.12], clamp);
  const hit = t(27.36) + 5;
  const shake = f >= hit && f < hit + 6 ? (random('sh' + f) - 0.5) * 10 * (1 - (f - hit) / 6) : 0;
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.pierre}}>
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <Photo src={P.P_cachet} w={1333} h={1913} zoom={z} oy={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.9) 0%, rgba(244,239,230,0.75) 28%, rgba(244,239,230,0) 44%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.55) 0%, rgba(14,23,38,0) 30%)'}} />
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(24.98)}>À la fin, </Word>
          <Word at={t(25.51)}>ce que vous obtenez</Word>
        </div>
        <div style={{...big, fontSize: 92, marginTop: 22}}>
          <Word at={t(26.56)}>votre </Word>
          <Word at={t(26.82)}>société</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(27.3)} size={164} color={OR_TEXTE} stroke="underline" strokeColor={C.marine}>
            immatriculée
          </Accent>
        </div>
        <div style={{...big, fontSize: 64, marginTop: 22, letterSpacing: -1.5}}>
          <Word at={t(28.06)}>et </Word>
          <Word at={t(28.21)}>prête </Word>
          <Word at={t(28.5)}>à démarrer.</Word>
        </div>
      </div>
      <Seal at={t(27.36)} />
    </AbsoluteFill>
  );
};

/* ===================================================== 8. Vous restez chez vous, nous gérons le reste */
const A8: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
      <AbsoluteFill style={{transform: `translateY(${(1 - wipe) * 160}px)`}}>
        <Photo src={P.P_couchant} w={1333} h={2000} ox={0.8 - 0.3 * k} zoom={1.12 - 0.05 * k} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 30% 26%, rgba(244,239,230,0.5), rgba(244,239,230,0))'}} />
        <div style={{position: 'absolute', left: 80, top: 250, color: C.marine}}>
          <div style={{...big, fontSize: 106}}>
            <Word at={t(29.24)}>Vous </Word>
            <Word at={t(29.55)}>restez</Word>
          </div>
          <div style={{...big, fontSize: 106}}>
            <Word at={t(29.71)}>chez </Word>
            <Word at={t(29.88)}>vous.</Word>
          </div>
          <div style={{...big, fontSize: 106, marginTop: 70}}>
            <Word at={t(30.14)}>Nous </Word>
            <Word at={t(30.3)}>gérons</Word>
          </div>
          <div style={{marginTop: 6, marginLeft: -6}}>
            <Accent at={t(30.6)} size={176} color={OR_TEXTE} stroke="underline" strokeColor={C.marine}>
              le reste.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ===================================================== 9. Carte de fin nuit et or */
const A9: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(31.4), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const pack = prog(f, t(32.3), 14);
  const btn = useSpring(t(31.85), 12, 150);
  const url = prog(f, t(32.5), 14);
  const shine = interpolate(f, [t(33.0), t(33.8)], [-30, 130], clamp);
  const breathe = 1 + 0.012 * Math.sin(f / 18);
  const glowAlg = 0.65 + 0.35 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${bg * 150}% at 50% 50%)`, background: C.nuit}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)'}} />
      </AbsoluteFill>
      <Particles at={t(31.3)} dur={s(0.6)} cx={W / 2} cy={H * 0.24} mode="in" n={90} spread={800} seed="p9" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.24, transform: `translate(-50%,-50%) scale(${(0.9 + 0.1 * reveal) * breathe})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 680, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.385, width: '100%', textAlign: 'center'}}>
        <div style={{...big, fontSize: 60, fontWeight: 700, letterSpacing: -1, color: 'rgba(255,255,255,0.92)'}}>
          <Word at={t(31.6)}>Le </Word>
          <Word at={t(31.68)}>trait </Word>
          <Word at={t(31.76)}>d’union </Word>
          <Word at={t(31.84)}>avec </Word>
          <Word at={t(31.92)}>votre</Word>
        </div>
        <div style={{marginTop: 4, filter: `drop-shadow(0 0 ${22 * glowAlg}px rgba(233,207,142,0.55))`}}>
          <Accent at={t(32.0)} size={160} color={C.orClair} stroke="none">
            Algérie.
          </Accent>
        </div>
      </div>
      {/* le pack de la vidéo */}
      <div style={{position: 'absolute', top: H * 0.6, width: '100%', display: 'flex', justifyContent: 'center', opacity: pack, transform: `translateY(${(1 - pack) * 20}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 70, height: 2, background: C.or}} />
          <div style={{...eyebrow, color: C.orClair, fontSize: 32, letterSpacing: 6}}>Pack Création de Société</div>
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
export const P01_DUREE = 35.5;
const PLAN: [number, number, Sc][] = [
  [0, 2.4, A1],
  [2.03, 3.72, A2],
  [3.36, 9.3, A3],
  [9.15, 13.15, A4],
  [12.9, 15.45, A5],
  [15.1, 25.22, A6],
  [24.88, 29.5, A7],
  [29.12, 31.6, A8],
  [31.25, P01_DUREE, A9],
];

export const Pack01Creation: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {PLAN.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp st={a} dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
