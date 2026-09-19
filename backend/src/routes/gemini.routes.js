import express from 'express';
import { ask, chat, getHistory, clearHistory } from '../controllers/gemini.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require a valid JWT
router.use(protect);

// One-shot prompt — no session persistence
router.post('/ask', ask);

// Multi-turn chat — loads & saves history in DB
router.post('/chat', chat);

// Get full conversation history for the logged-in patient
router.get('/history', getHistory);

// Clear conversation history for the logged-in patient
router.delete('/history', clearHistory);

export default router;
