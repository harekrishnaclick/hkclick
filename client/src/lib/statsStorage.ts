const PREFIX = 'cosmicMantra_';

export interface Session {
  deity: string;
  mantras: number;
  malas: number;
  timestamp: number;
  duration: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastDate: string | null;
}

export interface PersonalRecords {
  fastestMalaSecs: number | null;
  fastestMalaDate: string | null;
  singleSessionMaxMalas: number;
  singleSessionMaxDate: string | null;
  earlyBirdStreak: number;
}

const getDateStr = (ts: number = Date.now()) => new Date(ts).toISOString().split('T')[0];

function getDailyStats(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(PREFIX + 'daily') || '{}'); }
  catch { return {}; }
}

export function getSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(PREFIX + 'sessions') || '[]'); }
  catch { return []; }
}

export function getTotalMalas(): number {
  return parseInt(localStorage.getItem(PREFIX + 'totalMalas') || '0', 10);
}

export function getTotalPairs(): number {
  const daily = getDailyStats();
  return Object.values(daily).reduce((s, v) => s + v, 0);
}

export function getDailyMalas(): number {
  const daily = getDailyStats();
  return Math.floor((daily[getDateStr()] || 0) / 108);
}

export function getDailyPairs(): number {
  const daily = getDailyStats();
  return daily[getDateStr()] || 0;
}

export function getStreak(): StreakData {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + 'streak') || 'null') ||
      { currentStreak: 0, longestStreak: 0, lastDate: null };
  } catch { return { currentStreak: 0, longestStreak: 0, lastDate: null }; }
}

export function getPersonalRecords(): PersonalRecords {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + 'records') || 'null') || {
      fastestMalaSecs: null, fastestMalaDate: null,
      singleSessionMaxMalas: 0, singleSessionMaxDate: null,
      earlyBirdStreak: 0,
    };
  } catch {
    return { fastestMalaSecs: null, fastestMalaDate: null, singleSessionMaxMalas: 0, singleSessionMaxDate: null, earlyBirdStreak: 0 };
  }
}

export function getWeeklyData(): { day: string; pairs: number }[] {
  const daily = getDailyStats();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    result.push({ day: dayNames[d.getDay()], pairs: daily[date] || 0 });
  }
  return result;
}

export function getSpiritualLevel(): number {
  const m = getTotalMalas();
  if (m >= 1000) return Math.floor(m / 100);
  if (m >= 100) return Math.floor(m / 10);
  return Math.max(1, m);
}

function updateStreak(date: string) {
  const streak = getStreak();
  const yesterday = getDateStr(Date.now() - 86400000);
  if (streak.lastDate === date) return;
  if (streak.lastDate === yesterday || streak.lastDate === null) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastDate = date;
  localStorage.setItem(PREFIX + 'streak', JSON.stringify(streak));
}

function updatePersonalRecords(session: Session) {
  const records = getPersonalRecords();
  const date = getDateStr(session.timestamp);
  if (session.malas > records.singleSessionMaxMalas) {
    records.singleSessionMaxMalas = session.malas;
    records.singleSessionMaxDate = date;
  }
  if (new Date(session.timestamp).getHours() < 5 && session.malas > 0) {
    records.earlyBirdStreak += 1;
  }
  localStorage.setItem(PREFIX + 'records', JSON.stringify(records));
}

export function recordMalaTiming(secs: number) {
  const records = getPersonalRecords();
  if (records.fastestMalaSecs === null || secs < records.fastestMalaSecs) {
    records.fastestMalaSecs = secs;
    records.fastestMalaDate = getDateStr();
    localStorage.setItem(PREFIX + 'records', JSON.stringify(records));
  }
}

export function saveSession(session: Session) {
  if (session.mantras === 0) return;
  const sessions = getSessions();
  sessions.unshift(session);
  if (sessions.length > 100) sessions.pop();
  localStorage.setItem(PREFIX + 'sessions', JSON.stringify(sessions));

  const daily = getDailyStats();
  const date = getDateStr(session.timestamp);
  daily[date] = (daily[date] || 0) + session.mantras;
  localStorage.setItem(PREFIX + 'daily', JSON.stringify(daily));

  const totalMalas = getTotalMalas() + session.malas;
  localStorage.setItem(PREFIX + 'totalMalas', String(totalMalas));

  updateStreak(date);
  updatePersonalRecords(session);
}
