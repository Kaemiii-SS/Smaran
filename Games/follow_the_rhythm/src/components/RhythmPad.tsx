import React from 'react';
import { motion } from 'framer-motion';

interface RhythmPadProps {
  color: string;
  shadow: string;
  isActive: boolean;
  isError: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function RhythmPad({ color, shadow, isActive, isError, onClick, disabled }: RhythmPadProps) {
  return (
    <div className="relative flex justify-center items-center">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className="w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-32 sm:h-32 rounded-full border-4 sm:border-6 border-white/50 outline-none focus:ring-4 focus:ring-white/80"
        style={{ backgroundColor: color }}
        animate={{
          scale: isActive ? 1.15 : 1,
          boxShadow: isActive 
            ? "0 0 24px " + shadow + ", inset 0 0 12px rgba(255,255,255,0.6)" 
            : "0 6px 12px rgba(0,0,0,0.1), inset 0 0 6px rgba(255,255,255,0.3)",
          x: isError ? [-6, 6, -4, 4, 0] : 0,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          x: { duration: 0.4 },
        }}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <div className="absolute inset-0 rounded-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')] pointer-events-none" />
        
        {isError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute inset-0 rounded-full bg-red-400 pointer-events-none"
          />
        )}
      </motion.button>
      
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: shadow }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
