// Valise 3D (procédurale, Three.js) pour la vidéo « Pack Retour Définitif ».
// Coque rigide bleu nuit vernie, nervures, cerclage et coins dorés, poignée, roulettes, étiquette « ALGER ».
import React, {useMemo, useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environmentIntensity = 1.0;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
    pm.dispose();
  }, [gl, scene]);
  return null;
};

const tagTexture = () => {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 300;
  const x = c.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, 512, 300);
  g.addColorStop(0, '#F6E7BF'); g.addColorStop(0.5, '#E2C27A'); g.addColorStop(1, '#C9A24B');
  x.fillStyle = g; x.fillRect(0, 0, 512, 300);
  x.strokeStyle = 'rgba(14,23,38,0.55)'; x.lineWidth = 4; x.setLineDash([10, 8]);
  x.strokeRect(22, 22, 468, 256);
  x.setLineDash([]);
  x.fillStyle = '#0E1726';
  x.font = '800 118px Manrope, sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('ALGER', 256, 128);
  x.font = '700 30px Manrope, sans-serif';
  x.fillStyle = 'rgba(14,23,38,0.75)';
  x.fillText('RETOUR DÉFINITIF', 256, 222);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

export const Valise: React.FC<{rotY: number; rotX?: number; y: number; squash?: number; tagSwing?: number; scale?: number}> = ({rotY, rotX = 0, y, squash = 0, tagSwing = 0, scale = 1}) => {
  const W = 0.92, H = 1.4, D = 0.5;
  const geo = useMemo(() => ({
    body: new RoundedBoxGeometry(W, H, D, 8, 0.1),
    band: new RoundedBoxGeometry(W + 0.012, H + 0.012, 0.022, 8, 0.1),
    rib: new RoundedBoxGeometry(0.05, H - 0.3, 0.03, 4, 0.02),
    corner: new RoundedBoxGeometry(0.13, 0.13, D + 0.012, 6, 0.055),
  }), []);
  const mats = useMemo(() => ({
    shell: new THREE.MeshPhysicalMaterial({color: '#152238', roughness: 0.34, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08}),
    gold: new THREE.MeshStandardMaterial({color: '#e2bf6a', roughness: 0.28, metalness: 1}),
    dark: new THREE.MeshStandardMaterial({color: '#151b24', roughness: 0.6, metalness: 0.2}),
    tag: new THREE.MeshStandardMaterial({map: tagTexture(), roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide}),
  }), []);
  const sx = 1 + squash * 0.06, sy = 1 - squash * 0.08;
  return (
    <group position={[0, y, 0]} rotation={[rotX, rotY, 0]} scale={[scale * sx, scale * sy, scale * sx]}>
      <mesh geometry={geo.body} material={mats.shell} />
      {/* cerclage doré au milieu de l'épaisseur */}
      <mesh geometry={geo.band} material={mats.gold} />
      {/* nervures avant et arrière */}
      {[-0.27, -0.09, 0.09, 0.27].map((x) => (
        <React.Fragment key={x}>
          <mesh geometry={geo.rib} material={mats.shell} position={[x, 0, D / 2 + 0.004]} />
          <mesh geometry={geo.rib} material={mats.shell} position={[x, 0, -D / 2 - 0.004]} />
        </React.Fragment>
      ))}
      {/* coins dorés */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => (
        <mesh key={`${a}${b}`} geometry={geo.corner} material={mats.gold} position={[a * (W / 2 - 0.045), b * (H / 2 - 0.045), 0]} />
      ))}
      {/* poignée du dessus */}
      <mesh material={mats.dark} position={[0, H / 2 + 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.032, 0.3, 8, 16]} />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} material={mats.gold} position={[x, H / 2 + 0.035, 0]}>
          <boxGeometry args={[0.06, 0.07, 0.08]} />
        </mesh>
      ))}
      {/* canne télescopique repliée */}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} material={mats.gold} position={[x, H / 2 + 0.05, -D / 2 + 0.06]}>
          <cylinderGeometry args={[0.022, 0.022, 0.1, 16]} />
        </mesh>
      ))}
      <mesh material={mats.dark} position={[0, H / 2 + 0.11, -D / 2 + 0.06]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.035, 0.52, 8, 16]} />
      </mesh>
      {/* roulettes */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => (
        <group key={`w${a}${b}`} position={[a * (W / 2 - 0.1), -H / 2 - 0.07, b * (D / 2 - 0.1)]}>
          <mesh material={mats.dark} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 24]} />
          </mesh>
          <mesh material={mats.gold} position={[0, 0.05, 0]}>
            <boxGeometry args={[0.07, 0.05, 0.07]} />
          </mesh>
        </group>
      ))}
      {/* étiquette « ALGER » qui pend à la poignée */}
      <group position={[0.1, H / 2 + 0.06, D / 2 + 0.05]} rotation={[-0.22 - Math.abs(tagSwing) * 0.3, 0, tagSwing]}>
        <mesh material={mats.gold} position={[0, -0.09, 0.01]}>
          <boxGeometry args={[0.012, 0.18, 0.012]} />
        </mesh>
        <mesh material={mats.tag} position={[0, -0.3, 0]}>
          <planeGeometry args={[0.44, 0.26]} />
        </mesh>
      </group>
      <Env />
    </group>
  );
};
