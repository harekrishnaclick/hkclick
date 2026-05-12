import { Link } from 'wouter';

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-[#ffd700] text-2xl">{icon}</span>
        <h2 className="text-[#ffd700] font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h2>
      </div>
      <div className="text-[#d0c6ab] text-sm leading-relaxed space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-12 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Last updated: May 2026</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>Privacy Policy</h1>
      </div>

      <div className="space-y-5">
        <Section icon="info" title="Overview">
          <p>
            HareKrishna is a spiritual chanting app. We are committed to your privacy. This policy explains 
            what information we collect, how it is used, and how it is protected. We do not sell your data, 
            show ads, or use third-party analytics trackers.
          </p>
        </Section>

        <Section icon="storage" title="Data stored on your device (localStorage)">
          <p>The following information is stored locally in your browser's localStorage — it never leaves your device unless you submit to the leaderboard:</p>
          <ul className="space-y-1.5 mt-2">
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Game state</strong> — your current score, mala count, and session progress per deity</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Session history</strong> — past chanting sessions (deity, count, duration, timestamp)</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Streak & milestones</strong> — daily goal progress, streak count, personal records</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Preferences</strong> — language (Hindi/English), mute setting, last visited deity</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Login session</strong> — your username and account ID if you choose to log in</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Cookie consent</strong> — whether you accepted or declined this consent notice</span></li>
          </ul>
          <p className="mt-2">You can clear all this data at any time by clearing your browser's site data.</p>
        </Section>

        <Section icon="cloud" title="Data stored on our servers (MongoDB)">
          <p>If you create an account, we store the following on our secure cloud database:</p>
          <ul className="space-y-1.5 mt-2">
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Username</strong> — chosen by you at registration</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Password</strong> — stored as a one-way bcrypt hash only; we cannot read your password</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Leaderboard score</strong> — your username, score, and country code (if you submit to the leaderboard)</span></li>
          </ul>
          <p className="mt-2">We do not collect your email address, phone number, or any other personal identifying information.</p>
        </Section>

        <Section icon="public" title="IP address & country detection">
          <p>
            When you visit the app, your IP address is used to look up your country code (e.g. "IN" for India, "US" for the United States) 
            via a third-party geolocation API (<span className="text-[#fff6df]">ipapi.co</span>). This lookup happens server-side.
          </p>
          <p className="mt-2">
            <strong className="text-[#fff6df]">We do not store your IP address.</strong> The country code (two letters only) may be 
            stored alongside your leaderboard score if you choose to submit one.
          </p>
        </Section>

        <Section icon="block" title="What we do NOT do">
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> We do not use Google Analytics, Facebook Pixel, or any other third-party tracker</li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> We do not show advertisements</li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> We do not sell or share your data with any third party</li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> We do not collect data from children — this app is intended for users 13 and older</li>
          </ul>
        </Section>

        <Section icon="security" title="Data security">
          <p>
            All data in transit is encrypted using HTTPS/TLS. Passwords are hashed using bcrypt with a salt 
            factor of 10 — they are mathematically irreversible. Our database is hosted on MongoDB Atlas 
            with access controls and encryption at rest.
          </p>
        </Section>

        <Section icon="contact_support" title="Contact">
          <p>
            If you have questions about this policy or wish to request deletion of your account data, 
            please reach out via the HareKrishna app community. We will respond within 30 days.
          </p>
        </Section>

        <div className="flex gap-3 pt-2">
          <Link
            href="/about"
            className="flex-1 py-2.5 rounded-xl text-center text-sm text-[#d0c6ab] hover:text-[#fff6df] transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
          >
            About
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
