import SacredTextPage from '@/components/SacredTextPage';
import { chalisaVerses } from '@/lib/hanumanChalisa';

export default function ChalisaPage() {
  return (
    <SacredTextPage
      verses={chalisaVerses}
      title="हनुमान चालीसा"
      completionTitle="जय हनुमान!"
      completionSubtitle="हनुमान चालीसा पूर्ण हुई"
      completionEnglish="CHALISA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#f97316"
      storageKey="harekrishna_chalisa_progress"
    />
  );
}
