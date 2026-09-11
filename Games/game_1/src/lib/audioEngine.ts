// A simple Web Audio API synthesizer for felt piano tones and chimes

let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playTone = (frequency: number, type: OscillatorType = 'sine', duration: number = 0.5) => {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  // Soft attack and decay for a pleasant chime/felt tone
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playCorrectChime = () => {
  initAudio();
  // Play a pleasant ascending major third interval
  playTone(523.25, 'sine', 0.6); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.8), 150); // E5
};

export const playIncorrectSound = () => {
  initAudio();
  // Play a soft, non-punishing low tone
  playTone(261.63, 'triangle', 0.4); // C4
};
