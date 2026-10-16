import express from 'express';
import {
  generatePath,
  getLearningPaths,
  toggleMilestone,
  createExercise,
  getExerciseSolution,
  submitAssessment,
  getStudentProgress
} from '../controllers/learningController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  generateLearningPathSchema,
  generateExerciseSchema,
  submitAssessmentSchema
} from '../validators/learningValidators.js';

const router = express.Router();

router.use(authenticate);

// Learning paths
router.post('/paths/generate', aiLimiter, validate(generateLearningPathSchema), generatePath);
router.get('/paths', getLearningPaths);
router.patch('/paths/:id/milestones/:milestoneIndex/toggle', toggleMilestone);

// Practice exercises & assessments
router.post('/exercises/generate', aiLimiter, validate(generateExerciseSchema), createExercise);
router.get('/exercises/:id/solution', getExerciseSolution);
router.post('/assessments', validate(submitAssessmentSchema), submitAssessment);

// Student progress metrics
router.get('/progress', getStudentProgress);

export default router;
