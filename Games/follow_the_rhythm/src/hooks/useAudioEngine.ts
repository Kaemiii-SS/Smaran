import { useCallback, useRef } from 'react';

export function useAudioEngine() {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  }, []);

  const playTone = useCallback((freq: number) => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    
    // Fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05); 
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2); 
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Harmonic for a bell/electric piano timbre
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc1.start();
    osc1.stop(ctx.currentTime + 1.2);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.8);
  }, []);

  const playSuccessChime = useCallback(() => {
    if (!audioCtx.current) return;
    const freqs = [261.63, 329.63, 392.00, 523.25];
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        const ctx = audioCtx.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }, i * 150);
    });
  }, []);

  const playErrorTone = useCallback(() => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  return { initAudio, playTone, playSuccessChime, playErrorTone };
}
