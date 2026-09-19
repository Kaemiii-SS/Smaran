import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ColorNumberMatchGame } from './components/games/ColorNumberMatchGame';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-sage-light">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
            onClick={() => setLoading(false)}
          >
            <button 
              className="absolute top-6 left-6 sm:top-10 sm:left-10 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors flex items-center justify-center text-white shadow-sm z-[60] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <video 
              src="/assets/loading-video.mp4" 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover"
              onEnded={() => setLoading(false)}
            />
            <div className="absolute bottom-10 text-white/50 text-sm font-sans tracking-widest uppercase">Tap to skip</div>
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <motion.div 
                className="paper-wave-1"
                animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="paper-wave-2"
                animate={{ y: [0, 15, 0], rotate: [1, -1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div 
                className="paper-wave-3"
                animate={{ y: [0, -10, 0], rotate: [-1, 3, -1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
            
            <div className="relative w-full h-full z-10 overflow-y-auto">
              <ColorNumberMatchGame />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
