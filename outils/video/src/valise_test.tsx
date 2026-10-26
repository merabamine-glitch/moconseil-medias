import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Valise} from './valise3d';
export const ValiseTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #FBF8F2 0%, #F4EFE6 55%, #E8DCC6 100%)'}}>
      <div style={{position: 'absolute', left: 540 - 300, top: 1290, width: 600, height: 90, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,23,38,0.35) 0%, rgba(14,23,38,0) 70%)'}} />
      <ThreeCanvas width={1080} height={1920} camera={{fov: 28, position: [0, 0.35, 6.2]}}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[2.5, 3, 4]} intensity={2.4} color="#fff3dc" />
        <directionalLight position={[-3, 1, -2]} intensity={0.8} color="#cfe0ff" />
        <Valise rotY={0.55} rotX={0.12} y={-0.1} tagSwing={0.15} scale={0.8} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
