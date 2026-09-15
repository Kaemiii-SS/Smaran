import express from 'express';
import { createRoutine, getDailyRoutines, markRoutineCompleted, updateRoutine, deleteRoutine, getUnfinishedRoutines } from '../controllers/routine.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createRoutine);
router.get('/:patientId', protect, getDailyRoutines);
router.get('/:patientId/unfinished', protect, getUnfinishedRoutines);
router.patch('/:routineId/complete', protect, markRoutineCompleted);
router.put('/:routineId', protect, updateRoutine);
router.delete('/:routineId', protect, deleteRoutine);

export default router;
