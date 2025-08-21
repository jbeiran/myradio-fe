import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.MONGO_URI || "";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined =
  process.env.NODE_ENV === "development"
    ? global._mongoClientPromise
    : undefined;

async function getClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment");
  }
  if (!clientPromise) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    clientPromise = client.connect();
    if (process.env.NODE_ENV === "development") {
      global._mongoClientPromise = clientPromise;
    }
  }
  return clientPromise;
}

export async function getDb(name = process.env.DB_NAME): Promise<Db> {
  const c = await getClient();
  return c.db(name);
}
