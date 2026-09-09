import "server-only";
import { MongoServerError, ObjectId, type Collection } from "mongodb";
import { CONSENT_VERSION, NEWSLETTER_SOURCE, type SignupInput } from "./contract";
import type { Subscriber } from "./model";

export async function persistSubscriber(collection: Collection<Subscriber>, input: SignupInput) {
  const subscriber: Subscriber = {
    _id: new ObjectId(),
    ...input,
    email_normalized: input.email,
    status: "active",
    source: NEWSLETTER_SOURCE,
    subscribed_at: new Date(),
    unsubscribed_at: null,
    consent_version: CONSENT_VERSION,
    resend_contact_id: null,
    resend_sync_status: "pending",
    resend_last_sync_at: null,
  };
  try {
    await collection.insertOne(subscriber);
    return { status: "success" as const, subscriber };
  } catch (error) {
    if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
    const existing = await collection.findOne({ email_normalized: input.email });
    if (!existing) throw new Error("newsletter_duplicate_lookup_failed");
    // Preserve timestamps, attribution, consent and suppression on repeat requests.
    if (existing.status === "unsubscribed" || existing.resend_sync_status === "suppressed") {
      return { status: "unsubscribed" as const };
    }
    if (existing.status !== "active") throw new Error("newsletter_unknown_status");
    return { status: "already_subscribed" as const };
  }
}
