import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Translations } from '@/lib/translations';

interface AuthUser {
  id: string;
  username: string;
}

interface AuthModalProps {
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  t: Translations;
}

export function AuthModal({ onLogin, isOpen, onOpenChange, t }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      onLogin(data);
      onOpenChange(false);
      setUsername('');
      setPassword('');
      toast({
        title: t.auth.welcomeBackToast,
        description: `${t.auth.loggedInAs} ${data.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.auth.loginFailed,
        description: error.message || t.auth.invalidCredentials,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: (data) => {
      onLogin(data);
      onOpenChange(false);
      setUsername('');
      setPassword('');
      toast({
        title: t.auth.accountCreated,
        description: `${t.auth.welcomeUser} ${data.username}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.auth.registrationFailed,
        description: error.message || t.auth.usernameTaken,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3 || password.length < 4) {
      toast({
        title: t.auth.invalidInput,
        description: t.auth.inputRequirements,
        variant: 'destructive',
      });
      return;
    }
    
    if (isRegister) {
      registerMutation.mutate({ username, password });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark/95 backdrop-blur-xl border-golden/30 text-white max-w-sm" style={{ backgroundColor: 'rgba(10, 5, 30, 0.95)' }}>
        <DialogHeader>
          <DialogTitle className="text-golden orbitron text-xl text-center">
            {isRegister ? t.auth.createAccount : t.auth.welcomeBack}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80">{t.auth.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.auth.enterUsername}
              className="bg-white/10 border-golden/30 text-white placeholder:text-white/40 focus:border-golden"
              disabled={isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.enterPassword}
              className="bg-white/10 border-golden/30 text-white placeholder:text-white/40 focus:border-golden"
              disabled={isPending}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-golden/80 to-amber-600 hover:from-golden hover:to-amber-500 text-cosmic-dark font-bold rounded-full transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <span className="animate-pulse">{t.auth.processing}</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                {t.auth.createAccountBtn}
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {t.auth.login}
              </>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-golden/70 hover:text-golden text-sm transition-colors"
          >
            {isRegister ? t.auth.alreadyHaveAccount : t.auth.dontHaveAccount}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
