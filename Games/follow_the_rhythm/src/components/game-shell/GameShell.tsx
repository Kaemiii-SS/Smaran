import React from 'react';
import { Volume2, PauseCircle } from 'lucide-react';
import BackgroundWaves from './BackgroundWaves';

interface GameShellProps {
  title: string;
  level: number;
  streak: number;
  children: React.ReactNode;
  onExit: () => void;
  voiceText: string;
  onReplayVoice: () => void;
  progress: number; // 0 to 100
}

import { useLanguage } from '@/lib/LanguageContext';

export default function GameShell({
  title,
  level,
  streak,
  children,
  onExit,
  voiceText,
  onReplayVoice,
  progress
}: GameShellProps) {
  const { t } = useLanguage();
  return (
    <>
      <BackgroundWaves />
      <div className="flex flex-col min-h-screen h-[100dvh] max-w-4xl mx-auto relative px-4 sm:px-8 overflow-y-auto overflow-x-hidden">
        
        {/* Header */}
        <header className="flex justify-between items-center py-6 z-10">
          <button 
            onClick={onExit}
            className="flex items-center space-x-2 text-text-dark hover:opacity-70 transition-opacity"
            aria-label="Take a break"
          >
            <PauseCircle className="w-6 h-6" />
            <span className="font-bold text-lg">{t.rest}</span>
          </button>
          
          <div className="flex space-x-4 items-center">
            {streak > 2 && (
              <span className="text-ghibli-yellow font-bold text-lg animate-pulse">
                🔥 {streak}
              </span>
            )}
            <div className="bg-sage-medium text-text-dark px-4 py-1 rounded-full font-bold shadow-sm border border-sage-dark/20">
              {t.level} {level}
            </div>
          </div>
        </header>

        {/* Voice Banner */}
        <div className="z-10 mb-8">
          <button 
            onClick={onReplayVoice}
            className="w-full bg-ghibli-rose text-text-dark p-4 rounded-2xl shadow-sm border border-ghibli-rose/80 flex items-center space-x-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <div className="bg-white/50 p-2 rounded-full">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold leading-tight text-left">{voiceText}</span>
          </button>
        </div>

        {/* Game Content */}
        <main className="flex-1 flex flex-col justify-center items-center z-10">
          {children}
        </main>

        {/* Progress Bar */}
        <div className="pb-8 z-10">
          <div className="h-3 w-full bg-sage-light rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-ghibli-yellow transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </>
  );
}
