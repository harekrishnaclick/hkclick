import SacredTextPage from '@/components/SacredTextPage';
import { bajrangBaanVerses } from '@/lib/bajrangBaan';

export default function BajrangBaanPage() {
  return (
    <SacredTextPage
      verses={bajrangBaanVerses}
      title="बजरंग बाण"
      completionTitle="जय बजरंगबली!"
      completionSubtitle="बजरंग बाण पूर्ण हुआ"
      completionEnglish="BAJRANG BAAN COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#ef4444"
      storageKey="harekrishna_bajrang_baan_progress"
    />
  );
}
