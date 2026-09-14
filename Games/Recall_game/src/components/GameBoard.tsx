import { Card } from "./Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface GameBoardProps {
  deck: any[];
  flippedIndices: number[];
  matchedIndices: number[];
  mismatchIndices: number[];
  gameStarted: boolean;
  isPaused: boolean;
  onCardClick: (idx: number) => void;
  levelConfig: any;
}

export function GameBoard({ 
  deck, 
  flippedIndices, 
  matchedIndices, 
  mismatchIndices, 
  gameStarted, 
  isPaused,
  onCardClick, 
  levelConfig 
}: GameBoardProps) {
  
  const cols = levelConfig?.grid[0] || 4;
  const rows = levelConfig?.grid[1] || Math.ceil(deck.length / cols);

  // Calculate offsets for scattered layout only once per deck
  const offsets = useMemo(() => {
    if (levelConfig?.layout !== 'scattered') return null;
    return deck.map(() => ({
      x: (Math.random() - 0.5) * 16, // -8px to 8px
      y: (Math.random() - 0.5) * 16,
      r: (Math.random() - 0.5) * 8   // -4deg to 4deg
    }));
  }, [deck, levelConfig?.layout]);

  return (
    <main className="relative flex items-center justify-center m-auto rounded-md w-full py-4 h-full">
      {/* Game board with cards */}
      <div 
        className={cn(
          "grid gap-3 sm:gap-4 relative mx-auto h-auto transition-opacity duration-300",
          (!gameStarted || isPaused) && "opacity-30 pointer-events-none" // Dim the board when not started or paused
        )}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: '100%',
          // Scale cards to be as big as possible without overflowing ~60% of viewport height
          maxWidth: `min(100%, calc(60vh * ${cols / rows}))` 
        }}
      >
        {deck.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={mismatchIndices.includes(idx) ? "animate-shake" : ""}
          >
            <Card
              flipped={flippedIndices.includes(idx)}
              matched={matchedIndices.includes(idx)}
              mismatched={mismatchIndices.includes(idx)}
              value={card.value}
              isEmpty={card.isEmpty}
              offset={offsets ? offsets[idx] : null}
              onClick={() => gameStarted && !isPaused && onCardClick(idx)}
              disabled={!gameStarted || isPaused || flippedIndices.includes(idx) || matchedIndices.includes(idx)}
            />
          </motion.div>
        ))}
      </div>

      {/* Overlay when game is paused */}
      {isPaused && gameStarted && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-auto text-center w-full h-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-amber-500/50"
          >
            <h3 className="text-4xl md:text-5xl font-black tracking-widest text-amber-500 mb-2" style={{ fontFamily: "'Fredoka', 'Chewy', sans-serif" }}>
              PAUSED
            </h3>
            <p className="text-lg text-charcoal font-medium">
              Click the Play button top-right to resume
            </p>
          </motion.div>
        </div>
      )}

    </main>
  );
}