import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import screenRoutes from './routes/screen.routes';
import commentRoutes from './routes/comment.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', screenRoutes);
  app.use('/api', commentRoutes);

  app.use(errorHandler);

  return app;
}
