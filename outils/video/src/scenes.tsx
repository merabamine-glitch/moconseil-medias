import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {L_logo_clair, L_logo_couleur} from './assets';
import {
  Accent,
  C,
  clamp,
  DarkStage,
  ease,
  Particles,
  prog,
  s,
  SANS,
  SceneShell,
  SERIF,
  Spark,
  useSpring,
  Word,
} from './kit';

const W = 1080;
const H = 1920;

// Temps de la voix (secondes, absolus) — mesurés sur la piste.
// L1 0.53–1.70 | 1.95–3.79 ; L2 4.37–8.73 (virgules 5.36, 6.25) ; L3 9.32–11.22 | 11.39–12.66 ;
// L4 13.40–15.16 ; L5 15.79–16.69 | 16.95–17.93 ; L6 18.42–20.26 | 20.51–21.73 ;
// L7 22.55–23.49 | 23.66–24.71 ; L8 25.38–26.57 | 26.80–28.34

const big: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 800,
  letterSpacing: -3,
  lineHeight: 1.04,
};

/* ------------------------------------------------------------------ S1 */
export const S1: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], [1, 1.08]);
  const flash = prog(f, dur - 7, 7);
  return (
    <AbsoluteFill>
      <DarkStage glow={prog(f, 0, 20)} glowY={36} />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Particles at={0} dur={s(0.7)} cx={W / 2} cy={H * 0.36} mode="in" n={110} spread={900} seed="s1" />
        <Spark at={s(0.35)} x={W / 2} y={H * 0.36} scale={1.1} />
        <div style={{position: 'absolute', top: H * 0.5, width: '100%', textAlign: 'center', color: C.blanc}}>
          <div style={{...big, fontSize: 118}}>
            <Word at={s(0.5)}>Vous </Word>
            <Word at={s(0.68)}>vivez</Word>
          </div>
          <div style={{marginTop: 6}}>
            <Accent at={s(0.95)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
              à l'étranger.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
      {/* passage en lumière : un cercle pierre qui s'ouvre depuis l'étincelle */}
      <AbsoluteFill
        style={{
          background: C.pierre,
          clipPath: `circle(${flash * 140}% at 50% 36%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S2 */
export const S2: React.FC<{dur: number}> = ({dur}) => {
  const st = 1.8;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, dur], [1, 1.05]);
  const out = prog(f, dur - 8, 8);
  return (
    <AbsoluteFill style={{background: C.pierre}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 62%, rgba(201,162,75,0.18), rgba(201,162,75,0) 45%)',
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${drift * (1 + 0.12 * out)})`,
          filter: `blur(${out * 18}px)`,
          opacity: 1 - out,
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: C.marine,
        }}
      >
        <div style={{...big, fontSize: 104}}>
          <Word at={t(1.97)}>Mais </Word>
          <Word at={t(2.15)}>votre </Word>
          <Word at={t(2.33)}>projet,</Word>
        </div>
        <div style={{...big, fontSize: 104, marginTop: 4}}>
          <Word at={t(2.62)}>lui, </Word>
          <Word at={t(2.85)}>est </Word>
          <Word at={t(3.0)}>en</Word>
        </div>
        <div style={{marginTop: 40}}>
          <Accent at={t(3.12)} size={210} color={C.or} stroke="ellipse" strokeColor={C.marine}>
            Algérie.
          </Accent>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S3 */
const Icon: React.FC<{kind: string; color: string}> = ({kind, color}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      {kind === 'societe' && (
        <g {...p}>
          <rect x="18" y="20" width="36" height="62" rx="3" />
          <rect x="54" y="40" width="24" height="42" rx="3" />
          <path d="M28 32h6M40 32h6M28 44h6M40 44h6M28 56h6M40 56h6M62 52h8M62 64h8M30 82v-12h12v12" />
        </g>
      )}
      {kind === 'bien' && (
        <g {...p}>
          <path d="M14 46 48 18l34 28" />
          <path d="M24 40v40h48V40" />
          <circle cx="48" cy="58" r="8" />
          <path d="M48 66v10M44 72h4" />
        </g>
      )}
      {kind === 'succession' && (
        <g {...p}>
          <circle cx="48" cy="22" r="9" />
          <circle cx="24" cy="70" r="9" />
          <circle cx="48" cy="70" r="9" />
          <circle cx="72" cy="70" r="9" />
          <path d="M48 31v16M24 61V50h48v11M48 47v14" />
        </g>
      )}
      {kind === 'retour' && (
        <g {...p}>
          <path d="M44 50 66 32l22 18" />
          <path d="M50 46v30h32V46" />
          <path d="M62 76V62h8v14" />
          <path d="M40 30C24 30 12 42 12 58s10 24 24 24h10" />
          <path d="M40 22l8 8-8 8" />
        </g>
      )}
    </svg>
  );
};

const Card: React.FC<{at: number; x: number; y: number; rot: number; kind: string; title: string; pack: string}> = ({
  at,
  x,
  y,
  rot,
  kind,
  title,
  pack,
}) => {
  const sp = useSpring(at, 11, 160);
  const f = useCurrentFrame();
  const float = Math.sin((f - at) / 22) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width: 400,
        height: 430,
        borderRadius: 34,
        background: 'linear-gradient(160deg,#FFFFFF 0%, #FBF7EF 100%)',
        boxShadow: '0 30px 60px rgba(27,42,65,0.25), 0 2px 0 rgba(255,255,255,0.8) inset',
        transform: `translate(-50%,-50%) rotate(${rot * sp}deg) scale(${0.4 + 0.6 * sp}) translateY(${(1 - sp) * 120}px)`,
        opacity: Math.min(1, sp * 1.5),
        padding: 38,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 30,
          background: C.marine,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon kind={kind} color={C.orClair} />
      </div>
      <div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.marine, lineHeight: 1.08, letterSpacing: -1}}>
          {title}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.orFonce, marginTop: 14, letterSpacing: 0.5}}>
          {pack}
        </div>
      </div>
    </div>
  );
};

export const S3: React.FC<{dur: number}> = ({dur}) => {
  const st = 4.25;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const head = prog(f, 0, 14);
  const chip = useSpring(t(8.0), 12, 150);
  return (
    <SceneShell dur={dur} zoom={0.04}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #F3DC9F 0%, #DDBB66 38%, #C9A24B 70%, #B08935 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1.5px, transparent 1.7px)',
          backgroundSize: '24px 24px',
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 250,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 44,
          color: C.marine,
          opacity: head,
          transform: `translateY(${(1 - head) * 20}px)`,
          letterSpacing: 0.5,
        }}
      >
        Votre projet en Algérie, de A à Z.
      </div>
      <Card at={t(4.42)} x={W * 0.3} y={H * 0.36} rot={-5} kind="societe" title="Créer une société" pack="Pack Création de Société" />
      <Card at={t(5.5)} x={W * 0.7} y={H * 0.39} rot={4} kind="bien" title="Acheter un bien" pack="Pack Achat Immobilier" />
      <Card at={t(6.42)} x={W * 0.3} y={H * 0.63} rot={3} kind="succession" title="Régler une succession" pack="Pack Succession & Transmission" />
      <Card at={t(7.5)} x={W * 0.7} y={H * 0.66} rot={-4} kind="retour" title="Préparer votre retour" pack="Pack Retour Définitif" />
      <div
        style={{
          position: 'absolute',
          top: H * 0.83,
          left: '50%',
          transform: `translateX(-50%) scale(${chip})`,
          background: C.marine,
          color: C.orClair,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 38,
          padding: '22px 44px',
          borderRadius: 999,
          whiteSpace: 'nowrap',
          boxShadow: '0 16px 40px rgba(27,42,65,0.35)',
        }}
      >
        + 6 autres packs
      </div>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ S4 */
export const S4: React.FC<{dur: number}> = ({dur}) => {
  const st = 9.05;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const dissolve = prog(f, t(12.7), 12);
  const inn = prog(f, 0, 10);
  const drift = interpolate(f, [0, dur], [1, 1.06]);
  // aiguille d'horloge autour de « temps »
  const clock = prog(f, t(10.7), 30);
  return (
    <AbsoluteFill style={{background: '#FBF8F2'}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(rgba(27,42,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,42,65,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: C.marine,
          transform: `scale(${drift})`,
          opacity: inn * (1 - dissolve),
          filter: `blur(${dissolve * 16}px)`,
        }}
      >
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.orFonce, letterSpacing: 6, textTransform: 'uppercase'}}>
          <Word at={t(9.32)}>Sur place</Word>
        </div>
        <div style={{...big, fontSize: 108, marginTop: 30}}>
          <Word at={t(9.95)}>chaque </Word>
          <Word at={t(10.2)}>démarche</Word>
        </div>
        <div style={{...big, fontSize: 108}}>
          <Word at={t(10.45)}>demande </Word>
          <Word at={t(10.65)}>du</Word>
        </div>
        <div style={{position: 'relative', marginTop: 6}}>
          <Accent at={t(10.75)} size={190} color={C.or} stroke="none">
            temps,
          </Accent>
          <svg
            width={120}
            height={120}
            viewBox="-60 -60 120 120"
            style={{position: 'absolute', right: -130, top: 40, opacity: prog(f, t(10.8), 10)}}
          >
            <circle r={50} fill="none" stroke={C.marine} strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={-34} stroke={C.marine} strokeWidth={6} strokeLinecap="round" transform={`rotate(${clock * 360})`} />
            <line x1={0} y1={0} x2={22} y2={0} stroke={C.or} strokeWidth={6} strokeLinecap="round" transform={`rotate(${clock * 30})`} />
          </svg>
        </div>
        <div style={{...big, fontSize: 72, marginTop: 50, fontWeight: 700}}>
          <Word at={t(11.42)}>et </Word>
          <Word at={t(11.55)}>quelqu'un </Word>
          <Word at={t(11.85)}>de</Word>
        </div>
        <div style={{marginTop: 8}}>
          <Accent at={t(11.95)} size={170} color={C.marine} stroke="underline" strokeColor={C.or}>
            confiance.
          </Accent>
        </div>
      </AbsoluteFill>
      <Particles at={t(12.7)} dur={20} cx={W / 2} cy={H * 0.58} mode="out" n={160} spread={600} seed="s4" boxW={760} boxH={300} />
      <AbsoluteFill style={{background: C.nuit, opacity: prog(f, dur - 6, 6)}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S5 */
export const S5: React.FC<{dur: number}> = ({dur}) => {
  const st = 13.15;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const reveal = prog(f, t(13.45), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const out = prog(f, dur - 8, 8);
  const drift = interpolate(f, [0, dur], [1.04, 1]);
  return (
    <AbsoluteFill>
      <DarkStage glow={1} glowY={38} />
      <AbsoluteFill style={{transform: `scale(${drift * (1 + out * 0.1)})`, opacity: 1 - out, filter: `blur(${out * 16}px)`}}>
        <Particles at={0} dur={s(0.55)} cx={W / 2} cy={H * 0.38} mode="in" n={120} spread={950} seed="s5" />
        <Spark at={0} x={W / 2} y={H * 0.38} scale={1.25} out={t(13.5)} />
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: H * 0.38,
            transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`,
            clipPath: `inset(0 ${50 - 50 * reveal}% 0 ${50 - 50 * reveal}%)`,
            filter: `drop-shadow(0 0 ${40 * (1 - reveal) + 12}px rgba(233,207,142,0.45))`,
          }}
        >
          <img src={L_logo_clair} style={{width: 640}} />
        </div>
        <div style={{position: 'absolute', top: H * 0.58, width: '100%', textAlign: 'center', color: C.blanc}}>
          <div style={{...big, fontSize: 92}}>
            <Word at={t(14.25)}>est </Word>
            <Word at={t(14.4)}>ce</Word>
          </div>
          <div style={{marginTop: 10}}>
            <Accent at={t(14.5)} size={168} color={C.orClair} stroke="underline" strokeColor={C.or}>
              trait d'union.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S6 */
const Row: React.FC<{at: number; label: string; sub: string}> = ({at, label, sub}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  const tick = prog(f, at + 5, 10);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '22px 26px',
        borderRadius: 22,
        background: tick > 0.5 ? 'rgba(201,162,75,0.12)' : 'rgba(27,42,65,0.04)',
        opacity: p,
        transform: `translateX(${(1 - p) * 60}px)`,
        marginTop: 16,
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 58,
          background: tick > 0 ? C.or : 'transparent',
          border: `4px solid ${C.or}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${0.8 + 0.2 * tick})`,
        }}
      >
        <svg width={32} height={32} viewBox="0 0 32 32">
          <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
        </svg>
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.marine}}>{label}</div>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: '#6B7280', marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};

const Node: React.FC<{at: number; label: string; sub: string; x: number}> = ({at, label, sub, x}) => {
  const sp = useSpring(at, 12, 170);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        transform: `translateX(-50%) scale(${sp})`,
        textAlign: 'center',
        width: 330,
      }}
    >
      <div
        style={{
          width: 116,
          height: 116,
          margin: '0 auto',
          borderRadius: 116,
          background: C.marine,
          boxShadow: `0 0 0 ${10 * sp}px rgba(201,162,75,0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={56} height={56} viewBox="0 0 56 56">
          <path d="M28 50s16-15 16-27a16 16 0 0 0-32 0c0 12 16 27 16 27z" fill="none" stroke={C.orClair} strokeWidth={4.5} />
          <circle cx={28} cy={23} r={6} fill={C.orClair} />
        </svg>
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.marine, marginTop: 18}}>{label}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 25, color: '#6B7280', marginTop: 6, lineHeight: 1.3, whiteSpace: 'pre-line'}}>{sub}</div>
    </div>
  );
};

export const S6: React.FC<{dur: number}> = ({dur}) => {
  const st = 15.6;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const inn = prog(f, 0, 18);
  const link = prog(f, t(16.9), 22, Easing.bezier(0.6, 0, 0.2, 1));
  // caméra : inclinaison 3D qui se redresse, puis léger travelling
  const rx = interpolate(f, [0, 22, dur], [24, 6, 2], clamp);
  const ry = interpolate(f, [0, 22, t(18.3), t(19.2), dur], [-14, -6, -6, 4, 6], {...clamp, easing: ease});
  const sc = interpolate(f, [0, 22, dur], [0.82, 0.96, 1.04], clamp);
  const ty = interpolate(f, [t(18.2), t(19.0)], [0, -60], {...clamp, easing: ease});
  const packs = Math.round(interpolate(f, [t(18.45), t(19.1)], [0, 10], clamp));
  const k1 = useSpring(t(18.45), 13, 160);
  const k2 = useSpring(t(19.15), 13, 160);
  const progress = prog(f, t(20.55), 40);
  const toast = useSpring(t(21.2), 13, 160);
  const out = prog(f, dur - 8, 8);
  return (
    <AbsoluteFill style={{background: '#EDE6D9'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0) 60%)'}} />
      <AbsoluteFill style={{perspective: 1800, opacity: inn * (1 - out), filter: `blur(${out * 18}px)`}}>
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 250,
            width: W - 140,
            height: 1400,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc * (1 + out * 0.1)})`,
          }}
        >
          {/* fenêtre « espace client » */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 44,
              background: '#FFFFFF',
              boxShadow: '0 60px 120px rgba(27,42,65,0.28), 0 0 0 2px rgba(27,42,65,0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{height: 92, background: C.marine, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 14}}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{width: 18, height: 18, borderRadius: 18, background: i === 0 ? C.or : 'rgba(255,255,255,0.25)'}} />
              ))}
              <div style={{marginLeft: 24, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.orClair, letterSpacing: 0.5}}>
                Espace client · Votre dossier
              </div>
            </div>
            <div style={{position: 'absolute', top: 92, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
              <div style={{transform: `translateY(${ty}px)`, padding: '56px 52px'}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.orFonce, letterSpacing: 4, textTransform: 'uppercase'}}>
                  Votre équipe
                </div>
                <div style={{position: 'relative', height: 360, marginTop: 40}}>
                  <svg width={W - 244} height={140} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>
                    <line x1={210} y1={58} x2={(W - 244) - 210} y2={58} stroke="rgba(27,42,65,0.12)" strokeWidth={10} strokeLinecap="round" />
                    <line
                      x1={210}
                      y1={58}
                      x2={210 + ((W - 244) - 420) * link}
                      y2={58}
                      stroke={C.or}
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Node at={t(15.85)} x={190} label="Europe" sub={'Cadrage et suivi,\nun seul interlocuteur'} />
                  <Node at={t(17.0)} x={(W - 244) - 190} label="Algérie" sub={'Présence sur place,\naux guichets'} />
                </div>
                <div style={{display: 'flex', gap: 28, marginTop: 30}}>
                  <div style={{flex: 1, borderRadius: 30, background: C.marine, padding: '34px 36px', transform: `scale(${k1})`, transformOrigin: 'left top'}}>
                    <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 150, color: C.orClair, lineHeight: 0.9, fontVariantNumeric: 'lining-nums'}}>{packs}</div>
                    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.blanc, marginTop: 10}}>packs de services</div>
                  </div>
                  <div style={{flex: 1, borderRadius: 30, background: '#F6F1E7', padding: '34px 36px', transform: `scale(${k2})`, transformOrigin: 'left top'}}>
                    <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 150, color: C.marine, lineHeight: 0.9, fontVariantNumeric: 'lining-nums'}}>1</div>
                    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.marine, marginTop: 10}}>seul interlocuteur</div>
                  </div>
                </div>
                <div style={{marginTop: 46, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.orFonce, letterSpacing: 4, textTransform: 'uppercase'}}>
                  Suivi de votre dossier
                </div>
                <div style={{height: 16, borderRadius: 16, background: 'rgba(27,42,65,0.08)', marginTop: 22, overflow: 'hidden'}}>
                  <div style={{width: `${8 + 92 * progress}%`, height: '100%', background: `linear-gradient(90deg, ${C.orFonce}, ${C.orClair})`, borderRadius: 16}} />
                </div>
                <Row at={t(20.55)} label="Cadrage du projet" sub="Appel découverte, feuille de route" />
                <Row at={t(20.85)} label="Démarches lancées" sub="Consulat, notaire, administrations" />
                <Row at={t(21.15)} label="Point d'étape envoyé" sub="Avec les justificatifs" />
              </div>
            </div>
          </div>
          {/* notification flottante */}
          <div
            style={{
              position: 'absolute',
              right: -24,
              bottom: -64,
              transform: `translateZ(80px) scale(${toast}) translateY(${(1 - toast) * 40}px)`,
              background: C.marine,
              borderRadius: 26,
              padding: '26px 32px',
              display: 'flex',
              gap: 20,
              alignItems: 'center',
              boxShadow: '0 30px 60px rgba(27,42,65,0.4)',
            }}
          >
            <div style={{width: 20, height: 20, borderRadius: 20, background: C.or, boxShadow: '0 0 18px rgba(233,207,142,0.9)'}} />
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.blanc}}>
              Nouveau point d'étape <span style={{color: C.orClair}}>· à l'instant</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S7 */
export const S7: React.FC<{dur: number}> = ({dur}) => {
  const st = 22.3;
  const t = (x: number) => s(x - st);
  return (
    <SceneShell dur={dur} zoom={0.06}>
      <DarkStage glow={0.9} glowY={62} glowX={50} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: C.blanc}}>
        <div style={{...big, fontSize: 112}}>
          <Word at={t(22.55)}>Vous </Word>
          <Word at={t(22.75)}>restez</Word>
        </div>
        <div style={{...big, fontSize: 112}}>
          <Word at={t(22.98)}>chez </Word>
          <Word at={t(23.15)}>vous.</Word>
        </div>
        <div style={{...big, fontSize: 112, marginTop: 90, color: C.pierre}}>
          <Word at={t(23.68)}>Nous </Word>
          <Word at={t(23.9)}>gérons</Word>
        </div>
        <div style={{marginTop: 8}}>
          <Accent at={t(24.1)} size={190} color={C.orClair} stroke="underline" strokeColor={C.or}>
            le reste.
          </Accent>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ S8 */
export const S8: React.FC<{dur: number}> = ({dur}) => {
  const st = 25.15;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(25.4), 24, Easing.bezier(0.6, 0, 0.2, 1));
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
      <Particles at={t(25.2)} dur={s(0.6)} cx={W / 2} cy={H * 0.36} mode="in" n={90} spread={800} seed="s8" />
      <div
        style={{
          position: 'absolute',
          left: W / 2,
          top: H * 0.36,
          transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * reveal})`,
          clipPath: `inset(0 ${50 - 50 * reveal}% 0 ${50 - 50 * reveal}%)`,
        }}
      >
        <img src={L_logo_couleur} style={{width: 700}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.555, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 64, fontWeight: 700, letterSpacing: -1}}>
          <Word at={t(26.8)}>Le </Word>
          <Word at={t(26.95)}>trait </Word>
          <Word at={t(27.1)}>d'union </Word>
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
          position: 'absolute',
          top: H * 0.79,
          left: '50%',
          transform: `translate(-50%,-50%) scale(${btn})`,
          background: C.marine,
          borderRadius: 999,
          padding: '34px 64px',
          overflow: 'hidden',
          boxShadow: '0 24px 50px rgba(27,42,65,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.orClair}}>Réserver un appel découverte →</span>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${shine}%`,
            width: '22%',
            background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: H * 0.865,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 42,
          color: C.marine,
          letterSpacing: 2,
          opacity: url,
          transform: `translateY(${(1 - url) * 20}px)`,
        }}
      >
        moconseildz.com
      </div>
    </AbsoluteFill>
  );
};
