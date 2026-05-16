import SacredTextPage from '@/components/SacredTextPage';
import { ganeshVandanaVerses } from '@/lib/ganeshVandana';

export default function GaneshVandanaPage() {
  return (
    <SacredTextPage
      verses={ganeshVandanaVerses}
      title="गणेश वन्दना"
      completionTitle="जय गणेश!"
      completionSubtitle="गणेश वन्दना पूर्ण हुई"
      completionEnglish="GANESH VANDANA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#f97316"
      storageKey="harekrishna_ganesh_vandana_progress"
    />
  );
}
