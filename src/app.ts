import express, { Express } from 'express';
import { extractUser } from './middlewares/extract-user.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import routes from './routes';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(extractUser);
  app.use(routes);
  app.use(errorHandler);

  return app;
}
