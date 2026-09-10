import type { ObjectId } from "mongodb";
import type { Attribution } from "./contract";

export type Subscriber = Attribution & {
  _id: ObjectId;
  email: string;
  email_normalized: string;
  status: "active" | "unsubscribed";
  source: "ctrlplane_web";
  subscribed_at: Date;
  unsubscribed_at: Date | null;
  consent_version: string;
  resend_contact_id: string | null;
  resend_sync_status: "pending" | "synced" | "failed" | "suppressed";
  resend_last_sync_at: Date | null;
  // Optional on historical subscribers; only new inserts enroll in welcome delivery.
  welcome_email_status?: "pending" | "sending" | "sent" | "failed" | "skipped";
  welcome_email_attempted_at?: Date | null;
  welcome_email_sent_at?: Date | null;
  welcome_email_resend_id?: string | null;
  welcome_email_error_code?: "not_configured" | "suppressed" | "contact_sync_failed" | "send_failed" | null;
};
