import express from 'express';
import {
  getAllSkills,
  getSkillById,
  getSkillGraph,
  getMySkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createUserSkillSchema, updateUserSkillSchema } from '../validators/skillValidators.js';

const router = express.Router();

// Public / student visible
router.get('/', getAllSkills);
router.get('/graph', getSkillGraph);
router.get('/:id', (req, res, next) => {
  // Optional auth middleware for prerequisite detection
  if (req.cookies?.skillmesh_token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getSkillById);

// Protected student competency endpoints
router.get('/user/my-skills', authenticate, getMySkills);
router.post('/user/my-skills', authenticate, validate(createUserSkillSchema), addUserSkill);
router.patch('/user/my-skills/:id', authenticate, validate(updateUserSkillSchema), updateUserSkill);
router.delete('/user/my-skills/:id', authenticate, deleteUserSkill);

export default router;
