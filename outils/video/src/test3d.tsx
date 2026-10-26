import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import * as P from './photos';

const ll = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * Math.PI / 180;
  const th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};
const GENEVE = [46.2, 6.15];
const ALGER = [36.75, 3.06];

const Globe: React.FC = () => {
  const f = useCurrentFrame();
  const tex = useMemo(() => { const t = new THREE.TextureLoader().load(P.P_terre); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  const k = interpolate(f, [0, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0.05, 0.2, 1)});
  // rotation pour amener l'Europe/Alger face caméra
  const rotY = interpolate(k, [0, 1], [-2.2, -1.62]);
  const rotX = 0.62;
  const a = ll(GENEVE[0], GENEVE[1], 1.0);
  const b = ll(ALGER[0], ALGER[1], 1.0);
  const curve = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.18);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, []);
  const draw = interpolate(f, [40, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.006, 8, false), [curve]);
  geo.setDrawRange(0, Math.floor(geo.index!.count * draw));
  const camZ = interpolate(k, [0, 1], [5.2, 2.35]);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={2.2} />
      <perspectiveCamera position={[0, 0, camZ]} />
      <group rotation={[rotX, rotY, 0]} position={[0, 0, -camZ + 2.35 - 2.35]}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh scale={1.02}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial color="#7fb3ff" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial color="#F6E3AE" />
        </mesh>
        <mesh position={a}><sphereGeometry args={[0.014, 16, 16]} /><meshBasicMaterial color="#E9CF8E" /></mesh>
        <mesh position={b}><sphereGeometry args={[0.018, 16, 16]} /><meshBasicMaterial color="#C9A24B" /></mesh>
      </group>
    </>
  );
};

export const Test3D: React.FC = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 90], [6, 2.4], {extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0.05, 0.2, 1)});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #16243A, #0A101C 70%)'}}>
      <ThreeCanvas width={width} height={height} camera={{fov: 30, position: [0, 0, z]}}>
        <Globe />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
