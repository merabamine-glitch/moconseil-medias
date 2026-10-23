import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {L_logo_clair, L_logo_couleur} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Particles, prog, s, SANS, SERIF, Spark, useSpring, Word} from './kit';

const W = 1080;
const H = 1920;
const OR_TEXTE = '#9C7726'; // or lisible sur fond clair
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};

/* -------------------------------------------------------------- outils */

/** Photo en « cover » dans un cadre fw × fh, avec caméra (zoom, rotation, décalage). */
export const Photo: React.FC<{
  src: string; w: number; h: number; ox?: number; oy?: number; zoom?: number; rot?: number;
  dx?: number; dy?: number; fw?: number; fh?: number; filter?: string;
}> = ({src, w, h, ox = 0.5, oy = 0.5, zoom = 1, rot = 0, dx = 0, dy = 0, fw = W, fh = H, filter}) => {
  const sc = Math.max(fw / w, fh / h);
  const iw = w * sc;
  const ih = h * sc;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: fw, height: fh, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `rotate(${rot}deg) scale(${zoom})`, transformOrigin: '50% 50%', filter}}>
        <Img src={src} style={{position: 'absolute', left: (fw - iw) * ox + dx, top: (fh - ih) * oy + dy, width: iw, height: ih}} />
      </div>
    </div>
  );
};

/** Texte qui monte depuis un masque (entrée) et repart vers le haut (sortie). */
export const Mask: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; d?: number}> = ({
  at, out, children, style, d = 12,
}) => {
  const f = useCurrentFrame();
  const pin = prog(f, at, d);
  const pout = out !== undefined ? prog(f, out, 9, easeIn) : 0;
  return (
    <div style={{overflow: 'hidden', paddingBottom: 6, ...style}}>
      <div style={{transform: `translateY(${(1 - pin) * 105 - pout * 105}%)`, opacity: Math.min(1, pin * 1.5) * (1 - pout)}}>{children}</div>
    </div>
  );
};

export const Pin: React.FC<{size?: number; color?: string}> = ({size = 64, color = C.orClair}) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <path d="M28 52s17-16 17-29a17 17 0 0 0-34 0c0 13 17 29 17 29z" fill="none" stroke={color} strokeWidth={4.5} />
    <circle cx={28} cy={23} r={6.5} fill={color} />
  </svg>
);

/* ================================================================ SA — l'envol */
// Photo de l'avion : coordonnées en pixels de la photo (1568 × 2352).
const PK = H / 2352;
const PX = (W - 1568 * PK) / 2; // -100
const planeAt = (fr: number) => {
  const T = 94;
  const t = fr / T;
  let p: number;
  if (t < 0) p = 2.36 * t;
  else if (t <= 1) p = 0.85 * (1 - Math.pow(1 - t, 2.6)) + 0.15 * t;
  else p = 1 + 0.15 * (t - 1);
  const sc = 1.75 * Math.pow(0.4 / 1.75, Math.max(-0.4, Math.min(p, 1.15)));
  return {cx: 805 - 25 * p, cy: 2150 - 2420 * p, sc, rot: -4 + 4 * Math.min(p, 1), bank: 1 - 0.07 * Math.sin(Math.PI * Math.min(Math.max(p, 0), 1))};
};

const Contrails: React.FC<{fr: number; fade: number}> = ({fr, fade}) => {
  const A = 34;
  const lines: React.ReactNode[] = [];
  for (const [ox, key] of [[-57, 'g'], [55, 'd']] as [number, string][]) {
    for (let a = 1; a < A; a++) {
      const p0 = planeAt(fr - a);
      const p1 = planeAt(fr - a - 1);
      const x0 = p0.cx + ox * p0.sc * p0.bank;
      const y0 = p0.cy - 20 * p0.sc + 60 * p0.sc;
      const x1 = p1.cx + ox * p1.sc * p1.bank;
      const y1 = p1.cy - 20 * p1.sc + 60 * p1.sc;
      const op = 0.55 * interpolate(a, [1, 5], [0, 1], clamp) * Math.pow(1 - a / A, 1.4) * fade;
      const wdt = (5 + a * 0.55) * Math.max(p0.sc, 0.5);
      lines.push(<line key={key + a} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#FFFFFF" strokeOpacity={op} strokeWidth={wdt} strokeLinecap="round" />);
    }
  }
  return (
    <svg width={1568} height={2352} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'blur(3px)'}}>
      {lines}
    </svg>
  );
};

const Plane: React.FC<{fr: number}> = ({fr}) => {
  const p = planeAt(fr);
  const v = planeAt(fr - 1).cy - p.cy; // vitesse (px photo / image)
  const ghosts = Math.min(6, Math.floor(v / 8));
  const sprite = (k: number, op: number) => (
    <Img
      key={k}
      src={P.P_avion}
      style={{
        position: 'absolute',
        left: p.cx - 170 * p.sc,
        top: p.cy - 171 * p.sc + (k * v) / 7,
        width: 340 * p.sc,
        height: 342 * p.sc,
        opacity: op,
        transform: `rotate(${p.rot}deg) scaleX(${p.bank})`,
        filter: v > 25 && k === 0 ? `blur(${Math.min(3, v / 25)}px)` : undefined,
      }}
    />
  );
  return (
    <>
      {Array.from({length: ghosts}).map((_, i) => sprite(ghosts - i, 0.1))}
      {sprite(0, 1)}
    </>
  );
};

export const SA: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 90], [1.22, 1.04], {...clamp, easing: Easing.bezier(0.3, 0.1, 0.3, 1)});
  const r = interpolate(f, [0, 90], [-3, 0], {...clamp, easing: ease});
  const ty = interpolate(f, [0, 90], [70, -10], clamp);
  const whip = interpolate(f, [88, 99], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.9, 0.4)});
  const t = (x: number) => s(x);
  return (
    <AbsoluteFill style={{background: '#BFE3EC', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateY(${whip * H}px)`, filter: `blur(${whip * 26}px)`}}>
        <AbsoluteFill style={{transform: `scale(${z}) rotate(${r}deg) translateY(${ty}px)`, transformOrigin: '50% 50%'}}>
          <div style={{position: 'absolute', left: PX, top: 0, width: 1568, height: 2352, transform: `scale(${PK})`, transformOrigin: '0 0'}}>
            <Img src={P.P_ciel} style={{position: 'absolute', left: 0, top: 0, width: 1568, height: 2352}} />
            <Contrails fr={f} fade={interpolate(f, [60, 95], [1, 0.35], clamp)} />
            <Plane fr={f} />
            <Img src={P.P_premier_plan} style={{position: 'absolute', left: 0, top: 0, width: 1568, height: 2352}} />
          </div>
        </AbsoluteFill>
        {/* voile clair derrière le texte */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 13% at 50% 71%, rgba(244,239,230,0.78), rgba(244,239,230,0))'}} />
        {/* bloc 1 */}
        <div style={{position: 'absolute', top: 1235, width: '100%', textAlign: 'center', color: C.marine}}>
          <Mask at={0} out={t(1.68)} d={1} style={{overflow: 'visible'}}>
            <div style={{...big, fontSize: 112}}>
              <Word at={t(0.53)}>Vous </Word>
              <Word at={t(0.75)}>vivez</Word>
            </div>
            <div style={{marginTop: 2}}>
              <Accent at={t(1.0)} size={150} color={OR_TEXTE} stroke="underline" strokeColor={C.or}>
                à l’étranger.
              </Accent>
            </div>
          </Mask>
        </div>
        {/* bloc 2 */}
        <div style={{position: 'absolute', top: 1260, width: '100%', textAlign: 'center', color: C.marine}}>
          <div style={{...big, fontSize: 104}}>
            <Word at={t(1.97)}>Mais </Word>
            <Word at={t(2.15)}>votre </Word>
            <Word at={t(2.33)}>projet,</Word>
          </div>
          <div style={{...big, fontSize: 104, marginTop: 4}}>
            <Word at={t(2.62)}>lui, </Word>
            <Word at={t(2.85)}>est </Word>
            <Word at={t(3.0)}>en…</Word>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================================================ SB — Algérie */
export const SB: React.FC<{dur: number}> = ({dur}) => {
  const st = 3.0;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.bezier(0.1, 0.6, 0.3, 1)});
  const z = interpolate(f, [0, dur], [1.12, 1.03], {...clamp, easing: ease});
  const cap = prog(f, t(3.5), 12);
  return (
    <AbsoluteFill style={{transform: `translateY(${-enter * H}px)`, filter: `blur(${enter * 26}px)`}}>
      <Photo src={P.P_maqam} w={1333} h={1600} zoom={z} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.62) 0%, rgba(14,23,38,0.25) 30%, rgba(14,23,38,0) 48%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 12% at 50% 22%, rgba(14,23,38,0.45), rgba(14,23,38,0))'}} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center'}}>
        <div style={{filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.45))'}}>
          <Accent at={t(3.18)} size={235} color={C.orClair} stroke="ellipse" strokeColor={C.or}>
            Algérie.
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 1540, display: 'flex', alignItems: 'center', gap: 18, opacity: cap, transform: `translateX(${(1 - cap) * -30}px)`}}>
        <div style={{width: 60, height: 3, background: C.orClair}} />
        <div style={{...eyebrow, fontSize: 26, color: C.blanc, textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>Alger</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ SC — les projets */
const ITEMS = [
  {at: 4.37, n: '01', title: 'Créer une société', pack: 'Pack Création de Société', src: P.P_creation, w: 1067, h: 1600, ox: 0.5},
  {at: 5.45, n: '02', title: 'Acheter un bien', pack: 'Pack Achat Immobilier', src: P.P_patrimoine, w: 1280, h: 1600, ox: 0.5},
  {at: 6.4, n: '03', title: 'Régler une succession', pack: 'Pack Succession & Transmission', src: P.P_succession, w: 1400, h: 1599, ox: 0.62},
  {at: 7.45, n: '04', title: 'Préparer votre retour', pack: 'Pack Retour Définitif', src: P.P_couchant, w: 1333, h: 2000, ox: 0.55},
];
const WIN = {x: 70, y: 300, w: 940, h: 1030};

export const SC: React.FC<{dur: number}> = ({dur}) => {
  const st = 4.25;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const shrink = interpolate(f, [0, 13], [0, 1], {...clamp, easing: inOut});
  const box = {
    x: interpolate(shrink, [0, 1], [0, WIN.x]),
    y: interpolate(shrink, [0, 1], [0, WIN.y]),
    w: interpolate(shrink, [0, 1], [W, WIN.w]),
    h: interpolate(shrink, [0, 1], [H, WIN.h]),
  };
  const push = interpolate(f, [t(9.0), t(9.3)], [0, 1], {...clamp, easing: inOut});
  const head = prog(f, 8, 14);
  const chip = useSpring(t(8.05), 12, 160);
  return (
    <AbsoluteFill style={{background: C.pierre, transform: `translateX(${-push * W}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)'}} />
      {/* en-tête */}
      <div style={{position: 'absolute', top: 175, left: WIN.x, width: WIN.w, opacity: head}}>
        <div style={{...eyebrow, color: OR_TEXTE, textAlign: 'center'}}>Votre projet en Algérie</div>
        <div style={{display: 'flex', gap: 12, marginTop: 34}}>
          {ITEMS.map((it, i) => {
            const end = i < 3 ? ITEMS[i + 1].at : 8.95;
            const fill = interpolate(f, [t(it.at - 0.1), t(end - 0.1)], [0, 1], clamp);
            return (
              <div key={i} style={{flex: 1, height: 6, borderRadius: 6, background: 'rgba(27,42,65,0.12)', overflow: 'hidden'}}>
                <div style={{width: `${fill * 100}%`, height: '100%', background: C.or}} />
              </div>
            );
          })}
        </div>
      </div>
      {/* fenêtre photo */}
      <div
        style={{
          position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden',
          boxShadow: `0 40px 80px rgba(27,42,65,${0.28 * shrink})`,
        }}
      >
        <Photo src={P.P_maqam} w={1333} h={1600} fw={box.w} fh={box.h} zoom={interpolate(f, [0, 20], [1.03, 1.08], clamp)} />
        {ITEMS.map((it, i) => {
          const a = t(it.at - 0.14);
          const wp = interpolate(f, [a, a + 12], [0, 1], {...clamp, easing: inOut});
          if (wp <= 0) return null;
          const z = interpolate(f, [a, a + 12, a + 60], [1.18, 1.06, 1.0], {...clamp, easing: ease});
          return (
            <div key={i} style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - wp) * 100}% 0 0 0)`}}>
              <Photo src={it.src} w={it.w} h={it.h} fw={box.w} fh={box.h} ox={it.ox} zoom={z} />
            </div>
          );
        })}
        {/* filet or intérieur */}
        <div style={{position: 'absolute', inset: 18, border: `2px solid rgba(233,207,142,${0.75 * shrink})`, pointerEvents: 'none'}} />
      </div>
      {/* pastille + 6 autres packs */}
      <div
        style={{
          position: 'absolute', left: WIN.x + WIN.w - 40, top: WIN.y + WIN.h - 4, transform: `translate(-100%,-50%) scale(${chip})`,
          transformOrigin: '100% 50%', background: C.marine, color: C.orClair, fontFamily: SANS, fontWeight: 700, fontSize: 36,
          padding: '20px 40px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(27,42,65,0.35)',
        }}
      >
        + 6 autres packs
      </div>
      {/* légendes */}
      {ITEMS.map((it, i) => {
        const outAt = i < 3 ? t(ITEMS[i + 1].at - 0.2) : undefined;
        return (
          <div key={i} style={{position: 'absolute', left: WIN.x, top: WIN.y + WIN.h + 50, width: WIN.w}}>
            <Mask at={t(it.at - 0.05)} out={outAt}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 92, color: C.or, lineHeight: 1}}>{it.n}</div>
                <div style={{flex: 1, height: 2, background: 'rgba(201,162,75,0.55)'}} />
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: 'rgba(27,42,65,0.45)', letterSpacing: 2}}>/ 04</div>
              </div>
            </Mask>
            <Mask at={t(it.at)} out={outAt}>
              <div style={{...big, fontSize: 78, color: C.marine, letterSpacing: -2, marginTop: 8}}>{it.title}</div>
            </Mask>
            <Mask at={t(it.at + 0.08)} out={outAt}>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 31, color: OR_TEXTE, marginTop: 10, letterSpacing: 1}}>{it.pack}</div>
            </Mask>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================================================================ SD — sur place */
export const SD: React.FC<{dur: number}> = ({dur}) => {
  const st = 9.0;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 9], [1, 0], {...clamp, easing: inOut});
  const pan = interpolate(f, [0, t(12.3)], [0.04, 0.6], {...clamp, easing: Easing.bezier(0.45, 0.05, 0.3, 1)});
  const z = interpolate(f, [0, dur], [1.0, 1.1], clamp);
  const clock = prog(f, t(10.8), 34);
  const line = prog(f, t(12.85), 11, Easing.bezier(0.6, 0, 0.2, 1));
  const toNight = prog(f, t(13.1), 6);
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`, background: C.nuit}}>
      <AbsoluteFill style={{opacity: 1 - toNight}}>
        <Photo src={P.P_poignee} w={2212} h={1661} ox={pan} zoom={z} />
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(244,239,230,0.9) 0%, rgba(244,239,230,0.72) 26%, rgba(244,239,230,0) 46%)'}} />
        {/* bloc 1 */}
        <div style={{position: 'absolute', top: 205, width: '100%', textAlign: 'center', color: C.marine}}>
          <Mask at={0} out={t(11.28)} d={1} style={{overflow: 'visible'}}>
            <div style={{...eyebrow, color: OR_TEXTE, fontSize: 34}}>
              <Word at={t(9.32)}>Sur place</Word>
            </div>
            <div style={{...big, fontSize: 98, marginTop: 26}}>
              <Word at={t(9.95)}>chaque </Word>
              <Word at={t(10.2)}>démarche</Word>
            </div>
            <div style={{...big, fontSize: 98}}>
              <Word at={t(10.45)}>demande </Word>
              <Word at={t(10.65)}>du</Word>
            </div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 4}}>
              <Accent at={t(10.75)} size={176} color={OR_TEXTE} stroke="none">
                temps,
              </Accent>
              <svg width={104} height={104} viewBox="-60 -60 120 120" style={{position: 'absolute', right: -122, top: 46, opacity: prog(f, t(10.85), 10)}}>
                <circle r={50} fill="none" stroke={C.marine} strokeWidth={6} />
                <line x1={0} y1={0} x2={0} y2={-34} stroke={C.marine} strokeWidth={6} strokeLinecap="round" transform={`rotate(${clock * 360})`} />
                <line x1={0} y1={0} x2={22} y2={0} stroke={C.or} strokeWidth={6} strokeLinecap="round" transform={`rotate(${clock * 30})`} />
              </svg>
            </div>
          </Mask>
        </div>
        {/* bloc 2 */}
        <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', color: C.marine}}>
          <div style={{...big, fontSize: 88}}>
            <Word at={t(11.42)}>et </Word>
            <Word at={t(11.55)}>quelqu’un </Word>
            <Word at={t(11.85)}>de</Word>
          </div>
          <div style={{marginTop: 10}}>
            <Accent at={t(11.95)} size={190} color={C.marine} stroke="underline" strokeColor={C.or}>
              confiance.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
      {/* trait d'or : transition */}
      <div
        style={{
          position: 'absolute', left: 0, top: 957, height: 6, width: W * line, borderRadius: 6,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 60%, ${C.orClair})`,
          boxShadow: '0 0 24px rgba(233,207,142,0.9), 0 0 60px rgba(201,162,75,0.6)', opacity: line > 0 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

/* ================================================================ SE — le trait d'union */
export const SE: React.FC<{dur: number}> = ({dur}) => {
  const st = 13.2;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const slide = interpolate(f, [0, 13], [1, 0], {...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1)});
  const night = interpolate(f, [t(13.45), t(13.85)], [0, 0.74], clamp);
  const reveal = prog(f, t(13.5), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const out = interpolate(f, [t(15.55), t(15.8)], [0, 1], {...clamp, easing: easeIn});
  const lab = prog(f, t(13.6), 12);
  const glow = 0.7 + 0.3 * Math.sin(f / 5);
  const HALF = 957;
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `scale(${1 + out * 0.5})`, filter: `blur(${out * 20}px)`, opacity: 1 - out}}>
      {/* moitié haute : là où vous vivez */}
      <div style={{position: 'absolute', left: 0, top: -slide * HALF, width: W, height: HALF, overflow: 'hidden'}}>
        <Photo src={P.P_ciel} w={1568} h={2352} fw={W} fh={HALF} oy={0.2} zoom={interpolate(f, [0, dur], [1.12, 1.02])} />
        <AbsoluteFill style={{background: C.nuit, opacity: night}} />
      </div>
      {/* moitié basse : Algérie */}
      <div style={{position: 'absolute', left: 0, top: HALF + 6 + slide * HALF, width: W, height: H - HALF - 6, overflow: 'hidden'}}>
        <Photo src={P.P_maqam} w={1333} h={1600} fw={W} fh={H - HALF - 6} oy={0.35} zoom={interpolate(f, [0, dur], [1.12, 1.02])} />
        <AbsoluteFill style={{background: C.nuit, opacity: night}} />
      </div>
      {/* trait d'or */}
      <div
        style={{
          position: 'absolute', left: 0, top: HALF, height: 6, width: W,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 50%, ${C.orFonce})`,
          boxShadow: `0 0 ${26 * glow}px rgba(233,207,142,0.9), 0 0 ${70 * glow}px rgba(201,162,75,0.6)`,
        }}
      />
      <Spark at={t(13.38)} x={W / 2} y={HALF + 3} scale={0.9} out={t(13.95)} />
      <Particles at={t(13.38)} dur={s(0.7)} cx={W / 2} cy={HALF} mode="out" n={90} spread={420} seed="se" boxW={500} boxH={20} />
      {/* étiquettes */}
      <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Europe</div>
      </div>
      <div style={{position: 'absolute', top: 1590, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Algérie</div>
      </div>
      {/* logo */}
      <div
        style={{
          position: 'absolute', left: W / 2, top: 700, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`,
          clipPath: `inset(0 ${50 - 50 * reveal}% 0 ${50 - 50 * reveal}%)`,
          filter: `drop-shadow(0 0 ${40 * (1 - reveal) + 12}px rgba(233,207,142,0.45))`,
        }}
      >
        <Img src={L_logo_clair} style={{width: 600}} />
      </div>
      <div style={{position: 'absolute', top: 1035, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{...big, fontSize: 86}}>
          <Word at={t(14.25)}>est </Word>
          <Word at={t(14.4)}>ce</Word>
        </div>
        <div style={{marginTop: 10}}>
          <Accent at={t(14.5)} size={168} color={C.orClair} stroke="underline" strokeColor={C.or}>
            trait d’union.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ SF — les équipes */
export const SF: React.FC<{dur: number}> = ({dur}) => {
  const st = 15.55;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 9], [0, 1], {...clamp, easing: ease});
  const k = interpolate(f, [0, dur], [0, 1], {...clamp, easing: Easing.bezier(0.25, 0.6, 0.3, 1)});
  const rot = -7 + 7 * k;
  const zoom = 1.32 - 0.22 * k;
  const link = prog(f, t(16.95), 22, inOut);
  const pinTop = useSpring(t(15.8), 12, 170);
  const pinBot = useSpring(t(16.95), 12, 170);
  // point lumineux : aller-retour entre les deux épingles
  const tr = interpolate(f, [t(17.65), t(18.0), t(18.35)], [0, 1, 0], clamp);
  const Y0 = 640;
  const Y1 = 1265;
  return (
    <AbsoluteFill style={{opacity: enter, transform: `scale(${1.15 - 0.15 * enter})`}}>
      <Photo src={P.P_mains} w={1333} h={2000} rot={rot} zoom={zoom} oy={0.48} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.82) 0%, rgba(14,23,38,0.5) 24%, rgba(14,23,38,0) 40%, rgba(14,23,38,0) 58%, rgba(14,23,38,0.55) 72%, rgba(14,23,38,0.85) 100%)'}} />
      {/* liaison */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={W / 2} y1={Y0} x2={W / 2} y2={Y0 + (Y1 - Y0) * link} stroke={C.orClair} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
        {link > 0 && <circle cx={W / 2} cy={Y0 + (Y1 - Y0) * link} r={9} fill={C.orClair} />}
        <circle cx={W / 2} cy={Y0} r={11 * pinTop} fill={C.or} stroke={C.orClair} strokeWidth={3} />
        <circle cx={W / 2} cy={Y1} r={11 * pinBot} fill={C.or} stroke={C.orClair} strokeWidth={3} />
        {tr > 0 && tr < 1 && (
          <circle cx={W / 2} cy={Y0 + (Y1 - Y0) * tr} r={14} fill="#F6E3AE" style={{filter: 'drop-shadow(0 0 14px rgba(246,227,174,1))'}} />
        )}
      </svg>
      {/* haut : Europe */}
      <div style={{position: 'absolute', top: 205, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{transform: `scale(${pinTop})`, display: 'inline-block'}}>
          <Pin size={62} />
        </div>
        <div style={{...big, fontSize: 84, marginTop: 6}}>
          <Word at={t(15.79)}>Une </Word>
          <Word at={t(15.95)}>équipe </Word>
          <Word at={t(16.12)}>en</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(16.2)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
            Europe,
          </Accent>
        </div>
      </div>
      {/* bas : Algérie */}
      <div style={{position: 'absolute', top: 1300, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{transform: `scale(${pinBot})`, display: 'inline-block'}}>
          <Pin size={62} />
        </div>
        <div style={{...big, fontSize: 84, marginTop: 6}}>
          <Word at={t(16.95)}>une </Word>
          <Word at={t(17.12)}>équipe </Word>
          <Word at={t(17.28)}>en</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(17.38)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
            Algérie.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ SG — 10 packs, 1 interlocuteur, un suivi */
const TILES = [
  {src: P.P_t_creation, w: 533, h: 800, l: 'Création de Société'},
  {src: P.P_t_nationalite, w: 800, h: 534, l: 'Reconnaissance de Nationalité'},
  {src: P.P_t_suivi, w: 450, h: 800, l: 'Suivi de Société'},
  {src: P.P_t_logement, w: 533, h: 800, l: 'Logement & Installation'},
  {src: P.P_t_scolarisation, w: 533, h: 800, l: 'Scolarisation'},
  {src: P.P_t_immobilier, w: 640, h: 800, l: 'Achat Immobilier'},
  {src: P.P_t_succession, w: 700, h: 800, l: 'Succession & Transmission'},
  {src: P.P_t_bancaire, w: 533, h: 800, l: 'Compte Bancaire'},
  {src: P.P_t_conciergerie, w: 533, h: 800, l: 'Conciergerie'},
  {src: P.P_t_retour, w: 533, h: 800, l: 'Retour Définitif'},
];
const STEPS = [
  {l: 'Appel découverte', s: 'Votre situation, vos objectifs', at: 20.9},
  {l: 'Feuille de route', s: 'Les étapes, dans l’ordre', at: 21.15},
  {l: 'Démarches sur place', s: 'Administrations, notaire, banque', at: 21.4},
  {l: 'Point d’étape', s: 'Avec les justificatifs', at: 21.65},
];

export const SG: React.FC<{dur: number}> = ({dur}) => {
  const st = 18.25;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const G = 8;
  const tw = (W - G) / 2;
  const th = (H - 4 * G) / 5;
  const dark = interpolate(f, [t(18.5), t(18.75), t(19.2), t(19.5)], [0, 0.66, 0.66, 0], clamp);
  const ten = useSpring(t(18.45), 13, 150);
  const drop = prog(f, t(19.15), 14, easeIn);
  const slideOne = interpolate(f, [t(19.15), t(19.5)], [0, 1], {...clamp, easing: ease});
  const toTop = interpolate(f, [t(20.25), t(20.6)], [0, 1], {...clamp, easing: inOut});
  const numColor = interpolateColors(f, [t(19.2), t(19.5)], [C.orClair, C.or]);
  const cap1 = 1 - prog(f, t(19.12), 6);
  const lineDraw = prog(f, t(20.8), 30, ease);
  const base = f >= 15 ? 1 : 0; // fond pierre posé sous la mosaïque une fois l'écran couvert
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: C.pierre, opacity: base}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)', opacity: base}} />
      {/* mosaïque */}
      {TILES.map((tl, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const a = 1 + (row + col) * 2 + col;
        const pin = interpolate(f, [a, a + 9], [0, 1], {...clamp, easing: ease});
        const fold = interpolate(f, [t(19.15) + row * 1.5, t(19.15) + row * 1.5 + 10], [0, 1], {...clamp, easing: easeIn});
        if (pin <= 0 || fold >= 1) return null;
        const x = col * (tw + G);
        const y = row * (th + G);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: x, top: y, width: tw, height: th, overflow: 'hidden',
              opacity: Math.min(1, pin * 1.6) * (1 - fold * 0.6),
              transform: `scale(${0.9 + 0.1 * pin}) translateX(${(col === 0 ? -1 : 1) * fold * (tw + 40)}px)`,
            }}
          >
            <Photo src={tl.src} w={tl.w} h={tl.h} fw={tw} fh={th} zoom={1.12 - 0.12 * pin} />
            <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(14,23,38,0.75) 0%, rgba(14,23,38,0) 45%)'}} />
            <div style={{position: 'absolute', left: 24, bottom: 20, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.blanc, letterSpacing: 0.3}}>{tl.l}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{background: C.nuit, opacity: dark}} />
      {/* 10 → 1 */}
      <div
        style={{
          position: 'absolute', left: 0, width: '100%', textAlign: 'center',
          top: interpolate(toTop, [0, 1], [560, 150]),
          transform: `scale(${interpolate(toTop, [0, 1], [1, 0.5])})`, transformOrigin: '50% 0',
        }}
      >
        <div style={{display: 'inline-flex', alignItems: 'flex-end', transform: `scale(${ten})`}}>
          <span style={{fontFamily: SERIF, fontWeight: 600, fontSize: 440, lineHeight: 0.8, color: numColor, transform: `translateX(${slideOne * 105}px)`, display: 'inline-block', fontVariantNumeric: 'lining-nums'}}>1</span>
          <span
            style={{
              fontFamily: SERIF, fontWeight: 600, fontSize: 440, lineHeight: 0.8, color: C.orClair, display: 'inline-block', fontVariantNumeric: 'lining-nums',
              opacity: 1 - drop, transform: `translateY(${drop * 700}px) rotate(${drop * 28}deg)`,
            }}
          >
            0
          </span>
        </div>
        <div style={{position: 'relative', height: 120, marginTop: 40}}>
          <div style={{position: 'absolute', width: '100%', opacity: cap1}}>
            <div style={{...big, fontSize: 80, color: C.blanc, letterSpacing: -1}}>
              <Word at={t(18.6)}>packs </Word>
              <Word at={t(18.72)}>de </Word>
              <Word at={t(18.82)}>services</Word>
            </div>
          </div>
          <div style={{position: 'absolute', width: '100%'}}>
            <div style={{...big, fontSize: 80, color: C.marine, letterSpacing: -1}}>
              <Word at={t(19.3)}>seul </Word>
              <Word at={t(19.5)}>interlocuteur</Word>
            </div>
          </div>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: OR_TEXTE, marginTop: 18, opacity: prog(f, t(19.85), 12) * (1 - toTop)}}>
          pour tout votre dossier
        </div>
      </div>
      {/* suivi */}
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 80, letterSpacing: -2}}>
          <Word at={t(20.51)}>Un </Word>
          <Word at={t(20.62)}>suivi </Word>
          <Word at={t(20.75)}>à</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(20.85)} size={150} color={OR_TEXTE} stroke="underline" strokeColor={C.marine}>
            chaque étape.
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: 215, top: 930, width: 760, height: 700}}>
        <div style={{position: 'absolute', left: 31, top: 34, width: 4, height: 555 * lineDraw, background: `linear-gradient(${C.or}, ${C.orClair})`, borderRadius: 4}} />
        {STEPS.map((st2, i) => {
          const p = prog(f, t(st2.at), 12);
          const tick = prog(f, t(st2.at) + 4, 10);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: i * 185, display: 'flex', alignItems: 'center', gap: 34, opacity: p, transform: `translateX(${(1 - p) * 50}px)`}}>
              <div
                style={{
                  width: 66, height: 66, borderRadius: 66, background: tick > 0 ? C.or : C.pierre, border: `4px solid ${C.or}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * tick})`, flexShrink: 0,
                }}
              >
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                </svg>
              </div>
              <div>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.marine, letterSpacing: -0.5}}>{st2.l}</div>
                <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, color: '#5E6675', marginTop: 4}}>{st2.s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================ SH — vous restez chez vous */
export const SH: React.FC<{dur: number}> = ({dur}) => {
  const st = 22.2;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
      <AbsoluteFill style={{transform: `translateY(${(1 - wipe) * 160}px)`}}>
        <Photo src={P.P_couchant} w={1333} h={2000} ox={0.8 - 0.45 * k} zoom={1.12 - 0.08 * k} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 30% at 30% 26%, rgba(244,239,230,0.45), rgba(244,239,230,0))'}} />
        <div style={{position: 'absolute', left: 80, top: 250, color: C.marine}}>
          <div style={{...big, fontSize: 106}}>
            <Word at={t(22.55)}>Vous </Word>
            <Word at={t(22.75)}>restez</Word>
          </div>
          <div style={{...big, fontSize: 106}}>
            <Word at={t(22.98)}>chez </Word>
            <Word at={t(23.15)}>vous.</Word>
          </div>
          <div style={{...big, fontSize: 106, marginTop: 70}}>
            <Word at={t(23.68)}>Nous </Word>
            <Word at={t(23.9)}>gérons</Word>
          </div>
          <div style={{marginTop: 6, marginLeft: -6}}>
            <Accent at={t(24.1)} size={176} color={OR_TEXTE} stroke="underline" strokeColor={C.marine}>
              le reste.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================================================ SI — signature */
export const SI: React.FC<{dur: number}> = ({dur}) => {
  const st = 25.15;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(25.27), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const gold = prog(f, t(26.05), 18, Easing.bezier(0.6, 0, 0.2, 1));
  const btn = useSpring(t(27.75), 12, 150);
  const url = prog(f, t(28.2), 14);
  const shine = interpolate(f, [t(28.6), t(29.4)], [-30, 130], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F7F1E5 40%, #EADCC0 100%)',
          clipPath: `circle(${bg * 150}% at 50% 50%)`,
        }}
      />
      <Particles at={t(25.2)} dur={s(0.6)} cx={W / 2} cy={H * 0.34} mode="in" n={90} spread={800} seed="si" />
      <div
        style={{
          position: 'absolute', left: W / 2, top: H * 0.34, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * reveal})`,
          clipPath: `inset(0 ${50 - 50 * reveal}% 0 ${50 - 50 * reveal}%)`,
        }}
      >
        <Img src={L_logo_couleur} style={{width: 700}} />
      </div>
      {/* trait d'union doré sous le logo */}
      <div
        style={{
          position: 'absolute', left: W / 2 - 170 * gold, top: H * 0.34 + 205, width: 340 * gold, height: 5, borderRadius: 5,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE, ${C.orFonce})`, boxShadow: '0 0 16px rgba(201,162,75,0.55)',
        }}
      />
      <div style={{position: 'absolute', top: H * 0.555, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 64, fontWeight: 700, letterSpacing: -1}}>
          <Word at={t(26.8)}>Le </Word>
          <Word at={t(26.95)}>trait </Word>
          <Word at={t(27.1)}>d’union </Word>
          <Word at={t(27.3)}>avec </Word>
          <Word at={t(27.42)}>votre</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(27.55)} size={150} color={C.or} stroke="ellipse" strokeColor={C.marine}>
            Algérie.
          </Accent>
        </div>
      </div>
      <div
        style={{
          position: 'absolute', top: H * 0.78, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: C.marine,
          borderRadius: 999, padding: '34px 64px', overflow: 'hidden', boxShadow: '0 24px 50px rgba(27,42,65,0.35)', whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.orClair}}>Réserver un appel découverte →</span>
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '22%',
            background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute', top: H * 0.835, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 42,
          color: C.marine, letterSpacing: 2, opacity: url, transform: `translateY(${(1 - url) * 20}px)`,
        }}
      >
        moconseildz.com
      </div>
    </AbsoluteFill>
  );
};
