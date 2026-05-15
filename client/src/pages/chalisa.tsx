import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { chalisaVerses, buildWordList } from '@/lib/hanumanChalisa';

const wordList = buildWordList(chalisaVerses);
const TOTAL = wordList.length;

export default function ChalisaPage() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  const progress = Math.min(current / TOTAL, 1);

  // Build flat index: (verseId, lineIdx, wordIdx) -> globalIndex
  const wordIndex = useMemo(() => {
    const map = new Map<string, number>();
    wordList.forEach((w, i) => {
      map.set(`${w.verseId}:${w.lineIdx}:${w.wordIdx}`, i);
    });
    return map;
  }, []);

  const handleWordTap = useCallback(() => {
    if (completed) return;
    if (current >= TOTAL - 1) {
      setCurrent(TOTAL);
      setCompleted(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }, [current, completed]);

  const handleReset = useCallback(() => {
    setCurrent(0);
    setCompleted(false);
  }, []);

  // Scroll active word into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [current]);

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 40%, #0d0020 100%)',
    }}>
      {/* Stars background — deterministic so they don't shuffle on re-render */}
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

      {/* Sticky header: title + progress bar */}
      <div className="sticky top-0 z-50" style={{
        background: 'rgba(10,0,21,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
      }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="orbitron text-golden font-bold text-base sm:text-lg tracking-wider">
              हनुमान चालीसा
            </h1>
            <span className="text-white/50 text-xs font-mono">
              {Math.min(current, TOTAL)}/{TOTAL}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,215,0,0.12)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #f97316, #ffd700)',
                boxShadow: '0 0 8px rgba(255,215,0,0.6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Chalisa text */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32 relative z-10">
        {chalisaVerses.map((verse) => (
          <div key={verse.id} className="mb-6">
            {verse.label ? (
              <p className="text-center text-xs orbitron tracking-widest mb-3"
                style={{ color: 'rgba(255,215,0,0.5)' }}>
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
                <div key={li} className="flex flex-wrap gap-x-2 gap-y-1.5 mb-2 last:mb-0 justify-center">
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
                        className="rounded-lg px-2 py-0.5 transition-all duration-200 select-none"
                        style={{
                          fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
                          fontSize: isActive ? '1.25rem' : '1.05rem',
                          fontWeight: isActive ? 700 : isDone ? 500 : 400,
                          cursor: isActive ? 'pointer' : 'default',
                          color: isDone
                            ? 'rgba(255,215,0,0.55)'
                            : isActive
                            ? '#ffffff'
                            : 'rgba(255,255,255,0.28)',
                          background: isActive
                            ? 'rgba(249,115,22,0.18)'
                            : 'transparent',
                          border: isActive
                            ? '1px solid rgba(249,115,22,0.55)'
                            : '1px solid transparent',
                          boxShadow: isActive
                            ? '0 0 14px rgba(249,115,22,0.35), 0 0 4px rgba(255,215,0,0.2)'
                            : 'none',
                          transform: isActive ? 'scale(1.08)' : 'scale(1)',
                          lineHeight: 1.5,
                          WebkitTapHighlightColor: 'transparent',
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

      {/* Completion overlay */}
      {completed && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Glow ring */}
          <div className="relative mb-6">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
              style={{
                background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(255,215,0,0.08) 70%, transparent 100%)',
                border: '2px solid rgba(255,215,0,0.4)',
                boxShadow: '0 0 60px rgba(255,215,0,0.3), 0 0 120px rgba(249,115,22,0.15)',
              }}
            >
              🙏
            </div>
          </div>

          <h2
            className="font-bold mb-2"
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
              fontSize: '2rem',
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)',
            }}
          >
            जय हनुमान!
          </h2>
          <p
            className="mb-1"
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
              fontSize: '1.1rem',
              color: 'rgba(255,215,0,0.7)',
            }}
          >
            हनुमान चालीसा पूर्ण हुई
          </p>
          <p className="text-white/40 text-sm mb-8 orbitron tracking-widest">
            CHALISA COMPLETE
          </p>

          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-full font-semibold text-sm orbitron tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(255,215,0,0.2))',
              border: '1px solid rgba(255,215,0,0.5)',
              color: '#ffd700',
              boxShadow: '0 0 20px rgba(255,215,0,0.2)',
            }}
          >
            फिर से पढ़ें · Start Over
          </button>
        </div>
      )}

      {/* Tap hint at bottom (until first tap) */}
      {current === 0 && !completed && (
        <div
          className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none"
        >
          <div
            className="px-5 py-2.5 rounded-full text-sm animate-pulse"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.25)',
              color: 'rgba(255,215,0,0.7)',
              fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
            }}
          >
            पहले शब्द पर टैप करें ✦ Tap the first word
          </div>
        </div>
      )}
    </div>
  );
}
