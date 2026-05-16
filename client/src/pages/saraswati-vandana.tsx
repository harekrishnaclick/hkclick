import SacredTextPage from '@/components/SacredTextPage';
import { saraswatiVandanaVerses } from '@/lib/saraswatiVandana';

export default function SaraswatiVandanaPage() {
  return (
    <SacredTextPage
      verses={saraswatiVandanaVerses}
      title="सरस्वती वन्दना"
      completionTitle="जय माँ सरस्वती!"
      completionSubtitle="सरस्वती वन्दना पूर्ण हुई"
      completionEnglish="SARASWATI VANDANA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#818cf8"
      storageKey="harekrishna_saraswati_vandana_progress"
    />
  );
}
