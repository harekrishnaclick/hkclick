import SacredTextPage from '@/components/SacredTextPage';
import { omNamahShivayaVerses } from '@/lib/omNamahShivaya';

export default function OmNamahShivayaPage() {
  return (
    <SacredTextPage
      verses={omNamahShivayaVerses}
      title="ॐ नमः शिवाय — पंचाक्षर स्तोत्र"
      completionTitle="हर हर महादेव!"
      completionSubtitle="पंचाक्षर स्तोत्र पूर्ण हुआ"
      completionEnglish="PANCHAKSHARA STOTRA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#94a3b8"
      storageKey="harekrishna_omnamahshivaya_progress"
    />
  );
}
