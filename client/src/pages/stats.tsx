import { useEffect, useState } from 'react';
import {
  getDailyMalas,
  getDailyPairs,
  getWeeklyData,
  getTotalMalas,
  getTotalPairs,
  getStreak,
  getPersonalRecords,
  getSessions,
  getSpiritualLevel,
} from '@/lib/statsStorage';

const DAILY_GOAL = 108;

const deityMantraNames: Record<string, string> = {
  krishna: 'Krishna Mahamantra',
  radha: 'Radhe Radhe',
  rama: 'Ram Nam Sankirtan',
  shivji: 'Om Namah Shivaya',
  hanuman: 'Hanuman Chalisa',
  ganesh: 'Om Gan Ganapataye',
  durga: 'Durga Stuti',
  saibaba: 'Om Sai Ram',
  gurunanak: 'Waheguru Simran',
  buddha: 'Om Mani Padme Hum',
  mahavir: 'Namo Namah',
};

const deityIcons: Record<string, string> = {
  krishna: 'spa',
  radha: 'local_florist',
  rama: 'architecture',
  shivji: 'temple_hindu',
  hanuman: 'pets',
  ganesh: 'emoji_nature',
  durga: 'brightness_high',
  saibaba: 'self_improvement',
  gurunanak: 'flare',
  buddha: 'trip_origin',
  mahavir: 'filter_vintage',
};

function formatDuration(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export default function StatsPage() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate((n) => n + 1);
  }, []);

  const dailyMalas = getDailyMalas();
  const dailyPairs = getDailyPairs();
  const totalMalas = getTotalMalas();
  const totalPairs = getTotalPairs();
  const streak = getStreak();
  const records = getPersonalRecords();
  const weeklyData = getWeeklyData();
  const sessions = getSessions().slice(0, 10);
  const spiritualLevel = getSpiritualLevel();

  const dailyProgress = Math.min(dailyMalas / DAILY_GOAL, 1);
  const circumference = 2 * Math.PI * 88;
  const offset = circumference * (1 - dailyProgress);

  const maxWeeklyPairs = Math.max(...weeklyData.map((d) => d.pairs), 1);

  const milestones = [
    {
      icon: 'grain',
      label: 'Total Beads',
      value: (totalPairs * 2).toLocaleString(),
      color: '#ffd700',
    },
    {
      icon: 'trending_up',
      label: 'Longest Streak',
      value: `${streak.longestStreak}d`,
      color: '#dcb8ff',
    },
    {
      icon: 'favorite',
      label: 'Total Malas',
      value: totalMalas.toLocaleString(),
      color: '#00daf3',
    },
    {
      icon: 'auto_awesome',
      label: 'Spiritual Level',
      value: `Lv ${spiritualLevel}`,
      color: '#ffd700',
    },
  ];

  return (
    <div className="min-h-screen px-4 pt-10 pb-8">
      <div className="max-w-2xl mx-auto md:max-w-none md:mx-0 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <p
            className="text-[#d0c6ab] text-xs tracking-[0.25em] uppercase mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your Spiritual Journey
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Progress &amp; Stats
          </h1>
        </div>

        {/* Daily Goal ring + weekly chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Circular progress */}
          <div className="glass-card p-6 flex flex-col items-center">
            <p
              className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Daily Goal
            </p>
            <div className="relative w-52 h-52">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="#2f334b"
                  strokeWidth="10"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="url(#goldGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e9c400" />
                    <stop offset="100%" stopColor="#ffd700" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold text-[#fff6df]"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {dailyMalas}
                </span>
                <span
                  className="text-[#d0c6ab] text-xs"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  / {DAILY_GOAL} Malas
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p
                className="text-[#ffd700] font-semibold text-sm"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {dailyPairs} pairs today
              </p>
              <p
                className="text-[#d0c6ab] text-xs mt-0.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {streak.currentStreak} day streak 🔥
              </p>
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className="glass-card p-6">
            <p
              className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Weekly Activity
            </p>
            <div className="flex items-end justify-between gap-1.5 h-36">
              {weeklyData.map(({ day, pairs }, i) => {
                const heightPct = maxWeeklyPairs > 0 ? (pairs / maxWeeklyPairs) * 100 : 0;
                const isToday = i === 6;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, pairs > 0 ? 8 : 0)}%`,
                          minHeight: pairs > 0 ? '6px' : '0',
                          background: isToday
                            ? 'linear-gradient(180deg, #ffd700, #e9c400)'
                            : pairs > 0
                              ? 'rgba(255,215,0,0.35)'
                              : 'rgba(47,51,75,0.6)',
                          boxShadow: isToday ? '0 0 8px rgba(255,215,0,0.5)' : 'none',
                        }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${isToday ? 'text-[#ffd700]' : 'text-[#d0c6ab]'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sacred Milestones */}
        <div>
          <p
            className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Sacred Milestones
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {milestones.map(({ icon, label, value, color }) => (
              <div key={label} className="glass-card px-4 py-5 text-center">
                <span
                  className="material-symbols-outlined text-2xl mb-2 block"
                  style={{ color }}
                >
                  {icon}
                </span>
                <p
                  className="font-bold text-lg"
                  style={{ fontFamily: 'Sora, sans-serif', color }}
                >
                  {value}
                </p>
                <p
                  className="text-[#d0c6ab] text-[11px] mt-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chanting History */}
        {sessions.length > 0 && (
          <div>
            <p
              className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Chanting History
            </p>
            <div className="glass-card divide-y divide-white/5">
              {sessions.map((session, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}
                  >
                    <span className="material-symbols-outlined text-[#ffd700] text-xl">
                      {deityIcons[session.deity] || 'spa'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[#fff6df] text-sm font-semibold truncate"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {deityMantraNames[session.deity] || session.deity}
                    </p>
                    <p
                      className="text-[#d0c6ab] text-xs"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {session.malas} mala{session.malas !== 1 ? 's' : ''} · {session.mantras} pairs · {formatDuration(session.duration)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-[#d0c6ab]/60 text-xs"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {timeAgo(session.timestamp)}
                    </p>
                    {session.malas > 0 && (
                      <p
                        className="text-[#ffd700] text-xs font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Completed
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="glass-card p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-[#d0c6ab]/40 mb-4 block">
              spa
            </span>
            <p
              className="text-[#d0c6ab] text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Start chanting to see your history here
            </p>
          </div>
        )}

        {/* Personal Records */}
        <div>
          <p
            className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Personal Records
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: 'speed',
                label: 'Fastest Mala',
                value: records.fastestMalaSecs
                  ? formatDuration(records.fastestMalaSecs)
                  : '—',
                color: '#ffd700',
                sub: records.fastestMalaDate || 'Not yet set',
              },
              {
                icon: 'emoji_events',
                label: 'Single Session Max',
                value: records.singleSessionMaxMalas > 0
                  ? `${records.singleSessionMaxMalas} malas`
                  : '—',
                color: '#dcb8ff',
                sub: records.singleSessionMaxDate || 'Not yet set',
              },
              {
                icon: 'brightness_5',
                label: 'Early Bird Sessions',
                value: records.earlyBirdStreak > 0 ? `${records.earlyBirdStreak}x` : '—',
                color: '#00daf3',
                sub: 'Sessions before 5am',
              },
            ].map(({ icon, label, value, color, sub }) => (
              <div key={label} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color }}
                  >
                    {icon}
                  </span>
                  <p
                    className="text-[#d0c6ab] text-xs font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {label}
                  </p>
                </div>
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'Sora, sans-serif', color }}
                >
                  {value}
                </p>
                <p
                  className="text-[#d0c6ab]/60 text-xs"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
