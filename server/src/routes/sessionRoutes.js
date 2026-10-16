import express from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  completeSession,
  cancelSession,
  submitFeedback
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createSessionSchema,
  completeSessionSchema,
  sessionFeedbackSchema
} from '../validators/sessionValidators.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createSessionSchema), createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.post('/:id/complete', validate(completeSessionSchema), completeSession);
router.post('/:id/cancel', cancelSession);
router.post('/:id/feedback', validate(sessionFeedbackSchema), submitFeedback);

export default router;
