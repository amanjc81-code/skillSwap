import express from 'express';
import { getMatches, getExchangeCycles, refreshMatches } from '../controllers/matchingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMatches);
router.post('/refresh', refreshMatches);
router.get('/cycles', getExchangeCycles);

export default router;
