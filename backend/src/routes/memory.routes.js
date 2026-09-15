import express from 'express';
import { uploadMemory, getLatestMemory } from '../controllers/memory.controller.js';
import protect from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadMemory);
router.get('/:patientId/latest', protect, getLatestMemory);

export default router;
