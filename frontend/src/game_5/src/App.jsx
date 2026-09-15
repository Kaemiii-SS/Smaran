import { useState, useEffect, useRef, useCallback } from "react";
import { Toaster } from "./components/ui/sonner";
import { GameBoard } from "./components/GameBoard";
import { GameModal } from "./components/GameModal";
import { ConfettiCanvas } from "./components/ConfettiCanvas";
import { LEVELS } from "./config/levels";
import { usePairsEngine } from "./hooks/usePairsEngine";
import { useTracker } from "./hooks/useTracker";
import { GameShell } from "./components/GameShell";
import { LandingPage } from "./components/LandingPage";
import { LevelsPage } from "./components/LevelsPage";
import { FeedbackOverlay } from "./components/FeedbackOverlay";
import { useVoiceFeedback } from "./hooks/useVoiceFeedback";
import bgmFile from "./assets/sound.mp3";
function App() {
  const [level, setLevel] = useState(1);
  const currentLevelIndex = level - 1;
  const levelConfig = LEVELS[currentLevelIndex];
  const deck = usePairsEngine(levelConfig);
  const { trackClick, trackAttempt, completeLevel } = useTracker(levelConfig);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentView, setCurrentView] = useState("landing");
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "correct",
    msg: ""
  });
  const timerRef = useRef(null);
  const confettiRef = useRef(null);
  const { speak } = useVoiceFeedback();
  const [musicEnabled, setMusicEnabled] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    const tryPlay = () => {
      if (musicEnabled) {
        audio.play().catch(() => {
        });
      }
    };
    tryPlay();
    const onFirstInteraction = () => {
      tryPlay();
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("keydown", onFirstInteraction);
      document.removeEventListener("touchstart", onFirstInteraction);
    };
    document.addEventListener("click", onFirstInteraction);
    document.addEventListener("keydown", onFirstInteraction);
    document.addEventListener("touchstart", onFirstInteraction);
    return () => {
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("keydown", onFirstInteraction);
      document.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicEnabled) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {
      });
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);
  useEffect(() => {
    const savedHighScore = localStorage.getItem("memory-highscore");
    if (savedHighScore) setHighScore(Number(savedHighScore));
    const savedHistory = localStorage.getItem("memory-game-scores");
    if (savedHistory) setGameHistory(JSON.parse(savedHistory));
    const savedUnlocked = localStorage.getItem("memory-unlocked-level");
    if (savedUnlocked) setUnlockedLevel(Number(savedUnlocked));
    const savedStars = localStorage.getItem("memory-level-stars");
    if (savedStars) setLevelStars(JSON.parse(savedStars));
  }, []);
  useEffect(() => {
    if (highScore !== null) {
      localStorage.setItem("memory-highscore", highScore.toString());
    }
  }, [highScore]);
  useEffect(() => {
    localStorage.setItem("memory-game-scores", JSON.stringify(gameHistory));
  }, [gameHistory]);
  useEffect(() => {
    localStorage.setItem("memory-unlocked-level", unlockedLevel.toString());
  }, [unlockedLevel]);
  useEffect(() => {
    localStorage.setItem("memory-level-stars", JSON.stringify(levelStars));
  }, [levelStars]);
  useEffect(() => {
    if (isRunning && !gameWon) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1e3);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, gameWon]);
  const saveScore = useCallback((time, lvl) => {
    const newScore = {
      id: crypto.randomUUID(),
      time,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      level: lvl,
      isHighScore: false
    };
    setGameHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newScore];
      const fastestTime = Math.min(...updatedHistory.map((s) => s.time));
      return updatedHistory.map((score2) => ({
        ...score2,
        isHighScore: score2.time === fastestTime
      }));
    });
    const pairs = LEVELS[lvl - 1].pairs;
    let earnedStars = 1;
    if (time <= pairs * 3.5) earnedStars = 3;
    else if (time <= pairs * 6) earnedStars = 2;
    setLevelStars((prev) => {
      const current = prev[lvl] || 0;
      if (earnedStars > current) {
        return { ...prev, [lvl]: earnedStars };
      }
      return prev;
    });
    setUnlockedLevel((prev) => Math.min(20, Math.max(prev, lvl + 1)));
  }, []);
  const nonEmptyCards = deck.filter((c) => !c.isEmpty).length;
  const isRoundComplete = matchedIndices.length === nonEmptyCards && nonEmptyCards > 0;
  useEffect(() => {
    if (isRoundComplete && gameStarted && !gameWon) {
      setGameWon(true);
      setIsRunning(false);
      saveScore(timer, level);
      completeLevel();
      if (timer > 0 && (highScore === null || timer < highScore)) {
        setHighScore(timer);
      }
      confettiRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, { particleCount: 150 });
      speak(`Wonderful! You've completed level ${level}.`);
    }
  }, [isRoundComplete, gameStarted, gameWon, timer, highScore, saveScore, level, completeLevel, speak]);
  const handleCardClick = useCallback((idx) => {
    if (!gameStarted || isChecking || deck[idx].isEmpty) return;
    if (flippedIndices.includes(idx) || matchedIndices.includes(idx)) return;
    trackClick();
    let currentFlipped = [...flippedIndices];
    if (currentFlipped.length === 2) currentFlipped = [];
    const newFlipped = [...currentFlipped, idx];
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const isMatch = deck[firstIdx].value === deck[secondIdx].value;
      trackAttempt(isMatch, deck[firstIdx].value, deck[secondIdx].value);
      if (isMatch) {
        setStreak((s) => s + 1);
        setScore((s) => s + 100 + streak * 10);
        speak("Yes, that's a match!");
        setIsChecking(true);
        setTimeout(() => {
          setMatchedIndices((prev) => [...prev, firstIdx, secondIdx]);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 600);
      } else {
        setStreak(0);
        speak("Not quite. Let's try again.", 0.85);
        setIsChecking(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, levelConfig.delay !== null ? levelConfig.delay : 2000);
      }
    } else {
      speak("Good. Now find the matching one.", 0.9);
    }
  }, [gameStarted, isChecking, deck, flippedIndices, matchedIndices, trackClick, trackAttempt, levelConfig.delay, speak]);
  const startGame = useCallback(() => {
    setFlippedIndices([]);
    setMatchedIndices([]);
    setTimer(0);
    setGameWon(false);
    setGameStarted(true);
    setIsRunning(true);
    speak("Let's play Memory Cards. Tap a card to flip it over.");
  }, [speak]);
  const resetGame = useCallback(() => {
    setFlippedIndices([]);
    setMatchedIndices([]);
    setTimer(0);
    setGameWon(false);
    setGameStarted(false);
    setIsRunning(false);
    setStreak(0);
    setScore(0);
  }, []);
  const voiceText = gameStarted ? flippedIndices.length === 1 ? "Find the matching card..." : "Tap a card to start matching" : "Click Start Game to begin!";
  if (currentView === "landing") {
    return <>
        <LandingPage
      onPlayNow={() => setCurrentView("levels")}
      musicEnabled={musicEnabled}
      onToggleMusic={() => setMusicEnabled(!musicEnabled)}
    />
        <audio ref={audioRef} src={bgmFile} loop />
      </>;
  }
  if (currentView === "levels") {
    return <>
        <LevelsPage
      levels={LEVELS.map((l) => l.level)}
      unlockedLevel={unlockedLevel}
      levelStars={levelStars}
      onSelectLevel={(lvl) => {
        resetGame();
        setLevel(lvl);
        setCurrentView("game");
      }}
      onBack={() => setCurrentView("landing")}
      musicEnabled={musicEnabled}
      onToggleMusic={() => setMusicEnabled(!musicEnabled)}
    />
        <audio ref={audioRef} src={bgmFile} loop />
      </>;
  }
  return <GameShell
    title="Garden Pairs"
    level={level}
    streak={streak}
    score={score}
    timer={timer}
    round={matchedIndices.length / 2}
    maxRounds={levelConfig.pairs}
    gameStarted={gameStarted}
    isPaused={!isRunning}
    onTogglePause={() => setIsRunning(!isRunning)}
    onSelectLevel={(lvl) => {
      setLevel(lvl);
      resetGame();
    }}
    onExit={() => {
      resetGame();
      setCurrentView("levels");
      speak("Taking a rest. Good idea.");
    }}
    voiceText={voiceText}
    onPlayVoice={() => speak(voiceText)}
    musicEnabled={musicEnabled}
    onToggleMusic={() => setMusicEnabled(!musicEnabled)}
    onStartGame={startGame}
  >
      <div className="w-full flex flex-col items-center">
        <GameBoard
    deck={deck}
    flippedIndices={flippedIndices}
    matchedIndices={matchedIndices}
    mismatchIndices={isChecking && flippedIndices.length === 2 && deck[flippedIndices[0]].value !== deck[flippedIndices[1]].value ? flippedIndices : []}
    gameStarted={gameStarted}
    isPaused={!isRunning}
    onCardClick={handleCardClick}
    levelConfig={levelConfig}
  />
      </div>

      <FeedbackOverlay
    isOpen={feedback.isOpen}
    type={feedback.type}
    message={feedback.msg}
    subMessage={feedback.sub}
    onDismiss={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
  />

      <GameModal
    open={gameWon}
    timer={timer}
    highScore={highScore}
    onNextLevel={() => {
      if (level < 20) {
        setLevel((l) => l + 1);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setTimer(0);
        setGameWon(false);
        setGameStarted(true);
        setIsRunning(true);
        setStreak(0);
        setScore(0);
      } else {
        setCurrentView("levels");
      }
    }}
    onClose={resetGame}
  />

      <ConfettiCanvas ref={confettiRef} />

      <Toaster position="top-center" />
      <audio ref={audioRef} src={bgmFile} loop />
    </GameShell>;
}
export {
  App as default
};
