// Couverture de la vidéo duo n°2 (17/11/2026), version épurée : un seul message, un seul visuel.
// « Signé ≠ propriétaire » + la maison qui se fissure. Tout tient dans la zone centrale (recadrage de la grille Instagram).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SANS} from './kit';
import {Maison} from './maison';

const W = 1080, H = 1920, SOL = 1500;
const NUIT = '#0E1726', TERRE = '#C4512B';
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -4, lineHeight: 0.98, color: NUIT};

export const DuoSigneCouverture: React.FC<{crash?: number}> = ({crash = 0.13}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 70% at 50% 42%, #FFF6DC 0%, #F5DE9E 40%, #E2B55A 78%, #C4923A 100%)'}}>
    <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center'}}>
      <div style={{...big, fontSize: 190}}>Signé</div>
      <div style={{...big, fontSize: 150, marginTop: 10}}><span style={{color: TERRE}}>≠</span> propriétaire</div>
    </div>
    <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: 'linear-gradient(180deg, #8C6418 0%, #6E4C12 45%, #3E2A0A 100%)'}} />
    <div style={{position: 'absolute', left: 0, top: SOL - 6, width: W, height: 12, background: '#FFF4D2'}} />
    <Maison x={540} y={SOL - 6} scale={1.2} build={1} crash={crash} seed="couv" />
  </AbsoluteFill>
);
