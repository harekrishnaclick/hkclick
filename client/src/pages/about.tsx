import { Link } from 'wouter';

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-12 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Who we are</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>About HareKrishna</h1>
      </div>

      <div className="space-y-5">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#ffd700] text-2xl">auto_awesome</span>
            <h2 className="text-[#ffd700] font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>What is HareKrishna?</h2>
          </div>
          <p className="text-[#d0c6ab] text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            HareKrishna is a free spiritual chanting companion inspired by the ancient tradition of mantra japa — 
            the meditative repetition of sacred names. Whether you follow Krishna, Shiva, Hanuman, Durga, or any 
            other deity, this app helps you count your chants, track your malas, and stay consistent in your daily practice.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#dcb8ff] text-2xl">spa</span>
            <h2 className="text-[#ffd700] font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>How it works</h2>
          </div>
          <ul className="text-[#d0c6ab] text-sm leading-relaxed space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li className="flex gap-2"><span className="text-[#ffd700]">•</span> Choose your deity and alternate tapping the two mantra buttons</li>
            <li className="flex gap-2"><span className="text-[#ffd700]">•</span> Every 108 pairs completes one mala — a full cycle of a prayer bead rosary</li>
            <li className="flex gap-2"><span className="text-[#ffd700]">•</span> Your session stats, streaks, and personal records are saved locally on your device</li>
            <li className="flex gap-2"><span className="text-[#ffd700]">•</span> Create an account to submit your score to the global leaderboard and see how you compare with devotees worldwide</li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#00daf3] text-2xl">volunteer_activism</span>
            <h2 className="text-[#ffd700] font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Our intention</h2>
          </div>
          <p className="text-[#d0c6ab] text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            This app is offered freely, without ads, as a small contribution to anyone who wishes to deepen their 
            spiritual practice. It is not affiliated with any religious organization. All mantras and deity names 
            are used with devotion and respect for the traditions they belong to.
          </p>
        </div>

        <div
          className="glass-card p-5 text-center"
          style={{ background: 'rgba(119,1,208,0.12)', border: '1px solid rgba(220,184,255,0.15)' }}
        >
          <span className="material-symbols-outlined text-[#dcb8ff] text-3xl mb-2 block">format_quote</span>
          <p className="text-[#fff6df] text-sm leading-relaxed italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            "Chant the holy name, chant the holy name, chant the holy name of the Lord. In this age of quarrel 
            there is no other way, no other way, no other way."
          </p>
          <p className="text-[#dcb8ff] text-xs mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            — Brihan-naradiya Purana
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/privacy"
            className="flex-1 py-2.5 rounded-xl text-center text-sm text-[#d0c6ab] hover:text-[#fff6df] transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="flex-1 py-2.5 rounded-xl text-center text-sm text-[#d0c6ab] hover:text-[#fff6df] transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
