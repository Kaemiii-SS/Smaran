import React from 'react';
import { useCognitiveStore } from '../../lib/cognitiveEngine';
import { Volume2, Home } from 'lucide-react';
import { speak } from '../../lib/voiceEngine';

interface GameShellProps {
  title: string;
  children: React.ReactNode;
  voiceText?: string;
}

export const GameShell: React.FC<GameShellProps> = ({ title, children, voiceText }) => {
  const { level, score, streak } = useCognitiveStore();

  const handleReplay = () => {
    if (voiceText) {
      speak(voiceText);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-4 z-10">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between glass-panel rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-sage-olive text-white px-4 py-2 rounded-full font-bold shadow-md">
            Lvl {level}
          </div>
          <h1 className="text-2xl font-bold text-sage-dark hidden sm:block">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sage-dark font-bold text-lg">
            Score: {score}
          </div>
          {streak > 1 && (
            <div className="text-bubble-orange font-bold animate-pulse">
              🔥 {streak}
            </div>
          )}
        </div>
      </header>

      {/* Persistent Voice Prompt Banner */}
      {voiceText && (
        <button 
          onClick={handleReplay}
          className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-sage-medium flex items-center justify-between hover:bg-white transition-colors cursor-pointer active:scale-95 duration-200"
          aria-label="Repeat Instruction"
        >
          <p className="text-2xl font-bold text-sage-dark">{voiceText}</p>
          <Volume2 className="text-sage-dark w-10 h-10" />
        </button>
      )}

      {/* Main Game Area */}
      <main className="flex-1 w-full flex items-center justify-center p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <footer className="w-full max-w-4xl flex items-center justify-center p-4 mt-auto z-50 relative">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 glass-panel px-8 py-4 rounded-full text-sage-dark font-bold text-xl hover:bg-white/80 transition-colors"
        >
          <Home className="w-6 h-6" />
          Rest (Take a Break)
        </button>
      </footer>
    </div>
  );
};
