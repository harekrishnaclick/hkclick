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

import krishnaImg from '@assets/deities/krishna.webp';
import radhaImg from '@assets/deities/radha.webp';
import ramaImg from '@assets/deities/rama.webp';
import shivjiImg from '@assets/deities/shivji.webp';
import hanumanImg from '@assets/deities/hanuman.webp';
import ganeshImg from '@assets/deities/ganesh.webp';
import durgaImg from '@assets/deities/durga.webp';


import type { DeityGameConfig } from '@/components/DeityGame';

export const deityConfigs: Record<string, DeityGameConfig> = {
  krishna: {
    deityName: 'HARE KRISHNA',
    buttonLabels: ['HARE', 'KRISHNA'],
    colors: { primary: '#9d4edd', secondary: '#60a5fa' },
    backgroundImage: backgroundImage,
    deityImage: krishnaImg,
    sounds: [button1Sound, button2Sound],
  },
  radha: {
    deityName: 'RADHE RADHE',
    buttonLabels: ['RADHE', 'RADHE'],
    colors: { primary: '#ec4899', secondary: '#f472b6' },
    backgroundImage: backgroundImage,
    deityImage: radhaImg,
    sounds: [radhaSound, radhaSound],
  },
  rama: {
    deityName: 'JAI SHRI RAM',
    buttonLabels: ['JAI', 'SHRI RAM'],
    colors: { primary: '#f97316', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImage: ramaImg,
    sounds: [ramaSound1, ramaSound2],
  },
  shivji: {
    deityName: 'HAR HAR MAHADEV',
    buttonLabels: ['HAR HAR', 'MAHADEV'],
    colors: { primary: '#38bdf8', secondary: '#94a3b8' },
    backgroundImage: backgroundImage,
    deityImage: shivjiImg,
    sounds: [shivjiSound1, shivjiSound2],
  },
  hanuman: {
    deityName: 'JAI HANUMAN',
    buttonLabels: ['JAI', 'HANUMAN'],
    colors: { primary: '#f97316', secondary: '#ef4444' },
    backgroundImage: backgroundImage,
    deityImage: hanumanImg,
    sounds: [hanumanSound1, hanumanSound2],
  },
  ganesh: {
    deityName: 'JAI GANESH',
    buttonLabels: ['JAI', 'GANESH'],
    colors: { primary: '#ef4444', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImage: ganeshImg,
    sounds: [ganeshSound1, ganeshSound2],
  },
  durga: {
    deityName: 'JAI MAA DURGA',
    buttonLabels: ['JAI', 'MAA DURGA'],
    colors: { primary: '#ef4444', secondary: '#f97316' },
    backgroundImage: backgroundImage,
    deityImage: durgaImg,
    sounds: [durgaSound1, durgaSound2],
  },
};
