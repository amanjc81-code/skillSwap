import express from 'express';
import {
  getProfile,
  updateProfile,
  updateAvailability,
  blockUser,
  deleteAccount
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { updateProfileSchema, updateAvailabilitySchema } from '../validators/authValidators.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', getProfile);
router.patch('/me', validate(updateProfileSchema), updateProfile);
router.delete('/me', deleteAccount);
router.put('/me/availability', validate(updateAvailabilitySchema), updateAvailability);
router.post('/block/:targetUserId', blockUser);

export default router;
