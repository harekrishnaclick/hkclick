import { useState } from 'react';
import { Link } from 'wouter';

const CONSENT_KEY = 'harekrishna_cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(CONSENT_KEY);
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const handleAccept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* ignore */ }
    setVisible(false);
  };

  const handleDecline = () => {
    try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[80] px-4 py-3 md:py-4"
      style={{
        background: 'rgba(8,13,34,0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,215,0,0.18)',
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="material-symbols-outlined text-[#ffd700] text-xl shrink-0 mt-0.5 sm:mt-0">cookie</span>
        <p className="text-[#d0c6ab] text-xs leading-relaxed flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          We use your browser's local storage to save your chanting progress, preferences, and session data — 
          all stored on your device. No tracking cookies or ads.{' '}
          <Link href="/privacy" className="text-[#ffd700] underline underline-offset-2 hover:text-[#fff6df]">
            Learn more
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-1.5 rounded-lg text-xs text-[#d0c6ab] hover:text-[#fff6df] transition-colors"
            style={{
              fontFamily: 'Inter, sans-serif',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              fontFamily: 'Sora, sans-serif',
              background: 'linear-gradient(135deg, #e9c400, #ffd700)',
              color: '#3a3000',
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
