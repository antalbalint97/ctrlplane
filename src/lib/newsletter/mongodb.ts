import "server-only";
import { MongoClient, type Collection } from "mongodb";
import type { Subscriber } from "./model";

// One pool per warm process, including across development hot reloads.
const cache = globalThis as typeof globalThis & {
  ctrlplaneMongo?: Promise<MongoClient>;
  ctrlplaneSubscribers?: Promise<Collection<Subscriber>>;
};

export function getMongoClient(): Promise<MongoClient> {
  if (!cache.ctrlplaneMongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("newsletter_database_not_configured");
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
      waitQueueTimeoutMS: 5_000,
      timeoutMS: 8_000,
      writeConcern: { w: "majority" },
    });
    cache.ctrlplaneMongo = client.connect().catch(async () => {
      cache.ctrlplaneMongo = undefined;
      await client.close().catch(() => {});
      throw new Error("newsletter_database_unavailable");
    });
  }
  return cache.ctrlplaneMongo;
}

export async function ensureSubscriberIndex(collection: Collection<Subscriber>) {
  await collection.createIndex({ email_normalized: 1 }, { unique: true, name: "newsletter_email_unique" });
}

export function getSubscribers(): Promise<Collection<Subscriber>> {
  if (!cache.ctrlplaneSubscribers) {
    cache.ctrlplaneSubscribers = (async () => {
      const client = await getMongoClient();
      const collection = client.db(process.env.MONGODB_DB_NAME || "ctrlplane").collection<Subscriber>("newsletter_subscribers");
      // No writes until the database constraint is confirmed. Fail closed if it cannot be created.
      await ensureSubscriberIndex(collection);
      return collection;
    })().catch(() => {
      cache.ctrlplaneSubscribers = undefined;
      throw new Error("newsletter_storage_unavailable");
    });
  }
  return cache.ctrlplaneSubscribers;
}
