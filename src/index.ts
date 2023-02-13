import { createLogger } from './util/create-logger';
import { initFastify } from './init-fastify';
import { initMongo } from './db/index';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { isLeft } from 'fp-ts/Either';
import { checkEnvVars } from '@util/check-env-vars';
import { isSome } from 'fp-ts/Option';

dotenv.config();

async function start() {
  const logger = createLogger();
  logger.info('Starting application...');

  const envVars = checkEnvVars();

  if (isSome(envVars)) {
    logger.error(envVars.value);
    process.exit(1);
  }

  logger.info('Env variables set as expected...');

  const db = await initMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME,
  })();

  if (isLeft(db)) {
    console.error('Failed to connect to db, exiting application...', db.left);
    process.exit(1);
  }

  logger.info(
    `MongoDB connection to db '${process.env.MONGO_DB_NAME}' was successful`,
  );

  const fastify = initFastify(db.right, logger);

  if (isLeft(fastify)) {
    logger.error('Failed to init fastify, exiting application...', fastify.left);
  }

  logger.info(
    `Fastify was successfuly initalized on port ${process.env.FASTIFY_PORT}`,
  );
}

start();
