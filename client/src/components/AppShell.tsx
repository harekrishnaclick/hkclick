import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import type { Language, Translations } from '@/lib/translations';

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [location]);

  return (
    <div key={animKey} className="animate-page-enter h-full">
      {children}
    </div>
  );
}

interface AuthUser {
  id: string;
  username: string;
}

interface AppShellProps {
  children: React.ReactNode;
  user: AuthUser | null;
  isMuted: boolean;
  language: Language;
  onLoginClick: () => void;
  onLogout: () => void;
  onToggleMute: () => void;
  onToggleLanguage: () => void;
  t: Translations;
}

const deityNav = [
  { key: 'krishna', path: '/krishna', icon: 'spa' },
  { key: 'radha', path: '/radha', icon: 'local_florist' },
  { key: 'rama', path: '/rama', icon: 'architecture' },
  { key: 'shivji', path: '/shivji', icon: 'temple_hindu' },
  { key: 'hanuman', path: '/hanuman', icon: 'pets' },
  { key: 'ganesh', path: '/ganesh', icon: 'emoji_nature' },
  { key: 'durga', path: '/durga', icon: 'brightness_high' },
];

export function AppShell({
  children,
  user,
  isMuted,
  language,
  onLoginClick,
  onLogout,
  onToggleMute,
  onToggleLanguage,
  t,
}: AppShellProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lastDeity = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('cosmicMantra_lastDeity') || 'krishna')
    : 'krishna';
  const chantHref = `/${lastDeity}`;

  const isDeityRoute =
    deityNav.some((d) => location === d.path) || location === '/';
  const isStatsRoute = location === '/stats';
  const isDeityGallery = location === '/deities';
  const isLeaderboard = location === '/leaderboard';

  const activeDeityIcon =
    deityNav.find(
      (d) => location === d.path || (location === '/' && d.path === '/krishna'),
    )?.icon || 'spa';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 px-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,215,0,0.12)',
            border: '1.5px solid rgba(255,215,0,0.35)',
          }}
        >
          <span className="material-symbols-outlined text-[#ffd700] text-xl">
            {activeDeityIcon}
          </span>
        </div>
        <div>
          <p
            className="text-[#ffd700] text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {t.nav.deities.toUpperCase()}
          </p>
          <p className="text-[#d0c6ab] text-[11px]">{t.nav.selectFocus}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin pr-1">
        {deityNav.map((deity) => {
          const isActive =
            location === deity.path ||
            (location === '/' && deity.path === '/krishna');
          return (
            <Link
              key={deity.path}
              href={deity.path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-deity-link ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {deity.icon}
              </span>
              <span>{t.deityNames[deity.key] || deity.key}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ffd700]"
                  style={{ boxShadow: '0 0 6px rgba(255,215,0,0.8)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
        <button
          onClick={() => {
            onLoginClick();
            setSidebarOpen(false);
          }}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'Sora, sans-serif',
            background: user ? 'rgba(119,1,208,0.3)' : 'rgba(119,1,208,0.5)',
            border: '1px solid rgba(220,184,255,0.2)',
            color: '#dcb7ff',
          }}
        >
          {user ? user.username : t.menu.loginRegister}
        </button>
        {user && (
          <button
            onClick={() => {
              onLogout();
              setSidebarOpen(false);
            }}
            className="w-full py-1.5 text-red-400/80 hover:text-red-300 text-xs transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t.menu.logout}
          </button>
        )}
        <div className="flex justify-between px-1 pt-1">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-[#d0c6ab] hover:text-[#fff6df] text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">language</span>
            <span style={{ fontFamily: 'Inter, sans-serif' }}>
              {language === 'en' ? 'हिंदी' : 'English'}
            </span>
          </button>
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 text-[#d0c6ab] hover:text-[#fff6df] text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif' }}>
              {isMuted ? t.menu.unmuteSound : t.menu.muteSound}
            </span>
          </button>
        </div>

        <div className="flex justify-center gap-4 pt-3 border-t border-white/5 mt-1">
          {[
            { href: '/about', label: 'About' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className="text-[#d0c6ab]/50 hover:text-[#d0c6ab] text-[10px] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="h-[100svh] md:min-h-screen overflow-hidden md:overflow-auto"
      style={{
        background: 'radial-gradient(ellipse at 60% 0%, #191e35 0%, #0d1228 70%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-3"
        style={{
          background: 'rgba(13,18,40,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link
          href={chantHref}
          className="text-xl font-bold text-[#ffd700] cursor-pointer"
          style={{
            fontFamily: 'Sora, sans-serif',
            textShadow: '0 0 12px rgba(255,215,0,0.5)',
          }}
        >
          HareKrishna
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1 mr-2">
            {[
              { href: chantHref, label: t.nav.chant, active: isDeityRoute },
              { href: '/stats', label: t.nav.stats, active: isStatsRoute },
              { href: '/deities', label: t.nav.deities, active: isDeityGallery },
              { href: '/leaderboard', label: t.nav.ranks, active: isLeaderboard },
            ].map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link px-4 py-1.5 rounded-lg text-sm cursor-pointer ${
                  active ? 'active bg-[#ffd700]/10' : 'text-[#d0c6ab] hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="material-symbols-outlined text-[#d0c6ab] hover:text-[#fff6df] p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Open menu"
          >
            menu
          </button>
        </div>
      </header>

      {/* Backdrop (all screen sizes) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-80 z-[70] p-5 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(8,13,34,0.88)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-4 pt-14">
          <span
            className="text-[#ffd700] text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {t.nav.navigation}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="material-symbols-outlined text-[#d0c6ab] hover:text-[#fff6df] text-xl cursor-pointer"
            aria-label="Close menu"
          >
            close
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Page content */}
      <main className="pt-14 pb-16 md:pb-0 h-[100svh] md:h-auto md:min-h-screen overflow-hidden md:overflow-visible">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Bottom navigation (mobile only) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16"
        style={{
          background: 'rgba(25,30,53,0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[
          { href: chantHref, icon: 'auto_awesome', label: t.nav.chant, active: isDeityRoute },
          { href: '/stats', icon: 'insert_chart', label: t.nav.stats, active: isStatsRoute },
          { href: '/deities', icon: 'groups', label: t.nav.deities, active: isDeityGallery },
          { href: '/leaderboard', icon: 'leaderboard', label: t.nav.ranks, active: isLeaderboard },
        ].map(({ href, icon, label, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-all cursor-pointer ${
              active ? 'text-[#ffd700] scale-110' : 'text-[#d0c6ab] hover:text-[#fff6df]'
            }`}
            style={
              active ? { filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' } : {}
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span
              className="text-[10px] font-semibold tracking-wider"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
