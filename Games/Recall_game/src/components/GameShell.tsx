import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowLeft, Music, Star, Layers, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameShellProps {
  title: string;
  subtitle?: string;
  level: number;
  streak: number;
  round: number;
  maxRounds: number;
  score: number;
  timer: number;
  children: React.ReactNode;
  onExit: () => void;
  voiceText: string;
  onPlayVoice: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  gameStarted: boolean;
  onSelectLevel: (level: number) => void;
  onStartGame: () => void;
}

export function GameShell({
  level,
  streak,
  round,
  maxRounds,
  score,
  timer,
  children,
  onExit,
  musicEnabled,
  onToggleMusic,
  isPaused,
  onTogglePause,
  onStartGame,
  gameStarted,
}: GameShellProps) {
  const [instructionsDismissed, setInstructionsDismissed] = useState(false);
  const progress = Math.min(100, Math.max(0, (round / maxRounds) * 100));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDismissInstructions = () => {
    setInstructionsDismissed(true);
    onStartGame();
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans"
      onClick={!instructionsDismissed ? handleDismissInstructions : undefined}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 blur-sm opacity-50 pointer-events-none"
        src="/live_bg_image.mp4"
      />

      {/* Instructions Overlay */}
      <AnimatePresence>
        {!instructionsDismissed && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          >
            <div className="relative bg-white/95 rounded-3xl shadow-2xl border-4 border-primary/30 p-8 max-w-sm mx-4 flex flex-col items-center gap-4">
              {/* Decorative top badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <Layers className="w-6 h-6 text-white" />
              </div>

              <h2
                className="text-3xl font-normal mt-4 flex items-center gap-2"
                style={{ fontFamily: "'Chewy', system-ui, sans-serif" }}
              >
                <span className="text-[#f8fafc]" style={{ WebkitTextStroke: "1px #166534", textShadow: "0px 2px 0px #14532d" }}>LEVEL</span>
                <span className="text-[#fbbf24]" style={{ WebkitTextStroke: "1px #9a3412", textShadow: "0px 2px 0px #7c2d12" }}>{level}</span>
              </h2>

              <p className="text-deep-forest font-bold text-center text-base">How to Play</p>

              <ul className="text-charcoal text-sm space-y-2 text-center">
                <li>🃏 &nbsp;Tap a card to flip it over</li>
                <li>🔍 &nbsp;Find its matching pair</li>
                <li>✅ &nbsp;Match all pairs to win the level</li>
                <li>⚡ &nbsp;Faster you match = more stars!</li>
              </ul>

              <div className="mt-2 px-6 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-xs text-primary font-semibold tracking-wide animate-pulse">
                  Tap anywhere to start →
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar ── */}
      <header className="relative z-10 px-4 pt-4 pb-2 w-full flex items-center justify-between">

        {/* LEFT: Back + Garden Pairs logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onExit(); }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 hover:bg-white shadow transition-all text-charcoal hover:text-deep-forest shrink-0"
            aria-label="Back to levels"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col justify-center">
            <h1
              className="text-xl md:text-2xl font-normal leading-none tracking-wider flex items-center gap-1.5 mb-0.5"
              style={{ fontFamily: "'Chewy', system-ui, sans-serif" }}
            >
              <span className="text-[#f8fafc]" style={{
                WebkitTextStroke: "1px #166534",
                textShadow: "0px 2px 0px #14532d, 0px 3px 2px rgba(0,0,0,0.3)"
              }}>
                GARDEN
              </span>
              <span className="text-[#fbbf24]" style={{
                WebkitTextStroke: "1px #9a3412",
                textShadow: "0px 2px 0px #7c2d12, 0px 3px 2px rgba(0,0,0,0.3)"
              }}>
                PAIRS
              </span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-charcoal/70 font-bold uppercase tracking-widest">Memory Card Game</p>
          </div>
        </div>

        {/* CENTER: Level number */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
          <span
            className="text-3xl md:text-4xl font-normal leading-none tracking-wide text-white drop-shadow-md"
            style={{
              fontFamily: "'Chewy', system-ui, sans-serif",
              WebkitTextStroke: "1px #9a3412",
              textShadow: "0px 3px 0px #7c2d12, 0px 4px 4px rgba(0,0,0,0.3)"
            }}
          >
            Level {level}
          </span>
        </div>

        {/* RIGHT: Pause & Music toggle */}
        <div className="flex items-center gap-2">
          {gameStarted && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePause(); }}
              title={isPaused ? "Resume game" : "Pause game"}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
                isPaused
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white/50 text-charcoal hover:bg-white"
              )}
            >
              {isPaused ? <Play className="w-5 h-5 ml-1" /> : <Pause className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onToggleMusic(); }}
            title={musicEnabled ? "Turn music off" : "Turn music on"}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
              musicEnabled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/50 text-charcoal hover:bg-white"
            )}
          >
            <Music className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Main layout: Centered Game Board ── */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 flex items-center justify-center">
        {/* Center: Game Board perfectly centralized */}
        <div className="flex flex-col items-center justify-center h-full w-full">
          {children}
        </div>
      </main>

      {/* ── Absolute Floating Score Card (Right) ── */}
      <div className="absolute right-6 top-24 z-20 w-48 hidden md:block">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border-4 border-white/60 p-5 font-bold text-charcoal">
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">⭐</span>
            <span className="text-3xl text-primary font-black tracking-tight" style={{ fontFamily: "'Fredoka', 'Chewy', sans-serif" }}>
              {score}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🎯</span>
              <span>{round}/{maxRounds}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">⏱</span>
              <span className="font-mono font-bold tracking-tighter">{formatTime(timer)}</span>
            </div>
          </div>

          {streak > 1 && (
            <div className="mt-3 text-center border-t border-black/5 pt-2">
              <span className="text-xs text-amber-600 animate-pulse">🔥 {streak}× streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Bar: Progress ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-6 mt-auto">
        <div className="bg-white/85 backdrop-blur rounded-2xl shadow-lg border border-white/60 p-3 flex flex-col items-center w-full">
          <div className="w-full flex justify-between text-[11px] font-bold text-charcoal mb-2 uppercase tracking-widest px-1">
            <span>Progress</span>
            <span>{round} / {maxRounds} Pairs</span>
          </div>
          <div className="w-full h-4 bg-white/50 rounded-full overflow-hidden border border-white/80 shadow-inner">
            <motion.div
              className="h-full bg-primary rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
