import { GoogleGenAI } from '@google/genai';

let _ai = null;

/**
 * Returns the singleton GoogleGenAI client.
 * Initialized lazily so dotenv has time to load first.
 */
export function getAI() {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

export default { getAI };
