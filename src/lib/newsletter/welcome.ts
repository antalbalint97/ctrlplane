import "server-only";
import { setTimeout as delay } from "node:timers/promises";
import type { Collection, ObjectId } from "mongodb";
import { contactEmail, unsubscribeUrl } from "../../emails/CtrlPlaneEmailLayout";
import { WelcomeEmail } from "../../emails/WelcomeEmail";
import { normalizeEmail } from "./contract";
import type { Subscriber } from "./model";
import { getResendConfig, syncResendContact, type ResendConfig } from "./resend";

export function getWelcomeFromEmail(): string | null {
  return normalizeEmail(process.env.RESEND_FROM_EMAIL);
}

export async function sendWelcomeEmail(
  collection: Collection<Subscriber>,
  id: ObjectId,
  config: ResendConfig | null = getResendConfig(),
  fromEmail: string | null = getWelcomeFromEmail(),
  request: typeof fetch = fetch,
): Promise<void> {
  let claimed = false;
  try {
    const subscriber = await collection.findOne({ _id: id, welcome_email_status: "pending" });
    if (!subscriber) return; // Historical, duplicate, completed and failed records never enroll again.
    const reason = subscriber.status !== "active" || subscriber.resend_sync_status === "suppressed"
      ? "suppressed" : !config || !fromEmail ? "not_configured"
        : subscriber.resend_sync_status !== "synced" ? "contact_sync_failed" : null;
    if (reason) {
      await collection.updateOne({ _id: id, welcome_email_status: "pending" }, { $set: {
        welcome_email_status: reason === "contact_sync_failed" ? "failed" : "skipped",
        welcome_email_error_code: reason,
      } });
      console.info(`newsletter_welcome_${reason}`);
      return;
    }
    // The atomic claim is durable beyond Resend's 24-hour idempotency window.
    const current = await collection.findOneAndUpdate({
      _id: id, status: "active", resend_sync_status: "synced", welcome_email_status: "pending",
    }, { $set: { welcome_email_status: "sending", welcome_email_attempted_at: new Date() } }, { returnDocument: "after" });
    if (!current) return;
    claimed = true;
    const email = WelcomeEmail();
    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config!.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `ctrlplane-welcome/${id.toHexString()}` },
      body: JSON.stringify({ from: `CtrlPlane <${fromEmail}>`, to: [current.email_normalized], reply_to: contactEmail,
        subject: email.subject, html: email.html, text: email.text,
        headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
      }),
      signal: AbortSignal.timeout(8_000), cache: "no-store",
    });
    if (!response.ok) throw new Error("send_failed");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(result.id)) throw new Error("send_failed");
    // A DB failure after provider acceptance must remain 'sending' (unknown), not retryable.
    claimed = false;
    await collection.updateOne({ _id: id, welcome_email_status: "sending" }, { $set: {
      welcome_email_status: "sent", welcome_email_sent_at: new Date(), welcome_email_resend_id: result.id,
      welcome_email_error_code: null,
    } });
    console.info("newsletter_welcome_sent");
  } catch {
    console.warn(claimed ? "newsletter_welcome_send_failed" : "newsletter_welcome_state_write_failed");
    if (claimed) {
      await collection.updateOne({ _id: id, welcome_email_status: "sending" }, { $set: {
        welcome_email_status: "failed", welcome_email_error_code: "send_failed",
      } }).catch(() => { console.warn("newsletter_welcome_state_write_failed"); });
    }
  }
}

// Called only for the successful insert, inside Next after(). No newsletter delivery or retry loop.
export async function completeNewSignup(
  collection: Collection<Subscriber>, id: ObjectId,
  config: ResendConfig | null = getResendConfig(),
  fromEmail: string | null = getWelcomeFromEmail(),
  request: typeof fetch = fetch,
): Promise<void> {
  try {
    await syncResendContact(collection, id, config, request);
    // Separate the send from the contact lookup/mutation burst. This is not a rate-limit queue.
    if (config && fromEmail) await delay(1100);
    await sendWelcomeEmail(collection, id, config, fromEmail, request);
  } catch { console.warn("newsletter_followup_failed"); }
}
