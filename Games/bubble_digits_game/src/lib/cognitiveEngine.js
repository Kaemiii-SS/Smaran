import { create } from 'zustand';

export const useCognitiveStore = create((set) => ({
  level: 1,
  score: 0,
  streak: 0,
  failsInRow: 0,
  totalTimeMs: 0,
  sessionStart: null,
  
  startSession: () => set({ sessionStart: Date.now() }),
  
  incrementScore: () => set((state) => {
    const newStreak = state.streak + 1;
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
    const newLevel = (newFails >= 3 && state.level > 1) ? state.level - 1 : state.level;
    
    return {
      streak: 0,
      failsInRow: (newFails >= 3) ? 0 : newFails,
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
