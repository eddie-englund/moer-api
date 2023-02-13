declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      MONGO_URI: string;
      MONGO_DB_NAME: string;
      FASTIFY_CORS_ORIGINS: string | undefined;
      FASTIFY_PORT: string;
    }
  }
}

export {};
