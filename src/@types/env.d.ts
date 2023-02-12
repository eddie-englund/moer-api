declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_CORS_ORIGINS: string | undefined;
      MONGO_URI: string;
      MONGO_DB_NAME: string;
      FASTIFY_PORT: string;
    }
  }
}

export {};
