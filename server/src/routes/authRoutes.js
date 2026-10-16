import express from 'express';
import { register, login, logout, getMe, firebaseSync } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, firebaseSyncSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/firebase-sync', authLimiter, validate(firebaseSyncSchema), firebaseSync);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;

