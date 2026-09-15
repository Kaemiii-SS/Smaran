import express from 'express';
import { saveScore, getPatientAnalytics, getProgressAnalytics } from '../controllers/gameAnalytics.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, saveScore);
router.get('/progress/:patientId', protect, getProgressAnalytics);
router.get('/:patientId', protect, getPatientAnalytics);

export default router;
