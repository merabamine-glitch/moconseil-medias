import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Maison, Poussiere} from './maison';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const MaisonDemo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const build = t < 2.5 ? interpolate(t, [0, 2], [0, 1], cl) : interpolate(t, [4, 5.5], [0, 1], cl);
  const crash = t >= 2.5 && t < 4 ? interpolate(t, [2.5, 3.6], [0, 1], cl) : 0;
  const b = t >= 2.5 && t < 4 ? 1 : build;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #FFF6DF 0%, #F1DFAF 45%, #D9B66A 100%)'}}>
      <Maison x={540} y={1500} scale={1.15} build={b} crash={crash} door={interpolate(t, [6, 6.6], [0, 1], cl)} glow={interpolate(t, [5.6, 6], [0, 1], cl)} />
      <Poussiere x={540} y={1500} t={interpolate(t, [2.6, 3.8], [0, 1], cl)} />
    </AbsoluteFill>
  );
};
