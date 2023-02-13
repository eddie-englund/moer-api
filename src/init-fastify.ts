import { Logger } from 'winston';
import { registerRoutes } from './routes/router';
import { Either } from 'fp-ts/lib/Either';
import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Collections } from '@db';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { ZodError } from 'zod';
import cors from '@fastify/cors';

export const initFastify = (db: Collections, logger: Logger): Either<Error, FastifyInstance> => {
  const app = fastify();

  app.register(helmet);
  app.register(cors, { origin: process.env.FASTIFY_CORS_ORIGINS })

  // zod type provider
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        error: 'validation',
        details: JSON.parse(err.message),
        validation: err.validation,
        code: err.code,
        msg: 'Input failed validation, please check parameters',
        status: 400,
        success: false,
      });
    }

    logger.error('Unhandeled error', err);
    return reply.status(500).send({ msg: 'internal server error', success: false });
  });

  // register routes
  registerRoutes(app, db, logger);

  return pipe(
    E.tryCatch(
      () => app.listen({ port: 3000, host: '0.0.0.0' }),
      (reason) => new Error(`Failed to initalize fastify got error: ${reason}`),
    ),
    E.map(() => app),
  );
};
