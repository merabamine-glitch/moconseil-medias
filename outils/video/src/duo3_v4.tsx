// Duo éducatif n°4 (fond sable et or) : « Retour définitif : ramener sa voiture » (série du 17/11/2026).
// Fait vérifié : véhicule neuf ou de moins de 5 ans, essence, hybride ou électrique (fiche V-01, loi de finances 2026, art. 127).
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import {D3_V4 as d} from './duo3_data';
import {big, Bloc, Board, CarteMed, Duo, Estrade, eyebrow, FinCarte, Fond, Ico, Impact, NUIT, OR_F, Panneau, Pastille, PH, Pop, PW, ramp, seg, SOL, Tampon, TERRE, TH, VERT, Voiture, W} from './duoedu';
import {Accent, C, Particles, prog, s, SANS, useSpring, Word} from './kit';
import {MAP} from './map_med';

const th = 'or' as const;
const m = d.m;
const F2 = seg(d, 'F2'), H3 = seg(d, 'H3'), F4 = seg(d, 'F4'), H5 = seg(d, 'H5');
const CX = 545, CY = SOL - 4, CS = 0.78;

/* étiquette suspendue au-dessus de la voiture */
const Etiquette: React.FC<{at: number; out: number; l1: string; l2?: string; c?: string; x?: number; y?: number; arrow?: boolean}> = ({at, out, l1, l2, c = '#FFFFFF', x = CX, y = CY - 360, arrow}) => {
  const f = useCurrentFrame();
  const p = useSpring(s(at), 9, 180);
  const o = 1 - ramp(f, out, out + 0.2);
  if (f < s(at) || o <= 0) return null;
  const sw = Math.sin((f - s(at)) / 5) * 6 * Math.exp(-(f - s(at)) / 30);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p}) rotate(${sw}deg)`, transformOrigin: '50% 0%', opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px', borderRadius: 18, background: c, border: `5px solid ${NUIT}`, boxShadow: `0 8px 0 ${NUIT}`, whiteSpace: 'nowrap'}}>
        {arrow && <svg width={56} height={56} viewBox="0 0 64 64"><path d="M32 8v44M14 36l18 18 18-18" fill="none" stroke={VERT} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg>}
        <div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, color: NUIT, lineHeight: 1}}>{l1}</div>
          {l2 && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: '#5A6478', marginTop: 4}}>{l2}</div>}
        </div>
      </div>
    </div>
  );
};
/* tableau des conditions : âge du véhicule + motorisation */
const Conditions: React.FC = () => {
  const f = useCurrentFrame();
  const u = ramp(f, m.f4_neuve, m.f4_cinq + 0.35, Easing.bezier(0.4, 0, 0.3, 1));
  const X0 = 100, X1 = 640, XE = 810;
  const fuel = [
    {at: m.f4_essence, k: 'pompe', l: 'Essence', x: 170},
    {at: m.f4_hybride, k: 'feuille', l: 'Hybride', x: 450},
    {at: m.f4_electrique, k: 'prise', l: 'Électrique', x: 730},
  ];
  return (
    <Board at={F4.s - 0.05} out={H5.s - 0.15} h={570}>
      <div style={{position: 'absolute', left: 40, top: 26, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 5, color: TERRE, textTransform: 'uppercase'}}>Âge du véhicule</div>
      {/* frise 0 → 5 ans, au-delà : non */}
      <div style={{position: 'absolute', left: X0, top: 160, width: X1 - X0, height: 34, borderRadius: 17, background: '#E8DCC6'}} />
      <div style={{position: 'absolute', left: X0, top: 160, width: (X1 - X0) * u, height: 34, borderRadius: 17, background: `linear-gradient(90deg, ${C.orClair}, ${C.or})`}} />
      <div style={{position: 'absolute', left: X1 + 14, top: 160, width: XE - X1 - 14, height: 34, borderRadius: 17, background: 'repeating-linear-gradient(45deg, #E9B9A8 0 12px, #F4D9CF 12px 24px)', opacity: prog(f, s(m.f4_cinq), 8)}} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <div key={k} style={{position: 'absolute', left: X0 + (k / 5) * (X1 - X0) - 2, top: 150, width: 6, height: 54, background: NUIT, borderRadius: 3, opacity: prog(f, s(m.f4_neuve) + k * 2, 6)}} />
      ))}
      <div style={{position: 'absolute', left: X0 - 70, top: 212, width: 140, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NUIT, opacity: prog(f, s(m.f4_neuve), 8)}}>neuve</div>
      <div style={{position: 'absolute', left: X1 - 80, top: 212, width: 160, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NUIT, opacity: prog(f, s(m.f4_cinq) - 4, 8)}}>5 ans</div>
      <div style={{position: 'absolute', left: X0 + (X1 - X0) * u, top: 104, transform: 'translate(-50%,-50%)', opacity: prog(f, s(m.f4_neuve), 6)}}>
        <div style={{width: 88, height: 88, borderRadius: 88, background: '#FFFFFF', border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k="voiture" size={52} color={NUIT} /></div>
      </div>
      <Pop at={m.f4_cinq + 0.35} x={X1} y={104}><Pastille ok size={70} /></Pop>
      <Pop at={m.f4_cinq + 0.5} x={(X1 + XE) / 2 + 8} y={104}><Pastille ok={false} size={58} /></Pop>
      <div style={{position: 'absolute', left: 60, right: 60, top: 282, height: 4, background: '#E3D8C2', borderRadius: 2}} />
      <div style={{position: 'absolute', left: 40, top: 296, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 5, color: TERRE, textTransform: 'uppercase', opacity: prog(f, s(m.f4_essence) - 6, 8)}}>Motorisation</div>
      {fuel.map((x, i) => (
        <Pop key={i} at={x.at} x={x.x} y={462}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
            <div style={{position: 'relative', width: 128, height: 128, borderRadius: 28, background: '#FFF4D2', border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${NUIT}`}}>
              <Ico k={x.k} size={84} color={OR_F} />
              <div style={{position: 'absolute', right: -20, top: -20}}><Pastille ok size={50} /></div>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NUIT}}>{x.l}</div>
          </div>
        </Pop>
      ))}
      <Tampon at={m.f4_oui + 0.05} until={m.f4_neuve + 0.4} x={PW - 170} y={70} txt="OUI ✓" color={VERT} rot={-8} size={54} />
    </Board>
  );
};

export const DuoEdu4: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const shake = f >= t(F2.s) && f < t(F2.s + 0.3) ? Math.sin(f * 3) * 8 : 0;
  /* la voiture arrive au mot « voiture », redémarre un peu à la fin */
  const arrive = ramp(f, m.h1_voiture - 0.35, m.h1_voiture + 0.45, Easing.bezier(0.2, 0.8, 0.3, 1));
  const end = ramp(f, m.h5_voiture, m.h5_voiture + 0.6, Easing.bezier(0.5, 0, 0.3, 1));
  const cx = CX + (1 - arrive) * 760 - end * 0;
  const roll = -(1 - arrive) * 14 + Math.sin(end * Math.PI) * 2;
  const brake = f >= t(m.h1_voiture + 0.35) && f < t(m.h1_voiture + 0.9) ? Math.sin((f - t(m.h1_voiture + 0.35)) / 2) * 3 * Math.exp(-(f - t(m.h1_voiture + 0.35)) / 6) : 0;
  const hop = f >= t(m.h5_voiture) ? Math.abs(Math.sin((f - t(m.h5_voiture)) / 3.5)) * 26 * Math.exp(-(f - t(m.h5_voiture)) / 40) : 0;
  const A = MAP.villes.paris as [number, number], B = MAP.villes.alger as [number, number];
  const MiniVoiture = (
    <div style={{width: 84, height: 84, borderRadius: 84, background: '#FFFFFF', border: `5px solid ${NUIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(242,221,162,0.9)'}}><Ico k="voiture" size={58} color={NUIT} /></div>
  );
  return (
    <AbsoluteFill style={{background: '#F6E7BE', transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo3-v4-bande-son.wav')} />
      <Fond theme={th} />
      <Panneau theme={th} at={0.45} out={F2.s - 0.2} slides={[{at: 0.45, src: 'img/s2-algerie-cote.jpg', l: 'Retour en Algérie'}]} />
      <CarteMed theme={th} at={m.f2_changement - 0.15} out={H3.s - 0.25} from={A} to={B} labelFrom="Europe" labelTo="Alger"
        draw={[m.f2_changement, m.f2_ramener]} travel={[m.f2_ramener - 0.05, m.f2_europe + 0.35]} mobile={MiniVoiture} />
      <Panneau theme={th} at={H3.s - 0.05} out={F4.s - 0.2} slides={[
        {at: H3.s - 0.05, src: 'img/r10-voiture.jpg', l: 'Quelques années ?'},
        {at: m.h3_annees - 0.35, src: 'img/r10-voiture.jpg', l: 'Quelques années ?', mark: 'q'},
      ]} />
      <Conditions />
      <Panneau theme={th} at={H5.s - 0.05} out={d.fin + 0.3} slides={[{at: H5.s - 0.05, src: 'img/frontdemer.jpg', l: 'Ma voiture, à Alger'}]}>
        <Tampon at={m.h5_budget - 0.1} x={PW - 260} y={PH - 105} txt="BUDGET ALLÉGÉ ✓" color={VERT} rot={-8} size={50} />
      </Panneau>
      <Estrade theme={th} />
      {f >= t(m.h1_voiture - 0.35) && <Voiture x={cx} y={CY} scale={CS} color="#24627F" roll={roll + end * 3} bounce={hop} tilt={brake} glow={ramp(f, H5.s, H5.s + 0.4)} />}
      <Etiquette at={m.h1_neuve - 0.35} out={F2.s + 0.05} l1="Neuve ?" l2="achetée sur place" />
      {/* textes du haut */}
      <Bloc at={0.29} out={F2.s - 0.05}>
        <div style={{...big(th), fontSize: 72}}><Word at={t(m.h1_rentre - 0.25)}>Je rentre vivre en Algérie.</Word></div>
        <div style={{...big(th), fontSize: 80, marginTop: 6}}><Word at={t(m.h1_voiture - 0.3)}>Ma voiture : en acheter</Word></div>
        <div><Accent at={t(m.h1_neuve - 0.4)} size={118} color={TH[th].accent} stroke="none">une neuve sur place ?</Accent></div>
      </Bloc>
      <Impact theme={th} at={F2.s} out={m.f2_changement - 0.3} l1="NON !" size={190} />
      <Bloc at={m.f2_changement - 0.25} out={H3.s - 0.05}>
        <div style={eyebrow(th)}><Word at={t(m.f2_changement - 0.25)}>En changement de résidence,</Word></div>
        <div style={{...big(th), fontSize: 80, marginTop: 14}}><Word at={t(m.f2_ramener - 0.45)}>vous pouvez ramener</Word></div>
        <div><Accent at={t(m.f2_europe - 0.45)} size={118} color={TH[th].accent} stroke="none">la vôtre, d’Europe.</Accent></div>
      </Bloc>
      <Bloc at={H3.s} out={F4.s - 0.08}>
        <div style={{...big(th), fontSize: 96}}><Word at={t(H3.s + 0.05)}>Même si elle a</Word></div>
        <div><Accent at={t(m.h3_annees - 0.55)} size={124} color={TH[th].accent} stroke="none">quelques années ?</Accent></div>
      </Bloc>
      <Bloc at={F4.s} out={m.f4_essence - 0.2}>
        <div style={{...big(th), fontSize: 92}}><Word at={t(m.f4_oui)}>Oui : </Word><Word at={t(m.f4_neuve - 0.15)}>neuve ou</Word></div>
        <div><Accent at={t(m.f4_moins - 0.2)} size={128} color={TH[th].accent} stroke="none">moins de 5 ans.</Accent></div>
      </Bloc>
      <Bloc at={m.f4_essence - 0.15} out={H5.s - 0.12}>
        <div style={{...big(th), fontSize: 88}}><Word at={t(m.f4_essence - 0.15)}>Essence, </Word><Word at={t(m.f4_hybride - 0.15)}>hybride</Word></div>
        <div><Accent at={t(m.f4_electrique - 0.3)} size={128} color={TH[th].accent} stroke="none">ou électrique.</Accent></div>
      </Bloc>
      <Bloc at={H5.s - 0.1} out={d.fin}>
        <div style={{...big(th), fontSize: 86}}><Word at={t(m.h5_garde - 0.25)}>Je garde ma voiture</Word></div>
        <div><Accent at={t(m.h5_budget - 0.5)} size={104} color={TH[th].accent} stroke="none">et j’allège mon budget !</Accent></div>
      </Bloc>
      <Duo d={d} h1="pensif" />
      <Particles at={t(m.h5_voiture)} dur={s(1.1)} cx={CX} cy={CY - 200} mode="out" n={80} spread={520} seed="v4" />
      <FinCarte theme={th} at={d.fin} cx={CX} cy={CY - 120} />
    </AbsoluteFill>
  );
};
