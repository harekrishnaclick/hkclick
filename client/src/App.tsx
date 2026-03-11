import { useState, useCallback } from 'react';
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { AuthModal } from "@/components/AuthModal";
import DeityPage from "@/pages/deity";
import NotFound from "@/pages/not-found";

interface AuthUser {
  id: string;
  username: string;
}

const deityKeys = [
  'krishna', 'radha', 'rama', 'shivji', 'hanuman',
  'ganesh', 'durga', 'saibaba', 'gurunanak', 'buddha', 'mahavir'
];

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('harekrishna_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('harekrishna_muted') === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

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

  return (
    <div className="relative">
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
        <HamburgerMenu
          user={user}
          onLoginClick={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      </div>

      <AuthModal
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isOpen={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />

      <Switch>
        <Route path="/">
          <Redirect to="/krishna" />
        </Route>
        {deityKeys.map(key => (
          <Route key={key} path={`/${key}`}>
            <DeityPage deityKey={key} user={user} isMuted={isMuted} />
          </Route>
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
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
