// Web Speech API wrapper for warm, natural spoken instructions

let synth: SpeechSynthesis | null = null;
let voice: SpeechSynthesisVoice | null = null;

export const initVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = synth?.getVoices() || [];
      // Prefer a warm female voice or any English voice
      voice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')) || voices[0] || null;
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }
};

export const speak = (text: string, rate: number = 0.9) => {
  if (!synth) initVoice();
  if (!synth) return; // Fallback if still not available

  synth.cancel(); // Stop any ongoing speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) {
    utterance.voice = voice;
  }
  
  // Set to a slightly slower, warmer pace
  utterance.rate = rate; 
  utterance.pitch = 1.0;
  
  synth.speak(utterance);
};
