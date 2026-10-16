import express from 'express';
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  createSkill,
  updateSkill,
  getReports,
  resolveReport
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createSkillAdminSchema } from '../validators/skillValidators.js';

const router = express.Router();

router.use(authenticate);

// Skills management accessible to both Coordinator and Admin
router.post('/skills', requireRole('coordinator', 'admin'), validate(createSkillAdminSchema), createSkill);
router.patch('/skills/:id', requireRole('coordinator', 'admin'), updateSkill);

// User and platform moderation strictly Admin restricted
router.get('/users', requireRole('admin'), getUsers);
router.patch('/users/:id/status', requireRole('admin'), updateUserStatus);
router.patch('/users/:id/role', requireRole('admin'), updateUserRole);

// Reports moderation
router.get('/reports', requireRole('coordinator', 'admin'), getReports);
router.post('/reports/:id/resolve', requireRole('coordinator', 'admin'), resolveReport);

export default router;
