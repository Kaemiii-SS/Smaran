import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | 'complete' | 'levelUp';
  message: string;
  subMessage?: string;
  onDismiss?: () => void;
  isOpen: boolean;
}

export function FeedbackOverlay({
  type,
  message,
  subMessage,
  onDismiss,
  isOpen
}: FeedbackOverlayProps) {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Subtle backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/20 backdrop-blur-[2px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "relative z-10 pointer-events-auto",
              "flex flex-col items-center p-8 rounded-3xl max-w-sm w-full mx-4 text-center shadow-2xl border-4",
              type === 'correct' ? "bg-warm-cream border-primary/20" : 
              type === 'wrong' ? "bg-gentle-rose/90 border-rose-200" : 
              "bg-warm-cream border-warm-amber/30"
            )}
          >
            {/* Ghibli-inspired decorative elements */}
            <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center text-5xl bg-white shadow-soft">
              {type === 'correct' && "✨"}
              {type === 'wrong' && "🌱"}
              {type === 'complete' && "🎉"}
              {type === 'levelUp' && "🌟"}
            </div>
            
            <h2 className="text-3xl font-bold text-deep-forest mb-2">
              {message}
            </h2>
            
            {subMessage && (
              <p className="text-lg text-charcoal mb-6">
                {subMessage}
              </p>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={cn(
                  "px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md active:scale-95",
                  type === 'correct' ? "bg-primary text-white hover:bg-primary/90" : 
                  type === 'wrong' ? "bg-white text-charcoal hover:bg-white/90" : 
                  "bg-warm-amber text-amber-900 hover:bg-warm-amber/90"
                )}
              >
                {type === 'wrong' ? "Try Again" : "Continue"}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
