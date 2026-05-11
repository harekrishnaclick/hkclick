import backgroundImage from '@assets/generated-image_1755976323185.png';
import button1Sound from '@assets/button_1_1755632167131.mp3';
import button2Sound from '@assets/button_2_1755632167130.mp3';

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
    sounds: [button1Sound, button2Sound],
  },
  rama: {
    deityName: 'JAI SHRI RAM',
    buttonLabels: ['JAI', 'SHRI RAM'],
    colors: { primary: '#f97316', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImage: ramaImg,
    sounds: [button1Sound, button2Sound],
  },
  shivji: {
    deityName: 'HAR HAR MAHADEV',
    buttonLabels: ['HAR HAR', 'MAHADEV'],
    colors: { primary: '#38bdf8', secondary: '#94a3b8' },
    backgroundImage: backgroundImage,
    deityImage: shivjiImg,
    sounds: [button1Sound, button2Sound],
  },
  hanuman: {
    deityName: 'JAI HANUMAN',
    buttonLabels: ['JAI', 'HANUMAN'],
    colors: { primary: '#f97316', secondary: '#ef4444' },
    backgroundImage: backgroundImage,
    deityImage: hanumanImg,
    sounds: [button1Sound, button2Sound],
  },
  ganesh: {
    deityName: 'JAI GANESH',
    buttonLabels: ['JAI', 'GANESH'],
    colors: { primary: '#ef4444', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    deityImage: ganeshImg,
    sounds: [button1Sound, button2Sound],
  },
  durga: {
    deityName: 'JAI MAA DURGA',
    buttonLabels: ['JAI', 'MAA DURGA'],
    colors: { primary: '#ef4444', secondary: '#f97316' },
    backgroundImage: backgroundImage,
    deityImage: durgaImg,
    sounds: [button1Sound, button2Sound],
  },
};
