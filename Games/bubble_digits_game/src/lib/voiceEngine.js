let synth = null;
let voice = null;

export const initVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = synth?.getVoices() || [];
      voice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')) || voices[0] || null;
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }
};

export const speak = (text, rate = 0.9) => {
  if (!synth) initVoice();
  if (!synth) return;

  synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = rate; 
  utterance.pitch = 1.0;
  
  synth.speak(utterance);
};
