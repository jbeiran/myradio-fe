import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("Missing MONGO_URI in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= client.connect())
    : client.connect();

export async function getDb(name = process.env.DB_NAME): Promise<Db> {
  const c = await clientPromise;
  return c.db(name);
}
