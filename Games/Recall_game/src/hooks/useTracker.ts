import { useRef, useEffect } from 'react';

export function useTracker(levelConfig) {
  const sessionData = useRef(null);

  // Initialize tracker for a new level
  useEffect(() => {
    if (!levelConfig) return;
    sessionData.current = {
      level: levelConfig.level,
      gridSize: levelConfig.grid.join('x'),
      totalPairs: levelConfig.pairs,
      startTime: Date.now(),
      endTime: null,
      attempts: 0,
      confusedPairs: {},
      currentStreak: 0,
      longestStreak: 0,
      rapidClicks: 0,
      lastClickTime: null
    };
  }, [levelConfig]);

  const trackClick = () => {
    if (!sessionData.current) return;
    const now = Date.now();
    if (sessionData.current.lastClickTime && (now - sessionData.current.lastClickTime) < 300) {
      sessionData.current.rapidClicks += 1;
    }
    sessionData.current.lastClickTime = now;
  };

  const trackAttempt = (isMatch, val1, val2) => {
    if (!sessionData.current) return;
    sessionData.current.attempts += 1;
    
    if (isMatch) {
      sessionData.current.currentStreak += 1;
      if (sessionData.current.currentStreak > sessionData.current.longestStreak) {
        sessionData.current.longestStreak = sessionData.current.currentStreak;
      }
    } else {
      sessionData.current.currentStreak = 0;
      // Record confusion
      const pairKey = [val1, val2].sort().join(' vs ');
      sessionData.current.confusedPairs[pairKey] = (sessionData.current.confusedPairs[pairKey] || 0) + 1;
    }
  };

  const completeLevel = () => {
    if (!sessionData.current) return null;
    sessionData.current.endTime = Date.now();
    
    const timeElapsedSec = (sessionData.current.endTime - sessionData.current.startTime) / 1000;
    const accuracy = sessionData.current.attempts === 0 ? 0 : (sessionData.current.totalPairs / sessionData.current.attempts);

    const finalReport = {
      ...sessionData.current,
      timeElapsedSec,
      accuracy: (accuracy * 100).toFixed(1) + '%'
    };

    console.log("Session Data Tracked:", finalReport);
    // Here we would typically send finalReport to a backend
    return finalReport;
  };

  return { trackClick, trackAttempt, completeLevel };
}
