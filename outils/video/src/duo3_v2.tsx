// Duo éducatif n°2 (fond sable et or) : « EURL ou SARL : pas obligé de s'associer » (série du 17/11/2026).
// Seul : EURL ; à plusieurs : SARL ; dans les deux cas responsabilité limitée aux apports (forme juridique stable).
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import {D3_V2 as d} from './duo3_data';
import {big, Bloc, Board, Dome, Duo, Estrade, eyebrow, FinCarte, Fond, Ico, Impact, NUIT, Nuage, OR_F, Panneau, Pastille, Pop, ramp, seg, SOL, TH} from './duoedu';
import {Accent, C, Particles, s, SANS, useSpring, Word} from './kit';
import {Maison} from './maison';

const th = 'or' as const;
const m = d.m;
const F2 = seg(d, 'F2'), H3 = seg(d, 'H3'), F4 = seg(d, 'F4'), H5 = seg(d, 'H5');
const HX = 540, HY = SOL - 6, HS = 0.92;
const NY = 960; // nuage

const Perso: React.FC<{c?: string; size?: number}> = ({c = '#24627F', size = 150}) => (
  <div style={{width: size, height: size, borderRadius: size, background: c, border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${NUIT}`}}><Ico k="personne" size={size * 0.62} color="#FFFFFF" /></div>
);
const Badge: React.FC<{l: string}> = ({l}) => (
  <div style={{padding: '10px 40px', borderRadius: 20, background: `linear-gradient(100deg, ${C.orFonce}, ${C.or} 45%, ${C.orClair})`, border: `5px solid ${NUIT}`, boxShadow: `0 8px 0 ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 96, color: NUIT, letterSpacing: 2}}>{l}</div>
);
const Titre: React.FC<{l: string}> = ({l}) => <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: NUIT, whiteSpace: 'nowrap'}}>{l}</div>;
/* tableau : seul → EURL ; à plusieurs → SARL */
const Formes: React.FC = () => (
  <Board at={m.f2_seul - 0.2} out={H3.s - 0.15} h={520}>
    <div style={{position: 'absolute', left: 450, top: 40, bottom: 40, width: 5, background: '#E3D8C2', borderRadius: 4}} />
    <Pop at={m.f2_seul} x={225} y={70}><Titre l="Seul" /></Pop>
    <Pop at={m.f2_seul + 0.1} x={225} y={235}><Perso /></Pop>
    <Pop at={m.f2_eurl - 0.15} x={225} y={420}><Badge l="EURL" /></Pop>
    <Pop at={m.f2_plusieurs - 0.05} x={675} y={70}><Titre l="À plusieurs" /></Pop>
    <Pop at={m.f2_plusieurs + 0.05} x={575} y={245}><Perso c="#2E7D4F" size={128} /></Pop>
    <Pop at={m.f2_plusieurs + 0.29} x={775} y={245}><Perso c="#C4512B" size={128} /></Pop>
    <Pop at={m.f2_plusieurs + 0.17} x={675} y={225}><Perso size={142} /></Pop>
    <Pop at={m.f2_sarl - 0.15} x={675} y={420}><Badge l="SARL" /></Pop>
  </Board>
);
/* tableau final : mon projet → EURL ou SARL */
const Choix: React.FC = () => (
  <Board at={H5.s} out={d.fin + 0.3} h={420}>
    <Pop at={H5.s + 0.15} x={450} y={80}><div style={{padding: '10px 34px', borderRadius: 999, background: NUIT, color: '#F2DDA2', fontFamily: SANS, fontWeight: 800, fontSize: 46, whiteSpace: 'nowrap'}}>Mon projet</div></Pop>
    <Fleches />
    <Pop at={m.h5_choisis} x={230} y={320}><div style={{position: 'relative'}}><Badge l="EURL" /><div style={{position: 'absolute', right: -30, top: -30}}><Pastille ok size={60} /></div></div></Pop>
    <Pop at={m.h5_choisis + 0.25} x={670} y={320}><div style={{position: 'relative'}}><Badge l="SARL" /><div style={{position: 'absolute', right: -30, top: -30}}><Pastille ok size={60} /></div></div></Pop>
  </Board>
);
const Fleches: React.FC = () => {
  const f = useCurrentFrame();
  const u = ramp(f, H5.s + 0.3, m.h5_choisis, Easing.bezier(0.4, 0, 0.2, 1));
  return (
    <svg width={900} height={420} style={{position: 'absolute', inset: 0}}>
      {[230, 670].map((x, i) => <path key={i} d={`M 450 118 C 450 200, ${x} 190, ${x} 262`} fill="none" stroke={OR_F} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />)}
    </svg>
  );
};

export const DuoEdu2: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const shake = f >= t(F2.s) && f < t(F2.s + 0.3) ? Math.sin(f * 3) * 8 : 0;
  const build = ramp(f, m.h3_biens - 0.15, m.h3_biens + 0.75, Easing.linear);
  const cloud = ramp(f, m.h3_mal - 0.55, m.h3_mal - 0.2) * (1 - ramp(f, H5.s, H5.s + 0.5, Easing.linear));
  const dome = useSpring(t(m.f4_responsabilite - 0.15), 12, 140);
  const domeOut = 1 - ramp(f, m.h5_projet, m.h5_projet + 0.6);
  const hit1 = m.h3_mal - 0.05;
  const jolt = f >= t(hit1) && f < t(hit1 + 0.5) ? Math.sin((f - t(hit1)) * 2.4) * 10 * Math.exp(-(f - t(hit1)) / 5) : 0;
  const glow = ramp(f, H5.s + 0.2, H5.s + 0.6);
  const bolts = [{t: hit1, len: 250}, {t: m.f4_limitee - 0.15, len: 150}, {t: m.f4_apports - 0.1, len: 150}];
  return (
    <AbsoluteFill style={{background: '#F6E7BE', transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo3-v2-bande-son.wav')} />
      <Fond theme={th} />
      <Panneau theme={th} at={0.45} out={m.f2_seul - 0.4} slides={[
        {at: 0.45, src: 'img/creation.jpg', l: 'Ma société'},
        {at: m.h1_associer - 0.2, src: 'img/mains.jpg', l: 'Des associés ?', mark: 'q'},
      ]} />
      <Panneau theme={th} at={H3.s - 0.05} out={F4.s - 0.15} slides={[{at: H3.s - 0.05, src: 'img/s5-cles.jpg', l: 'Mes biens personnels'}]} />
      <Formes />
      <Choix />
      <Estrade theme={th} />
      {/* biens personnels : la maison, l'orage, puis le dôme de la responsabilité limitée */}
      {f >= t(m.h3_biens - 0.15) && (
        <AbsoluteFill style={{transform: `translateX(${jolt}px)`}}>
          <Maison x={HX} y={HY} scale={HS} build={build} glow={glow} seed="v2" />
        </AbsoluteFill>
      )}
      <Dome x={HX} y={HY} p={f >= t(m.f4_responsabilite - 0.15) ? dome * domeOut : 0} w={640} h={540} hitAt={[bolts[1].t, bolts[2].t]} />
      <Nuage x={HX} y={NY} p={cloud} bolts={bolts} />
      {/* textes du haut */}
      <Bloc at={0.25} out={F2.s - 0.05}>
        <div style={{...big(th), fontSize: 80}}><Word at={t(m.h1_creer - 0.3)}>Pour créer ma société,</Word></div>
        <div style={{...big(th), fontSize: 92, marginTop: 6}}><Word at={t(m.h1_creer + 0.5)}>je suis obligé</Word></div>
        <div><Accent at={t(m.h1_associer - 0.35)} size={128} color={TH[th].accent} stroke="none">de m’associer ?</Accent></div>
      </Bloc>
      <Impact theme={th} at={F2.s} out={m.f2_seul - 0.08} l1="NON." size={190} />
      <Bloc at={m.f2_seul - 0.05} out={H3.s - 0.05}>
        <div style={{...big(th), fontSize: 74}}><Word at={t(m.f2_seul - 0.05)}>Un associé ?</Word></div>
        <div><Accent at={t(m.f2_seul + 0.25)} size={112} color={TH[th].accent} stroke="none">pas obligatoire.</Accent></div>
      </Bloc>
      <Bloc at={H3.s} out={F4.s - 0.08}>
        <div style={{...big(th), fontSize: 88}}><Word at={t(m.h3_biens - 0.3)}>Et mes biens personnels,</Word></div>
        <div><Accent at={t(m.h3_mal - 0.55)} size={122} color={TH[th].alerte} stroke="none">si ça tourne mal ?</Accent></div>
      </Bloc>
      <Bloc at={F4.s} out={H5.s - 0.08}>
        <div style={eyebrow(th)}><Word at={t(m.f4_deux - 0.3)}>EURL comme SARL :</Word></div>
        <div style={{...big(th), fontSize: 84, marginTop: 14}}><Word at={t(m.f4_responsabilite - 0.25)}>responsabilité limitée</Word></div>
        <div><Accent at={t(m.f4_apports - 0.45)} size={118} color={TH[th].accent} stroke="none">à vos apports.</Accent></div>
      </Bloc>
      <Bloc at={H5.s} out={d.fin}>
        <div style={{...big(th), fontSize: 100}}><Word at={t(m.h5_choisis - 0.25)}>Je choisis</Word></div>
        <div><Accent at={t(m.h5_projet - 0.3)} size={118} color={TH[th].accent} stroke="none">selon mon projet !</Accent></div>
      </Bloc>
      <Duo d={d} h1="question" />
      <Particles at={t(bolts[1].t)} dur={s(0.7)} cx={HX} cy={HY - 540} mode="out" n={36} spread={240} seed="v2a" />
      <Particles at={t(bolts[2].t)} dur={s(0.7)} cx={HX} cy={HY - 540} mode="out" n={36} spread={240} seed="v2b" />
      <Particles at={t(m.h5_projet)} dur={s(1.1)} cx={HX} cy={1200} mode="out" n={90} spread={560} seed="v2c" />
      <FinCarte theme={th} at={d.fin} cx={HX} cy={HY - 90} />
    </AbsoluteFill>
  );
};
