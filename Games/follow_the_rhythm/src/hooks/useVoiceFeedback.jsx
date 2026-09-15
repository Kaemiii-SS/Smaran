import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export function useVoiceFeedback() {
  const { t, lang } = useLanguage();
  const [lastText, setLastText] = useState(t.voiceWelcome);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = useCallback((text) => {
    setLastText(text);
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; 
    const voices = synthRef.current.getVoices();
    
    // Use broad matching for the language code (e.g., 'hi' for 'hi-IN')
    const baseLang = lang.split('-')[0];
    const matchingLangVoices = voices.filter(v => v.lang.toLowerCase().startsWith(baseLang.toLowerCase()));
    
    const preferredVoice = 
      matchingLangVoices.find(v => v.name.toLowerCase().includes('female')) || 
      matchingLangVoices[0] || 
      voices.find(v => v.name.includes('Veena') || v.name.includes('Heera') || v.name.includes('Neerja')) || 
      voices.find(v => v.lang.includes('IN')) || 
      voices.find(v => v.name.toLowerCase().includes('female')) ||
      voices[0]; // Absolute fallback so it always speaks
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang; // CRITICAL: match utterance lang to voice lang, otherwise browser silences it
    } else {
      utterance.lang = lang;
    }
    
    synthRef.current.speak(utterance);
  }, [lang]);

  const replay = useCallback(() => {
    speak(lastText);
  }, [lastText, speak]);

  return { speak, replay, currentPrompt: lastText };
}
