/**
 * test-gemini.js
 * Run from the backend folder:  node test-gemini.js
 *
 * Tests:
 *  1. askGemini        — single one-shot prompt
 *  2. askGeminiWithHistory — multi-turn conversation with history
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'src/.env') });

import { askGemini, askGeminiWithHistory } from './src/gemini/gemini.service.js';

/* ── helpers ── */
const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const CYAN   = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const BOLD   = '\x1b[1m';

function section(title) {
  console.log(`\n${BOLD}${CYAN}${'─'.repeat(55)}${RESET}`);
  console.log(`${BOLD}${CYAN}  ${title}${RESET}`);
  console.log(`${CYAN}${'─'.repeat(55)}${RESET}`);
}

function label(name, value) {
  console.log(`${YELLOW}${name}:${RESET} ${value}`);
}

function reply(text) {
  console.log(`${GREEN}Gemini:${RESET} ${text}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, retries = 3, delayMs = 4000) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err?.message ?? String(err);
      const isRetryable = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand');
      if (isRetryable && i < retries) {
        console.log(`  ${YELLOW}[retry ${i}/${retries}] Model busy, waiting ${delayMs / 1000}s...${RESET}`);
        await sleep(delayMs);
      } else {
        throw err;
      }
    }
  }
}

/* ── test 1: one-shot prompt ── */
async function testAskGemini() {
  section('TEST 1 — askGemini (one-shot)');
  const message = "What is today's date?";
  label('User', message);

  const response = await withRetry(() => askGemini(message));
  reply(response);
}

/* ── test 2: multi-turn with history ── */
async function testAskGeminiWithHistory() {
  section('TEST 2 — askGeminiWithHistory (multi-turn)');

  // Simulate a prior conversation
  const history = [
    { role: 'user',      content: 'My name is Rajan.' },
    { role: 'assistant', content: 'Hello Rajan! It is lovely to meet you. How are you feeling today?' },
    { role: 'user',      content: 'I feel a bit confused about where I am.' },
    { role: 'assistant', content: 'That is okay, Rajan. You are safe at home. Take a deep breath.' },
  ];

  const message = 'Can you remind me what my name is?';

  console.log(`${YELLOW}History (${history.length} messages):${RESET}`);
  history.forEach((m) => {
    const who = m.role === 'user' ? `${CYAN}User${RESET}` : `${GREEN}Gemini${RESET}`;
    console.log(`  ${who}: ${m.content}`);
  });

  label('\nUser (new message)', message);

  const response = await withRetry(() => askGeminiWithHistory(message, history));
  reply(response);
}

/* ── run all tests ── */
async function main() {
  console.log(`\n${BOLD}  Gemini API Test${RESET}`);
  console.log(`  Model: gemini-3.6-flash`);
  console.log(`  Key  : ${process.env.GEMINI_API_KEY ? '✓ loaded' : '✗ MISSING'}`);

  if (!process.env.GEMINI_API_KEY) {
    console.error(`\n${RED}ERROR: GEMINI_API_KEY not found. Check src/.env${RESET}`);
    process.exit(1);
  }

  try {
    await testAskGemini();
    await testAskGeminiWithHistory();
    section('ALL TESTS PASSED ✓');
  } catch (err) {
    const msg = err?.message ?? String(err);
    console.error(`\n${RED}TEST FAILED:${RESET} ${msg}`);
    process.exit(1);
  }
}

main();
