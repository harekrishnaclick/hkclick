import backgroundImage from '@assets/generated-image_1755976323185.png';
import button1Sound from '@assets/button_1_1755632167131.mp3';
import button2Sound from '@assets/button_2_1755632167130.mp3';
import radhaSound from '@assets/speech_20260511190441320_1778526436172.mp3';
import ramaSound1 from '@assets/speech_1_1778526563771.mp3';
import ramaSound2 from '@assets/speech_2_1778526560238.mp3';
import shivjiSound1 from '@assets/speech_3_1778526676768.mp3';
import shivjiSound2 from '@assets/speech_4_1778526676767.mp3';
import hanumanSound1 from '@assets/speech_1_1778526783052.mp3';
import hanumanSound2 from '@assets/speech_5_1778526783051.mp3';
import ganeshSound1 from '@assets/speech_1_1778526855868.mp3';
import ganeshSound2 from '@assets/speech_6_1778526855868.mp3';
import durgaSound1 from '@assets/speech_1_1778526915118.mp3';
import durgaSound2 from '@assets/speech_9_1778526915117.mp3';

import type { DeityGameConfig } from '@/components/DeityGame';

const deityImageModules = import.meta.glob<{ default: string }>(
  '/src/assets/deities/*.webp',
  { eager: false },
);

export function loadDeityImage(filename: string): Promise<string> {
  const key = `/src/assets/deities/${filename}`;
  const loader = deityImageModules[key];
  if (!loader) return Promise.resolve('');
  return loader().then((m) => m.default);
}

export const deityConfigs: Record<string, DeityGameConfig> = {
  krishna: {
    deityName: 'HARE KRISHNA',
    buttonLabels: ['HARE', 'KRISHNA'],
    colors: { primary: '#9d4edd', secondary: '#60a5fa' },
    backgroundImage: backgroundImage,
    deityImageFile: 'krishna.webp',
    sounds: [button1Sound, button2Sound],
  },
  radha: {
    deityName: 'RADHE RADHE',
    buttonLabels: ['RADHE', 'RADHE'],
    colors: { primary: '#ec4899', secondary: '#f472b6' },
    backgroundImage: backgroundImage,
    deityImageFile: 'radha.webp',
    sounds: [radhaSound, radhaSound],
  },
  rama: {
    deityName: 'JAI SHRI RAM',
    buttonLabels: ['JAI', 'SHRI RAM'],
    colors: { primary: '#f97316', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImageFile: 'rama.webp',
    sounds: [ramaSound1, ramaSound2],
  },
  shivji: {
    deityName: 'HAR HAR MAHADEV',
    buttonLabels: ['HAR HAR', 'MAHADEV'],
    colors: { primary: '#38bdf8', secondary: '#94a3b8' },
    backgroundImage: backgroundImage,
    deityImageFile: 'shivji.webp',
    sounds: [shivjiSound1, shivjiSound2],
  },
  hanuman: {
    deityName: 'JAI HANUMAN',
    buttonLabels: ['JAI', 'HANUMAN'],
    colors: { primary: '#f97316', secondary: '#ef4444' },
    backgroundImage: backgroundImage,
    deityImageFile: 'hanuman.webp',
    sounds: [hanumanSound1, hanumanSound2],
  },
  ganesh: {
    deityName: 'JAI GANESH',
    buttonLabels: ['JAI', 'GANESH'],
    colors: { primary: '#ef4444', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImageFile: 'ganesh.webp',
    sounds: [ganeshSound1, ganeshSound2],
  },
  durga: {
    deityName: 'JAI MAA DURGA',
    buttonLabels: ['JAI', 'MAA DURGA'],
    colors: { primary: '#ef4444', secondary: '#f97316' },
    backgroundImage: backgroundImage,
    deityImageFile: 'durga.webp',
    sounds: [durgaSound1, durgaSound2],
  },
};
