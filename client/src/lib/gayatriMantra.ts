import type { ChalisaVerse } from './hanumanChalisa';

function w(line: string): string[] {
  return line.trim().split(/\s+/);
}

export const gayatriVerses: ChalisaVerse[] = [
  {
    id: 'gayatri-intro',
    label: 'आवाहन',
    lines: [
      w('ॐ भूर्भुवः स्वः'),
    ],
  },
  {
    id: 'gayatri-main',
    label: 'गायत्री मंत्र',
    lines: [
      w('तत्सवितुर्वरेण्यम्'),
      w('भर्गो देवस्य धीमहि'),
      w('धियो यो नः प्रचोदयात्'),
    ],
  },
  {
    id: 'gayatri-meaning',
    label: 'अर्थ',
    lines: [
      w('हम उस परमात्मा की महिमा का ध्यान करते हैं'),
      w('जो सृष्टि का स्रोत हैं पापों को नष्ट करने वाले हैं'),
      w('और दिव्य प्रकाश स्वरूप हैं'),
      w('वे हमारी बुद्धि को प्रकाशित करें'),
    ],
  },
  {
    id: 'gayatri-repeat-1',
    label: 'पुनः पाठ',
    lines: [
      w('ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्'),
      w('भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्'),
    ],
  },
  {
    id: 'gayatri-repeat-2',
    label: '',
    lines: [
      w('ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्'),
      w('भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्'),
    ],
  },
  {
    id: 'gayatri-repeat-3',
    label: '',
    lines: [
      w('ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्'),
      w('भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्'),
    ],
  },
  {
    id: 'gayatri-samapti',
    label: 'समाप्ति',
    lines: [
      w('ॐ शान्तिः शान्तिः शान्तिः'),
    ],
  },
];

export { buildWordList } from './hanumanChalisa';
