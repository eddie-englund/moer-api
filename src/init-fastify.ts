import { registerRoutes } from './routes/router';
import { Either } from 'fp-ts/lib/Either';
import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Collections } from '@db';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { ZodError } from 'zod';

export const initFastify = (db: Collections): Either<Error, FastifyInstance> => {
  const app = fastify();

  app.register(helmet);

  // zod
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
  });

  // register routes
  registerRoutes(app, db);

  return pipe(
    E.tryCatch(
      () => app.listen({ port: 3000, host: '0.0.0.0' }),
      (reason) => new Error(`Failed to initalize fastify got error: ${reason}`),
    ),
    E.map(() => app),
  );
};
