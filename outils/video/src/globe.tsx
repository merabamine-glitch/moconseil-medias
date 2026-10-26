// Globe 3D réutilisable (Three.js + @remotion/three) — série « Un pack en 30 secondes »
import React, {useMemo, useState} from 'react';
import {continueRender, delayRender, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import * as P from './photos';

export const ll = (lat: number, lon: number, r: number) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};
export const ALGER = {lat: 36.75, lon: 3.06};
export const PARIS = {lat: 48.86, lon: 2.35};

/** Rotation (x, y) qui amène (lat, lon) face à la caméra. */
const faceRot = (lat: number, lon: number) => ({
  x: (lat * Math.PI) / 180,
  y: Math.PI / 2 - ((lon + 180) * Math.PI) / 180,
});

export type GlobeKey = {f: number; lat: number; lon: number; dist: number; y?: number};

const useTexture = (src: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [handle] = useState(() => delayRender('texture globe'));
  useMemo(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
      continueRender(handle);
    });
  }, [src]);
  return tex;
};

const Pin3D: React.FC<{pos: THREE.Vector3; at: number; color?: string}> = ({pos, at, color = '#E9CF8E'}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const ring = ((f - at) % 36) / 36;
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  if (f < at) return null;
  return (
    <group position={pos} quaternion={q}>
      <mesh scale={p}>
        <sphereGeometry args={[0.016, 20, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={0.6 + 2.2 * ring}>
        <ringGeometry args={[0.02, 0.026, 48]} />
        <meshBasicMaterial color={color} transparent opacity={(1 - ring) * 0.85 * p} side={THREE.DoubleSide} />
      </mesh>
      <mesh scale={p}>
        <ringGeometry args={[0.03, 0.034, 48]} />
        <meshBasicMaterial color="#C9A24B" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Arc3D: React.FC<{a: THREE.Vector3; b: THREE.Vector3; from: number; to: number}> = ({a, b, from, to}) => {
  const f = useCurrentFrame();
  const curve = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.16);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [a, b]);
  const core = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.0045, 10, false), [curve]);
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.014, 10, false), [curve]);
  const k = interpolate(f, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  if (k <= 0) return null;
  core.setDrawRange(0, Math.floor(core.index!.count * k));
  glow.setDrawRange(0, Math.floor(glow.index!.count * k));
  const head = curve.getPoint(Math.min(k, 0.999));
  return (
    <>
      <mesh geometry={glow}>
        <meshBasicMaterial color="#E9CF8E" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh geometry={core}>
        <meshBasicMaterial color="#F6E3AE" />
      </mesh>
      {k < 1 && (
        <mesh position={head}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color="#FFF4D6" />
        </mesh>
      )}
    </>
  );
};

const GlobeInner: React.FC<{keys: GlobeKey[]; arc?: [number, number]; pinA?: number; pinB?: number; spin?: number}> = ({keys, arc, pinA, pinB, spin = 0}) => {
  const f = useCurrentFrame();
  const tex = useTexture(P.P_terre);
  const fs = keys.map((k) => k.f);
  const ease = Easing.bezier(0.45, 0.05, 0.25, 1);
  const lat = interpolate(f, fs, keys.map((k) => k.lat), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const lon = interpolate(f, fs, keys.map((k) => k.lon), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) - spin * f;
  const dist = interpolate(f, fs, keys.map((k) => k.dist), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const gy = interpolate(f, fs, keys.map((k) => k.y ?? 0), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const r = faceRot(lat, lon);
  const a = useMemo(() => ll(ALGER.lat, ALGER.lon, 1.0), []);
  const b = useMemo(() => ll(PARIS.lat, PARIS.lon, 1.0), []);
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 900;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3(random('sx' + i) - 0.5, random('sy' + i) - 0.5, random('sz' + i) - 0.5).normalize().multiplyScalar(30 + random('sr' + i) * 20);
      arr.set([v.x, v.y, v.z], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 2.5, 4]} intensity={2.3} color="#FFF1DA" />
      <directionalLight position={[3, -1, -2]} intensity={0.6} color="#7FA6FF" />
      <points geometry={stars}>
        <pointsMaterial color="#E9CF8E" size={0.06} transparent opacity={0.55} />
      </points>
      <group position={[0, gy, -dist + 3]} rotation={[r.x, r.y, 0]}>
        <mesh>
          <sphereGeometry args={[1, 128, 128]} />
          {tex && <meshStandardMaterial map={tex} roughness={0.9} metalness={0.02} />}
        </mesh>
        <mesh scale={1.035}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial color="#8DB8FF" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {arc && <Arc3D a={a} b={b} from={arc[0]} to={arc[1]} />}
        {pinA !== undefined && <Pin3D pos={a} at={pinA} />}
        {pinB !== undefined && <Pin3D pos={b} at={pinB} />}
      </group>
    </>
  );
};

/** Globe plein cadre. Les images clés et les temps sont en images (relatifs à la séquence). */
export const Globe: React.FC<{keys: GlobeKey[]; arc?: [number, number]; pinA?: number; pinB?: number; spin?: number}> = (props) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 30, position: [0, 0, 3]}}>
      <GlobeInner {...props} />
    </ThreeCanvas>
  );
};
