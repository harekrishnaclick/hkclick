import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, User, LogIn, LogOut, Volume2, VolumeX } from 'lucide-react';

interface AuthUser {
  id: string;
  username: string;
}

interface DeityLink {
  name: string;
  path: string;
  icon: string;
}

const deityLinks: DeityLink[] = [
  { name: 'Krishna', path: '/krishna', icon: '🙏' },
  { name: 'Radha', path: '/radha', icon: '🌸' },
  { name: 'Rama', path: '/rama', icon: '🏹' },
  { name: 'Shivji', path: '/shivji', icon: '🔱' },
  { name: 'Hanuman', path: '/hanuman', icon: '🐒' },
  { name: 'Ganesh', path: '/ganesh', icon: '🐘' },
  { name: 'Durga', path: '/durga', icon: '🦁' },
  { name: 'Sai Baba', path: '/saibaba', icon: '🙏' },
  { name: 'Guru Nanak', path: '/gurunanak', icon: '☬' },
  { name: 'Buddha', path: '/buddha', icon: '☸' },
  { name: 'Mahavir', path: '/mahavir', icon: '✋' },
];

interface HamburgerMenuProps {
  user: AuthUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function HamburgerMenu({ user, onLoginClick, onLogout, isMuted, onToggleMute }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative z-50 p-2 rounded-full bg-white/10 backdrop-blur-md border border-golden/30 hover:bg-white/20 hover:border-golden/50 transition-all duration-300"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-golden" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-gradient-to-b from-black/90 via-cosmic-purple/80 to-deep-space/90 backdrop-blur-xl border-l border-golden/30 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-golden/20">
            <span className="orbitron text-golden text-lg font-bold tracking-wider">MENU</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-golden" />
            </button>
          </div>

          {user && (
            <div className="px-4 py-3 border-b border-golden/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-golden/20 border border-golden/40 flex items-center justify-center">
                  <User className="w-4 h-4 text-golden" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">{user.username}</p>
                  <p className="text-white/40 text-xs">Logged in</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
            <div className="px-4 py-2">
              <p className="text-golden/60 text-xs orbitron tracking-widest uppercase mb-2">Deities</p>
            </div>
            {deityLinks.map((deity) => {
              const isActive = location === deity.path || (location === '/' && deity.path === '/krishna');
              return (
                <Link key={deity.path} href={deity.path}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-golden/15 border-r-2 border-golden text-golden'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-lg w-7 text-center">{deity.icon}</span>
                    <span className="text-sm font-medium">{deity.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-golden shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-golden/20 p-4 space-y-2">
            <button
              onClick={onToggleMute}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-golden" />
              )}
              <span className="text-sm font-medium">{isMuted ? 'Unmute Sound' : 'Mute Sound'}</span>
            </button>

            {user ? (
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors text-white/80 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-golden/10 hover:bg-golden/20 border border-golden/30 transition-colors text-golden"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm font-medium">Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
