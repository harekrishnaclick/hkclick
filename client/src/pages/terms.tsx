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

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-12 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Last updated: May 2026</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>Terms of Service</h1>
      </div>

      <div className="space-y-5">
        <Section icon="gavel" title="Acceptance of terms">
          <p>
            By using HareKrishna, you agree to these terms. If you do not agree, please discontinue use 
            of the app. These terms may be updated from time to time — continued use after changes 
            constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section icon="check_circle" title="Permitted use">
          <p>HareKrishna is provided for personal, non-commercial spiritual practice. You may:</p>
          <ul className="space-y-1.5 mt-2">
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> Use the app freely for chanting, tracking malas, and personal spiritual progress</li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> Create an account to participate in the global leaderboard</li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> Share the app URL with others</li>
          </ul>
        </Section>

        <Section icon="block" title="Prohibited use">
          <p>The following are strictly not allowed:</p>
          <ul className="space-y-1.5 mt-2">
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Bots and auto-clickers</strong> — using automated tools to generate clicks or inflate scores</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Score manipulation</strong> — submitting scores via the API that do not reflect genuine chanting activity</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Impersonation</strong> — registering a username that impersonates another person or entity</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Abuse</strong> — attempting to overload, hack, or otherwise disrupt the service</span></li>
            <li className="flex gap-2"><span className="text-[#ffd700] shrink-0">•</span> <span><strong className="text-[#fff6df]">Commercial use</strong> — reselling, repackaging, or monetising the app without written permission</span></li>
          </ul>
        </Section>

        <Section icon="leaderboard" title="Leaderboard & accounts">
          <p>
            The global leaderboard is a shared space for genuine devotees. We reserve the right to remove 
            any entry or account that we reasonably believe has been generated through automated means or 
            score manipulation, without prior notice.
          </p>
          <p className="mt-2">
            Account registration requires a username and password. You are responsible for keeping your 
            credentials secure. We are not liable for any loss resulting from unauthorised access to your account.
          </p>
        </Section>

        <Section icon="info" title="No warranty">
          <p>
            HareKrishna is provided "as is" without any warranty of any kind, express or implied. 
            We do not guarantee uninterrupted availability, and we are not responsible for any loss 
            of data or spiritual progress records stored on your device.
          </p>
        </Section>

        <Section icon="update" title="Changes to the service">
          <p>
            We may update, modify, or discontinue any part of the app at any time. We may also reset 
            the leaderboard periodically to keep the competition fresh. We will make reasonable efforts 
            to notify users of significant changes.
          </p>
        </Section>

        <Section icon="balance" title="Governing law">
          <p>
            These terms are governed by applicable law. Any disputes will be resolved in good faith. 
            If you have a concern, please contact us before pursuing any formal action.
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
            href="/privacy"
            className="flex-1 py-2.5 rounded-xl text-center text-sm text-[#d0c6ab] hover:text-[#fff6df] transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
