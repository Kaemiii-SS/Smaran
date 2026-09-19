import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameShell } from '../ui/GameShell';
import { useCognitiveStore } from '../../lib/cognitiveEngine';
import { playCorrectChime, playIncorrectSound } from '../../lib/audioEngine';
import { speak, initVoice } from '../../lib/voiceEngine';

const COLORS = [
  { name: 'Red', hex: 'bg-bubble-red' },
  { name: 'Blue', hex: 'bg-bubble-blue' },
  { name: 'Green', hex: 'bg-bubble-green' },
  { name: 'Yellow', hex: 'bg-bubble-yellow' },
  { name: 'Purple', hex: 'bg-bubble-purple' },
  { name: 'Orange', hex: 'bg-bubble-orange' },
];

export const ColorNumberMatchGame = () => {
  const { level, incrementScore, recordFailure, startSession } = useCognitiveStore();
  const [bubbles, setBubbles] = useState([]);
  const [target, setTarget] = useState(null);
  const [incorrectId, setIncorrectId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const promptTimeout = useRef();

  const generateLevel = () => {
    let bubbleCount = 2;
    let allowedColors = COLORS.slice(0, 2);
    let maxNumber = 2;

    if (level === 2) {
      bubbleCount = 4;
      allowedColors = COLORS.slice(0, 4);
      maxNumber = 4;
    } else if (level === 3) {
      bubbleCount = 6;
      allowedColors = COLORS;
      maxNumber = 9;
    } else if (level >= 4) {
      bubbleCount = 8;
      allowedColors = COLORS;
      maxNumber = 15;
    }

    const newBubbles = [];
    const usedCombinations = new Set();

    while (newBubbles.length < bubbleCount) {
      const color = allowedColors[Math.floor(Math.random() * allowedColors.length)];
      const num = Math.floor(Math.random() * maxNumber) + 1;
      const combo = `${color.name}-${num}`;

      if (!usedCombinations.has(combo)) {
        usedCombinations.add(combo);
        newBubbles.push({
          id: combo,
          colorName: color.name,
          colorHex: color.hex,
          number: num,
        });
      }
    }

    const newTarget = newBubbles[Math.floor(Math.random() * newBubbles.length)];
    
    setBubbles(newBubbles);
    setTarget(newTarget);
    setIsCorrect(false);
    setIncorrectId(null);
    
    const promptText = `Find the ${newTarget.colorName} ${newTarget.number}`;
    speak(promptText);
    resetPromptTimer(promptText);
  };

  const resetPromptTimer = (text) => {
    if (promptTimeout.current) clearTimeout(promptTimeout.current);
    promptTimeout.current = setTimeout(() => {
      speak(`Remember, we are looking for the ${text}`);
    }, 10000);
  };

  useEffect(() => {
    initVoice();
    startSession();
    generateLevel();
    return () => {
      if (promptTimeout.current) clearTimeout(promptTimeout.current);
    };
  }, []);

  useEffect(() => {
    generateLevel();
  }, [level]);

  const handleBubbleTap = (bubble) => {
    if (isCorrect) return;

    if (bubble.id === target?.id) {
      if (promptTimeout.current) clearTimeout(promptTimeout.current);
      playCorrectChime();
      speak("Great job!");
      setIsCorrect(true);
      
      setTimeout(() => {
        incrementScore();
        generateLevel();
      }, 2000);
    } else {
      playIncorrectSound();
      setIncorrectId(bubble.id);
      recordFailure();
      const promptText = `Not quite. Let's look for the ${target?.colorName} ${target?.number}`;
      speak(promptText);
      resetPromptTimer(promptText);
      
      setTimeout(() => setIncorrectId(null), 1000);
    }
  };

  return (
    <GameShell 
      title="Color-Number Audio Match"
      voiceText={target ? `Find the ${target.colorName} ${target.number}` : undefined}
    >
      <div className="relative w-full flex-1 flex flex-wrap items-center justify-center gap-6 p-4 min-h-[300px]">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                bounce: 0.4,
                duration: level === 5 ? 4 : 0.5,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBubbleTap(bubble)}
              className={`
                bubble-base w-24 h-24 sm:w-32 sm:h-32 text-4xl sm:text-5xl
                ${bubble.colorHex}
                ${incorrectId === bubble.id ? 'opacity-30 blur-sm' : ''}
              `}
              style={{
                boxShadow: (isCorrect && target?.id === bubble.id) 
                  ? '0 0 40px 10px rgba(255, 255, 255, 0.8)' 
                  : '0 8px 16px rgba(0,0,0,0.2)'
              }}
              animate={
                incorrectId === bubble.id 
                  ? { x: [-5, 5, -5, 5, 0], scale: 1, opacity: 1 } 
                  : (isCorrect && target?.id === bubble.id)
                    ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                    : { 
                        scale: 1, 
                        opacity: 1,
                        x: level === 5 ? [0, (Math.random() * 20) - 10, 0] : 0,
                        y: level === 5 ? [0, (Math.random() * 20) - 10, 0] : 0,
                        transition: level === 5 ? {
                          x: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
                          y: { duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
                        } : undefined
                      }
              }
            >
              {bubble.number}
            </motion.button>
          ))}
        </AnimatePresence>

        {isCorrect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="w-full h-full bg-white/30 rounded-3xl backdrop-blur-sm" />
          </motion.div>
        )}
      </div>
    </GameShell>
  );
};
