import SacredTextPage from '@/components/SacredTextPage';
import { hanumanAshtakVerses } from '@/lib/hanumanAshtak';

export default function HanumanAshtakPage() {
  return (
    <SacredTextPage
      verses={hanumanAshtakVerses}
      title="हनुमान अष्टक"
      completionTitle="जय हनुमान!"
      completionSubtitle="हनुमान अष्टक पूर्ण हुआ"
      completionEnglish="ASHTAK COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#f97316"
    />
  );
}
