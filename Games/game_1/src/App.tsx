import React from 'react';
import { motion } from 'framer-motion';
import { ColorNumberMatchGame } from './components/games/ColorNumberMatchGame';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Paper Cut Layered Background with Framer Motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="paper-wave-1"
          animate={{
            y: [0, -20, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="paper-wave-2"
          animate={{
            y: [0, 15, 0],
            rotate: [1, -1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="paper-wave-3"
          animate={{
            y: [0, -10, 0],
            rotate: [-1, 3, -1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      {/* Main App Container */}
      <ColorNumberMatchGame />
    </div>
  );
}

export default App;
