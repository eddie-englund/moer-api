import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/function';
import { Collection, Db, MongoClient } from 'mongodb';
import { User } from './models/user';
type ConnectionDetails = {
  uri: string;
  dbName: string;
};

export interface Collections {
  users: Collection<User>;
}

export const initMongo = ({
  uri,
  dbName,
}: ConnectionDetails): TE.TaskEither<Error, Collections> => {
  const client = new MongoClient(uri);

  return pipe(
    TE.tryCatch(
      async () => await client.connect(),
      (reason) => new Error(`Failed to connect, got error: ${reason}`),
    ),
    TE.map((ctx) => {
      const db: Db = ctx.db(dbName);

      return {
        users: db.collection<User>('users'),
      };
    }),
  );
};
