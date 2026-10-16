import express from 'express';
import {
  createConnectionRequest,
  getConnectionRequests,
  respondConnectionRequest,
  getActiveConnections,
  addConnectionResource
} from '../controllers/connectionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createConnectionRequestSchema,
  respondConnectionRequestSchema
} from '../validators/connectionValidators.js';

const router = express.Router();

router.use(authenticate);

router.post('/requests', validate(createConnectionRequestSchema), createConnectionRequest);
router.get('/requests', getConnectionRequests);
router.post('/requests/:id/respond', validate(respondConnectionRequestSchema), respondConnectionRequest);

router.get('/active', getActiveConnections);
router.post('/active/:id/resources', addConnectionResource);

export default router;
