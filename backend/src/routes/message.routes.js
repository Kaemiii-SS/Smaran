import express from 'express';
import { getConversationHistory } from '../controllers/message.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All message routes require authentication

router.get('/history/:otherUserId', getConversationHistory);

export default router;
