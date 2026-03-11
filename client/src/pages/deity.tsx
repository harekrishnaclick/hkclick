import { DeityGame } from '@/components/DeityGame';
import { deityConfigs } from '@/lib/deityConfigs';
import { Redirect } from 'wouter';

interface AuthUser {
  id: string;
  username: string;
}

interface DeityPageProps {
  deityKey: string;
  user: AuthUser | null;
  isMuted: boolean;
}

export default function DeityPage({ deityKey, user, isMuted }: DeityPageProps) {
  const config = deityConfigs[deityKey];

  if (!config) {
    return <Redirect to="/krishna" />;
  }

  return (
    <DeityGame
      key={deityKey}
      config={config}
      user={user}
      isMuted={isMuted}
    />
  );
}
