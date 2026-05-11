import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { LeaderboardEntry, UpdateScore } from '@shared/schema';
import type { Translations } from '@/lib/translations';
import { getTotalPairs } from '@/lib/statsStorage';
import { useToast } from '@/hooks/use-toast';

interface AuthUser { id: string; username: string; }
interface LeaderboardPageProps { user: AuthUser | null; t: Translations; }

const DEITY_KEYS = ['krishna', 'radha', 'rama', 'shivji', 'hanuman', 'ganesh', 'durga'];

const getUserCountry = async (): Promise<string> => {
  try {
    const data = await (await fetch('/api/country')).json();
    return data.country || 'XX';
  } catch { return 'XX'; }
};

function getAutoScore(): number {
  let best = 0;
  for (const key of DEITY_KEYS) {
    try {
      const raw = localStorage.getItem(`cm_game_${key}`);
      if (raw) {
        const state = JSON.parse(raw);
        if ((state.score || 0) > best) best = state.score;
      }
    } catch { /* ignore */ }
  }
  if (best === 0) {
    const last = localStorage.getItem('cosmicMantra_lastSessionScore');
    best = last ? (parseInt(last, 10) || 0) : 0;
  }
  if (best === 0) best = getTotalPairs();
  return best;
}

const getFlagEmoji = (code: string) => {
  if (!code || code === 'XX') return '🌍';
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
};

const formatNum = (n: number) => n.toLocaleString();

const avatarColors = [
  '#ffd700','#dcb8ff','#00daf3','#f97316','#ec4899',
  '#38bdf8','#a3e635','#fb923c','#c084fc','#34d399',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function LeaderboardPage({ user, t }: LeaderboardPageProps) {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('hareKrishnaPlayerName') || '',
  );
  const [userCountry, setUserCountry] = useState('XX');
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'global' | 'country'>('global');
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    getUserCountry().then(setUserCountry);
  }, []);

  useEffect(() => {
    const notifyUser = localStorage.getItem('cosmicMantra_autoSubmitNotify');
    if (notifyUser) {
      localStorage.removeItem('cosmicMantra_autoSubmitNotify');
      const score = localStorage.getItem('cosmicMantra_lastSessionScore');
      toast({
        title: '🙏 Score auto-saved!',
        description: `${score ? `${score} pairs` : 'Your score'} was automatically submitted to the leaderboard for ${notifyUser}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/global'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/country'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/total'] });
    }
  }, [toast, queryClient]);

  const { data: globalLeaderboard, isLoading: globalLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/global'],
  });

  const { data: countryLeaderboard, isLoading: countryLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/country', userCountry],
    enabled: userCountry !== 'XX',
  });

  const { data: totalData } = useQuery<{ totalScore: number }>({
    queryKey: ['/api/leaderboard/total'],
  });

  const submitMutation = useMutation({
    mutationFn: (data: UpdateScore) => apiRequest('POST', '/api/leaderboard/score', data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/global'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/country'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/total'] });
      setSubmittedScore(variables.score);
      toast({ title: '🙏 Score submitted!', description: `${formatNum(variables.score)} pairs added to the leaderboard.` });
    },
  });

  const handleSubmit = () => {
    const name = user ? user.username : playerName.trim();
    const freshScore = getAutoScore();
    if (!name || freshScore <= 0) return;
    if (!user) localStorage.setItem('hareKrishnaPlayerName', name);
    submitMutation.mutate({ playerName: name, score: freshScore, country: userCountry });
  };

  const currentScore = getAutoScore();
  const alreadySubmitted = submittedScore !== null && submittedScore >= currentScore;
  const canSubmit = currentScore > 0 && !alreadySubmitted && (user ? true : playerName.trim().length > 0);

  const activeList = (activeTab === 'global' ? globalLeaderboard : countryLeaderboard) ?? [];
  const loading = activeTab === 'global' ? globalLoading : countryLoading;

  const filteredList = search
    ? activeList.filter((e) => e.playerName.toLowerCase().includes(search.toLowerCase()))
    : activeList;

  const top3 = filteredList.slice(0, 3);
  const rest = filteredList.slice(3);

  const myEntry = user ? activeList.find((e) => e.playerName === user.username) : null;
  const myRank = myEntry ? activeList.indexOf(myEntry) + 1 : 0;

  const nextEntry = myRank > 1 ? activeList[myRank - 2] : null;
  const toNextRank = nextEntry && myEntry ? nextEntry.score - myEntry.score + 1 : 0;

  const podiumOrder = top3.length >= 2
    ? [top3[1], top3[0], top3[2]].filter(Boolean)
    : top3;
  const podiumRanks = top3.length >= 2 ? [2, 1, 3] : [1, 2, 3];
  const podiumHeights = ['h-20', 'h-28', 'h-14'];
  const podiumBg = [
    'linear-gradient(180deg,#c0c0c0,#a0a0a0)',
    'linear-gradient(180deg,#ffd700,#f0a500)',
    'linear-gradient(180deg,#cd7f32,#a0522d)',
  ];
  const podiumLabel = ['🥈', '🥇', '🥉'];

  return (
    <div className="min-h-screen px-4 pt-10 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Hall of Champions</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>Global Leaderboard</h1>
      </div>

      {/* Total banner */}
      <div className="glass-card px-6 py-4 mb-6 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,215,0,0.15)' }}>
        <div>
          <p className="text-[#d0c6ab] text-xs tracking-wider uppercase"
            style={{ fontFamily: 'Inter, sans-serif' }}>Total Global Mantras</p>
          <p className="text-2xl font-bold text-[#ffd700]"
            style={{ fontFamily: 'Sora, sans-serif', textShadow: '0 0 16px rgba(255,215,0,0.6)' }}>
            {formatNum(totalData?.totalScore ?? 0)}
          </p>
        </div>
        <span className="material-symbols-outlined text-[#ffd700] text-4xl">groups</span>
      </div>

      {/* Submit score card */}
      <div className="glass-card p-5 mb-6">
        <p className="text-[#d0c6ab] text-xs tracking-[0.2em] uppercase mb-3"
          style={{ fontFamily: 'Inter, sans-serif' }}>Submit Your Score</p>

        {/* Score badge — always auto, never editable */}
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ffd700] text-base">auto_awesome</span>
          <span className="text-[#fff6df] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your score:&nbsp;
            <span className="font-bold text-[#ffd700]" style={{ fontFamily: 'Sora, sans-serif' }}>
              {currentScore > 0 ? `${formatNum(currentScore)} pairs` : 'No score yet — go chant first!'}
            </span>
          </span>
        </div>

        {user ? (
          /* Logged-in: show username pill + submit */
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(255,215,0,0.2)', color: '#ffd700', fontFamily: 'Sora, sans-serif' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-[#ffd700] text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                {user.username}
              </span>
            </div>
            <button onClick={handleSubmit}
              disabled={submitMutation.isPending || !canSubmit}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
              style={{ fontFamily: 'Sora, sans-serif', background: alreadySubmitted ? 'rgba(47,51,75,0.6)' : 'linear-gradient(135deg,#e9c400,#ffd700)', color: alreadySubmitted ? '#a3e635' : '#3a3000', border: alreadySubmitted ? '1px solid rgba(163,230,53,0.3)' : 'none' }}>
              {alreadySubmitted
                ? <><span className="material-symbols-outlined text-base">check_circle</span> Submitted</>
                : submitMutation.isPending ? 'Submitting…' : t.leaderboard.submit}
            </button>
          </div>
        ) : (
          /* Guest: name input + submit */
          <div className="flex gap-2 flex-wrap">
            <input type="text" placeholder="Enter your name…"
              value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={50}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm text-[#fff6df] outline-none"
              style={{ fontFamily: 'Inter, sans-serif', background: 'rgba(47,51,75,0.6)', border: '1px solid rgba(255,255,255,0.1)' }} />
            <button onClick={handleSubmit}
              disabled={submitMutation.isPending || !canSubmit}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
              style={{ fontFamily: 'Sora, sans-serif', background: alreadySubmitted ? 'rgba(47,51,75,0.6)' : 'linear-gradient(135deg,#e9c400,#ffd700)', color: alreadySubmitted ? '#a3e635' : '#3a3000', border: alreadySubmitted ? '1px solid rgba(163,230,53,0.3)' : 'none' }}>
              {alreadySubmitted
                ? <><span className="material-symbols-outlined text-base">check_circle</span> Submitted</>
                : submitMutation.isPending ? 'Submitting…' : t.leaderboard.submit}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'global' as const, label: 'Global', icon: 'public' },
          { id: 'country' as const, label: `${getFlagEmoji(userCountry)} ${userCountry}`, icon: 'flag' },
        ].map(({ id, label, icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              fontFamily: 'Inter, sans-serif',
              background: activeTab === id ? 'linear-gradient(135deg,#e9c400,#ffd700)' : 'rgba(47,51,75,0.5)',
              color: activeTab === id ? '#3a3000' : '#d0c6ab',
              border: activeTab === id ? 'none' : '1px solid rgba(255,255,255,0.08)',
            }}>
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d0c6ab] text-xl">search</span>
        <input type="text" placeholder="Search players..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#fff6df] outline-none"
          style={{ fontFamily: 'Inter, sans-serif', background: 'rgba(25,30,53,0.6)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-[#d0c6ab]/40 mb-3 block">leaderboard</span>
          <p className="text-[#d0c6ab] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            {search ? 'No matching players found' : t.leaderboard.noEntries}
          </p>
        </div>
      ) : (
        <>
          {/* Podium */}
          {!search && top3.length >= 1 && (
            <div className="flex items-end justify-center gap-4 mb-8 px-2">
              {podiumOrder.map((entry, i) => {
                if (!entry) return null;
                const color = getAvatarColor(entry.playerName);
                return (
                  <div key={entry.id} className="flex flex-col items-center flex-1 max-w-[110px]">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold mb-1 flex-shrink-0"
                      style={{ background: `${color}22`, border: `2px solid ${color}55`, color,
                        fontFamily: 'Sora, sans-serif',
                        boxShadow: podiumRanks[i] === 1 ? `0 0 18px ${color}45` : 'none' }}>
                      {entry.playerName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-[#fff6df] text-xs font-semibold text-center truncate w-full mb-0.5"
                      style={{ fontFamily: 'Sora, sans-serif' }}>{entry.playerName}</p>
                    <p className="text-[#d0c6ab] text-[11px] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {formatNum(entry.score)}
                    </p>
                    <div className={`w-full ${podiumHeights[i]} flex items-center justify-center rounded-t-lg text-lg`}
                      style={{ background: podiumBg[i], boxShadow: '0 -4px 12px rgba(0,0,0,0.3)' }}>
                      {podiumLabel[i]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ranked list */}
          <div className="glass-card divide-y divide-white/5">
            {(search ? filteredList : rest).map((entry, i) => {
              const rank = search ? i + 1 : i + 4;
              const color = getAvatarColor(entry.playerName);
              const isMe = user && entry.playerName === user.username;
              return (
                <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5"
                  style={{ background: isMe ? 'rgba(255,215,0,0.06)' : 'transparent' }}>
                  <span className="text-sm font-bold w-6 text-right flex-shrink-0 text-[#d0c6ab]"
                    style={{ fontFamily: 'Sora, sans-serif' }}>{rank}</span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ background: `${color}1a`, border: `1.5px solid ${color}45`, color, fontFamily: 'Sora, sans-serif' }}>
                    {entry.playerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold flex items-center gap-1.5 truncate"
                      style={{ fontFamily: 'Sora, sans-serif', color: isMe ? '#ffd700' : '#fff6df' }}>
                      {entry.playerName}
                      {isMe && (
                        <span className="text-[10px] bg-[#ffd700]/15 text-[#ffd700] px-1.5 py-0.5 rounded-full border border-[#ffd700]/30">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-[#d0c6ab] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {getFlagEmoji(entry.country || 'XX')} {Math.floor(entry.score / 108)} malas
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#ffd700] font-bold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {formatNum(entry.score)}
                    </p>
                    <p className="text-[#d0c6ab] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>pairs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Sticky My Rank footer (mobile) */}
      {myEntry && myRank > 3 && user && (
        <div className="md:hidden fixed bottom-16 left-0 w-full z-40 px-4 py-3"
          style={{ background: 'rgba(8,13,34,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,215,0,0.2)' }}>
          <div className="flex items-center gap-3">
            <span className="text-[#ffd700] font-bold text-base w-8 text-center"
              style={{ fontFamily: 'Sora, sans-serif' }}>#{myRank}</span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(255,215,0,0.15)', border: '1.5px solid rgba(255,215,0,0.5)', color: '#ffd700', fontFamily: 'Sora, sans-serif' }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#ffd700] text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                {user.username}
              </p>
              <p className="text-[#d0c6ab] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                {formatNum(myEntry.score)} pairs
              </p>
            </div>
            {toNextRank > 0 && (
              <div className="text-right flex-shrink-0">
                <p className="text-[#dcb8ff] text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatNum(toNextRank)} more
                </p>
                <p className="text-[#d0c6ab] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  to #{myRank - 1}!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
