import backgroundImage from '@assets/generated-image_1755976323185.png';
import button1Sound from '@assets/button_1_1755632167131.mp3';
import button2Sound from '@assets/button_2_1755632167130.mp3';

import type { DeityGameConfig } from '@/components/DeityGame';

export const deityConfigs: Record<string, DeityGameConfig> = {
  krishna: {
    deityName: 'HARE KRISHNA',
    buttonLabels: ['HARE', 'KRISHNA'],
    colors: { primary: '#9d4edd', secondary: '#60a5fa' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  radha: {
    deityName: 'RADHE RADHE',
    buttonLabels: ['RADHE', 'RADHE'],
    colors: { primary: '#ec4899', secondary: '#f472b6' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  rama: {
    deityName: 'JAI SHRI RAM',
    buttonLabels: ['JAI', 'SHRI RAM'],
    colors: { primary: '#f97316', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  shivji: {
    deityName: 'HAR HAR MAHADEV',
    buttonLabels: ['HAR HAR', 'MAHADEV'],
    colors: { primary: '#38bdf8', secondary: '#94a3b8' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  hanuman: {
    deityName: 'JAI HANUMAN',
    buttonLabels: ['JAI', 'HANUMAN'],
    colors: { primary: '#f97316', secondary: '#ef4444' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  ganesh: {
    deityName: 'JAI GANESH',
    buttonLabels: ['JAI', 'GANESH'],
    colors: { primary: '#ef4444', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  durga: {
    deityName: 'JAI MAA DURGA',
    buttonLabels: ['JAI', 'MAA DURGA'],
    colors: { primary: '#ef4444', secondary: '#f97316' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  saibaba: {
    deityName: 'OM SAI RAM',
    buttonLabels: ['OM', 'SAI RAM'],
    colors: { primary: '#f8fafc', secondary: '#f97316' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  gurunanak: {
    deityName: 'WAHEGURU',
    buttonLabels: ['WAHE', 'GURU'],
    colors: { primary: '#f97316', secondary: '#38bdf8' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  buddha: {
    deityName: 'OM MANI PADME HUM',
    buttonLabels: ['OM', 'MANI PADME HUM'],
    colors: { primary: '#fbbf24', secondary: '#f8fafc' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
  mahavir: {
    deityName: 'NAMO ARIHANTANAM',
    buttonLabels: ['NAMO', 'ARIHANTANAM'],
    colors: { primary: '#f8fafc', secondary: '#fbbf24' },
    backgroundImage: backgroundImage,
    sounds: [button1Sound, button2Sound],
  },
};
