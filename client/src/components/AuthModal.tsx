import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createAccountSchema, loginSchema, setPasswordSchema, type CreateAccount, type Login, type SetPassword } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'menu' | 'create-account' | 'login' | 'set-password';
  token?: string;
}

export function AuthModal({ isOpen, onClose, initialStep = 'menu', token }: AuthModalProps) {
  const [currentStep, setCurrentStep] = useState<'menu' | 'create-account' | 'login' | 'set-password'>(initialStep);
  const { toast } = useToast();

  const createAccountForm = useForm<CreateAccount>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const loginForm = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const setPasswordForm = useForm<SetPassword>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: CreateAccount) => {
      const res = await apiRequest('POST', '/api/auth/create-account', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Check your email for verification instructions.',
      });
      onClose();
      createAccountForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: Login) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.user.username}`,
      });
      onClose();
      loginForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: async (data: SetPassword) => {
      const res = await apiRequest('POST', '/api/auth/set-password', data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Account created!',
        description: `Welcome ${data.user.username}! Your account is ready.`,
      });
      onClose();
      setPasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    onClose();
    setCurrentStep('menu');
    createAccountForm.reset();
    loginForm.reset();
  };

  const renderMenuStep = () => (
    <div className="space-y-4">
      <Button 
        data-testid="button-create-account"
        onClick={() => setCurrentStep('create-account')} 
        className="w-full bg-golden hover:bg-golden/90 text-black font-medium"
      >
        Create Account
      </Button>
      <Button 
        data-testid="button-login"
        onClick={() => setCurrentStep('login')} 
        variant="outline" 
        className="w-full border-golden text-golden hover:bg-golden/10"
      >
        Login
      </Button>
    </div>
  );

  const renderCreateAccountStep = () => (
    <Form {...createAccountForm}>
      <form onSubmit={createAccountForm.handleSubmit((data) => createAccountMutation.mutate(data))} className="space-y-4">
        <FormField
          control={createAccountForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-username"
                  placeholder="Enter username" 
                  className="bg-black/20 border-golden/30 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccountForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-email"
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-black/20 border-golden/30 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('menu')}
            className="flex-1 border-golden/30 text-golden hover:bg-golden/10"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            data-testid="button-submit-create-account"
            disabled={createAccountMutation.isPending}
            className="flex-1 bg-golden hover:bg-golden/90 text-black font-medium"
          >
            {createAccountMutation.isPending ? 'Sending...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderLoginStep = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-login-email"
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-black/20 border-golden/30 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-login-password"
                  type="password" 
                  placeholder="Enter password" 
                  className="bg-black/20 border-golden/30 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('menu')}
            className="flex-1 border-golden/30 text-golden hover:bg-golden/10"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            data-testid="button-submit-login"
            disabled={loginMutation.isPending}
            className="flex-1 bg-golden hover:bg-golden/90 text-black font-medium"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderSetPasswordStep = () => (
    <div>
      <p className="text-white/80 mb-4">
        Your email has been verified! Please set your password to complete your account setup.
      </p>
      <Form {...setPasswordForm}>
        <form onSubmit={setPasswordForm.handleSubmit((data) => setPasswordMutation.mutate(data))} className="space-y-4">
          <FormField
            control={setPasswordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    data-testid="input-set-password"
                    type="password" 
                    placeholder="Enter password (min 6 characters)" 
                    className="bg-black/20 border-golden/30 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            data-testid="button-submit-set-password"
            disabled={setPasswordMutation.isPending}
            className="w-full bg-golden hover:bg-golden/90 text-black font-medium"
          >
            {setPasswordMutation.isPending ? 'Creating account...' : 'Set Password'}
          </Button>
        </form>
      </Form>
    </div>
  );

  const getTitle = () => {
    switch (currentStep) {
      case 'create-account': return 'Create Account';
      case 'login': return 'Login';
      case 'set-password': return 'Set Password';
      default: return 'Authentication';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-cosmic-dark/95 border-golden/30 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-golden text-center">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {currentStep === 'menu' && renderMenuStep()}
          {currentStep === 'create-account' && renderCreateAccountStep()}
          {currentStep === 'login' && renderLoginStep()}
          {currentStep === 'set-password' && renderSetPasswordStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}