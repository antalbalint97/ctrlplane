import "server-only";
import type { Collection, ObjectId } from "mongodb";
import type { Subscriber } from "./model";

type ResendConfig = { apiKey: string; segmentId: string };
type Contact = { id: string; unsubscribed: boolean };

export function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();
  return apiKey && segmentId ? { apiKey, segmentId } : null;
}

export async function syncResendContact(
  collection: Collection<Subscriber>,
  id: ObjectId,
  config = getResendConfig(),
  request: typeof fetch = fetch,
): Promise<void> {
  if (!config) return;
  try {
    const subscriber = await collection.findOne({ _id: id, status: "active" });
    if (!subscriber || subscriber.resend_sync_status === "suppressed") return;
    const signal = AbortSignal.timeout(6_000);
    const call = (path: string, method = "GET", body?: unknown) => request(`https://api.resend.com${path}`, {
      method,
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal,
      cache: "no-store",
    });
    const existing = await call(`/contacts/${encodeURIComponent(subscriber.email_normalized)}`);
    let contact: Contact;
    if (existing.ok) {
      contact = await existing.json();
      if (typeof contact.id !== "string" || typeof contact.unsubscribed !== "boolean") throw new Error("invalid_provider_response");
      if (!contact.unsubscribed) {
        const added = await call(`/contacts/${encodeURIComponent(contact.id)}/segments/${encodeURIComponent(config.segmentId)}`, "POST");
        if (!added.ok) throw new Error("provider_segment_failed");
      }
    } else if (existing.status === 404) {
      // Never explicitly set unsubscribed:false: an existing global opt-out must survive retries/races.
      const created = await call("/contacts", "POST", { email: subscriber.email_normalized, segments: [{ id: config.segmentId }] });
      if (!created.ok) throw new Error("provider_create_failed");
      const data = await created.json();
      if (typeof data.id !== "string") throw new Error("invalid_provider_response");
      contact = { id: data.id, unsubscribed: false };
    } else {
      throw new Error("provider_lookup_failed");
    }
    await collection.updateOne({ _id: id, status: "active" }, { $set: {
      resend_contact_id: contact.id,
      resend_sync_status: contact.unsubscribed ? "suppressed" : "synced",
      resend_last_sync_at: new Date(),
    } });
  } catch {
    // Fixed event codes only; Mongo/provider errors may contain credentials or addresses.
    console.warn("newsletter_resend_sync_failed");
    await collection.updateOne({ _id: id, status: "active", resend_sync_status: { $ne: "suppressed" } }, {
      $set: { resend_sync_status: "failed", resend_last_sync_at: new Date() },
    }).catch(() => { console.warn("newsletter_resend_state_write_failed"); });
  }
}
