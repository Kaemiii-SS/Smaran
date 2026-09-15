"use client";

import React from 'react';
import GameShell from '@/components/game-shell/GameShell';
import RhythmPad from '@/components/RhythmPad';
import { useRhythmGame } from '@/hooks/useRhythmGame';
import { GAME_NODES } from '@/lib/nodes';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings2 } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function RhythmGamePage() {
  const { t } = useLanguage();
  const {
    difficulty,
    setDifficulty,
    level,
    streak,
    isPlaying,
    isPlayerTurn,
    activePad,
    errorPad,
    currentPrompt,
    sequenceLength,
    playerIndex,
    nodeCount,
    startGame,
    pauseGame,
    handlePadClick,
    replayVoice
  } = useRhythmGame();

  const progress = sequenceLength > 0 ? (playerIndex / sequenceLength) * 100 : 0;
  const activeNodes = GAME_NODES.slice(0, nodeCount);

  return (
    <GameShell
      title={t.title}
      level={level}
      streak={streak}
      onExit={pauseGame}
      voiceText={currentPrompt}
      onReplayVoice={replayVoice}
      progress={progress}
    >
      
      {!isPlaying && sequenceLength === 0 && (
        <div className="flex space-x-2 mb-6 z-20">
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-full font-bold capitalize transition-colors ${difficulty === d ? 'bg-button-dark text-white' : 'bg-sage-light text-text-dark hover:bg-sage-medium'}`}
            >
              {t[d]}
            </button>
          ))}
        </div>
      )}

      <div className="relative w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center my-8">
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-sage-lightest/40 backdrop-blur-sm rounded-3xl"
            >
              <button
                onClick={startGame}
                className="bg-button-dark text-white px-8 py-4 rounded-full font-bold text-2xl shadow-xl flex items-center space-x-3 hover:scale-105 active:scale-95 transition-transform"
              >
                <Play fill="currentColor" className="w-8 h-8" />
                <span>{sequenceLength > 0 ? t.resume : t.start}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid gap-4 sm:gap-8 justify-items-center w-full ${nodeCount === 10 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {activeNodes.map((node) => (
            <RhythmPad
              key={node.id}
              color={node.color}
              shadow={node.shadow}
              isActive={activePad === node.id}
              isError={errorPad === node.id}
              onClick={() => handlePadClick(node)}
              disabled={!isPlaying || (!isPlayerTurn && activePad !== node.id)}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
}
