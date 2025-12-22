import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AuthUser {
  id: string;
  username: string;
}

interface AuthModalProps {
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

export function AuthModal({ user, onLogin, onLogout }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      setUsername('');
      setPassword('');
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password',
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
      setIsOpen(false);
      setUsername('');
      setPassword('');
      toast({
        title: 'Account created!',
        description: `Welcome, ${data.username}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Username may already be taken',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3 || password.length < 4) {
      toast({
        title: 'Invalid input',
        description: 'Username must be 3+ characters, password 4+ characters',
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

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-golden/30">
          <User className="w-4 h-4 text-golden" />
          <span className="text-white/90 text-sm font-medium" data-testid="text-username">
            {user.username}
          </span>
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-golden/30 hover:bg-white/20 hover:border-golden/50 transition-all duration-300 text-white"
          data-testid="button-login"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cosmic-dark/95 backdrop-blur-xl border-golden/30 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-golden orbitron text-xl text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="bg-white/10 border-golden/30 text-white placeholder:text-white/40 focus:border-golden"
              disabled={isPending}
              data-testid="input-username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-white/10 border-golden/30 text-white placeholder:text-white/40 focus:border-golden"
              disabled={isPending}
              data-testid="input-password"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-golden/80 to-amber-600 hover:from-golden hover:to-amber-500 text-cosmic-dark font-bold rounded-full transition-all duration-300"
            disabled={isPending}
            data-testid="button-submit-auth"
          >
            {isPending ? (
              <span className="animate-pulse">Processing...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-golden/70 hover:text-golden text-sm transition-colors"
            data-testid="button-toggle-auth-mode"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
