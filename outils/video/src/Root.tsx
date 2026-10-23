import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Finish, s} from './kit';
import * as A from './assets';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenes';
import {SA, SB, SC, SD, SE, SF, SG, SH, SI} from './scenes2';
import {Certificat} from './certificat';
import * as V3 from './scenes3';
import * as V4 from './scenes4';
import {Wp} from './warp';

const fonts: [string, string, string, string][] = [
  ['Cormorant', 'cormorant-garamond-latin-600-normal.woff2', '600', 'normal'],
  ['Cormorant', 'cormorant-garamond-latin-600-italic.woff2', '600', 'italic'],
  ['Cormorant', 'cormorant-garamond-latin-700-italic.woff2', '700', 'italic'],
  ['Manrope', 'manrope-latin-500-normal.woff2', '500', 'normal'],
  ['Manrope', 'manrope-latin-600-normal.woff2', '600', 'normal'],
  ['Manrope', 'manrope-latin-700-normal.woff2', '700', 'normal'],
  ['Manrope', 'manrope-latin-800-normal.woff2', '800', 'normal'],
];
for (const [fam, file, weight, style] of fonts) {
  loadFont({family: fam, url: (A as any)['F_' + file.replace(/-/g, '_').replace('.woff2', '')], weight, style, format: 'woff2'});
}

// [début (s), fin (s), composant]
const plan: [number, number, React.FC<{dur: number}>][] = [
  [0, 1.95, S1],
  [1.8, 4.35, S2],
  [4.25, 9.15, S3],
  [9.05, 13.25, S4],
  [13.15, 15.7, S5],
  [15.6, 22.4, S6],
  [22.3, 25.25, S7],
  [25.15, 30, S8],
];

export const Presentation: React.FC = () => (
  <AbsoluteFill style={{background: '#0E1726'}}>
    {plan.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />

  </AbsoluteFill>
);

const plan2: [number, number, React.FC<{dur: number}>][] = [
  [0, 3.3, SA],
  [3.0, 4.45, SB],
  [4.25, 9.3, SC],
  [9.0, 13.35, SD],
  [13.2, 15.8, SE],
  [15.55, 18.8, SF],
  [18.25, 22.5, SG],
  [22.2, 25.45, SH],
  [25.15, 30, SI],
];

export const PresentationV2: React.FC = () => (
  <AbsoluteFill style={{background: '#0E1726'}}>
    {plan2.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);

// v3 : voix ElevenLabs, mêmes scènes recalées par Wp (voir warp.ts)
const plan3: [number, number, React.FC<{dur: number}>][] = [
  [0, Wp(3.3), V3.SA],
  [Wp(3.0), Wp(4.45), V3.SB],
  [Wp(4.25), Wp(9.3), V3.SC],
  [Wp(9.0), Wp(13.35), V3.SD],
  [Wp(13.2), Wp(15.8), V3.SE],
  [Wp(15.55), Wp(18.8), V3.SF],
  [Wp(18.25), Wp(22.5), V3.SG],
  [Wp(22.2), Wp(25.45), V3.SH],
  [Wp(25.15), 31.5, V3.SI],
];

export const PresentationV3: React.FC = () => (
  <AbsoluteFill style={{background: '#0E1726'}}>
    {plan3.map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);

// v4 : retouches d'Amine du 23/10 (fond des mains au trait d'union, carte pour les équipes, retour définitif, carte de fin contrastée)
const plan4 = (end: React.FC<{dur: number}>): [number, number, React.FC<{dur: number}>][] => [
  [0, Wp(3.3), V4.SA],
  [Wp(3.0), Wp(4.45), V4.SB],
  [Wp(4.25), Wp(9.3), V4.SC],
  [Wp(9.0), Wp(13.35), V4.SD],
  [Wp(13.2), Wp(15.8), V4.SE],
  [Wp(15.55), Wp(18.8), V4.SF],
  [Wp(18.25), Wp(22.5), V4.SG],
  [Wp(22.2), Wp(25.45), V4.SH],
  [Wp(25.15), 31.5, end],
];
const mk4 = (end: React.FC<{dur: number}>): React.FC => () => (
  <AbsoluteFill style={{background: '#0E1726'}}>
    {plan4(end).map(([a, b, Comp], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <Comp dur={s(b) - s(a)} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
);
export const PresentationV4A = mk4(V4.SIA);
export const PresentationV4B = mk4(V4.SIB);

export const Root: React.FC = () => (
  <>
    <Composition id="Presentation" component={Presentation} durationInFrames={900} fps={30} width={1080} height={1920} />
    <Composition id="PresentationV2" component={PresentationV2} durationInFrames={900} fps={30} width={1080} height={1920} />
    <Composition id="PresentationV3" component={PresentationV3} durationInFrames={945} fps={30} width={1080} height={1920} />
    <Composition id="PresentationV4A" component={PresentationV4A} durationInFrames={945} fps={30} width={1080} height={1920} />
    <Composition id="PresentationV4B" component={PresentationV4B} durationInFrames={945} fps={30} width={1080} height={1920} />
    <Composition id="Certificat" component={Certificat} durationInFrames={765} fps={30} width={1080} height={1920} />
  </>
);
