import SacredTextPage from '@/components/SacredTextPage';
import { gayatriVerses } from '@/lib/gayatriMantra';

export default function GayatriMantraPage() {
  return (
    <SacredTextPage
      verses={gayatriVerses}
      title="गायत्री मंत्र"
      completionTitle="ॐ शान्तिः!"
      completionSubtitle="गायत्री मंत्र पूर्ण हुआ"
      completionEnglish="GAYATRI MANTRA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#f59e0b"
      storageKey="harekrishna_gayatri_progress"
    />
  );
}
