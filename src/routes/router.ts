import { Logger } from 'winston';
import { registerEmail } from './misc/register-email';
import { FastifyInstance } from 'fastify';
import { Collections } from './../db/index';

const prefix = '/api';

export const registerRoutes = (
  app: FastifyInstance,
  db: Collections,
  logger: Logger,
): void => {
  const routeContext = { app, db, logger };
  app.register(registerEmail, { ...routeContext, prefix });
};
