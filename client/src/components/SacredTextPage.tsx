import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ChalisaVerse } from '@/lib/hanumanChalisa';
import { buildWordList } from '@/lib/hanumanChalisa';

interface SacredTextPageProps {
  verses: ChalisaVerse[];
  title: string;
  completionTitle: string;
  completionSubtitle: string;
  completionEnglish: string;
  resetLabel?: string;
  hintLabel?: string;
  accentColor?: string;
  storageKey?: string;
}

const FLOWERS = ['🌸', '🌺', '🌼', '🌻', '🌹', '🏵️', '🌷', '💐'];

function Confetti() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 2.5) % 100}%`,
      delay: `${(i * 0.07).toFixed(2)}s`,
      duration: `${(2.8 + (i % 7) * 0.3).toFixed(1)}s`,
      size: `${1.1 + (i % 5) * 0.25}rem`,
      flower: FLOWERS[i % FLOWERS.length],
      drift: `${((i % 2 === 0 ? 1 : -1) * (30 + (i % 6) * 18))}px`,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[210] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-3rem',
            fontSize: p.size,
            animationName: 'confettiFall',
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-in',
            animationFillMode: 'forwards',
            ['--drift' as string]: p.drift,
          }}
        >
          {p.flower}
        </div>
      ))}
    </div>
  );
}

export default function SacredTextPage({
  verses,
  title,
  completionTitle,
  completionSubtitle,
  completionEnglish,
  resetLabel = 'फिर से पढ़ें · Start Over',
  hintLabel = 'पहले शब्द पर टैप करें ✦ Tap the first word',
  accentColor = '#f97316',
  storageKey,
}: SacredTextPageProps) {
  const wordList = useMemo(() => buildWordList(verses), [verses]);
  const TOTAL = wordList.length;

  const [current, setCurrent] = useState(() => {
    if (!storageKey) return 0;
    try {
      const v = localStorage.getItem(storageKey);
      if (v === null) return 0;
      const n = parseInt(v, 10);
      return Number.isFinite(n) && n >= 0 && n < TOTAL ? n : 0;
    } catch { return 0; }
  });
  const [completed, setCompleted] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    try { return parseInt(localStorage.getItem('harekrishna_text_size') || '17', 10); } catch { return 17; }
  });

  const changeFontSize = useCallback((delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(28, Math.max(13, prev + delta));
      try { localStorage.setItem('harekrishna_text_size', String(next)); } catch {}
      return next;
    });
  }, []);

  const activeRef = useRef<HTMLButtonElement | null>(null);
  const pageTopRef = useRef<HTMLDivElement | null>(null);

  const progress = Math.min(current / TOTAL, 1);

  const wordIndex = useMemo(() => {
    const map = new Map<string, number>();
    wordList.forEach((w, i) => {
      map.set(`${w.verseId}:${w.lineIdx}:${w.wordIdx}`, i);
    });
    return map;
  }, [wordList]);

  useEffect(() => {
    if (storageKey && current > 0 && current < TOTAL) {
      try { localStorage.setItem(storageKey, String(current)); } catch {}
    }
  }, [current, storageKey, TOTAL]);

  const handleWordTap = useCallback(() => {
    if (completed) return;
    if (current >= TOTAL - 1) {
      setCurrent(TOTAL);
      setCompleted(true);
      if (storageKey) {
        try { localStorage.removeItem(storageKey); } catch {}
      }
    } else {
      setCurrent((c) => c + 1);
    }
  }, [current, completed, TOTAL, storageKey]);

  const handleReset = useCallback(() => {
    setCompleted(false);
    setCurrent(0);
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch {}
    }
    setTimeout(() => {
      pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }, [storageKey]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [current]);

  const rgb = hexToRgb(accentColor);

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 40%, #0d0020 100%)',
    }}>
      <div ref={pageTopRef} />

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3) * 0.5,
              height: 1 + (i % 3) * 0.5,
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              opacity: 0.2 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50" style={{
        background: 'rgba(10,0,21,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
      }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-bold text-base sm:text-lg tracking-wider"
              style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif", color: '#ffd700' }}>
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeFontSize(-2)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: 'rgba(255,215,0,0.8)' }}
                >A−</button>
                <button
                  onClick={() => changeFontSize(2)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: 'rgba(255,215,0,0.8)' }}
                >A+</button>
              </div>
              <span className="text-white/50 text-xs font-mono">
                {Math.min(current, TOTAL)}/{TOTAL}
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,215,0,0.12)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${accentColor}, #ffd700)`,
                boxShadow: '0 0 8px rgba(255,215,0,0.6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Verse content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32 relative z-10">
        {verses.map((verse) => (
          <div key={verse.id} className="mb-6">
            {verse.label ? (
              <p className="text-center text-xs tracking-widest mb-3"
                style={{ color: 'rgba(255,215,0,0.5)', fontFamily: 'Sora, sans-serif' }}>
                — {verse.label} —
              </p>
            ) : null}
            <div
              className="rounded-2xl px-5 py-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,215,0,0.08)',
              }}
            >
              {verse.lines.map((line, li) => (
                <div key={li} className="flex flex-wrap gap-x-2 gap-y-2 mb-2 last:mb-0 justify-center">
                  {line.map((word, wi) => {
                    const globalIdx = wordIndex.get(`${verse.id}:${li}:${wi}`) ?? -1;
                    const isDone = globalIdx < current;
                    const isActive = globalIdx === current && !completed;

                    return (
                      <button
                        key={wi}
                        ref={isActive ? activeRef : null}
                        onClick={isActive ? handleWordTap : undefined}
                        disabled={!isActive}
                        className="rounded-lg px-2 py-0.5 select-none"
                        style={{
                          fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
                          fontSize: `${fontSize}px`,
                          fontWeight: 600,
                          lineHeight: 1.6,
                          cursor: isActive ? 'pointer' : 'default',
                          color: isDone
                            ? 'rgba(255,215,0,0.62)'
                            : isActive
                            ? '#ffffff'
                            : 'rgba(255,255,255,0.28)',
                          background: isActive ? `rgba(${rgb},0.18)` : 'transparent',
                          border: isActive
                            ? `1px solid rgba(${rgb},0.55)`
                            : '1px solid transparent',
                          boxShadow: isActive
                            ? `0 0 14px rgba(${rgb},0.35), 0 0 4px rgba(255,215,0,0.2)`
                            : 'none',
                          WebkitTapHighlightColor: 'transparent',
                          transition: 'color 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s',
                        }}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion overlay — rendered via portal to escape CSS transform stacking context */}
      {completed && createPortal(
        <>
          <Confetti />
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 text-center"
            style={{ background: 'rgba(5,0,15,0.88)', backdropFilter: 'blur(16px)' }}
          >
            {/* Glowing circle */}
            <div style={{ animation: 'completionBounce 0.65s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div
                className="w-36 h-36 rounded-full flex items-center justify-center mb-6"
                style={{
                  fontSize: '4.5rem',
                  background: `radial-gradient(circle, rgba(${rgb},0.3) 0%, rgba(255,215,0,0.1) 60%, transparent 100%)`,
                  border: '2px solid rgba(255,215,0,0.55)',
                  animation: 'glowPulseCompletion 2.5s ease-in-out infinite',
                }}
              >
                🙏
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#ffd700',
                textShadow: '0 0 30px rgba(255,215,0,0.9), 0 0 70px rgba(255,215,0,0.4)',
                marginBottom: '0.6rem',
                animation: 'fadeSlideUp 0.5s 0.25s ease-out both',
              }}
            >
              {completionTitle}
            </h2>

            <p
              style={{
                fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
                fontSize: '1.15rem',
                color: 'rgba(255,215,0,0.75)',
                marginBottom: '0.3rem',
                animation: 'fadeSlideUp 0.5s 0.4s ease-out both',
              }}
            >
              {completionSubtitle}
            </p>

            <p
              className="text-white/40 text-sm orbitron tracking-widest"
              style={{ marginBottom: '2.5rem', animation: 'fadeSlideUp 0.5s 0.5s ease-out both' }}
            >
              {completionEnglish}
            </p>

            <button
              onClick={handleReset}
              className="px-10 py-3 rounded-full font-semibold text-sm orbitron tracking-wider active:scale-95"
              style={{
                background: `linear-gradient(135deg, rgba(${rgb},0.35), rgba(255,215,0,0.2))`,
                border: '1.5px solid rgba(255,215,0,0.55)',
                color: '#ffd700',
                boxShadow: '0 0 28px rgba(255,215,0,0.25)',
                animation: 'fadeSlideUp 0.5s 0.6s ease-out both',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              {resetLabel}
            </button>
          </div>
        </>,
        document.body
      )}

      {/* Hint */}
      {current === 0 && !completed && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <div
            className="px-5 py-2.5 rounded-full text-sm animate-pulse"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.25)',
              color: 'rgba(255,215,0,0.7)',
              fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
            }}
          >
            {hintLabel}
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '249,115,22';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
