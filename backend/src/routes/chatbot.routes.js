import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatbot.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/history/:patientId', protect, getChatHistory);

export default router;
