import express from 'express';
import {
  getOverview,
  getSkillDemand,
  getSessionOutcomes,
  exportAggregateReport
} from '../controllers/analyticsController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Coordinator and Admin restricted
router.use(authenticate, requireRole('coordinator', 'admin'));

router.get('/overview', getOverview);
router.get('/skill-demand', getSkillDemand);
router.get('/session-outcomes', getSessionOutcomes);
router.get('/export', exportAggregateReport);

export default router;
