import React, { useState, useRef, useEffect } from 'react';
import { useStaggerTransition, StaggerCurtain } from '../components/StaggerWipeTransition';
import RhythmGame from '../components/RhythmGame';
import { Play } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useLanguage, TRANSLATIONS } from '../lib/LanguageContext';
import heroBg from '../utils/hero-bg.png';
import transitionVideo from '../utils/mori_clean_smoother.webm';

const TRANSITION_CONFIG = {
  columns: 10,
  coverMs: 450,
  coverStagger: 40,
  hold: 150,
  revealMs: 450,
  revealStagger: 40,
};

function LandingPage({ onPlay }) {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ container: containerRef });
  const { t, lang, setLang } = useLanguage();
  
  const bgScale = useTransform(scrollY, [0, 400], [1.15, 1.35]);
  const blurRadius = useTransform(scrollY, [0, 300], [0, 40]);
  const bgBrightness = useTransform(scrollY, [0, 300], [1, 0.5]);
  const bgFilter = useMotionTemplate`blur(${blurRadius}px) brightness(${bgBrightness})`;

  return (
    <div ref={containerRef} className="w-full h-screen overflow-y-auto overflow-x-hidden relative">
      
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <select 
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-white/80 backdrop-blur-sm text-text-dark font-bold py-2 px-4 rounded-full border-2 border-white/50 outline-none focus:ring-4 focus:ring-white/80 shadow-md cursor-pointer"
        >
          {Object.entries(TRANSLATIONS).map(([code, data]) => (
            <option key={code} value={code}>{data.name}</option>
          ))}
        </select>
      </div>

      <motion.div 
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center origin-center pointer-events-none"
        style={{ 
          backgroundImage: `url('${heroBg}')`, 
          scale: bgScale,
          filter: bgFilter
        }}
        animate={{ x: ["-3.5%", "3.5%", "-3.5%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 w-full min-h-[150vh] flex flex-col items-center pt-[25vh] pb-32 px-4">
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/60 flex flex-col items-center mb-[40vh] max-w-4xl text-center">
          <h1 
            className="text-[clamp(32px,7vw,96px)] font-extrabold text-text-dark tracking-tight mb-2 text-center leading-none" 
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.title}
          </h1>
          <p 
            className="text-[clamp(16px,2vw,22px)] text-ghibli-navy font-bold mb-10 text-center px-4" 
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay}
            className="bg-button-dark text-white px-10 py-5 rounded-full font-bold text-2xl shadow-2xl flex items-center space-x-3"
          >
            <Play fill="currentColor" className="w-8 h-8" />
            <span>{t.playNow}</span>
          </motion.button>
        </div>
        <div className="max-w-2xl bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60">
          <h2 className="text-3xl font-bold text-text-dark mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            {t.howToPlay}
          </h2>
          <p className="text-lg text-ghibli-navy mb-4 leading-relaxed font-medium">
            {t.desc1}
          </p>
          <p className="text-lg text-ghibli-navy leading-relaxed font-medium">
            {t.desc2}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FollowTheRhythmApp() {
  const [appState, setAppState] = useState('entering');
  const { phase, run } = useStaggerTransition(TRANSITION_CONFIG);
  const videoRef = useRef(null);

  useEffect(() => {
    if (appState === 'entering') {
      setTimeout(() => {
        run(() => setAppState('landing'));
      }, 300);
    }
  }, [appState, run]);

  const handleVideoError = () => {
    // Force transition to game state if video fails, bypassing the staggered wipe 
    // since the initial wipe might still be revealing, causing run() to be ignored.
    setAppState('game');
  };

  // Handle Brave/Safari strict autoplay blocks or codec errors
  useEffect(() => {
    if (appState === 'loading' && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Silently handle autoplay prevention or format errors and skip to game
          handleVideoError();
        });
      }
    }
  }, [appState]);

  const startGame = () => {
    run(() => {
      setAppState('loading');
    });
  };

  const handleLoadingEnd = () => {
    run(() => setAppState('game'));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0c]">
      <StaggerCurtain phase={phase} color="#b0ceb0" {...TRANSITION_CONFIG} />

      {appState === 'entering' && (
        <div className="w-full h-full bg-[#0a0a0c]" />
      )}

      {appState === 'landing' && (
        <LandingPage onPlay={startGame} />
      )}

      {appState === 'loading' && (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0c] fixed inset-0">
          <video 
            ref={videoRef}
            src={transitionVideo}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleLoadingEnd}
            onError={handleVideoError}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
      )}

      {appState === 'game' && (
        <div className="w-full h-full overflow-y-auto fixed inset-0 bg-background">
          <RhythmGame />
        </div>
      )}
    </div>
  );
}
