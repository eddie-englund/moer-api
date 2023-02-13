import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';

const expectedEnvVars = [
  'MONGO_URI',
  'MONGO_DB_NAME',
  'FASTIFY_PORT',
  'FASTIFY_CORS_ORIGINS',
  'NODE_ENV',
];

export const checkEnvVars = (): O.Option<Error> => {
  const setEnvVars = pipe(
    expectedEnvVars,
    A.filter((key) => Object.keys(process.env).includes(key)),
  );

  if (setEnvVars.length === expectedEnvVars.length) return O.none;
  return O.some(Error(`Aborting startup env vars missing: ${setEnvVars}`));
};
