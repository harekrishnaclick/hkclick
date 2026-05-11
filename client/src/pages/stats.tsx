import { useEffect, useState } from 'react';
import {
  getDailyMalas, getDailyPairs, getWeeklyData, getTotalMalas,
  getTotalPairs, getStreak, getPersonalRecords, getSessions, getSpiritualLevel,
} from '@/lib/statsStorage';

const DAILY_GOAL = 108;

const deityMantraNames: Record<string, string> = {
  krishna: 'Krishna Mahamantra', radha: 'Radhe Radhe', rama: 'Ram Nam Sankirtan',
  shivji: 'Om Namah Shivaya', hanuman: 'Hanuman Chalisa', ganesh: 'Om Gan Ganapataye',
  durga: 'Durga Stuti', saibaba: 'Om Sai Ram', gurunanak: 'Waheguru Simran',
  buddha: 'Om Mani Padme Hum', mahavir: 'Namo Namah',
};

const deityIcons: Record<string, string> = {
  krishna: 'spa', radha: 'local_florist', rama: 'architecture', shivji: 'temple_hindu',
  hanuman: 'pets', ganesh: 'emoji_nature', durga: 'brightness_high',
  saibaba: 'self_improvement', gurunanak: 'flare', buddha: 'trip_origin', mahavir: 'filter_vintage',
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
  useEffect(() => { forceUpdate((n) => n + 1); }, []);
  const lastDeity = typeof localStorage !== 'undefined' ? localStorage.getItem('cosmicMantra_lastDeity') || '' : '';

  const dailyMalas = getDailyMalas();
  const dailyPairs = getDailyPairs();
  const totalMalas = getTotalMalas();
  const streak = getStreak();
  const records = getPersonalRecords();
  const weeklyData = getWeeklyData();
  const sessions = getSessions().slice(0, 10);
  const spiritualLevel = getSpiritualLevel();

  const dailyProgress = Math.min(dailyMalas / DAILY_GOAL, 1);
  const circumference = 2 * Math.PI * 88;
  const offset = circumference * (1 - dailyProgress);
  const maxWeeklyPairs = Math.max(...weeklyData.map((d) => d.pairs), 1);

  return (
    <div className="min-h-screen px-4 pt-10 pb-8">
      <div className="mb-8">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Your Spiritual Journey</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>Progress &amp; Stats</h1>
      </div>

      {/* 12-col bento grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Daily Goal — 4/12 cols on md+, full width below */}
        <div className="col-span-12 md:col-span-4 glass-card p-6 flex flex-col items-center">
          <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}>Daily Goal</p>
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r="88" fill="none" stroke="#2f334b" strokeWidth="10" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldGrad)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e9c400" />
                  <stop offset="100%" stopColor="#ffd700" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#fff6df]"
                style={{ fontFamily: 'Sora, sans-serif' }}>{dailyMalas}</span>
              <span className="text-[#d0c6ab] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                / {DAILY_GOAL} Malas
              </span>
            </div>
          </div>
          <p className="text-[#ffd700] font-semibold text-sm mt-4"
            style={{ fontFamily: 'Sora, sans-serif' }}>{dailyPairs} pairs today</p>
          <p className="text-[#d0c6ab] text-xs mt-0.5"
            style={{ fontFamily: 'Inter, sans-serif' }}>{streak.currentStreak} day streak 🔥</p>
          {lastDeity && (
            <a
              href={`/${lastDeity}`}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: 'Sora, sans-serif',
                background: 'linear-gradient(135deg, #e9c400, #ffd700)',
                color: '#3a3000',
                boxShadow: '0 0 14px rgba(255,215,0,0.4)',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined text-xl">spa</span>
              Continue Journey
            </a>
          )}
        </div>

        {/* Weekly Activity — 8/12 cols on md+, full width below */}
        <div className="col-span-12 md:col-span-8 glass-card p-6">
          <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}>Weekly Activity</p>
          <div className="flex items-end justify-between gap-2 h-36">
            {weeklyData.map(({ day, pairs }, i) => {
              const heightPct = (pairs / maxWeeklyPairs) * 100;
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
                            ? 'linear-gradient(180deg, #dcb8ff99, #7701d066)'
                            : 'rgba(47,51,75,0.5)',
                        boxShadow: isToday
                          ? '0 0 10px rgba(255,215,0,0.55)'
                          : pairs > 0
                            ? '0 0 8px rgba(119,1,208,0.45)'
                            : 'none',
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium ${isToday ? 'text-[#ffd700]' : 'text-[#d0c6ab]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sacred Milestones — full 12 cols */}
        <div className="col-span-12">
          <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}>Sacred Milestones</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: 'grain', label: 'Total Beads', value: (getTotalPairs() * 2).toLocaleString(), color: '#ffd700' },
              { icon: 'trending_up', label: 'Longest Streak', value: `${streak.longestStreak}d`, color: '#dcb8ff' },
              { icon: 'favorite', label: 'Total Malas', value: totalMalas.toLocaleString(), color: '#00daf3' },
              { icon: 'auto_awesome', label: 'Spiritual Level', value: `Lv ${spiritualLevel}`, color: '#ffd700' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="glass-card px-4 py-5 text-center">
                <span className="material-symbols-outlined text-2xl mb-2 block" style={{ color }}>{icon}</span>
                <p className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif', color }}>{value}</p>
                <p className="text-[#d0c6ab] text-[11px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chanting History — 7/12 cols on md+ */}
        <div className="col-span-12 md:col-span-7">
          <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}>Chanting History</p>
          {sessions.length > 0 ? (
            <div className="glass-card divide-y divide-white/5">
              {sessions.map((session, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
                    <span className="material-symbols-outlined text-[#ffd700] text-xl">
                      {deityIcons[session.deity] || 'spa'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#fff6df] text-sm font-semibold truncate"
                      style={{ fontFamily: 'Sora, sans-serif' }}>
                      {deityMantraNames[session.deity] || session.deity}
                    </p>
                    <p className="text-[#d0c6ab] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {session.malas} mala{session.malas !== 1 ? 's' : ''} · {session.mantras} pairs · {formatDuration(session.duration)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#d0c6ab]/60 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {timeAgo(session.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-[#d0c6ab]/40 mb-4 block">spa</span>
              <p className="text-[#d0c6ab] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Start chanting to see your history here
              </p>
            </div>
          )}
        </div>

        {/* Personal Records — 5/12 cols on md+ */}
        <div className="col-span-12 md:col-span-5 space-y-3">
          <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}>Personal Records</p>
          {[
            {
              icon: 'speed', label: 'Fastest Mala', color: '#ffd700',
              value: records.fastestMalaSecs ? formatDuration(records.fastestMalaSecs) : '—',
              sub: records.fastestMalaDate || 'Not yet set',
            },
            {
              icon: 'emoji_events', label: 'Best Session', color: '#dcb8ff',
              value: records.singleSessionMaxMalas > 0 ? `${records.singleSessionMaxMalas} malas` : '—',
              sub: records.singleSessionMaxDate || 'Not yet set',
            },
            {
              icon: 'brightness_5', label: 'Early Bird', color: '#00daf3',
              value: records.earlyBirdStreak > 0 ? `${records.earlyBirdStreak}×` : '—',
              sub: 'Sessions before 5am',
            },
          ].map(({ icon, label, value, color, sub }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1.5px solid ${color}40` }}>
                <span className="material-symbols-outlined text-xl" style={{ color }}>{icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#d0c6ab] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
                <p className="font-bold text-xl" style={{ fontFamily: 'Sora, sans-serif', color }}>{value}</p>
                <p className="text-[#d0c6ab]/55 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{sub}</p>
              </div>
            </div>
          ))}

          {/* Inspirational quote card */}
          <div
            className="glass-card p-5 text-center mt-2"
            style={{
              background: 'rgba(119,1,208,0.12)',
              border: '1px solid rgba(220,184,255,0.15)',
            }}
          >
            <span className="material-symbols-outlined text-[#dcb8ff] text-3xl mb-2 block">format_quote</span>
            <p className="text-[#fff6df] text-sm leading-relaxed italic"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              "The soul that meditates on the Self is content to serve the Self and rests satisfied within the Self."
            </p>
            <p className="text-[#dcb8ff] text-xs mt-2 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
              — Bhagavad Gita 3.17
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
