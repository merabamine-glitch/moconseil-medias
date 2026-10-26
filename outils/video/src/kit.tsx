import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

export const C = {
  marine: '#1B2A41',
  nuit: '#0E1726',
  nuit2: '#16233A',
  or: '#C9A24B',
  orClair: '#E9CF8E',
  orFonce: '#A8822F',
  pierre: '#F4EFE6',
  sable: '#E8DCC6',
  encre: '#1E2633',
  blanc: '#FFFFFF',
  teal: '#152E30',
};

export const SERIF = '"Cormorant", serif';
export const SANS = '"Manrope", sans-serif';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);

export const prog = (frame: number, start: number, dur: number, e = ease) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: e});

/** Mot qui apparaît : montée + flou + opacité. */
export const Word: React.FC<{
  at: number; // frame d'apparition (relative à la séquence)
  children: React.ReactNode;
  style?: React.CSSProperties;
  dur?: number;
}> = ({at, children, style, dur = 14}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: p,
        transform: `translateY(${(1 - p) * 38}px) scale(${0.96 + 0.04 * p})`,
        filter: `blur(${(1 - p) * 14}px)`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Mot d'accent : serif italique, avec un trait dessiné à la main (ellipse ou soulignement). */
export const Accent: React.FC<{
  at: number;
  children: React.ReactNode;
  color?: string;
  size: number;
  stroke?: 'ellipse' | 'underline' | 'none';
  strokeColor?: string;
  width?: number;
}> = ({at, children, color = C.or, size, stroke = 'underline', strokeColor, width = 600}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 16);
  const d = prog(f, at + 8, 22, Easing.bezier(0.45, 0, 0.2, 1));
  const sc = strokeColor ?? color;
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          display: 'inline-block',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: size,
          color,
          lineHeight: 1,
          opacity: p,
          transform: `translateY(${(1 - p) * 30}px)`,
          filter: `blur(${(1 - p) * 12}px)`,
          letterSpacing: -1,
          padding: '0 6px',
        }}
      >
        {children}
      </span>
      {stroke !== 'none' && (
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            left: stroke === 'ellipse' ? '-9%' : '2%',
            top: stroke === 'ellipse' ? '-12%' : '78%',
            width: stroke === 'ellipse' ? '118%' : '96%',
            height: stroke === 'ellipse' ? '130%' : '28%',
            overflow: 'visible',
          }}
        >
          {stroke === 'ellipse' ? (
            <path
              d="M330 18 C 120 10, 18 60, 26 108 C 36 170, 250 190, 420 176 C 560 164, 600 110, 570 70 C 540 30, 420 14, 300 22 L 248 30"
              fill="none"
              stroke={sc}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - d}
            />
          ) : (
            <path
              d="M6 120 C 150 90, 300 150, 594 100"
              fill="none"
              stroke={sc}
              strokeWidth={9}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - d}
            />
          )}
        </svg>
      )}
    </span>
  );
};

/** Fond : dégradé + trame de points lumineux (halftone), comme la référence. */
export const DarkStage: React.FC<{glow?: number; glowX?: number; glowY?: number; children?: React.ReactNode}> = ({
  glow = 1,
  glowX = 50,
  glowY = 42,
  children,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(201,162,75,${0.22 * glow}) 0%, rgba(201,162,75,0) 38%), radial-gradient(circle at 50% 120%, #1d2f4d 0%, ${C.nuit} 60%)`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(233,207,142,0.20) 1.6px, transparent 1.8px)',
        backgroundSize: '22px 22px',
        WebkitMaskImage: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0,0,0,${0.9 * glow}) 0%, rgba(0,0,0,0) 34%)`,
        maskImage: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0,0,0,${0.9 * glow}) 0%, rgba(0,0,0,0) 34%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Étincelle « trait d'union » : un trait d'or qui se dessine avec halo et rayons. */
export const Spark: React.FC<{at: number; x: number; y: number; scale?: number; out?: number; dash?: boolean}> = ({
  at,
  x,
  y,
  scale = 1,
  out,
  dash = false,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 18);
  const rays = prog(f, at + 4, 22);
  const pulse = 1 + 0.06 * Math.sin((f - at) / 4);
  const o = out !== undefined ? 1 - prog(f, out, 10) : 1;
  const n = 10;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${scale * pulse})`,
        opacity: o,
      }}
    >
      <svg width={520} height={520} viewBox="-260 -260 520 520" style={{overflow: 'visible'}}>
        <defs>
          <radialGradient id="sg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(240)">
            <stop offset="0" stopColor="#F6E3AE" stopOpacity={0.85 * p} />
            <stop offset="0.35" stopColor="#C9A24B" stopOpacity={0.35 * p} />
            <stop offset="1" stopColor="#C9A24B" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="dash" x1="-120" x2="120" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#B88A2E" />
            <stop offset="0.5" stopColor="#F6E3AE" />
            <stop offset="1" stopColor="#B88A2E" />
          </linearGradient>
        </defs>
        <circle r={240} fill="url(#sg)" />
        {Array.from({length: n}).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + (f - at) / 60;
          const r0 = 70 + 20 * random(`r0${i}`);
          const len = (60 + 70 * random(`l${i}`)) * rays;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r0}
              y1={Math.sin(a) * r0}
              x2={Math.cos(a) * (r0 + len)}
              y2={Math.sin(a) * (r0 + len)}
              stroke="#E9CF8E"
              strokeOpacity={0.75 * rays}
              strokeWidth={6}
              strokeLinecap="round"
            />
          );
        })}
        {dash && (
          <>
            <rect x={-120 * p} y={-9} width={240 * p} height={18} rx={9} fill="url(#dash)" />
            <circle cx={-128 * p} cy={0} r={14 * p} fill="#F6E3AE" />
            <circle cx={128 * p} cy={0} r={14 * p} fill="#F6E3AE" />
          </>
        )}
      </svg>
    </div>
  );
};

/** Particules d'or qui convergent (mode in) ou s'envolent (mode out). */
export const Particles: React.FC<{
  at: number;
  dur: number;
  cx: number;
  cy: number;
  mode: 'in' | 'out';
  n?: number;
  spread?: number;
  seed?: string;
  boxW?: number;
  boxH?: number;
}> = ({at, dur, cx, cy, mode, n = 90, spread = 700, seed = 'p', boxW = 0, boxH = 0}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + dur], [0, 1], clamp);
  if (t <= 0 || t >= 1) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const a = random(seed + 'a' + i) * Math.PI * 2;
        const r = spread * (0.35 + 0.65 * random(seed + 'r' + i));
        const ox = cx + (random(seed + 'x' + i) - 0.5) * boxW;
        const oy = cy + (random(seed + 'y' + i) - 0.5) * boxH;
        const k = mode === 'in' ? 1 - Easing.bezier(0.2, 0.8, 0.3, 1)(t) : Easing.bezier(0.3, 0, 0.6, 1)(t);
        const x = ox + Math.cos(a) * r * k + (mode === 'out' ? -120 * k * random(seed + 'w' + i) : 0);
        const y = oy + Math.sin(a) * r * k - (mode === 'out' ? 260 * k * random(seed + 'u' + i) : 0);
        const size = 3 + 7 * random(seed + 's' + i);
        const op = mode === 'in' ? Math.min(1, t * 3) * (1 - t * 0.6) : 1 - t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: i % 3 === 0 ? '#F6E3AE' : '#C9A24B',
              opacity: op,
              boxShadow: '0 0 12px rgba(233,207,142,0.8)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Entrée / sortie de scène : zoom, flou, fondu. */
export const SceneShell: React.FC<{dur: number; children: React.ReactNode; inDur?: number; outDur?: number; zoom?: number}> = ({
  dur,
  children,
  inDur = 10,
  outDur = 8,
  zoom = 0.05,
}) => {
  const f = useCurrentFrame();
  const pin = prog(f, 0, inDur);
  const pout = prog(f, dur - outDur, outDur, easeIn);
  const drift = interpolate(f, [0, dur], [1, 1 + zoom]);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(pin * 1.4, 1) * (1 - pout),
        transform: `scale(${drift * (1.06 - 0.06 * pin) * (1 + 0.08 * pout)})`,
        filter: `blur(${(1 - pin) * 18 + pout * 22}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const useSpring = (at: number, damping = 14, stiffness = 140) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, stiffness, mass: 0.9}});
};

/** Grain léger et vignette, pour un rendu « film ». */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)'}}
      />

    </AbsoluteFill>
  );
};

/** Étoile « pop » autour du logo : rayons d'or en ellipse qui jaillissent puis s'effacent (sans trait ni points). */
export const LogoBurst: React.FC<{at: number; x: number; y: number; rx?: number; ry?: number; n?: number}> = ({at, x, y, rx = 340, ry = 190, n = 16}) => {
  const f = useCurrentFrame();
  const grow = prog(f, at, 10, Easing.bezier(0.2, 0.9, 0.3, 1));
  const fade = 1 - prog(f, at + 14, 16);
  if (f < at || fade <= 0) return null;
  return (
    <svg width={rx * 2 + 300} height={ry * 2 + 300} viewBox={`${-rx - 150} ${-ry - 150} ${rx * 2 + 300} ${ry * 2 + 300}`} style={{position: 'absolute', left: x - rx - 150, top: y - ry - 150, overflow: 'visible', opacity: fade}}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.2;
        const c = Math.cos(a), sn = Math.sin(a);
        const r0 = 1 + 0.06 * random('lb' + i);
        const len = (45 + 50 * random('ll' + i)) * grow;
        const x1 = c * rx * r0, y1 = sn * ry * r0;
        const k = len / Math.hypot(c * rx, sn * ry);
        return <line key={i} x1={x1} y1={y1} x2={x1 + c * rx * k} y2={y1 + sn * ry * k} stroke="#E9CF8E" strokeOpacity={0.85} strokeWidth={6} strokeLinecap="round" />;
      })}
    </svg>
  );
};
