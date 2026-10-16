import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Cross-Origin Resource Sharing with cookies enabled
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost or designated origin or no origin (curl/mobile/Postman)
      if (!origin || origin.startsWith('http://localhost') || origin === env.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ensure database connection is established (especially for serverless execution)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// General Rate Limiting
app.use('/api', apiLimiter);

// Mount API v1
app.use('/api/v1', apiRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
