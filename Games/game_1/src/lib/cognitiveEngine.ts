import { create } from 'zustand';

interface CognitiveState {
  level: number;
  score: number;
  streak: number;
  failsInRow: number;
  totalTimeMs: number;
  sessionStart: number | null;
  incrementScore: () => void;
  recordFailure: () => void;
  startSession: () => void;
  reset: () => void;
}

export const useCognitiveStore = create<CognitiveState>((set) => ({
  level: 1,
  score: 0,
  streak: 0,
  failsInRow: 0,
  totalTimeMs: 0,
  sessionStart: null,
  
  startSession: () => set({ sessionStart: Date.now() }),
  
  incrementScore: () => set((state) => {
    const newStreak = state.streak + 1;
    // Step up level mid-session if 5 successes in a row (Max level 5)
    const newLevel = (newStreak % 5 === 0 && state.level < 5) ? state.level + 1 : state.level;
    
    return {
      score: state.score + 10,
      streak: newStreak,
      failsInRow: 0,
      level: newLevel,
    };
  }),
  
  recordFailure: () => set((state) => {
    const newFails = state.failsInRow + 1;
    // Step down level mid-session if 3 fails in a row (Min level 1)
    const newLevel = (newFails >= 3 && state.level > 1) ? state.level - 1 : state.level;
    
    return {
      streak: 0,
      failsInRow: (newFails >= 3) ? 0 : newFails, // reset failure counter if we leveled down
      level: newLevel,
    };
  }),
  
  reset: () => set({
    level: 1,
    score: 0,
    streak: 0,
    failsInRow: 0,
    sessionStart: null,
  }),
}));
