// Duo éducatif n°1 (fond bleu) : « Créer ma société en Algérie sans y vivre » (série du 17/11/2026).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {D3_V1 as d} from './duo3_data';
import {Avion, Bloc, Board, CarteMed, Duo, Estrade, eyebrow, FinCarte, Fond, Ico, Impact, Panneau, Pastille, PH, Pop, PW, seg, Tampon, TERRE, TH, VERT, NUIT, big, ramp} from './duoedu';
import {Accent, C, Particles, s, SANS, Word} from './kit';
import {MAP} from './map_med';

const th = 'bleu' as const;
const m = d.m;
const F2 = seg(d, 'F2'), H3 = seg(d, 'H3'), F4 = seg(d, 'F4'), H5 = seg(d, 'H5');

const DocMini: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 10px', borderRadius: 12, background: '#FFFFFF', border: `4px solid ${NUIT}`, boxShadow: `0 6px 0 ${NUIT}`}}>
    <Ico k="doc" size={44} color={C.or} />
    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: NUIT}}>Procuration</span>
  </div>
);
const Representant: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 8px 10px', borderRadius: 999, background: '#F2DDA2', border: `4px solid ${NUIT}`, boxShadow: `0 6px 0 ${NUIT}`, whiteSpace: 'nowrap'}}>
    <div style={{width: 50, height: 50, borderRadius: 50, background: '#FFFFFF', border: `4px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k="personne" size={36} color={NUIT} /></div>
    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: NUIT}}>Votre représentant</span>
  </div>
);
/* tableau des étapes : la plupart à distance, une seule demande votre présence */
const Etapes: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    {t: m.f4_etapes + 0.05, l: 'à distance', ok: true},
    {t: m.f4_etapes + 0.3, l: 'à distance', ok: true},
    {t: m.f4_etapes + 0.55, l: 'votre présence', ok: false},
    {t: m.f4_etapes + 0.8, l: 'à distance', ok: true},
  ];
  const hl = ramp(f, m.f4_presence - 0.35, m.f4_presence);
  return (
    <Board at={m.f4_etapes - 0.15} out={H5.s - 0.12} h={500}>
      {rows.map((r, i) => (
        <Pop key={i} at={r.t} x={450} y={78 + i * 112} soft>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, width: 780, padding: '12px 22px', borderRadius: 18, background: r.ok ? '#FFFFFF' : `rgba(242,221,162,${0.5 + 0.5 * hl})`, border: r.ok ? '4px solid #E3D8C2' : `5px solid ${NUIT}`, transform: `scale(${r.ok ? 1 : 1 + 0.05 * hl})`}}>
            <div style={{width: 60, height: 60, borderRadius: 60, background: NUIT, color: '#F2DDA2', fontFamily: SANS, fontWeight: 800, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <span style={{flex: 1, fontFamily: SANS, fontWeight: 800, fontSize: 42, color: NUIT}}>Étape {i + 1} · {r.l}</span>
            {r.ok ? <Pastille ok size={58} /> : <div style={{width: 58, height: 58, borderRadius: 58, background: C.or, border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k="personne" size={36} color="#FFFFFF" /></div>}
          </div>
        </Pop>
      ))}
    </Board>
  );
};

export const DuoEdu1: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const shake = f >= t(F2.s) && f < t(F2.s + 0.3) ? Math.sin(f * 3) * 8 : 0;
  const A = MAP.villes.paris as [number, number], B = MAP.villes.alger as [number, number];
  return (
    <AbsoluteFill style={{background: NUIT, transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo3-v1-bande-son.wav')} />
      <Fond theme={th} />
      {/* H1 + F2 : photos réelles, l'idée reçue puis sa correction */}
      <Panneau theme={th} at={0.45} out={H3.s - 0.25} slides={[
        {at: 0.45, src: 'img/creation.jpg', l: 'Ma société'},
        {at: m.h1_algerie, src: 'img/s2-algerie-cote.jpg', l: 'En Algérie'},
        {at: m.h1_france - 0.1, src: 'img/s2-europe-paris.jpg', l: 'Je vis en France'},
        {at: m.h1_mort, src: 'img/creation.jpg', l: 'Impossible ?', tint: 'rgba(196,81,43,0.55)', mark: 'x'},
        {at: F2.s + 0.05, src: 'img/creation.jpg', l: 'Ma société'},
      ]}>
        <Tampon at={m.f2_obligatoire + 0.15} x={PW - 230} y={PH - 110} txt="POSSIBLE ✓" color={VERT} rot={-9} />
      </Panneau>
      {/* H3 + F4 : la distance France → Algérie, la procuration voyage, le représentant agit sur place */}
      <CarteMed theme={th} at={H3.s - 0.05} out={m.f4_etapes - 0.3} from={A} to={B} labelFrom="Vous" labelTo="Alger"
        draw={[m.h3_distance - 0.1, m.h3_comment + 0.3]} travel={[m.f4_procuration + 0.1, m.f4_representant]} mobile={<DocMini />}
        badge={{at: m.f4_representant, node: <Representant />, dx: -120, dy: -95}}>
        <Pop at={m.f4_place + 0.1} x={PW - 170} y={60}><div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px 8px 10px', borderRadius: 999, background: '#FFFFFF', border: `4px solid ${NUIT}`, boxShadow: `0 6px 0 ${NUIT}`, whiteSpace: 'nowrap'}}><Pastille ok size={46} /><span style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, color: NUIT}}>agit sur place</span></div></Pop>
      </CarteMed>
      <Etapes />
      {/* H5 : pendant ce temps, vous voyagez */}
      <Panneau theme={th} at={H5.s - 0.05} out={d.fin + 0.3} slides={[{at: H5.s - 0.05, src: 'img/duo-aeroport.jpg', l: 'Pendant ce temps…'}]}>
        <Tampon at={m.h5_sans} x={PW - 250} y={PH - 110} txt="ÇA AVANCE ✓" color={VERT} rot={-8} size={52} />
      </Panneau>
      <Estrade theme={th} />
      {/* textes du haut */}
      <Bloc at={0.42} out={F2.s - 0.1}>
        <div style={{...big(th), fontSize: 82}}><Word at={t(m.h1_societe - 0.3)}>Ma société en Algérie ?</Word></div>
        <div style={{...big(th), fontSize: 66, marginTop: 8, opacity: 0.92}}><Word at={t(m.h1_france - 0.4)}>Mais je vis en France…</Word></div>
        <div><Accent at={t(m.h1_mort - 0.08)} size={130} color={TH[th].alerte} stroke="none">c’est mort.</Accent></div>
      </Bloc>
      <Impact theme={th} at={F2.s} out={m.f2_vivre - 0.08} l1="PAS DU" l2="TOUT !" />
      <Bloc at={m.f2_vivre} out={H3.s - 0.08}>
        <div style={{...big(th), fontSize: 92}}><Word at={t(m.f2_vivre)}>Vivre là-bas</Word></div>
        <div><Accent at={t(m.f2_obligatoire - 0.3)} size={104} color={TH[th].accent} stroke="none">n’est pas obligatoire.</Accent></div>
      </Bloc>
      <Bloc at={H3.s} out={F4.s - 0.08}>
        <div style={{...big(th), fontSize: 96}}><Word at={t(m.h3_distance - 0.25)}>Et à distance,</Word></div>
        <div><Accent at={t(m.h3_comment - 0.35)} size={120} color={TH[th].accent} stroke="none">je fais comment ?</Accent></div>
      </Bloc>
      <Bloc at={F4.s} out={m.f4_etapes - 0.18}>
        <div style={eyebrow(th)}><Word at={t(m.f4_procuration - 0.25)}>Avec une procuration,</Word></div>
        <div style={{...big(th), fontSize: 84, marginTop: 12}}><Word at={t(m.f4_representant - 0.25)}>votre représentant</Word></div>
        <div><Accent at={t(m.f4_place - 0.2)} size={118} color={TH[th].accent} stroke="none">agit sur place.</Accent></div>
      </Bloc>
      <Bloc at={m.f4_etapes - 0.15} out={H5.s - 0.08}>
        <div style={{...big(th), fontSize: 88}}><Word at={t(m.f4_etapes - 0.15)}>Quelques étapes :</Word></div>
        <div><Accent at={t(m.f4_presence - 0.4)} size={128} color={TH[th].accent} stroke="none">votre présence.</Accent></div>
      </Bloc>
      <Bloc at={H5.s} out={d.fin}>
        <div style={{...big(th), fontSize: 86}}><Word at={t(m.h5_projet - 0.3)}>Mon projet avance…</Word></div>
        <div><Accent at={t(m.h5_sans - 0.2)} size={104} color={TH[th].accent} stroke="none">sans moi, dans l’avion !</Accent></div>
      </Bloc>
      <Duo d={d} hx={225} fx={855} scale={0.8} h1="inquiet" />
      <Avion at={m.h5_avion - 0.6} y={1040} />
      <Particles at={t(m.h5_sans)} dur={s(1.1)} cx={540} cy={1050} mode="out" n={90} spread={600} seed="v1" />
      <FinCarte theme={th} at={d.fin} />
    </AbsoluteFill>
  );
};
