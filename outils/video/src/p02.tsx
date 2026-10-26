// Série « Un pack en 30 secondes » — vidéo 2 : Pack Suivi de Société (voix « Femme » ElevenLabs, générée le 26/10/2026)
// Temps en secondes de la voix (alignement /home/claude/p02/align.json, contrôlé par les pauses).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, Sequence, useCurrentFrame} from 'remotion';
import {L_logo_clair} from './assets';
import * as P from './photos';
import {Accent, C, clamp, ease, easeIn, Finish, Particles, prog, s, SANS, SERIF, Spark, useSpring, Word} from './kit';
import {Mask, Photo, Pin} from './scenes4';
import {Globe} from './globe';

const W = 1080;
const H = 1920;
const OR_TEXTE = '#9C7726';
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04};
const eyebrow: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase'};
const HALF = 957;
type Sc = React.FC<{st: number; dur: number}>;
const useT = (st: number) => (x: number) => s(x - st);
const NIGHT_BG = 'radial-gradient(circle at 50% 42%, #1B2C47 0%, #111C2F 45%, #0A101C 100%)';

/* ===================================================== 1. Accroche : globe 3D, Alger puis l'Europe */
const B1: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const out = interpolate(f, [t(3.38), t(3.62)], [0, 1], {...clamp, easing: easeIn});
  const txt1Out = t(2.02);
  return (
    <AbsoluteFill style={{background: NIGHT_BG, transform: `scale(${1 + out * 0.6})`, filter: `blur(${out * 22}px)`, opacity: 1 - out * 0.9}}>
      <Globe
        keys={[
          {f: 0, lat: 31.0, lon: 12.0, dist: 1.75, y: -0.12},
          {f: t(1.9), lat: 36.2, lon: 3.4, dist: 2.05, y: -0.12},
          {f: t(3.2), lat: 42.6, lon: 2.7, dist: 2.35, y: -0.1},
          {f: t(3.7), lat: 43.0, lon: 2.6, dist: 2.2, y: -0.1},
        ]}
        pinA={t(0.5)}
        pinB={t(2.73)}
        arc={[t(2.15), t(2.95)]}
      />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,16,28,0.85) 0%, rgba(10,16,28,0.45) 26%, rgba(10,16,28,0) 42%)'}} />
      {/* bloc 1 */}
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', color: C.blanc}}>
        <Mask at={0} out={txt1Out} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 96}}>
            <Word at={t(0.11)}>Votre </Word>
            <Word at={t(0.5)}>société</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Word at={t(1.13)} style={{...big, fontSize: 96}}>en </Word>
            <Accent at={t(1.38)} size={168} color={C.orClair} stroke="underline" strokeColor={C.or}>
              Algérie…
            </Accent>
          </div>
        </Mask>
      </div>
      {/* bloc 2 */}
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{...big, fontSize: 96}}>
          <Word at={t(2.15)}>et </Word>
          <Word at={t(2.31)}>vous, </Word>
          <Word at={t(2.67)}>en</Word>
        </div>
        <div style={{marginTop: 4}}>
          <Accent at={t(2.73)} size={168} color={C.orClair} stroke="underline" strokeColor={C.or}>
            Europe ?
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== calendrier 3D (problème puis résultat) */
const MOIS = ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const Carrousel: React.FC<{rot: number; done: (i: number) => number; dim?: number; light?: boolean}> = ({rot, done, dim = 0, light}) => {
  const R = 600;
  return (
    <div style={{position: 'absolute', left: W / 2, top: 1000, perspective: 1700, perspectiveOrigin: '50% 35%', transform: 'scale(1.12)'}}>
      <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateX(-9deg) rotateY(${rot}deg)`}}>
        {MOIS.map((m, i) => {
          const a = (i * 360) / 12;
          const d = done(i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: -150, top: -200, width: 300, height: 400, borderRadius: 26,
                transform: `rotateY(${a}deg) translateZ(${R}px)`, backfaceVisibility: 'hidden',
                background: light ? '#FFFFFF' : 'linear-gradient(160deg, #F7F2E8, #E9DFC9)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.35)', overflow: 'hidden', filter: `brightness(${1 - 0.55 * dim})`,
              }}
            >
              <div style={{height: 86, background: C.marine, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.orClair, textTransform: 'uppercase'}}>{m}</span>
              </div>
              <div style={{textAlign: 'center', marginTop: 34, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 70, color: C.marine, lineHeight: 1}}>Déclaration</div>
              <div style={{textAlign: 'center', marginTop: 16, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: '#5E6675'}}>du mois</div>
              <div style={{position: 'absolute', left: 30, right: 30, bottom: 34, height: 74, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                background: d > 0.5 ? `linear-gradient(100deg, ${C.orFonce}, ${C.or})` : 'rgba(181,84,58,0.12)', border: d > 0.5 ? 'none' : '3px solid rgba(181,84,58,0.55)'}}>
                {d > 0.5 ? (
                  <>
                    <svg width={34} height={34} viewBox="0 0 32 32"><path d="M6 17l7 7 13-15" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#FFFFFF'}}>Déposée</span>
                  </>
                ) : (
                  <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#A24A33'}}>À déposer</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const B2: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.bezier(0.1, 0.6, 0.3, 1)});
  const speed = interpolate(f, [0, t(4.6), t(6.2), t(7.4)], [5.5, 3.2, 1.2, 0.3], clamp);
  let rot = 0;
  for (let i = 0; i < f; i++) rot -= interpolate(i, [0, t(4.6), t(6.2), t(7.4)], [5.5, 3.2, 1.2, 0.3], clamp);
  const dim = prog(f, t(6.15), 12);
  const head = 1 - prog(f, t(6.05), 8, easeIn);
  const clock = prog(f, t(7.25), 22);
  const line = prog(f, t(8.3), 9, Easing.bezier(0.6, 0, 0.2, 1));
  const toNight = prog(f, t(8.5), 5);
  return (
    <AbsoluteFill style={{background: NIGHT_BG, transform: `scale(${1.25 - 0.25 * (1 - enter)})`, opacity: 1 - enter * 0.8}}>
      <AbsoluteFill style={{opacity: 1 - toNight}}>
        <Particles at={0} dur={dur} cx={W / 2} cy={H * 0.55} mode="out" n={50} spread={900} seed="cal" boxW={900} boxH={600} />
        <Carrousel rot={rot} done={() => 0} dim={dim} />
        <div style={{position: 'absolute', top: 220, width: '100%', textAlign: 'center', color: C.blanc, opacity: head, filter: `blur(${(1 - head) * 10}px)`}}>
          <div style={{...eyebrow, color: C.orClair, fontSize: 34}}>
            <Word at={t(3.76)}>Chaque mois</Word>
          </div>
          <div style={{...big, fontSize: 84, marginTop: 20}}>
            <Word at={t(4.52)}>des </Word>
            <Word at={t(4.61)}>déclarations</Word>
          </div>
          <div style={{marginTop: 2}}>
            <Accent at={t(5.39)} size={150} color={C.orClair} stroke="none">
              à déposer…
            </Accent>
          </div>
        </div>
        <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.5))'}}>
          <div style={{...big, fontSize: 84}}>
            <Word at={t(6.1)}>et </Word>
            <Word at={t(6.26)}>personne</Word>
          </div>
          <div style={{marginTop: 2}}>
            <Accent at={t(6.67)} size={160} color={C.orClair} stroke="underline" strokeColor={C.or}>
              sur place
            </Accent>
          </div>
          <div style={{...big, fontSize: 64, marginTop: 18, letterSpacing: -1.5, display: 'inline-flex', alignItems: 'center', gap: 22}}>
            <span>
              <Word at={t(7.29)}>pour </Word>
              <Word at={t(7.38)}>les </Word>
              <Word at={t(7.8)}>délais.</Word>
            </span>
            <svg width={86} height={86} viewBox="-60 -60 120 120" style={{opacity: prog(f, t(7.3), 8)}}>
              <circle r={50} fill="none" stroke={C.orClair} strokeWidth={7} />
              <line x1={0} y1={0} x2={0} y2={-34} stroke={C.blanc} strokeWidth={7} strokeLinecap="round" transform={`rotate(${clock * 720})`} />
              <line x1={0} y1={0} x2={22} y2={0} stroke={C.or} strokeWidth={7} strokeLinecap="round" transform={`rotate(${clock * 60})`} />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
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

/* ===================================================== 3. Plan signature : M et O Conseil */
const B3: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const photoIn = prog(f, 1, 12, ease);
  const reveal = prog(f, t(11.2), 20, Easing.bezier(0.6, 0, 0.2, 1));
  const lab = prog(f, t(11.75), 12);
  const out = interpolate(f, [t(12.42), t(12.7)], [0, 1], {...clamp, easing: easeIn});
  const glow = 0.7 + 0.3 * Math.sin(f / 5);
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.nuit, transform: `scale(${1 + out * 0.5})`, filter: `blur(${out * 20}px)`, opacity: 1 - out}}>
      <AbsoluteFill style={{opacity: photoIn}}>
        <Photo src={P.P_mains} w={1333} h={2000} zoom={1.2 - 0.12 * k} rot={-2 + 2 * k} oy={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(14,23,38,0.62)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 45% at 50% 50%, rgba(14,23,38,0) 0%, rgba(14,23,38,0.45) 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: HALF, height: 6, width: W, background: `linear-gradient(90deg, ${C.orFonce}, #F6E3AE 50%, ${C.orFonce})`, boxShadow: `0 0 ${26 * glow}px rgba(233,207,142,0.9), 0 0 ${70 * glow}px rgba(201,162,75,0.6)`}} />
      <Spark at={t(11.2)} x={W / 2} y={HALF + 3} scale={0.9} out={t(11.8)} />
      <Particles at={t(11.2)} dur={s(0.7)} cx={W / 2} cy={HALF} mode="out" n={90} spread={420} seed="p2s" boxW={500} boxH={20} />
      <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.55))'}}>
        <Mask at={0} out={t(9.72)} d={1} style={{overflow: 'visible'}}>
          <div style={{...big, fontSize: 88}}>
            <Word at={t(8.67)}>Tenir </Word>
            <Word at={t(8.98)}>ces</Word>
          </div>
          <div style={{marginTop: 4}}>
            <Accent at={t(9.16)} size={170} color={C.orClair} stroke="underline" strokeColor={C.or}>
              délais,
            </Accent>
          </div>
        </Mask>
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', color: C.blanc, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.55))'}}>
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
      <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))'}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Europe</div>
      </div>
      <div style={{position: 'absolute', top: 1590, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lab, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))'}}>
        <Pin size={44} />
        <div style={{...eyebrow, color: C.blanc, fontSize: 30}}>Algérie</div>
      </div>
      <div style={{position: 'absolute', left: W / 2, top: 1215, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * reveal})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 600, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1440, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.9)', opacity: lab, transform: `translateY(${(1 - lab) * 16}px)`}}>
        Une équipe en Europe, une équipe en Algérie
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 4. Le pack : cartes en 3D (UI world) */
const CARTES = [
  {l: 'Comptabilité tenue', s: 'par notre expert-comptable', at: 14.66, z: 120, x: -40, y: -250},
  {l: 'Déclarations déposées', s: 'à chaque échéance', at: 16.3, z: 220, x: 40, y: 0},
  {l: 'Point de suivi', s: 'avec les justificatifs', at: 16.8, z: 120, x: -30, y: 250},
];
const B4: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 12], [0, 1], {...clamp, easing: inOut});
  const orbit = interpolate(f, [0, dur], [-14, 10], clamp);
  const aside = interpolate(f, [t(17.4), t(17.8)], [0, 1], {...clamp, easing: inOut});
  const push = interpolate(f, [t(19.2), t(19.5)], [0, 1], {...clamp, easing: inOut});
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - enter) * 100}% 0 0 0)`, transform: `translateX(${-push * W}px)`}}>
      <AbsoluteFill style={{background: C.pierre}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.9), rgba(255,255,255,0) 62%)'}} />
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', opacity: 1 - aside, transform: `translateY(${-aside * 60}px)`}}>
        <div style={{...eyebrow, color: OR_TEXTE, fontSize: 32}}>
          <Word at={t(12.67)}>Avec le pack</Word>
        </div>
        <div style={{marginTop: 6}}>
          <Accent at={t(13.3)} size={120} color={C.marine} stroke="none">
            Suivi de Société
          </Accent>
        </div>
      </div>
      {/* cartes flottantes */}
      <div style={{position: 'absolute', left: W / 2, top: 1030, perspective: 1400, opacity: 1 - aside, transform: `translateX(${-aside * 300}px)`}}>
        <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateY(${orbit}deg) rotateX(6deg)`}}>
          {[-9, 0, 9].map((r, j) => {
            const sp = useSpring(t(13.1) + j * 3, 14, 110);
            return (
              <div key={'f' + j} style={{position: 'absolute', left: -230, top: -310, width: 460, height: 600, borderRadius: 18, background: '#FFFFFF', boxShadow: '0 30px 70px rgba(27,42,65,0.18)',
                transform: `translateZ(${-260 - j * 40}px) rotateZ(${r * sp}deg) translateY(${(1 - sp) * 400}px)`, opacity: Math.min(1, sp * 1.5) * 0.92, padding: 46, boxSizing: 'border-box'}}>
                <div style={{width: 120, height: 14, borderRadius: 7, background: C.or, opacity: 0.8}} />
                {Array.from({length: 9}).map((_, q) => (
                  <div key={q} style={{marginTop: 26, height: 10, borderRadius: 5, width: `${55 + random('fl' + j + q) * 40}%`, background: 'rgba(27,42,65,0.12)'}} />
                ))}
              </div>
            );
          })}
          {CARTES.map((c, i) => {
            const sp = useSpring(t(c.at), 13, 120);
            const tick = prog(f, t(c.at) + 6, 10);
            const bob = Math.sin((f + i * 20) / 22) * 10;
            if (f < t(c.at)) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute', left: -430 + c.x, top: -95 + c.y + bob, width: 860, height: 190, borderRadius: 30, background: '#FFFFFF',
                  boxShadow: '0 30px 70px rgba(27,42,65,0.22)', transform: `translateZ(${-500 + (c.z + 500) * sp}px)`, opacity: Math.min(1, sp * 1.6),
                  display: 'flex', alignItems: 'center', gap: 34, padding: '0 46px', border: '2px solid rgba(201,162,75,0.35)',
                }}
              >
                <div style={{width: 92, height: 92, borderRadius: 92, flexShrink: 0, background: tick > 0 ? `linear-gradient(135deg, ${C.or}, ${C.orFonce})` : C.pierre, border: `4px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width={46} height={46} viewBox="0 0 32 32"><path d="M6 17l7 7 13-15" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} /></svg>
                </div>
                <div>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.marine, letterSpacing: -1}}>{c.l}</div>
                  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: '#5E6675', marginTop: 4}}>{c.s}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* sans que vous ayez à vous déplacer */}
      <div style={{position: 'absolute', top: 700, width: '100%', textAlign: 'center', color: C.marine}}>
        <div style={{...big, fontSize: 104}}>
          <Word at={t(17.49)}>Sans </Word>
          <Word at={t(17.87)}>vous</Word>
        </div>
        <div style={{marginTop: 6}}>
          <Accent at={t(18.43)} size={180} color={OR_TEXTE} stroke="underline" strokeColor={C.marine}>
            déplacer.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 5. Résultat : chaque mois, une société à jour */
const B5: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = interpolate(f, [0, 9], [1, 0], {...clamp, easing: inOut});
  let rot = 0;
  for (let i = 0; i < f; i++) rot -= interpolate(i, [0, s(1.2), dur], [4.5, 1.6, 0.8], clamp);
  // les cartes passent à « Déposée » une à une, de face
  const done = (i: number) => (f >= t(19.9) + i * 2.6 ? 1 : 0);
  const out = interpolate(f, [t(22.95), t(23.2)], [0, 1], {...clamp, easing: easeIn});
  return (
    <AbsoluteFill style={{background: NIGHT_BG, transform: `translateX(${enter * W}px) scale(${1 + out * 0.4})`, filter: `blur(${out * 18}px)`, opacity: 1 - out * 0.8}}>
      <Particles at={0} dur={dur} cx={W / 2} cy={H * 0.55} mode="out" n={60} spread={900} seed="cal2" boxW={900} boxH={600} />
      <Carrousel rot={rot} done={done} light />
      <div style={{position: 'absolute', top: 220, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{...eyebrow, color: C.orClair, fontSize: 32}}>
          <Word at={t(19.63)}>Chaque mois, </Word>
          <Word at={t(20.23)}>ce que vous obtenez</Word>
        </div>
        <div style={{...big, fontSize: 92, marginTop: 24}}>
          <Word at={t(21.71)}>une </Word>
          <Word at={t(21.88)}>société</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(22.34)} size={176} color={C.orClair} stroke="underline" strokeColor={C.or}>
            à jour.
          </Accent>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 6. Vous restez chez vous (Europe), nous gérons le reste (Alger) */
const B6: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const enter = prog(f, 0, 10);
  return (
    <AbsoluteFill style={{background: NIGHT_BG, opacity: enter}}>
      <Globe
        keys={[
          {f: 0, lat: 46, lon: 6, dist: 2.1, y: -0.12},
          {f: t(24.25), lat: 41.5, lon: 3.2, dist: 2.35, y: -0.1},
          {f: dur, lat: 39, lon: 2.6, dist: 2.25, y: -0.1},
        ]}
        pinA={0}
        pinB={0}
        arc={[0, 1]}
      />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,16,28,0.8) 0%, rgba(10,16,28,0.2) 26%, rgba(10,16,28,0) 40%, rgba(10,16,28,0) 66%, rgba(10,16,28,0.75) 84%)'}} />
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{...eyebrow, color: C.orClair, fontSize: 28, marginBottom: 14, opacity: prog(f, t(23.19), 10)}}>Europe</div>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(23.19)}>Vous </Word>
          <Word at={t(23.42)}>restez</Word>
        </div>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(23.68)}>chez </Word>
          <Word at={t(23.88)}>vous.</Word>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1420, width: '100%', textAlign: 'center', color: C.blanc}}>
        <div style={{...big, fontSize: 92}}>
          <Word at={t(24.29)}>Nous </Word>
          <Word at={t(24.45)}>gérons</Word>
        </div>
        <div style={{marginTop: 2}}>
          <Accent at={t(24.7)} size={168} color={C.orClair} stroke="underline" strokeColor={C.or}>
            le reste.
          </Accent>
        </div>
        <div style={{...eyebrow, color: C.orClair, fontSize: 28, marginTop: 6, opacity: prog(f, t(24.29), 10)}}>Algérie</div>
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================== 7. Carte de fin nuit et or */
const B7: Sc = ({st, dur}) => {
  const f = useCurrentFrame();
  const t = useT(st);
  const bg = prog(f, 0, 14);
  const reveal = prog(f, t(25.62), 22, Easing.bezier(0.6, 0, 0.2, 1));
  const pack = prog(f, t(26.3), 14);
  const btn = useSpring(t(26.4), 12, 150);
  const url = prog(f, t(26.8), 14);
  const shine = interpolate(f, [t(27.3), t(28.1)], [-30, 130], clamp);
  const breathe = 1 + 0.012 * Math.sin(f / 18);
  const glowAlg = 0.65 + 0.35 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${bg * 150}% at 50% 50%)`, background: C.nuit}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, #22344F 0%, #16243A 38%, #0E1726 70%, #0A101C 100%)'}} />
      </AbsoluteFill>
      <Particles at={t(25.5)} dur={s(0.6)} cx={W / 2} cy={H * 0.24} mode="in" n={90} spread={800} seed="p2e" />
      <div style={{position: 'absolute', left: W / 2, top: H * 0.24, transform: `translate(-50%,-50%) scale(${(0.9 + 0.1 * reveal) * breathe})`}}>
        <div style={{clipPath: `inset(-5% ${50 - 50 * reveal}% -5% ${50 - 50 * reveal}%)`}}>
          <Img src={L_logo_clair} style={{width: 680, display: 'block'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.385, width: '100%', textAlign: 'center'}}>
        <div style={{...big, fontSize: 60, fontWeight: 700, letterSpacing: -1, color: 'rgba(255,255,255,0.92)'}}>
          <Word at={t(25.75)}>Le </Word>
          <Word at={t(25.82)}>trait </Word>
          <Word at={t(25.9)}>d’union </Word>
          <Word at={t(25.98)}>avec </Word>
          <Word at={t(26.06)}>votre</Word>
        </div>
        <div style={{marginTop: 4, filter: `drop-shadow(0 0 ${22 * glowAlg}px rgba(233,207,142,0.55))`}}>
          <Accent at={t(26.14)} size={160} color={C.orClair} stroke="none">
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
          background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, borderRadius: 999, padding: '34px 64px', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(201,162,75,0.35)', whiteSpace: 'nowrap',
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
export const P02_DUREE = 29.4;
const PLAN: [number, number, Sc][] = [
  [0, 3.65, B1],
  [3.4, 8.75, B2],
  [8.55, 12.72, B3],
  [12.5, 19.55, B4],
  [19.25, 23.25, B5],
  [23.0, 25.7, B6],
  [25.45, P02_DUREE, B7],
];

export const Pack02Suivi: React.FC = () => (
  <AbsoluteFill style={{background: C.nuit}}>
    {PLAN.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp st={a} dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
