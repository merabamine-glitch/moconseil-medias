import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {L_logo_couleur} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, Particles, prog, s, SANS, SERIF, useSpring, Word} from './kit';
import {Mask, Photo} from './scenes2';

const W = 1080;
const H = 1920;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.06};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};

/* ============================================================ 1. Accroche (0 → 4,6) */
const C1: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  const out = interpolate(f, [s(4.28), s(4.6)], [0, 1], {...clamp, easing: easeIn});
  const eb = prog(f, s(0.15), 12);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + out * 0.45})`, filter: `blur(${out * 22}px)`, opacity: 1 - out}}>
      <Photo src={P.P_frontdemer} w={1200} h={1600} ox={0.35} zoom={1.2 - 0.12 * k} dx={30 - 60 * k} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.78) 0%, rgba(14,23,38,0.55) 30%, rgba(14,23,38,0.05) 52%, rgba(14,23,38,0) 70%, rgba(14,23,38,0.35) 100%)'}} />
      <div style={{position: 'absolute', left: 80, top: 230, color: C.blanc}}>
        <div style={{...eyebrow, color: C.orClair, opacity: eb, transform: `translateY(${(1 - eb) * 16}px)`, display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 54 * eb, height: 3, background: C.orClair}} />
          Achat immobilier en Algérie
        </div>
        <div style={{...big, fontSize: 104, marginTop: 34}}>
          <Word at={s(0.35)}>Avant </Word>
          <Word at={s(0.6)}>d’acheter,</Word>
        </div>
        <div style={{...big, fontSize: 104}}>
          <Word at={s(1.2)}>vérifiez</Word>
        </div>
        <div style={{marginTop: 6, marginLeft: -8}}>
          <Accent at={s(1.55)} size={200} color={C.orClair} stroke="ellipse" strokeColor={C.or}>
            la date
          </Accent>
        </div>
        <div style={{...big, fontSize: 84, marginTop: 18, fontWeight: 700}}>
          <Word at={s(2.3)}>de </Word>
          <Word at={s(2.45)}>ce </Word>
          <Word at={s(2.6)}>document.</Word>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================ 2 + 3. Le document (4,3 → 12,95) */
const Check: React.FC<{p: number; size?: number}> = ({p, size = 58}) => (
  <div
    style={{
      width: size, height: size, borderRadius: 12, border: `4px solid ${C.or}`, background: p > 0 ? C.or : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * p})`, flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 32 32">
      <path d="M6 17l7 7 13-15" fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  </div>
);

const Bar: React.FC<{w: number; o?: number}> = ({w, o = 0.13}) => (
  <div style={{width: w, height: 14, borderRadius: 7, background: `rgba(27,42,65,${o})`}} />
);

const ROWS = [
  {l: 'Hypothèque', at: 9.0},
  {l: 'Saisie', at: 9.75},
  {l: 'Mesure conservatoire', at: 10.5},
];

const C2: React.FC<{dur: number}> = ({dur}) => {
  const st = 4.3;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 9], [0, 1], {...clamp, easing: ease});
  const doc = useSpring(t(4.55), 15, 110);
  const zoom = interpolate(f, [t(8.2), t(8.9)], [0, 1], {...clamp, easing: inOut});
  const push = interpolate(f, [t(12.62), t(12.95)], [0, 1], {...clamp, easing: inOut});
  const circle = prog(f, t(11.45), 20, Easing.bezier(0.45, 0, 0.2, 1));
  const docScale = 1 + 0.22 * zoom;
  const docY = interpolate(zoom, [0, 1], [0, -250]);
  const tilt = interpolate(doc, [0, 1], [38, 7]) - 5 * zoom;
  const rotZ = interpolate(doc, [0, 1], [-9, -2.5]) + 1.5 * zoom;
  return (
    <AbsoluteFill style={{opacity: enter, transform: `translateX(${-push * W}px) scale(${1.12 - 0.12 * enter})`}}>
      <AbsoluteFill style={{background: C.nuit}} />
      <Photo src={P.P_patrimoine} w={1280} h={1600} zoom={1.2 + 0.08 * zoom} filter="blur(16px)" />
      <AbsoluteFill style={{background: 'rgba(14,23,38,0.66)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 62%, rgba(201,162,75,0.22), rgba(201,162,75,0) 50%)'}} />
      {/* titres */}
      <div style={{position: 'absolute', top: 205, width: '100%', textAlign: 'center', color: C.blanc}}>
        <Mask at={0} out={t(8.1)} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 80}}>
            <Word at={t(4.7)}>Le</Word>
          </div>
          <div style={{marginTop: 2}}>
            <Accent at={t(4.9)} size={150} color={C.orClair} stroke="underline" strokeColor={C.or}>
              certificat négatif,
            </Accent>
          </div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.92)', marginTop: 18}}>
            <Word at={t(5.7)}>délivré </Word>
            <Word at={t(5.85)}>par </Word>
            <Word at={t(5.98)}>la </Word>
            <Word at={t(6.1)}>conservation </Word>
            <Word at={t(6.3)}>foncière.</Word>
          </div>
        </Mask>
      </div>
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center', color: C.blanc}}>
        <Mask at={t(8.3)} out={t(11.15)} d={12}>
          <div style={{...big, fontSize: 92}}>Il atteste</div>
        </Mask>
        <Mask at={t(8.42)} out={t(11.15)} d={12}>
          <div style={{...big, fontSize: 92}}>l’absence de :</div>
        </Mask>
      </div>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', color: C.blanc}}>
        <Mask at={t(11.3)} d={12}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22}}>
            <span style={{...big, fontSize: 88}}>Et surtout,</span>
            <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 124, color: C.orClair, letterSpacing: -1}}>sa date.</span>
          </div>
        </Mask>
      </div>
      {/* le document */}
      <AbsoluteFill style={{perspective: 1700}}>
        <div
          style={{
            position: 'absolute', left: (W - 740) / 2, top: 760, width: 740, height: 940,
            transform: `translateY(${(1 - doc) * 1100 + docY}px) rotateX(${tilt}deg) rotateZ(${rotZ}deg) scale(${docScale})`,
            transformOrigin: '50% 30%', borderRadius: 18, background: 'linear-gradient(170deg, #FFFFFF 0%, #FBF7EE 100%)',
            boxShadow: '0 50px 110px rgba(0,0,0,0.45), 0 0 0 1px rgba(27,42,65,0.06)', overflow: 'hidden', padding: '54px 58px', boxSizing: 'border-box',
          }}
        >
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 12, background: `linear-gradient(90deg, ${C.orFonce}, ${C.orClair}, ${C.orFonce})`}} />
          <div style={{...eyebrow, fontSize: 22, letterSpacing: 6, color: 'rgba(27,42,65,0.5)'}}>Conservation foncière</div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 82, color: C.marine, marginTop: 14, lineHeight: 1}}>Certificat négatif</div>
          <div style={{height: 2, background: 'rgba(201,162,75,0.6)', marginTop: 26, width: 180}} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34}}>
            <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: 'rgba(27,42,65,0.55)', width: 120}}>Bien</div>
              <Bar w={380} />
            </div>
            <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: 'rgba(27,42,65,0.55)', width: 120}}>Titre</div>
              <Bar w={300} />
            </div>
          </div>
          {/* lignes cochées */}
          <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', gap: 22}}>
            {ROWS.map((r, i) => {
              const p = prog(f, t(r.at), 12);
              const tag = useSpring(t(r.at) + 6, 12, 180);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 24, padding: '16px 20px', borderRadius: 14,
                    background: p > 0.3 ? 'rgba(201,162,75,0.13)' : 'rgba(27,42,65,0.035)',
                  }}
                >
                  <Check p={p} />
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.marine, flex: 1, letterSpacing: -0.5}}>{r.l}</div>
                  <div
                    style={{
                      fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.blanc, background: C.marine, borderRadius: 999,
                      padding: '8px 18px', transform: `scale(${tag})`, opacity: Math.min(1, tag * 2),
                    }}
                  >
                    aucune
                  </div>
                </div>
              );
            })}
          </div>
          {/* date */}
          <div style={{position: 'absolute', left: 58, bottom: 62, display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: 'rgba(27,42,65,0.55)'}}>Délivré le</div>
            <div style={{position: 'relative', fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.marine, letterSpacing: 3}}>
              __ / __ / ____
              <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{position: 'absolute', left: '-14%', top: '-55%', width: '128%', height: '210%', overflow: 'visible'}}>
                <path
                  d="M330 18 C 120 10, 18 60, 26 108 C 36 170, 250 190, 420 176 C 560 164, 600 110, 570 70 C 540 30, 420 14, 300 22 L 248 30"
                  fill="none" stroke={C.or} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle}
                />
              </svg>
            </div>
          </div>
          <div style={{position: 'absolute', right: 58, bottom: 52, width: 120, height: 120, borderRadius: 120, border: '3px dashed rgba(27,42,65,0.18)'}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================ 4. Récent, vérifié (12,6 → 16,75) */
const C4: React.FC<{dur: number}> = ({dur}) => {
  const st = 12.6;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: inOut});
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{transform: `translateX(${enter * W}px)`}}>
      <Photo src={P.P_stylo} w={901} h={1600} oy={0.12} zoom={1.3 - 0.12 * k} dx={-20 + 30 * k} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(14,23,38,0.72) 0%, rgba(14,23,38,0.45) 30%, rgba(14,23,38,0) 46%, rgba(14,23,38,0.78) 63%, rgba(14,23,38,0.96) 100%)'}} />
      <div style={{position: 'absolute', left: 80, top: 230, color: C.blanc}}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(12.95)}>Exigez </Word>
          <Word at={t(13.15)}>un</Word>
        </div>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(13.35)}>certificat</Word>
        </div>
        <div style={{marginTop: 4, marginLeft: -6}}>
          <Accent at={t(13.65)} size={190} color={C.orClair} stroke="underline" strokeColor={C.or}>
            récent,
          </Accent>
        </div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 1290, color: C.blanc}}>
        <div style={{...big, fontSize: 72, fontWeight: 700, letterSpacing: -1.5}}>
          <Word at={t(14.45)}>vérifié </Word>
          <Word at={t(14.62)}>par </Word>
          <Word at={t(14.75)}>votre</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(14.9)} size={140} color={C.orClair} stroke="none">
            notaire.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================ 5. La parole ne suffit pas (16,4 → 20,55) */
const C5: React.FC<{dur: number}> = ({dur}) => {
  const st = 16.4;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const wipe = interpolate(f, [0, 10], [0, 1], {...clamp, easing: inOut});
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  const bubble = useSpring(t(16.75), 13, 150);
  const strike = prog(f, t(18.05), 12, Easing.bezier(0.6, 0, 0.2, 1));
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
      <AbsoluteFill style={{transform: `translateY(${(1 - wipe) * 160}px)`}}>
        <Photo src={P.P_residence} w={1067} h={1600} zoom={1.14 - 0.08 * k} ox={0.6} />
        <AbsoluteFill style={{background: 'rgba(14,23,38,0.7)'}} />
        {/* bulle */}
        <div
          style={{
            position: 'absolute', left: 110, top: 300, width: W - 220, transform: `scale(${bubble})`, transformOrigin: '20% 100%',
            opacity: Math.min(1, bubble * 1.5) * (1 - 0.35 * strike),
          }}
        >
          <div style={{background: C.pierre, borderRadius: 40, padding: '52px 56px 46px', boxShadow: '0 30px 70px rgba(0,0,0,0.35)', position: 'relative'}}>
            <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 70, color: C.marine, lineHeight: 1.08}}>
              « Tout est en règle, faites-moi confiance. »
            </div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: 'rgba(27,42,65,0.55)', marginTop: 20, letterSpacing: 1}}>Le vendeur, ou l’agence</div>
            <svg width={70} height={60} style={{position: 'absolute', left: 90, bottom: -48}}>
              <path d="M0 0 L70 0 L10 58 Z" fill={C.pierre} />
            </svg>
            {/* trait barré */}
            <div
              style={{
                position: 'absolute', left: 30, top: '46%', height: 10, width: `${strike * 92}%`, borderRadius: 10,
                background: `linear-gradient(90deg, ${C.orFonce}, ${C.or})`, transform: 'rotate(-6deg)', transformOrigin: '0 50%',
                boxShadow: '0 0 16px rgba(201,162,75,0.6)',
              }}
            />
          </div>
        </div>
        <div style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', color: C.blanc}}>
          <div style={{...big, fontSize: 78, letterSpacing: -2}}>
            <Word at={t(17.0)}>La </Word>
            <Word at={t(17.12)}>parole </Word>
            <Word at={t(17.3)}>du </Word>
            <Word at={t(17.42)}>vendeur</Word>
          </div>
          <div style={{...big, fontSize: 78, letterSpacing: -2}}>
            <Word at={t(17.6)}>ou </Word>
            <Word at={t(17.72)}>de </Word>
            <Word at={t(17.84)}>l’agence</Word>
          </div>
          <div style={{marginTop: 10}}>
            <Accent at={t(18.3)} size={142} color={C.orClair} stroke="underline" strokeColor={C.or}>
              ne le remplace pas.
            </Accent>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================ 6. Appel à l'action (20,2 → 25,5) */
const C6: React.FC<{dur: number}> = ({dur}) => {
  const st = 20.2;
  const t = (x: number) => s(x - st);
  const f = useCurrentFrame();
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(20.45), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const gold = prog(f, t(20.95), 16, Easing.bezier(0.6, 0, 0.2, 1));
  const eb = prog(f, t(21.15), 12);
  const btn = useSpring(t(22.6), 12, 150);
  const save = prog(f, t(23.2), 14);
  const shine = interpolate(f, [t(23.4), t(24.2)], [-30, 130], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F7F1E5 42%, #EADCC0 100%)', clipPath: `circle(${bg * 150}% at 50% 50%)`}} />
      <Particles at={t(20.25)} dur={s(0.6)} cx={W / 2} cy={H * 0.25} mode="in" n={80} spread={760} seed="c6" />
      <div
        style={{
          position: 'absolute', left: W / 2, top: H * 0.25, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * reveal})`,
          clipPath: `inset(0 ${50 - 50 * reveal}% 0 ${50 - 50 * reveal}%)`,
        }}
      >
        <Img src={L_logo_couleur} style={{width: 560}} />
      </div>
      <div
        style={{
          position: 'absolute', left: W / 2 - 150 * gold, top: H * 0.25 + 165, width: 300 * gold, height: 5, borderRadius: 5,
          background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE, ${C.orFonce})`, boxShadow: '0 0 16px rgba(201,162,75,0.55)',
        }}
      />
      <div style={{position: 'absolute', top: H * 0.42, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...eyebrow, color: OR_TEXTE, opacity: eb, transform: `translateY(${(1 - eb) * 14}px)`}}>Pack Achat Immobilier</div>
        <div style={{...big, fontSize: 70, marginTop: 30, letterSpacing: -2}}>
          <Word at={t(21.45)}>Vérification </Word>
          <Word at={t(21.65)}>écrite</Word>
        </div>
        <div style={{...big, fontSize: 70, letterSpacing: -2}}>
          <Word at={t(21.8)}>du </Word>
          <Word at={t(21.9)}>titre,</Word>
        </div>
        <div style={{marginTop: 6}}>
          <Accent at={t(22.1)} size={124} color={C.or} stroke="ellipse" strokeColor={C.marine}>
            avec votre notaire.
          </Accent>
        </div>
      </div>
      <div
        style={{
          position: 'absolute', top: H * 0.735, left: '50%', transform: `translate(-50%,-50%) scale(${btn})`, background: C.marine,
          borderRadius: 999, padding: '32px 60px', overflow: 'hidden', boxShadow: '0 24px 50px rgba(27,42,65,0.35)', whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 42, color: C.orClair}}>Appel découverte · lien en bio</span>
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '22%',
            background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute', top: H * 0.795, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
          opacity: save, transform: `translateY(${(1 - save) * 16}px)`,
        }}
      >
        <svg width={30} height={38} viewBox="0 0 30 38">
          <path d="M3 3h24v32l-12-9-12 9z" fill="none" stroke={C.marine} strokeWidth={3.5} strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: 'rgba(27,42,65,0.8)'}}>Enregistrez cette vidéo pour votre futur achat</div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================ composition */
const plan: [number, number, React.FC<{dur: number}>][] = [
  [4.3, 12.95, C2],
  [0, 4.62, C1],
  [12.6, 16.75, C4],
  [16.4, 20.55, C5],
  [20.2, 25.5, C6],
];

export const Certificat: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {plan.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
