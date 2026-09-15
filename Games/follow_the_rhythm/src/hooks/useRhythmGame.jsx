import { useState, useRef } from 'react';
import { useAudioEngine } from './useAudioEngine';
import { useVoiceFeedback } from './useVoiceFeedback';
import { GAME_NODES } from '@/lib/nodes';

import { useLanguage } from '@/lib/LanguageContext';

export function useRhythmGame() {
  const { initAudio, playTone, playSuccessChime, playErrorTone } = useAudioEngine();
  const { speak, replay, currentPrompt } = useVoiceFeedback();
  const { t } = useLanguage();

  const [difficulty, setDifficulty] = useState('easy');
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  
  const [activePad, setActivePad] = useState(null);
  const [errorPad, setErrorPad] = useState(null);

  const isPlayingRef = useRef(false);

  const getDifficultyConfig = () => {
    if (difficulty === 'easy') {
      const len = Math.min(level + 2, 5); // L1:3, L2:4, L3:5
      return { length: len, speed: 1000, nodeCount: 8 };
    } else if (difficulty === 'medium') {
      const len = Math.min(level + 5, 8); // L1:6, L2:7, L3:8
      return { length: len, speed: 900, nodeCount: 10 };
    } else {
      const speeds = [600, 500, 400]; // L1:600, L2:500, L3:400
      return { length: 8, speed: speeds[Math.min(level - 1, 2)], nodeCount: 8 };
    }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const playSequence = async (seq, speed) => {
    setIsPlayerTurn(false);
    speak(t.voiceListen);
    await delay(1500);
    
    for (let i = 0; i < seq.length; i++) {
      if (!isPlayingRef.current) return;
      setActivePad(seq[i].id);
      playTone(seq[i].note);
      await delay(speed * 0.6);
      setActivePad(null);
      await delay(speed * 0.4);
    }
    
    if (!isPlayingRef.current) return;
    setIsPlayerTurn(true);
    speak(t.voiceTurn);
  };

  const nextRound = async (isNewRound = true) => {
    if (!isPlayingRef.current) return;
    setPlayerIndex(0);
    const config = getDifficultyConfig();
    
    let currentSeq = sequence;
    if (isNewRound) {
      const availableNodes = GAME_NODES.slice(0, config.nodeCount);
      currentSeq = Array.from({ length: config.length }, () => availableNodes[Math.floor(Math.random() * availableNodes.length)]);
      setSequence(currentSeq);
    }
    
    await playSequence(currentSeq, config.speed);
  };

  const startGame = () => {
    initAudio();
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    if (sequence.length > 0) {
      nextRound(false); // Resume
    } else {
      setLevel(1);
      setStreak(0);
      nextRound(true);
    }
  };

  const pauseGame = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    speak(t.voiceBreak);
  };

  const handlePadClick = async (node) => {
    if (!isPlayerTurn || !isPlayingRef.current) return;
    
    playTone(node.note);
    setActivePad(node.id);
    setTimeout(() => setActivePad(null), 300);

    if (node.id === sequence[playerIndex].id) {
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);
      
      if (nextIndex === sequence.length) {
        setIsPlayerTurn(false);
        playSuccessChime();
        speak(t.voiceWonderful);
        setStreak(s => s + 1);
        await delay(2000);
        
        if (!isPlayingRef.current) return;
        
        const nextLevel = level + 1;
        if (nextLevel > 3) {
          speak(t.voiceComplete);
          setIsPlaying(false);
          isPlayingRef.current = false;
          setSequence([]);
        } else {
          setLevel(nextLevel);
          nextRound(true);
        }
      }
    } else {
      setIsPlayerTurn(false);
      setErrorPad(node.id);
      playErrorTone();
      setStreak(0);
      setTimeout(() => setErrorPad(null), 400);
      speak(t.voiceListenAgain);
      
      await delay(2000);
      if (isPlayingRef.current) {
        nextRound(false);
      }
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setSequence([]);
    setLevel(1);
    setStreak(0);
  };

  return {
    difficulty,
    setDifficulty: (d) => { setDifficulty(d); resetGame(); },
    level,
    streak,
    isPlaying,
    isPlayerTurn,
    activePad,
    errorPad,
    currentPrompt,
    sequenceLength: sequence.length,
    playerIndex,
    nodeCount: getDifficultyConfig().nodeCount,
    startGame,
    pauseGame,
    handlePadClick,
    replayVoice: replay
  };
}
