import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Translations } from '@/lib/translations';
import { saveSession, recordMalaTiming, getDailyPairs, getDailyGoal } from '@/lib/statsStorage';
import { loadDeityImage } from '@/lib/deityConfigs';
import type { LeaderboardEntry } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface Particle {
  id: number;
  x: number;
  y: number;
  px: number;
  py: number;
  color: string;
  size: number;
  delay: number;
}

function RollingDigit({ value, animKey }: { value: string; animKey: number }) {
  return (
    <span
      className="inline-block overflow-hidden"
      style={{ verticalAlign: 'top', lineHeight: 'inherit' }}
    >
      <span key={animKey} className="inline-block animate-digit-roll">
        {value}
      </span>
    </span>
  );
}

function RollingScore({ score }: { score: number }) {
  const digitKeys = useRef<Record<number, number>>({});
  const prevDigitsRef = useRef<string[]>([]);

  const digits = score.toString().split('');
  const maxLen = Math.max(digits.length, prevDigitsRef.current.length);
  const padded = digits.join('').padStart(maxLen, ' ').split('');
  const prevPadded = prevDigitsRef.current.join('').padStart(maxLen, ' ').split('');

  const result = padded.map((d, i) => {
    const posFromRight = padded.length - 1 - i;
    if (d !== prevPadded[i]) {
      digitKeys.current[posFromRight] = (digitKeys.current[posFromRight] ?? 0) + 1;
    }
    return { d, key: posFromRight, animKey: digitKeys.current[posFromRight] ?? 0 };
  });

  prevDigitsRef.current = digits;

  return (
    <>
      {result.map(({ d, key, animKey }) =>
        d === ' ' ? null : (
          <RollingDigit key={key} value={d} animKey={animKey} />
        ),
      )}
    </>
  );
}

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
  deityImageFile?: string;
  sounds: [string, string];
}

interface DeityGameProps {
  config: DeityGameConfig;
  user: AuthUser | null;
  isMuted: boolean;
  t: Translations;
  language: string;
  deityKey: string;
}

const CLICK_COOLDOWN_MS = 100;

// Module-level country cache — fetched once for the whole session
let _cachedCountry: string | null = null;
let _countryFetchPromise: Promise<string> | null = null;

// Persist/restore game state per deity across navigation
function loadGameState(key: string) {
  try {
    const raw = localStorage.getItem(`cm_game_${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as { score: number; malaCount: number; expecting: ButtonType };
  } catch { return null; }
}
function saveGameState(key: string, score: number, malaCount: number, expecting: ButtonType) {
  try {
    localStorage.setItem(`cm_game_${key}`, JSON.stringify({ score, malaCount, expecting }));
  } catch { /* ignore */ }
}
function clearGameState(key: string) {
  localStorage.removeItem(`cm_game_${key}`);
}


function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function DeityGame({ config, user, isMuted, t, language, deityKey }: DeityGameProps) {
  const { buttonLabels, colors, backgroundImage, deityImageFile, sounds } = config;
  const [deityImage, setDeityImage] = useState<string | null>(null);

  useEffect(() => {
    if (!deityImageFile) return;
    let cancelled = false;
    loadDeityImage(deityImageFile).then((url) => {
      if (!cancelled) setDeityImage(url || null);
    });
    return () => { cancelled = true; };
  }, [deityImageFile]);

  const localizedTitle = t.deityTitles[deityKey] || config.deityName;
  const localizedButtons = t.deityButtons[deityKey] || buttonLabels;

  const { toast } = useToast();

  const [score, setScore] = useState(() => loadGameState(deityKey)?.score ?? 0);
  const [malaCount, setMalaCount] = useState(() => loadGameState(deityKey)?.malaCount ?? 0);
  const [expecting, setExpecting] = useState<ButtonType>(() => loadGameState(deityKey)?.expecting ?? 'button1');
  const [lastClicked, setLastClicked] = useState<ButtonType | null>(null);
  const [pressedButton, setPressedButton] = useState<ButtonType | null>(null);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [malaFlash, setMalaFlash] = useState(false);
  const [malaFlashKey, setMalaFlashKey] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showStreakBanner, setShowStreakBanner] = useState(() => getDailyPairs() === 0);
  const [goalCelebrated, setGoalCelebrated] = useState(() => getDailyPairs() >= getDailyGoal());
  const [dailyGoal, setDailyGoalState] = useState(() => getDailyGoal());
  const [savedDailyPairs, setSavedDailyPairs] = useState(() => getDailyPairs());
  const particleIdRef = useRef(0);

  const sessionStartRef = useRef(Date.now());
  const lastClickTime = useRef(0);
  const malaStartTimeRef = useRef(Date.now());
  const currentScoreRef = useRef(0);
  const currentMalaRef = useRef(0);
  const userRef = useRef(user);
  const countryRef = useRef('XX');

  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    if (_cachedCountry) { countryRef.current = _cachedCountry; return; }
    if (_countryFetchPromise) {
      _countryFetchPromise.then((c) => { countryRef.current = c; });
      return;
    }
    _countryFetchPromise = fetch('/api/country')
      .then((r) => r.json())
      .then((d) => { _cachedCountry = (d.country?.length === 2 ? d.country : 'XX'); return _cachedCountry; })
      .catch(() => { _cachedCountry = 'XX'; return 'XX'; });
    _countryFetchPromise.then((c) => { countryRef.current = c; });
  }, []);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const buf1Ref = useRef<AudioBuffer | null>(null);
  const buf2Ref = useRef<AudioBuffer | null>(null);

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
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const load = async (url: string) => {
      try {
        const res = await fetch(url);
        const raw = await res.arrayBuffer();
        return ctx.decodeAudioData(raw);
      } catch { return null; }
    };
    Promise.all([load(sounds[0]), load(sounds[1])]).then(([b1, b2]) => {
      buf1Ref.current = b1;
      buf2Ref.current = b2;
    });
    return () => { ctx.close(); };
  }, [sounds]);

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

  // Sync refs from restored state on first mount
  useEffect(() => {
    currentScoreRef.current = score;
    currentMalaRef.current = malaCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist game state to localStorage on every change
  useEffect(() => {
    saveGameState(deityKey, score, malaCount, expecting);
  }, [deityKey, score, malaCount, expecting]);

  // Re-sync daily baseline and goal when tab regains focus (handles midnight rollover and external goal changes)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setSavedDailyPairs(getDailyPairs());
        setDailyGoalState(getDailyGoal());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const submitScoreToLeaderboard = useCallback(
    async (finalScore: number, silent: boolean): Promise<boolean> => {
      const currentUser = userRef.current;
      if (!currentUser || finalScore <= 0) return false;
      localStorage.setItem('cosmicMantra_lastSessionScore', String(finalScore));
      try {
        const res = await fetch('/api/leaderboard/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            playerName: currentUser.username,
            score: finalScore,
            country: countryRef.current,
            userId: currentUser.id,
          }),
        });
        if (!res.ok) return false;
        if (silent) {
          localStorage.setItem('cosmicMantra_autoSubmitNotify', currentUser.username);
        }
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const handleEndSession = useCallback(async () => {
    const finalScore = currentScoreRef.current;
    const finalMalas = currentMalaRef.current;
    if (finalScore === 0) return;
    setSessionEnded(true);
    saveSession({
      deity: deityKey,
      mantras: finalScore,
      malas: finalMalas,
      timestamp: sessionStartRef.current,
      duration: Math.floor((Date.now() - sessionStartRef.current) / 1000),
    });
    setSavedDailyPairs(getDailyPairs());
    const success = await submitScoreToLeaderboard(finalScore, false);
    if (success && userRef.current) {
      toast({
        title: t.game.scoreSaved,
        description: t.game.scoreSavedDesc
          .replace('{n}', String(finalScore))
          .replace('{username}', userRef.current.username),
      });
    } else if (!success) {
      toast({
        title: t.game.couldNotSave,
        description: t.game.couldNotSaveDesc,
        variant: 'destructive',
      });
    }
    clearGameState(deityKey);
    setScore(0);
    setMalaCount(0);
    setExpecting('button1');
    setLastClicked(null);
    setSessionSecs(0);
    currentScoreRef.current = 0;
    currentMalaRef.current = 0;
    sessionStartRef.current = Date.now();
    malaStartTimeRef.current = Date.now();
    setSessionEnded(false);
  }, [deityKey, submitScoreToLeaderboard, toast]);

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
        submitScoreToLeaderboard(finalScore, true);
      }
    };
  }, [deityKey, submitScoreToLeaderboard]);

  const handleButtonClick = useCallback(
    (buttonType: ButtonType) => {
      const now = Date.now();
      if (now - lastClickTime.current < CLICK_COOLDOWN_MS) return;
      lastClickTime.current = now;

      setShowStreakBanner(false);

      try { navigator.vibrate(30); } catch { /* not supported */ }

      if (!isMuted) {
        try {
          const ctx = audioCtxRef.current;
          const buf = buttonType === 'button1' ? buf1Ref.current : buf2Ref.current;
          if (ctx && buf) {
            if (ctx.state === 'suspended') ctx.resume();
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            src.start(0);
          }
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
    [isMuted],
  );

  useEffect(() => {
    if (malaCount > 0) {
      setMalaFlashKey((k) => k + 1);
      setMalaFlash(true);
      const t = setTimeout(() => setMalaFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [malaCount]);

  const spawnParticles = useCallback(
    (clientX: number, clientY: number, color: string) => {
      const count = 14;
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 55 + Math.random() * 65;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;
        const colors = [color, '#ffd700', '#fff6df', '#dcb8ff'];
        return {
          id: ++particleIdRef.current,
          x: clientX,
          y: clientY,
          px,
          py,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 5 + Math.random() * 6,
          delay: Math.random() * 0.08,
        };
      });
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        const ids = new Set(newParticles.map((p) => p.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 800);
    },
    [],
  );

  const dailyPairsToday = savedDailyPairs + score;
  const dailyGoalProgress = Math.min(dailyPairsToday / dailyGoal, 1);
  const dailyGoalMet = dailyPairsToday >= dailyGoal;

  useEffect(() => {
    if (dailyGoalMet && !goalCelebrated) {
      setGoalCelebrated(true);
      toast({
        title: t.game.dailyGoalToastTitle,
        description: t.game.dailyGoalToastDesc.replace('{n}', String(dailyPairsToday)),
      });
    }
  }, [dailyGoalMet, goalCelebrated, dailyPairsToday, toast]);

  const malaProgress = (score % 108) / 108;
  const tagline = t.deityTaglines[deityKey] || '';

  return (
    <div className="h-full relative overflow-hidden">
      {/* Particle overlay */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[200]">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full animate-particle"
              style={{
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                animationDelay: `${p.delay}s`,
                ['--px' as string]: `${p.px}px`,
                ['--py' as string]: `${p.py}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Mala completion flash */}
      {malaFlash && (
        <div
          key={malaFlashKey}
          className="fixed inset-0 pointer-events-none z-[190] animate-mala-flash"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,215,0,0.35) 0%, rgba(255,215,0,0.15) 40%, transparent 70%)',
          }}
        >
          <div
            className="absolute animate-mala-text text-center px-8"
            style={{ left: '50%', top: '42%' }}
          >
            <p
              className="text-[#ffd700] font-bold text-3xl sm:text-4xl"
              style={{
                fontFamily: 'Sora, sans-serif',
                textShadow: '0 0 40px rgba(255,215,0,1), 0 0 80px rgba(255,215,0,0.6)',
              }}
            >
              {t.game.malaCompleteTitle}
            </p>
            <p
              className="text-[#fff6df] text-base mt-2 font-semibold"
              style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 0 20px rgba(255,246,223,0.8)' }}
            >
              {malaCount} {malaCount !== 1 ? t.game.malaCompletedPlural : t.game.malaCompletedSingle}
            </p>
          </div>
        </div>
      )}

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
      <div className="relative z-10 flex flex-col items-center justify-between h-full pt-4 sm:pt-10 pb-2 sm:pb-6 px-4">
        {/* Streak reminder banner */}
        {showStreakBanner && (
          <div
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(255,100,30,0.12)',
              border: '1px solid rgba(255,140,50,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p className="text-[#ffb347] text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
              {t.game.streakBanner}
            </p>
            <button
              onClick={() => setShowStreakBanner(false)}
              className="text-[#d0c6ab] hover:text-[#fff6df] transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* Deity title */}
        <div className="text-center sm:mb-7 mt-1 sm:mt-2">
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
          className="glass-card w-full max-w-xs sm:max-w-sm md:max-w-md px-8 py-3 sm:py-7 sm:mb-7 text-center"
          style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.45)' }}
        >
          <p
            className="text-[#d0c6ab] text-[11px] tracking-[0.22em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t.game.currentSession}
          </p>

          <div
            className={`text-[2.8rem] sm:text-[5rem] font-bold text-[#fff6df] leading-none ${scoreAnimation ? 'animate-score-increase' : ''}`}
            style={{
              fontFamily: 'Sora, sans-serif',
              textShadow: '0 0 20px rgba(255,246,223,0.35)',
            }}
          >
            <RollingScore score={score} />
          </div>

          <p
            className="text-[#d0c6ab] text-[11px] tracking-[0.22em] uppercase mt-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t.game.pairsCompleted}
          </p>

          {malaCount > 0 && (
            <p
              className="text-[#ffd700] text-xs font-semibold mt-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {malaCount} {malaCount !== 1 ? t.game.malaCompletedPlural : t.game.malaCompletedSingle}
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
            {108 - (score % 108)} {t.game.pairsToNextMala}
          </p>

          {/* Daily goal progress */}
          <div
            className="mt-5 w-full rounded-xl px-4 py-3"
            style={{
              background: dailyGoalMet
                ? 'rgba(255,215,0,0.08)'
                : 'rgba(255,255,255,0.04)',
              border: dailyGoalMet
                ? '1px solid rgba(255,215,0,0.25)'
                : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: dailyGoalMet ? '#ffd700' : '#d0c6ab',
                }}
              >
                {t.game.dailyGoalLabel}
              </p>
              <p
                className="text-[11px] font-semibold tabular-nums"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: dailyGoalMet ? '#ffd700' : '#d0c6ab',
                }}
              >
                {dailyPairsToday} / {dailyGoal}
              </p>
            </div>
            <div className="w-full bg-[#2f334b] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${dailyGoalProgress * 100}%`,
                  background: dailyGoalMet
                    ? 'linear-gradient(90deg, #ffd700, #ffe566)'
                    : 'linear-gradient(90deg, #7c3aed, #dcb8ff)',
                  boxShadow: dailyGoalMet
                    ? '0 0 8px rgba(255,215,0,0.6)'
                    : '0 0 6px rgba(220,184,255,0.4)',
                }}
              />
            </div>
            {dailyGoalMet ? (
              <p
                className="text-[#ffd700] text-[11px] font-semibold mt-1.5 text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {t.game.dailyGoalReached}
              </p>
            ) : (
              <p
                className="text-[#d0c6ab]/50 text-[11px] mt-1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {dailyGoal - dailyPairsToday} {t.game.pairsLeftToday}
              </p>
            )}
          </div>
        </div>

        {/* Chant buttons */}
        <div className="flex items-center gap-5 sm:gap-8 sm:mb-7">
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
                onClick={(e) => {
                  spawnParticles(e.clientX, e.clientY, color);
                  handleButtonClick(type);
                }}
                className="chant-btn flex items-center justify-center text-center"
                style={{
                  width: 'clamp(148px, 40vw, 172px)',
                  height: 'clamp(148px, 40vw, 172px)',
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
        <div className="flex items-center gap-2.5 sm:mb-7">
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
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md grid grid-cols-3 gap-2.5 sm:mb-5">
          {[
            {
              icon: 'timer',
              color: '#d0c6ab',
              value: formatTime(sessionSecs),
              label: t.game.focusTime,
            },
            {
              icon: 'military_tech',
              color: '#ffd700',
              value: userRank > 0 ? `#${userRank}` : '—',
              label: t.game.dailyRank,
            },
            {
              icon: 'bolt',
              color: '#dcb8ff',
              value: malaCount > 0 ? `${malaCount} ${malaCount !== 1 ? t.game.malaCompletedPlural : t.game.malaCompletedSingle}` : t.game.pure,
              label: t.game.energy,
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

        {/* End Session button (logged in users only) */}
        {user && score > 0 && (
          <button
            onClick={handleEndSession}
            disabled={sessionEnded}
            className="mb-3 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
            style={{
              fontFamily: 'Sora, sans-serif',
              background: 'linear-gradient(135deg,#e9c400,#ffd700)',
              color: '#3a3000',
              boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
            }}
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            {sessionEnded ? t.game.saving : t.game.endSession}
          </button>
        )}

        {/* Share score button */}
        {score > 0 && (
          <button
            onClick={async () => {
              const malas = malaCount;
              const text = language === 'hi'
                ? `मैंने ${localizedTitle} का ${score.toLocaleString()} जोड़ी जप किया${malas > 0 ? ` (${malas} ${t.game.malaCompletedPlural})` : ''} Cosmic Mantra पर! 🙏`
                : `I just chanted ${score.toLocaleString()} pairs${malas > 0 ? ` (${malas} mala${malas !== 1 ? 's' : ''})` : ''} of ${localizedTitle} on Cosmic Mantra! 🙏`;
              try {
                if (navigator.share) {
                  await navigator.share({ text });
                } else {
                  await navigator.clipboard.writeText(text);
                  toast({ title: t.game.copiedToClipboard, description: t.game.shareWithFriends });
                }
              } catch { /* user cancelled or not supported */ }
            }}
            className="mb-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            style={{
              fontFamily: 'Inter, sans-serif',
              background: 'rgba(220,184,255,0.1)',
              border: '1px solid rgba(220,184,255,0.25)',
              color: '#dcb8ff',
            }}
          >
            <span className="material-symbols-outlined text-base">share</span>
            {t.game.shareScore}
          </button>
        )}

        {/* Leaderboard link */}
        <Link
          href="/leaderboard"
          className="text-[#d0c6ab] hover:text-[#ffd700] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="material-symbols-outlined text-base">leaderboard</span>
          {t.game.viewLeaderboard}
        </Link>
      </div>
    </div>
  );
}
