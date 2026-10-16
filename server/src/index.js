import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { User } from './models/User.js';
import { runSeed } from '../scripts/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed initial demo dataset if database has 0 users
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        logger.info('Database is unpopulated. Automatically executing initial seed with demo dataset...');
        await runSeed();
        logger.info('Auto-seed completed successfully. Demo accounts ready for evaluation.');
      }
    } catch (seedErr) {
      logger.warn(`Auto-seed check encountered an issue: ${seedErr.message}`);
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`SkillMesh API server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      logger.info(`Health check available at http://localhost:${env.PORT}/api/v1/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.PORT} is already in use. Please terminate the process holding port ${env.PORT} or check running background servers.`);
      } else {
        logger.error('Server listener error:', err);
      }
      process.exit(1);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Gracefully terminating SkillMesh server...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
