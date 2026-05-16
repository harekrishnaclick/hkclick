import type { ChalisaVerse } from './hanumanChalisa';

function w(line: string): string[] {
  return line.trim().split(/\s+/);
}

export const ganeshVandanaVerses: ChalisaVerse[] = [
  {
    id: 'ganesh-1',
    label: 'गणेश वन्दना',
    lines: [
      w('वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ'),
      w('निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा'),
    ],
  },
  {
    id: 'ganesh-2',
    label: '',
    lines: [
      w('गजाननं भूतगणादिसेवितं'),
      w('कपित्थजम्बूफलचारुभक्षणम्'),
      w('उमासुतं शोकविनाशकारकं'),
      w('नमामि विघ्नेश्वरपादपङ्कजम्'),
    ],
  },
  {
    id: 'ganesh-3',
    label: '',
    lines: [
      w('शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्'),
      w('प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये'),
    ],
  },
  {
    id: 'ganesh-4',
    label: '',
    lines: [
      w('अगजानन पद्मार्कं गजाननमहर्निशम्'),
      w('अनेकदन्तं भक्तानामेकदन्तमुपास्महे'),
    ],
  },
  {
    id: 'ganesh-5',
    label: '',
    lines: [
      w('सिद्धिविनायक नमस्तुभ्यं सिद्धिदायक नमोस्तुते'),
      w('विघ्नविनाशक देवेश गणनाथ नमोस्तुते'),
    ],
  },
  {
    id: 'ganesh-mantra',
    label: 'मंत्र',
    lines: [
      w('ॐ गं गणपतये नमः'),
      w('ॐ गं गणपतये नमः'),
      w('ॐ गं गणपतये नमः'),
    ],
  },
  {
    id: 'ganesh-samapti',
    label: 'समाप्ति',
    lines: [
      w('जय गणेश जय गणेश जय गणेश देवा'),
      w('माता जाकी पार्वती पिता महादेवा'),
    ],
  },
];

export { buildWordList } from './hanumanChalisa';
