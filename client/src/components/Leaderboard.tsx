import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Globe, Flag, Users } from 'lucide-react';
import type { LeaderboardEntry, UpdateScore } from '@shared/schema';

// Helper function to get user's country
const getUserCountry = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/country/');
    const country = await response.text();
    return country || 'XX';
  } catch {
    return 'XX';
  }
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Flag emoji helper
const getFlagEmoji = (countryCode: string): string => {
  if (countryCode === 'XX') return '🌍';
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

interface LeaderboardProps {
  currentScore: number;
  onScoreSubmitted?: () => void;
}

export function Leaderboard({ currentScore, onScoreSubmitted }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [userCountry, setUserCountry] = useState('XX');
  const [activeTab, setActiveTab] = useState('global');
  
  const queryClient = useQueryClient();

  // Get user's country on component mount
  useEffect(() => {
    getUserCountry().then(setUserCountry);
  }, []);

  // Load saved player name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('hareKrishnaPlayerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Fetch global leaderboard
  const { data: globalLeaderboard, isLoading: globalLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/global'],
  });

  // Fetch country leaderboard
  const { data: countryLeaderboard, isLoading: countryLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/country', userCountry],
    enabled: userCountry !== 'XX',
  });

  // Fetch total global score
  const { data: totalData } = useQuery<{ totalScore: number }>({
    queryKey: ['/api/leaderboard/total'],
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async (data: UpdateScore) => {
      return apiRequest('POST', '/api/leaderboard/score', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/global'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/country'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/total'] });
      onScoreSubmitted?.();
    },
  });

  const handleSubmitScore = () => {
    if (!playerName.trim() || currentScore === 0) return;
    
    const trimmedName = playerName.trim();
    localStorage.setItem('hareKrishnaPlayerName', trimmedName);
    
    submitScoreMutation.mutate({
      playerName: trimmedName,
      score: currentScore,
      country: userCountry,
    });
  };

  const getRankEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const LeaderboardList = ({ 
    data, 
    loading, 
    showCountry = true 
  }: { 
    data?: LeaderboardEntry[]; 
    loading: boolean; 
    showCountry?: boolean;
  }) => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-cosmic-purple/20 rounded-lg animate-pulse">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-16"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-white/60">
          No entries yet. Be the first to submit your score!
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              index < 3 
                ? 'bg-gradient-to-r from-golden/20 to-mystic-purple/20 border border-golden/30' 
                : 'bg-cosmic-purple/20 hover:bg-cosmic-purple/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold orbitron">{getRankEmoji(index)}</span>
              <div>
                <div className="font-semibold text-white flex items-center space-x-2">
                  <span>{entry.playerName}</span>
                  {showCountry && (
                    <span className="text-sm">{getFlagEmoji(entry.country || 'XX')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-golden">{formatNumber(entry.score)}</div>
              <div className="text-xs text-white/60">pairs</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          data-testid="leaderboard-button"
          className="bg-gradient-to-r from-mystic-purple to-blue-600 hover:from-mystic-purple/80 hover:to-blue-600/80 text-white border-2 border-golden/50 hover:border-golden button-glow"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-cosmic-purple to-deep-space border-2 border-golden/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold orbitron text-golden text-center">
            🌟 GLOBAL LEADERBOARD 🌟
          </DialogTitle>
        </DialogHeader>
        
        {/* Global Stats */}
        <div className="text-center mb-6">
          <div className="text-sm text-white/60 mb-2">Total Global Score</div>
          <div className="text-3xl font-bold orbitron text-golden score-glow">
            {formatNumber(totalData?.totalScore || 0)}
          </div>
          <div className="text-xs text-white/60">pairs completed worldwide</div>
        </div>

        {/* Score Submission */}
        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <div className="text-center mb-4">
            <div className="text-lg font-semibold">Your Score: <span className="text-golden">{formatNumber(currentScore)}</span></div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              data-testid="player-name-input"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-cosmic-blue/50 border-golden/30 text-white placeholder:text-white/50"
              maxLength={50}
            />
            <Button
              data-testid="submit-score-button"
              onClick={handleSubmitScore}
              disabled={!playerName.trim() || currentScore === 0 || submitScoreMutation.isPending}
              className="bg-golden hover:bg-golden/80 text-black font-bold"
            >
              {submitScoreMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-cosmic-blue/30">
            <TabsTrigger 
              value="global" 
              className="data-[state=active]:bg-golden data-[state=active]:text-black"
            >
              <Globe className="w-4 h-4 mr-2" />
              Global
            </TabsTrigger>
            <TabsTrigger 
              value="country" 
              className="data-[state=active]:bg-golden data-[state=active]:text-black"
              disabled={userCountry === 'XX'}
            >
              <Flag className="w-4 h-4 mr-2" />
              {getFlagEmoji(userCountry)} {userCountry}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="mt-4">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Users className="w-5 h-5 text-golden" />
              <span className="text-lg font-semibold">Top Players Worldwide</span>
            </div>
            <LeaderboardList data={globalLeaderboard} loading={globalLoading} />
          </TabsContent>
          
          <TabsContent value="country" className="mt-4">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <span className="text-2xl">{getFlagEmoji(userCountry)}</span>
              <span className="text-lg font-semibold">Top Players in {userCountry}</span>
            </div>
            <LeaderboardList 
              data={countryLeaderboard} 
              loading={countryLoading} 
              showCountry={false} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}