import { useState, useCallback } from 'react';
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { AuthModal } from "@/components/AuthModal";
import { CookieBanner } from "@/components/CookieBanner";
import DeityPage from "@/pages/deity";
import DeityGallery from "@/pages/deities";
import StatsPage from "@/pages/stats";
import LeaderboardPage from "@/pages/leaderboard";
import AboutPage from "@/pages/about";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import ChalisaPage from "@/pages/chalisa";
import HanumanAshtakPage from "@/pages/hanuman-ashtak";
import ShivChalisaPage from "@/pages/shiv-chalisa";
import GayatriMantraPage from "@/pages/gayatri-mantra";
import MahamrityunjayaPage from "@/pages/mahamrityunjaya";
import OmNamahShivayaPage from "@/pages/om-namah-shivaya";
import GaneshVandanaPage from "@/pages/ganesh-vandana";
import SaraswatiVandanaPage from "@/pages/saraswati-vandana";
import BajrangBaanPage from "@/pages/bajrang-baan";
import NotFound from "@/pages/not-found";
import { getTranslations, type Language } from "@/lib/translations";

interface AuthUser {
  id: string;
  username: string;
}

const deityKeys = [
  'krishna', 'radha', 'rama', 'shivji', 'hanuman', 'ganesh', 'durga'
];

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('harekrishna_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('harekrishna_muted') === 'true';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('harekrishna_lang') as Language) || 'en';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const t = getTranslations(language);

  const handleLogin = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('harekrishna_user', JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('harekrishna_user');
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('harekrishna_muted', String(next));
      return next;
    });
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('harekrishna_lang', next);
      return next as Language;
    });
  }, []);

  return (
    <AppShell
      user={user}
      isMuted={isMuted}
      language={language}
      onLoginClick={() => setAuthModalOpen(true)}
      onLogout={handleLogout}
      onToggleMute={handleToggleMute}
      onToggleLanguage={handleToggleLanguage}
      t={t}
    >
      <AuthModal
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isOpen={authModalOpen}
        onOpenChange={setAuthModalOpen}
        t={t}
      />

      <Switch>
        <Route path="/">
          <Redirect to={`/${typeof localStorage !== 'undefined' ? (localStorage.getItem('cosmicMantra_lastDeity') || 'krishna') : 'krishna'}`} />
        </Route>
        <Route path="/deities">
          <DeityGallery t={t} />
        </Route>
        <Route path="/stats">
          <StatsPage t={t} language={language} />
        </Route>
        <Route path="/leaderboard">
          <LeaderboardPage user={user} t={t} />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/privacy">
          <PrivacyPage />
        </Route>
        <Route path="/terms">
          <TermsPage />
        </Route>
        <Route path="/chalisa">
          <ChalisaPage />
        </Route>
        <Route path="/hanuman-ashtak">
          <HanumanAshtakPage />
        </Route>
        <Route path="/shiv-chalisa">
          <ShivChalisaPage />
        </Route>
        <Route path="/gayatri-mantra">
          <GayatriMantraPage />
        </Route>
        <Route path="/mahamrityunjaya">
          <MahamrityunjayaPage />
        </Route>
        <Route path="/om-namah-shivaya">
          <OmNamahShivayaPage />
        </Route>
        <Route path="/ganesh-vandana">
          <GaneshVandanaPage />
        </Route>
        <Route path="/saraswati-vandana">
          <SaraswatiVandanaPage />
        </Route>
        <Route path="/bajrang-baan">
          <BajrangBaanPage />
        </Route>
        {deityKeys.map(key => (
          <Route key={key} path={`/${key}`}>
            <DeityPage deityKey={key} user={user} isMuted={isMuted} t={t} language={language} />
          </Route>
        ))}
        <Route component={NotFound} />
      </Switch>
      <CookieBanner />
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
