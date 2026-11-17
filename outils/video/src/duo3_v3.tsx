// Duo éducatif n°3 (fond bleu) : « Retour définitif : le dédouanement ne se délègue pas » (série du 17/11/2026).
// Fait vérifié : présence du titulaire exigée au dédouanement, procuration irrecevable (fiche C-02, pages consulaires officielles).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {D3_V3 as d} from './duo3_data';
import {Avion, big, Billet, Bloc, Carte, Douane, Duo, Estrade, eyebrow, FinCarte, Fond, NUIT, Panneau, PH, PW, ramp, seg, SOL, Tampon, TERRE, TH, VERT} from './duoedu';
import {Accent, Particles, s, useSpring, Word} from './kit';

const th = 'bleu' as const;
const m = d.m;
const F2 = seg(d, 'F2'), H3 = seg(d, 'H3'), F4 = seg(d, 'F4'), H5 = seg(d, 'H5');
const GX = 504; // poste de douane (barrière à gauche, guérite à droite)
const PAS = [m.f4_present, m.f4_present + 0.45]; // l'homme s'avance jusqu'à la barrière
const OUVRE = [m.f4_present + 0.5, m.f4_present + 1.0];
const PASSE = [m.f4_present + 1.1, m.f4_present + 2.1]; // puis il passe

export const DuoEdu3: React.FC = () => {
  const f = useCurrentFrame();
  const t = (x: number) => s(x);
  const shake = f >= t(F2.s) && f < t(F2.s + 0.3) ? Math.sin(f * 3) * 8 : 0;
  const gateIn = useSpring(t(m.f2_dedouanement - 0.15), 11, 170);
  const open = ramp(f, OUVRE[0], OUVRE[1]);
  return (
    <AbsoluteFill style={{background: NUIT, transform: `translateX(${shake}px)`}}>
      <Audio src={staticFile('audio/duo3-v3-bande-son.wav')} />
      <Fond theme={th} />
      {/* H1 → H3 : retour définitif, procuration… sauf au dédouanement */}
      <Panneau theme={th} at={0.45} out={F4.s - 0.25} slides={[
        {at: 0.45, src: 'img/duo-aeroport.jpg', l: 'Retour définitif'},
        {at: m.h1_procuration - 0.15, src: 'img/s2-signature.jpg', l: 'Procuration'},
        {at: m.f2_mais, src: 'img/s2-signature.jpg', l: 'Au dédouanement', tint: 'rgba(196,81,43,0.55)', mark: 'x'},
      ]}>
        <Tampon at={m.f2_oui} until={m.f2_mais} x={PW - 210} y={PH - 110} txt="OUI ✓" color={VERT} rot={-9} />
      </Panneau>
      {/* F4 : les formalités de dédouanement exigent le titulaire en personne */}
      <Panneau theme={th} at={F4.s - 0.05} out={H5.s - 0.2} slides={[
        {at: F4.s - 0.05, src: 'img/cachet.jpg', l: 'Formalités de dédouanement'},
        {at: m.f4_procuration - 0.1, src: 'img/s2-signature.jpg', l: 'Procuration', tint: 'rgba(196,81,43,0.55)', mark: 'x'},
      ]}>
        <Tampon at={m.f4_present + 0.05} until={m.f4_procuration - 0.1} x={PW / 2} y={PH - 100} txt="PRÉSENCE OBLIGATOIRE" color={TERRE} rot={-6} size={50} />
      </Panneau>
      <Billet at={H5.s - 0.05} out={d.fin + 0.3} />
      <Estrade theme={th} />
      {/* poste de douane : apparaît au mot « dédouanement », s'ouvre quand le titulaire se présente */}
      {f >= t(m.f2_dedouanement - 0.15) && (
        <AbsoluteFill style={{transform: `scale(${gateIn})`, transformOrigin: `${GX}px ${SOL}px`}}>
          <Douane x={GX} y={SOL - 4} scale={0.7} open={open} flip L={300} />
        </AbsoluteFill>
      )}
      {/* étiquettes « pour tout » */}
      <Carte k="meuble" l="Meubles" at={m.h1_meubles - 0.1} out={F2.s - 0.15} x={700} y={1110} r={-5} />
      <Carte k="voiture" l="Voiture" at={m.h1_voiture - 0.1} out={F2.s - 0.15} x={740} y={1260} r={3} />
      <Carte k="douane" l="Douane" at={m.h1_douane - 0.1} out={F2.s - 0.15} x={700} y={1410} r={-3} />
      {/* textes du haut */}
      <Bloc at={0.38} out={F2.s - 0.1}>
        <div style={{...big(th), fontSize: 70}}><Word at={t(m.h1_retour - 0.25)}>Pour mon retour définitif,</Word></div>
        <div style={{...big(th), fontSize: 86, marginTop: 6}}><Word at={t(m.h1_procuration - 0.35)}>je donne procuration</Word></div>
        <div><Accent at={t(m.h1_tout - 0.25)} size={132} color={TH[th].accent} stroke="none">pour tout !</Accent></div>
      </Bloc>
      <Bloc at={F2.s} out={m.f2_mais - 0.08}>
        <div style={{...big(th), fontSize: 88}}><Word at={t(m.f2_beaucoup - 0.2)}>Pour beaucoup</Word></div>
        <div style={{...big(th), fontSize: 88}}><Word at={t(m.f2_beaucoup + 0.25)}>de démarches :</Word></div>
        <div><Accent at={t(m.f2_oui - 0.2)} size={140} color={TH[th].accent} stroke="none">oui.</Accent></div>
      </Bloc>
      <Bloc at={m.f2_mais} out={H3.s - 0.08}>
        <div style={{...big(th), fontSize: 96}}><Word at={t(m.f2_mais)}>Mais pas pour</Word></div>
        <div><Accent at={t(m.f2_dedouanement - 0.25)} size={118} color={TH[th].alerte} stroke="none">le dédouanement.</Accent></div>
      </Bloc>
      <Bloc at={H3.s} out={F4.s - 0.08}>
        <div style={{...big(th), fontSize: 132}}><Word at={t(m.h3_ahbon)}>Ah bon ?</Word></div>
        <div><Accent at={t(m.h3_douane - 0.6)} size={96} color={TH[th].accent} stroke="none">Pourquoi pas la douane ?</Accent></div>
      </Bloc>
      <Bloc at={F4.s - 0.06} out={m.f4_procuration - 0.22}>
        <div style={{...big(th), fontSize: 92}}><Word at={t(m.f4_titulaire - 0.2)}>Le titulaire</Word></div>
        <div><Accent at={t(m.f4_present - 0.3)} size={124} color={TH[th].accent} stroke="none">doit être présent.</Accent></div>
      </Bloc>
      <Bloc at={m.f4_procuration - 0.2} out={H5.s - 0.08}>
        <div style={{...big(th), fontSize: 92}}><Word at={t(m.f4_procuration - 0.2)}>La procuration</Word></div>
        <div><Accent at={t(m.f4_acceptee - 0.45)} size={108} color={TH[th].alerte} stroke="none">n’y est pas acceptée.</Accent></div>
      </Bloc>
      <Bloc at={H5.s - 0.04} out={d.fin}>
        <div style={{...big(th), fontSize: 100}}><Word at={t(m.h5_savoir - 0.3)}>Bon à savoir</Word></div>
        <div><Accent at={t(m.h5_billet - 0.45)} size={118} color={TH[th].accent} stroke="none">avant le billet !</Accent></div>
      </Bloc>
      <Duo d={d} hx={190} fx={905} scale={0.66} h1="confiant" hOver={(fr) => {
        const a = ramp(fr, PAS[0], PAS[1]), b = ramp(fr, PASSE[0], PASSE[1]);
        const o: Record<string, number> = {x: 190 + 55 * a + 185 * b};
        if ((a > 0 && a < 1) || (b > 0 && b < 1)) { o.bounce = Math.abs(Math.sin(fr / 2.6)) * 22; o.lookX = 1; o.lookY = 0; o.armL = 20; o.armR = 20; }
        return o;
      }} />
      <Particles at={t(OUVRE[1])} dur={s(0.8)} cx={GX - 60} cy={SOL - 260} mode="out" n={40} spread={260} seed="v3g" />
      <Avion at={m.h5_billet - 0.6} y={1040} />
      <Particles at={t(m.h5_billet - 0.2)} dur={s(1.1)} cx={540} cy={1050} mode="out" n={90} spread={600} seed="v3" />
      <FinCarte theme={th} at={d.fin} />
    </AbsoluteFill>
  );
};
