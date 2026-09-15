import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePic'), updateProfile);

export default router;
