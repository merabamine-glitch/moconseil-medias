// Couverture de la vidéo duo n°2 (17/11/2026) : « Signé chez le notaire = propriétaire ? PAS ENCORE ! »
// Message lisible dans la zone centrale 1080 x 1350 (recadrage de la grille Instagram) ; mêmes éléments que la vidéo.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Chibi} from './chibi';
import {C, SANS} from './kit';
import {Maison} from './maison';

const W = 1080, H = 1920, SOL = 1560;
const NUIT = '#0E1726', TERRE = '#C4512B', OR_F = '#8C6418';
const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02, color: NUIT, filter: 'drop-shadow(0 4px 0 rgba(255,250,235,0.9))'};

export const DuoSigneCouverture: React.FC<{crash?: number}> = ({crash = 0.13}) => {
  const PW = 840, PHh = 460, PY = 860;
  return (
    <AbsoluteFill style={{background: '#F6E7BE'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 65% at 50% 40%, #FFF6DC 0%, #F5DE9E 34%, #E2B55A 66%, #B8842C 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
        <g transform={`translate(${W / 2} 860) rotate(4)`}>
          {Array.from({length: 18}).map((_, i) => <path key={i} d="M0 0 L-70 -1400 L70 -1400 Z" fill="#FFFFFF" transform={`rotate(${i * 20})`} />)}
        </g>
      </svg>
      {/* titre */}
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center'}}>
        <div style={{display: 'inline-block', padding: '10px 28px', borderRadius: 999, background: NUIT, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: '#F2DDA2', textTransform: 'uppercase'}}>Achat immobilier en Algérie</div>
        <div style={{...big, fontSize: 86, marginTop: 26}}>Signé chez le notaire</div>
        <div style={{...big, fontSize: 132, color: OR_F, marginTop: 4}}>= propriétaire ?</div>
      </div>
      {/* vraie photo de signature */}
      <div style={{position: 'absolute', left: W / 2, top: PY, transform: 'translate(-50%,-50%) rotate(-2deg)'}}>
        <div style={{position: 'relative', width: PW, height: PHh, borderRadius: 30, overflow: 'hidden', border: `8px solid ${NUIT}`, boxShadow: `0 14px 0 ${NUIT}, 0 30px 70px rgba(80,50,0,0.35)`, background: NUIT}}>
          <Img src={staticFile('img/s2-signature.jpg')} style={{width: PW, height: PHh, objectFit: 'cover', transform: 'scale(1.06)', filter: 'saturate(1.2) contrast(1.08)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,40,0.45) 0%, rgba(10,20,40,0) 35%, rgba(10,20,40,0) 60%, rgba(10,20,40,0.35) 100%)'}} />
          <div style={{position: 'absolute', left: 24, top: 22, padding: '10px 26px', borderRadius: 999, background: '#F2DDA2', border: `4px solid ${NUIT}`, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: NUIT}}>Acte signé ✓</div>
        </div>
      </div>
      {/* tampon PAS ENCORE, à cheval sur la photo */}
      <div style={{position: 'absolute', left: W / 2 + 90, top: PY + 140, transform: 'translate(-50%,-50%) rotate(-10deg)'}}>
        <div style={{padding: '14px 40px', border: `10px solid ${TERRE}`, borderRadius: 20, fontFamily: SANS, fontWeight: 800, fontSize: 104, letterSpacing: 3, color: TERRE, background: 'rgba(255,253,246,0.96)', whiteSpace: 'nowrap', boxShadow: '0 12px 34px rgba(0,0,0,0.35)'}}>PAS ENCORE !</div>
      </div>
      {/* estrade + maison qui se fissure */}
      <div style={{position: 'absolute', left: 0, top: SOL, width: W, height: H - SOL, background: 'linear-gradient(180deg, #8C6418 0%, #6E4C12 45%, #3E2A0A 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: SOL - 6, width: W, height: 12, background: '#FFF4D2', boxShadow: '0 0 30px rgba(255,244,210,0.9)'}} />
      <Maison x={540} y={SOL - 6} scale={0.8} build={1} crash={crash} seed="couv" />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <Chibi kind="homme" x={190} y={SOL} scale={0.58} pose={{sticker: true, mouth: 'sourire', brow: 1, lookX: 0.6, armL: 150, armR: 150, fx: 'etoiles', fxT: 0.5}} />
        <Chibi kind="femme" x={890} y={SOL} scale={0.58} pose={{sticker: true, mouth: 'o', brow: 1, lookX: -0.9, armR: 115, fx: 'exclam', fxT: 1}} />
      </svg>
      {/* bandeau bas (hors zone de recadrage, bonus en plein écran) */}
      <div style={{position: 'absolute', top: SOL + 60, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 54, color: '#FFF4D2'}}>
        Ce qui vous rend <span style={{color: C.orClair}}>vraiment</span> propriétaire
      </div>
      <div style={{position: 'absolute', top: SOL + 140, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#E9CF8E', letterSpacing: 2}}>moconseildz.com</div>
    </AbsoluteFill>
  );
};
