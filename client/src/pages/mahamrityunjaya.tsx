import SacredTextPage from '@/components/SacredTextPage';
import { mahamrityunjayaVerses } from '@/lib/mahamrityunjaya';

export default function MahamrityunjayaPage() {
  return (
    <SacredTextPage
      verses={mahamrityunjayaVerses}
      title="महामृत्युञ्जय मंत्र"
      completionTitle="ॐ नमः शिवाय!"
      completionSubtitle="महामृत्युञ्जय मंत्र पूर्ण हुआ"
      completionEnglish="MAHAMRITYUNJAYA COMPLETE"
      resetLabel="फिर से पढ़ें · Start Over"
      hintLabel="पहले शब्द पर टैप करें ✦ Tap the first word"
      accentColor="#06b6d4"
      storageKey="harekrishna_mahamrityunjaya_progress"
    />
  );
}
