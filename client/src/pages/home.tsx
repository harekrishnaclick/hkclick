import { useState, useEffect, useCallback } from 'react';
import { Leaderboard } from '@/components/Leaderboard';
import backgroundImage from '@assets/36f57654-c1a0-4deb-84b1-5c5c107f8f27_1755631140560.jpeg';
import button1Sound from '@assets/button_1_1755632167131.mp3';
import button2Sound from '@assets/button_2_1755632167130.mp3';

type ButtonType = 'hare' | 'krishna';
type GameState = {
  score: number;
  lastClicked: ButtonType | null;
  expecting: ButtonType;
  malaCount: number;
};

// Floating particle component
const FloatingParticle = ({ id }: { id: string }) => {
  const [style, setStyle] = useState({
    left: Math.random() * 100 + 'vw',
    top: Math.random() * 100 + 'vh',
    width: Math.random() * 4 + 2 + 'px',
    animationDuration: Math.random() * 3 + 2 + 's',
    opacity: Math.random() * 0.5 + 0.3,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle(prev => ({
        ...prev,
        left: Math.random() * 100 + 'vw',
        top: Math.random() * 100 + 'vh',
      }));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

// Game button component
const GameButton = ({ 
  type, 
  onClick, 
  isExpected, 
  isPressed 
}: { 
  type: ButtonType;
  onClick: () => void;
  isExpected: boolean;
  isPressed: boolean;
}) => {
  const isHare = type === 'hare';
  const label = isHare ? 'HARE' : 'KRISHNA';
  
  const baseClasses = `
    w-48 h-48 md:w-56 md:h-56 rounded-full text-white/90 font-bold 
    transition-all duration-200 hover:scale-105 active:scale-95 border-4 
    flex items-center justify-center orbitron tracking-wider select-none
    shadow-2xl hover:shadow-golden/30
    ${isHare ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}
    ${isExpected ? 'animate-button-pulse-active' : 'animate-button-pulse'}
  `;
  
  const gradientClasses = isHare 
    ? 'bg-gradient-to-br from-black/20 to-purple-900/30 backdrop-blur-sm'
    : 'bg-gradient-to-br from-black/20 to-blue-900/30 backdrop-blur-sm';
    
  const borderClasses = isExpected 
    ? 'border-golden/80 shadow-[0_0_30px_rgba(255,215,0,0.5)]' 
    : 'border-white/30 hover:border-golden/60 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]';
    
  const pressedClasses = isPressed ? 'animate-button-press' : '';

  return (
    <button
      data-testid={`button-${type}`}
      className={`${baseClasses} ${gradientClasses} ${borderClasses} ${pressedClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lastClicked: null,
    expecting: 'hare',
    malaCount: 0
  });
  
  const [particles, setParticles] = useState<string[]>([]);
  const [pressedButton, setPressedButton] = useState<ButtonType | null>(null);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  
  // Audio objects for button sounds
  const [audio1] = useState(new Audio(button1Sound));
  const [audio2] = useState(new Audio(button2Sound));

  // Create floating particles
  const createParticle = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    setParticles(prev => [...prev, id]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p !== id));
    }, 5000);
  }, []);

  // Initialize particles and set up periodic creation
  useEffect(() => {
    // Create initial particles
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 100);
    }
    
    // Create particles periodically
    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, [createParticle]);
  
  // Preload audio on component mount
  useEffect(() => {
    audio1.preload = 'auto';
    audio2.preload = 'auto';
    audio1.volume = 0.7;
    audio2.volume = 0.7;
  }, [audio1, audio2]);

  const handleButtonClick = useCallback((buttonType: ButtonType) => {
    // Play button sound
    try {
      if (buttonType === 'hare') {
        audio1.currentTime = 0;
        audio1.play().catch(console.warn);
      } else {
        audio2.currentTime = 0;
        audio2.play().catch(console.warn);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
    
    // Button press animation
    setPressedButton(buttonType);
    setTimeout(() => setPressedButton(null), 100);

    setGameState(prev => {
      const newState = { ...prev };
      
      if (buttonType === prev.expecting) {
        // Correct button clicked
        if (buttonType === 'krishna' && prev.lastClicked === 'hare') {
          // Complete pair - increase score
          newState.score = prev.score + 1;
          
          // Check if we completed a mala (108 pairs)
          if (newState.score > 0 && newState.score % 108 === 0) {
            newState.malaCount = prev.malaCount + 1;
          }
          
          setScoreAnimation(true);
          setTimeout(() => setScoreAnimation(false), 300);
        }
        
        newState.lastClicked = buttonType;
        newState.expecting = buttonType === 'hare' ? 'krishna' : 'hare';
      } else {
        // Wrong button clicked - no score increase, but update expectation
        newState.lastClicked = buttonType;
        newState.expecting = buttonType === 'hare' ? 'krishna' : 'hare';
      }
      
      return newState;
    });
  }, [audio1, audio2]);

  const getStatusText = () => {
    if (gameState.expecting === 'hare') {
      return <span className="text-mystic-purple">Click HARE</span>;
    } else {
      return <span className="text-blue-400">Click KRISHNA</span>;
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
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Animated Background */}
      <div className="stars" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(id => (
          <FloatingParticle key={id} id={id} />
        ))}
      </div>
      
      {/* Mala Counter */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-golden/30">
          <div className="text-golden/80 text-sm font-semibold mb-1 orbitron">MALA COUNTER</div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📿</span>
            <div className="text-2xl font-bold orbitron text-golden score-glow">
              {gameState.malaCount}
            </div>
          </div>
          <div className="text-xs text-white/60 mt-1">
            {108 - (gameState.score % 108)} to next mala
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="orbitron text-4xl md:text-6xl font-bold text-golden score-glow animate-pulse-slow">
            HARE KRISHNA
          </h1>
          <p className="text-white/80 text-lg md:text-xl mt-2 animate-float">
            Click in alternating order
          </p>
        </div>
        
        {/* Score Display */}
        <div className="text-center mb-12">
          <div 
            data-testid="score-display"
            className={`orbitron text-6xl md:text-8xl font-black text-golden score-glow ${
              scoreAnimation ? 'animate-score-increase' : ''
            }`}
          >
            {gameState.score}
          </div>
          <p className="text-white/60 text-sm md:text-base mt-2">PAIRS COMPLETED</p>
        </div>
        
        {/* Button Container */}
        <div className="flex flex-row gap-4 md:gap-12 items-center justify-center">
          {/* HARE Button */}
          <GameButton
            type="hare"
            onClick={() => handleButtonClick('hare')}
            isExpected={gameState.expecting === 'hare'}
            isPressed={pressedButton === 'hare'}
          />
          
          {/* VS Indicator */}
          <div className="text-golden/60 text-4xl md:text-6xl font-bold orbitron animate-pulse">
            OM
          </div>
          
          {/* KRISHNA Button */}
          <GameButton
            type="krishna"
            onClick={() => handleButtonClick('krishna')}
            isExpected={gameState.expecting === 'krishna'}
            isPressed={pressedButton === 'krishna'}
          />
        </div>
        
        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div data-testid="status-text" className="text-white/80 text-lg md:text-xl">
            {getStatusText()}
          </div>
          <div className="mt-2 flex justify-center space-x-2">
            <div 
              data-testid="indicator-hare"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                gameState.expecting === 'hare' 
                  ? 'bg-mystic-purple animate-pulse' 
                  : 'bg-golden/30'
              }`}
            />
            <div 
              data-testid="indicator-krishna"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                gameState.expecting === 'krishna' 
                  ? 'bg-blue-400 animate-pulse' 
                  : 'bg-golden/30'
              }`}
            />
          </div>
        </div>
        
        {/* Leaderboard Button */}
        <div className="mt-8 flex justify-center">
          <Leaderboard 
            currentScore={gameState.score} 
            onScoreSubmitted={() => {
              // Optional: Add any feedback when score is submitted
              console.log('Score submitted successfully!');
            }}
          />
        </div>
      </div>
    </div>
  );
}
