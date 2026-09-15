import express from 'express';
import { createAlert, getAlertsForCaregiver, markAlertRead } from '../controllers/alert.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// For MVP, anyone logged in can create an alert (maybe the patient's app triggered it)
router.post('/', protect, createAlert);
router.get('/', protect, getAlertsForCaregiver);
router.patch('/:alertId/read', protect, markAlertRead);

export default router;
