import SacredTextPage from '@/components/SacredTextPage';
import { shivChalisaVerses } from '@/lib/shivChalisa';

export default function ShivChalisaPage() {
  return (
    <SacredTextPage
      verses={shivChalisaVerses}
      title="शिव चालीसा"
      completionTitle="हर हर महादेव!"
      completionSubtitle="शिव चालीसा पूर्ण हुई"
      completionEnglish="CHALISA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#60a5fa"
    />
  );
}
