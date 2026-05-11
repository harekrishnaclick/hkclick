import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Translations } from '@/lib/translations';
import { saveSession, recordMalaTiming } from '@/lib/statsStorage';
import type { LeaderboardEntry } from '@shared/schema';

interface AuthUser {
  id: string;
  username: string;
}

type ButtonType = 'button1' | 'button2';

export interface DeityGameConfig {
  deityName: string;
  buttonLabels: [string, string];
  colors: { primary: string; secondary: string };
  backgroundImage: string;
  deityImage?: string;
  sounds: [string, string];
}

interface DeityGameProps {
  config: DeityGameConfig;
  user: AuthUser | null;
  isMuted: boolean;
  t: Translations;
  deityKey: string;
}

const CLICK_COOLDOWN_MS = 100;

const deityTaglines: Record<string, string> = {
  krishna: "The Cosmic Enchanter",
  radha: "Divine Love Personified",
  rama: "The Eternal Guardian",
  shivji: "The Eternal Meditator",
  hanuman: "The Strength of Devotion",
  ganesh: "Remover of Obstacles",
  durga: "The Invincible Mother",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function DeityGame({ config, user, isMuted, t, deityKey }: DeityGameProps) {
  const { buttonLabels, colors, backgroundImage, deityImage, sounds } = config;
  const localizedTitle = t.deityTitles[deityKey] || config.deityName;
  const localizedButtons = t.deityButtons[deityKey] || buttonLabels;

  const [score, setScore] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [expecting, setExpecting] = useState<ButtonType>('button1');
  const [lastClicked, setLastClicked] = useState<ButtonType | null>(null);
  const [pressedButton, setPressedButton] = useState<ButtonType | null>(null);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);

  const sessionStartRef = useRef(Date.now());
  const lastClickTime = useRef(0);
  const malaStartTimeRef = useRef(Date.now());
  const currentScoreRef = useRef(0);
  const currentMalaRef = useRef(0);

  const [audio1] = useState(() => new Audio(sounds[0]));
  const [audio2] = useState(() => new Audio(sounds[1]));

  const { data: globalLeaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/global'],
  });

  const userRank =
    globalLeaderboard && user
      ? globalLeaderboard.findIndex((e) => e.playerName === user.username) + 1
      : 0;

  useEffect(() => {
    localStorage.setItem('cosmicMantra_lastDeity', deityKey);
  }, [deityKey]);

  useEffect(() => {
    audio1.preload = 'auto';
    audio2.preload = 'auto';
    audio1.volume = 0.7;
    audio2.volume = 0.7;
  }, [audio1, audio2]);

  useEffect(() => {
    const timer = setInterval(() => setSessionSecs((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    currentScoreRef.current = score;
  }, [score]);

  useEffect(() => {
    currentMalaRef.current = malaCount;
  }, [malaCount]);

  useEffect(() => {
    return () => {
      const finalScore = currentScoreRef.current;
      const finalMalas = currentMalaRef.current;
      if (finalScore > 0) {
        saveSession({
          deity: deityKey,
          mantras: finalScore,
          malas: finalMalas,
          timestamp: sessionStartRef.current,
          duration: Math.floor((Date.now() - sessionStartRef.current) / 1000),
        });
      }
    };
  }, [deityKey]);

  const handleButtonClick = useCallback(
    (buttonType: ButtonType) => {
      const now = Date.now();
      if (now - lastClickTime.current < CLICK_COOLDOWN_MS) return;
      lastClickTime.current = now;

      if (!isMuted) {
        try {
          const audio = buttonType === 'button1' ? audio1 : audio2;
          audio.currentTime = 0;
          audio.play().catch(console.warn);
        } catch (e) {
          console.warn('Audio failed:', e);
        }
      }

      setPressedButton(buttonType);
      setTimeout(() => setPressedButton(null), 100);

      setExpecting((prevExpecting) => {
        setLastClicked((prevLastClicked) => {
          setScore((prevScore) => {
            let newScore = prevScore;
            let newMalas = currentMalaRef.current;

            if (buttonType === prevExpecting) {
              if (buttonType === 'button2' && prevLastClicked === 'button1') {
                newScore = prevScore + 1;
                if (newScore > 0 && newScore % 108 === 0) {
                  const malaSecs = Math.floor(
                    (Date.now() - malaStartTimeRef.current) / 1000,
                  );
                  recordMalaTiming(malaSecs);
                  malaStartTimeRef.current = Date.now();
                  newMalas += 1;
                  setMalaCount(newMalas);
                }
                setScoreAnimation(true);
                setTimeout(() => setScoreAnimation(false), 300);
              }
            }
            return newScore;
          });
          return buttonType;
        });
        return buttonType === 'button1' ? 'button2' : 'button1';
      });
    },
    [audio1, audio2, isMuted],
  );

  const malaProgress = (score % 108) / 108;
  const tagline = deityTaglines[deityKey] || '';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deity portrait background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${deityImage || backgroundImage})`,
          backgroundSize: deityImage ? 'cover' : 'cover',
          backgroundPosition: deityImage ? 'center top' : 'center',
          opacity: deityImage ? 0.22 : 0.15,
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 75%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 75%, transparent 100%)',
        }}
      />
      <div className="stars" />

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-10 pb-6 px-4">
        {/* Deity title */}
        <div className="text-center mb-7 mt-2">
          <p
            className="text-[#d0c6ab] text-[11px] tracking-[0.28em] uppercase mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tagline}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fff6df]"
            style={{
              fontFamily: 'Sora, sans-serif',
              textShadow: '0 0 24px rgba(255,246,223,0.35)',
            }}
          >
            {localizedTitle}
          </h1>
        </div>

        {/* Score glass panel */}
        <div
          className="glass-card w-full max-w-xs sm:max-w-sm md:max-w-md px-8 py-7 mb-7 text-center"
          style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.45)' }}
        >
          <p
            className="text-[#d0c6ab] text-[11px] tracking-[0.22em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Current Session
          </p>

          <div
            className={`text-[4rem] sm:text-[5rem] font-bold text-[#fff6df] leading-none ${scoreAnimation ? 'animate-score-increase' : ''}`}
            style={{
              fontFamily: 'Sora, sans-serif',
              textShadow: '0 0 20px rgba(255,246,223,0.35)',
            }}
          >
            {score}
          </div>

          <p
            className="text-[#d0c6ab] text-[11px] tracking-[0.22em] uppercase mt-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            PAIRS COMPLETED
          </p>

          {malaCount > 0 && (
            <p
              className="text-[#ffd700] text-xs font-semibold mt-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {malaCount} mala{malaCount !== 1 ? 's' : ''} completed
            </p>
          )}

          {/* Mala progress bar */}
          <div className="mt-4 w-full bg-[#2f334b] rounded-full h-1.5 overflow-hidden">
            <div
              className="progress-bar-gold h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${malaProgress * 100}%` }}
            />
          </div>
          <p
            className="text-[#d0c6ab]/50 text-[11px] mt-1.5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {108 - (score % 108)} pairs to next mala
          </p>
        </div>

        {/* Chant buttons */}
        <div className="flex items-center gap-5 sm:gap-8 mb-7">
          {(
            [
              { type: 'button1' as ButtonType, label: localizedButtons[0], color: colors.primary },
              { type: 'button2' as ButtonType, label: localizedButtons[1], color: colors.secondary },
            ] as const
          ).map(({ type, label, color }) => {
            const isExpected = expecting === type;
            const isPressed = pressedButton === type;
            const len = label.length;
            const fontSize =
              len <= 4
                ? 'clamp(1rem, 3.5vw, 1.5rem)'
                : len <= 8
                  ? 'clamp(0.85rem, 3vw, 1.2rem)'
                  : 'clamp(0.65rem, 2.2vw, 0.95rem)';

            return (
              <button
                key={type}
                onClick={() => handleButtonClick(type)}
                className="chant-btn flex items-center justify-center text-center"
                style={{
                  width: 'clamp(118px, 26vw, 172px)',
                  height: 'clamp(118px, 26vw, 172px)',
                  fontSize,
                  background: isExpected
                    ? `radial-gradient(circle at 35% 35%, ${color}50 0%, ${color}20 60%, rgba(13,18,40,0.65) 100%)`
                    : 'rgba(25,30,53,0.55)',
                  border: isExpected
                    ? `2px solid ${color}80`
                    : '1px solid rgba(255,255,255,0.09)',
                  transform: isPressed ? 'scale(0.91)' : 'scale(1)',
                  transition:
                    'transform 0.08s ease-out, box-shadow 0.15s ease, border 0.15s ease',
                  boxShadow: isExpected
                    ? `0 0 30px ${color}50, 0 6px 24px rgba(0,0,0,0.4)`
                    : '0 4px 20px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(14px)',
                  letterSpacing: '0.06em',
                  lineHeight: 1.2,
                  padding: '10px',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Indicator dots */}
        <div className="flex items-center gap-2.5 mb-7">
          {(['button1', 'button2'] as ButtonType[]).map((b) => (
            <div
              key={b}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${expecting === b ? 'animate-indicator-blink' : ''}`}
              style={{
                backgroundColor:
                  expecting === b
                    ? b === 'button1'
                      ? colors.primary
                      : colors.secondary
                    : 'rgba(255,255,255,0.12)',
                boxShadow:
                  expecting === b
                    ? `0 0 8px ${b === 'button1' ? colors.primary : colors.secondary}`
                    : 'none',
              }}
            />
          ))}
        </div>

        {/* Bento stats */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md grid grid-cols-3 gap-2.5 mb-5">
          {[
            {
              icon: 'timer',
              color: '#d0c6ab',
              value: formatTime(sessionSecs),
              label: 'FOCUS TIME',
            },
            {
              icon: 'military_tech',
              color: '#ffd700',
              value: userRank > 0 ? `#${userRank}` : '—',
              label: 'DAILY RANK',
            },
            {
              icon: 'bolt',
              color: '#dcb8ff',
              value: malaCount > 0 ? `${malaCount} Mala${malaCount !== 1 ? 's' : ''}` : 'Pure',
              label: 'ENERGY',
            },
          ].map(({ icon, color, value, label }) => (
            <div key={label} className="glass-card px-2 py-4 text-center">
              <span
                className="material-symbols-outlined text-xl mb-1 block"
                style={{ color }}
              >
                {icon}
              </span>
              <p
                className="font-bold text-sm"
                style={{ fontFamily: 'Sora, sans-serif', color }}
              >
                {value}
              </p>
              <p
                className="text-[#d0c6ab] text-[10px] mt-0.5 tracking-wider"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard link */}
        <Link
          href="/leaderboard"
          className="text-[#d0c6ab] hover:text-[#ffd700] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="material-symbols-outlined text-base">leaderboard</span>
          View Leaderboard &amp; Submit Score
        </Link>
      </div>
    </div>
  );
}
