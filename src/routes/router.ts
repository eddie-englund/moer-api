import { registerEmail } from './misc/register-email';
import { FastifyInstance } from 'fastify';
import { Collections } from './../db/index';

const prefix = '/api';

export const registerRoutes = (app: FastifyInstance, db: Collections): void => {
  app.register(registerEmail, { app, db, prefix });
};
