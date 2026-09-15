import express from 'express';
import { addPatientToRoster, getCaregiverRoster, getMyCaretaker } from '../controllers/roster.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addPatientToRoster);
router.get('/', protect, getCaregiverRoster);
router.get('/my-caretaker', protect, getMyCaretaker);

export default router;
