import express from 'express';
import cors from 'cors';
import { applicationsRouter } from './routes/applications.js';
import { profileRouter } from './routes/profile.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Essential API routes used by the frontend app
  app.use('/api/applications', applicationsRouter);
  app.use('/api/profile', profileRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

