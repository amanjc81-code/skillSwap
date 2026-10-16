import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import skillRoutes from './skillRoutes.js';
import matchingRoutes from './matchingRoutes.js';
import connectionRoutes from './connectionRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import learningRoutes from './learningRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// System Health Check
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SkillMesh REST API',
    database: dbStatus,
    version: '1.0.0'
  });
});

// Database Wipe / Fresh Start Endpoint
router.post('/reset-database', async (req, res) => {
  try {
    const { clearDatabase } = await import('../../scripts/clearDatabase.js');
    await clearDatabase();
    res.status(200).json({
      status: 'success',
      message: 'All database collections have been completely cleared. Fresh start initialized!'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to clear database collections'
    });
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/matches', matchingRoutes);
router.use('/connections', connectionRoutes);
router.use('/sessions', sessionRoutes);
router.use('/learning', learningRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export default router;
