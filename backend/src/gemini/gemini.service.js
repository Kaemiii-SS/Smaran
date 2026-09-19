import { getAI } from '../config/gemini.js';

const MODEL = 'gemini-3.6-flash';

const SYSTEM_INSTRUCTION =
  'You are a warm, patient, and empathetic AI companion for a dementia patient. ' +
  'Always respond in short, simple sentences that are easy to understand. ' +
  'Be reassuring and never express frustration. ' +
  'If the user seems confused, gently repeat or clarify information. ' +
  'Never overwhelm the user with too many details at once.';

/** Wait for ms milliseconds */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Retry wrapper — retries on 503 UNAVAILABLE (model overloaded) with exponential backoff.
 * @param {() => Promise<any>} fn
 * @param {number} retries
 * @param {number} baseDelayMs
 */
async function withRetry(fn, retries = 3, baseDelayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is503 =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('high demand');

      if (is503 && attempt < retries) {
        const delay = baseDelayMs * attempt; // 3s, 6s, 9s
        console.warn(`[Gemini] 503 on attempt ${attempt}/${retries}, retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

/**
 * One-shot prompt — no conversation history.
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function askGemini(message) {
  const ai = getAI();

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    return response.text;
  });
}

/**
 * Multi-turn chat — accepts prior conversation history.
 * @param {string} message - Current user message
 * @param {Array<{ role: 'user'|'assistant', content: string }>} history
 * @returns {Promise<string>}
 */
export async function askGeminiWithHistory(message, history = []) {
  const ai = getAI();

  // @google/genai uses role 'model' for assistant turns
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  return withRetry(async () => {
    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  });
}
