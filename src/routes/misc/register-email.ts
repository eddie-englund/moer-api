import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/lib/TaskEither';
// import { Collections } from '@db';
import { UserSchema } from '@db/models/user';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const registerEmail = (app: FastifyInstance, options: FastifyPluginOptions) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/subscribe',
    schema: {
      body: UserSchema,
    },
    handler: async (req, res) => {
      await pipe(
        TE.tryCatch(
          async () =>
            options.db.users.updateOne(
              { email: req.body.email },
              { $setOnInsert: { email: req.body.email } },
              { upsert: true },
            ),
          (reason) => ['Something went wrong inserting to db', reason],
        ),
        TE.map(() => res.status(200).send({ success: true })),
        TE.mapLeft((err) => {
          console.error(
            `Something went wrong inserting email into subscriptions got error: ${err}`,
          );
          return res
            .status(500)
            .send({ success: false, msg: 'internal server error' });
        }),
      )();
    },
  });
