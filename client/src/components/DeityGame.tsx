import { useState, useEffect, useCallback } from 'react';
import { Leaderboard } from '@/components/Leaderboard';

interface AuthUser {
  id: string;
  username: string;
}

type ButtonType = 'button1' | 'button2';
type GameState = {
  score: number;
  lastClicked: ButtonType | null;
  expecting: ButtonType;
  malaCount: number;
};

export interface DeityGameConfig {
  deityName: string;
  buttonLabels: [string, string];
  colors: { primary: string; secondary: string };
  backgroundImage: string;
  sounds: [string, string];
}

interface DeityGameProps {
  config: DeityGameConfig;
  user: AuthUser | null;
  isMuted: boolean;
}

const FloatingParticle = ({ id }: { id: string }) => {
  const [style] = useState({
    left: Math.random() * 100 + 'vw',
    top: Math.random() * 100 + 'vh',
    width: Math.random() * 4 + 2 + 'px',
    animationDuration: Math.random() * 3 + 2 + 's',
    opacity: Math.random() * 0.5 + 0.3,
  });

  return (
    <div
      key={id}
      className="particle animate-twinkle"
      style={{
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.width,
        animationDuration: style.animationDuration,
        opacity: style.opacity,
      }}
    />
  );
};

const GameButton = ({
  label,
  onClick,
  isExpected,
  isPressed,
  gradientClass,
  textSizeClass,
}: {
  label: string;
  onClick: () => void;
  isExpected: boolean;
  isPressed: boolean;
  gradientClass: string;
  textSizeClass: string;
}) => {
  const baseClasses = `
    w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full text-white/90 font-bold 
    border-2 md:border-4 flex items-center justify-center orbitron tracking-wider select-none
    shadow-2xl touch-manipulation ${textSizeClass}
  `;

  const borderClasses = isExpected
    ? 'border-golden/80 shadow-[0_0_30px_rgba(255,215,0,0.5)]'
    : 'border-white/30';

  const scaleStyle = {
    transform: isPressed ? 'scale(0.92)' : 'scale(1)',
    transition: 'transform 0.08s ease-out',
  };

  return (
    <button
      className={`${baseClasses} ${gradientClass} ${borderClasses}`}
      style={scaleStyle}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export function DeityGame({ config, user, isMuted }: DeityGameProps) {
  const { deityName, buttonLabels, colors, backgroundImage, sounds } = config;

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lastClicked: null,
    expecting: 'button1',
    malaCount: 0,
  });

  const [particles, setParticles] = useState<string[]>([]);
  const [pressedButton, setPressedButton] = useState<ButtonType | null>(null);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [malaExpanded, setMalaExpanded] = useState(() => {
    return window.innerWidth >= 768;
  });

  const [audio1] = useState(new Audio(sounds[0]));
  const [audio2] = useState(new Audio(sounds[1]));

  const createParticle = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    setParticles(prev => [...prev, id]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 100);
    }
    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, [createParticle]);

  useEffect(() => {
    audio1.preload = 'auto';
    audio2.preload = 'auto';
    audio1.volume = 0.7;
    audio2.volume = 0.7;
  }, [audio1, audio2]);

  const handleButtonClick = useCallback(
    (buttonType: ButtonType) => {
      if (!isMuted) {
        try {
          if (buttonType === 'button1') {
            audio1.currentTime = 0;
            audio1.play().catch(console.warn);
          } else {
            audio2.currentTime = 0;
            audio2.play().catch(console.warn);
          }
        } catch (error) {
          console.warn('Audio playback failed:', error);
        }
      }

      setPressedButton(buttonType);
      setTimeout(() => setPressedButton(null), 100);

      setGameState(prev => {
        const newState = { ...prev };

        if (buttonType === prev.expecting) {
          if (buttonType === 'button2' && prev.lastClicked === 'button1') {
            newState.score = prev.score + 1;

            if (newState.score > 0 && newState.score % 108 === 0) {
              newState.malaCount = prev.malaCount + 1;
            }

            setScoreAnimation(true);
            setTimeout(() => setScoreAnimation(false), 300);
          }

          newState.lastClicked = buttonType;
          newState.expecting = buttonType === 'button1' ? 'button2' : 'button1';
        } else {
          newState.lastClicked = buttonType;
          newState.expecting = buttonType === 'button1' ? 'button2' : 'button1';
        }

        return newState;
      });
    },
    [audio1, audio2, isMuted],
  );

  const getStatusText = () => {
    if (gameState.expecting === 'button1') {
      return (
        <span style={{ color: colors.primary }}>Click {buttonLabels[0]}</span>
      );
    } else {
      return (
        <span style={{ color: colors.secondary }}>
          Click {buttonLabels[1]}
        </span>
      );
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="stars" />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map(id => (
          <FloatingParticle key={id} id={id} />
        ))}
      </div>

      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
        <div className="bg-gradient-to-br from-black/30 to-blue-900/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <button
            onClick={() => setMalaExpanded(prev => !prev)}
            className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3 text-golden text-xs md:text-sm font-bold orbitron tracking-wider touch-manipulation"
          >
            <span className="flex items-center gap-2">
              <span>📿</span>
              <span>{gameState.malaCount}</span>
            </span>
            <svg
              className={`w-3 h-3 ml-2 transition-transform duration-200 ${malaExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {malaExpanded && (
            <div className="px-3 pb-3 md:px-4 md:pb-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-3 pt-2 mb-1">
                <div
                  className="text-2xl md:text-4xl font-black orbitron text-golden"
                  style={{
                    textShadow:
                      '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
                  }}
                >
                  {gameState.malaCount}
                </div>
                <span className="text-golden/60 text-xs orbitron">MALAS</span>
              </div>

              <div className="text-blue-300/80 text-center text-xs">
                {108 - (gameState.score % 108)} to next mala
              </div>

              <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                <div
                  className="bg-golden/70 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((gameState.score % 108) / 108) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6 md:mb-8 mt-16 md:mt-0">
          <h1 className="orbitron text-3xl sm:text-4xl md:text-6xl font-bold text-golden score-glow animate-pulse-slow">
            {deityName}
          </h1>
        </div>

        <div className="text-center mb-8 md:mb-12">
          <div
            className={`orbitron text-4xl sm:text-6xl md:text-8xl font-black text-golden score-glow ${
              scoreAnimation ? 'animate-score-increase' : ''
            }`}
          >
            {gameState.score}
          </div>
          <p className="text-white/60 text-xs sm:text-sm md:text-base mt-2">
            PAIRS COMPLETED
          </p>
        </div>

        <div className="flex flex-row gap-2 sm:gap-4 md:gap-12 items-center justify-center px-2">
          <GameButton
            label={buttonLabels[0]}
            onClick={() => handleButtonClick('button1')}
            isExpected={gameState.expecting === 'button1'}
            isPressed={pressedButton === 'button1'}
            gradientClass="bg-gradient-to-br from-black/20 to-purple-900/30 backdrop-blur-sm"
            textSizeClass={
              buttonLabels[0].length <= 4
                ? 'text-lg sm:text-xl md:text-3xl'
                : buttonLabels[0].length <= 8
                  ? 'text-base sm:text-lg md:text-2xl'
                  : 'text-xs sm:text-sm md:text-xl'
            }
          />

          <GameButton
            label={buttonLabels[1]}
            onClick={() => handleButtonClick('button2')}
            isExpected={gameState.expecting === 'button2'}
            isPressed={pressedButton === 'button2'}
            gradientClass="bg-gradient-to-br from-black/20 to-blue-900/30 backdrop-blur-sm"
            textSizeClass={
              buttonLabels[1].length <= 6
                ? 'text-lg sm:text-xl md:text-3xl'
                : buttonLabels[1].length <= 10
                  ? 'text-base sm:text-lg md:text-2xl'
                  : 'text-xs sm:text-sm md:text-xl'
            }
          />
        </div>

        <div className="mt-8 text-center">
          <div className="text-white/80 text-lg md:text-xl">
            {getStatusText()}
          </div>
          <div className="mt-2 flex justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                gameState.expecting === 'button1'
                  ? 'animate-indicator-blink'
                  : 'bg-golden/30'
              }`}
              style={{
                backgroundColor: gameState.expecting === 'button1' ? colors.primary : undefined,
              }}
            />
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                gameState.expecting === 'button2'
                  ? 'animate-indicator-blink'
                  : 'bg-golden/30'
              }`}
              style={{
                backgroundColor: gameState.expecting === 'button2' ? colors.secondary : undefined,
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Leaderboard
            currentScore={gameState.score}
            loggedInUsername={user?.username}
            onScoreSubmitted={() => {
              console.log('Score submitted successfully!');
            }}
          />
        </div>
      </div>
    </div>
  );
}
