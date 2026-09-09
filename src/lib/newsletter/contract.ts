export const NEWSLETTER_SOURCE = "ctrlplane_web";
export const CONSENT_VERSION = "newsletter-2026-09-09";

export const signupMessages = {
  success: "Köszönjük, feliratkoztál. A következő CtrlPlane összefoglalót e-mailben küldjük.",
  already_subscribed: "Ezzel az e-mail-címmel már feliratkoztál.",
  unsubscribed: "Ezzel az e-mail-címmel korábban leiratkoztál. Az újbóli feliratkozás ezen az űrlapon még nem érhető el.",
  invalid_email: "Adj meg egy érvényes e-mail-címet.",
  invalid_request: "A feliratkozási kérés nem érvényes. Frissítsd az oldalt, majd próbáld újra.",
  consent_required: "A feliratkozáshoz a hírlevél célú adatkezeléshez való hozzájárulás szükséges.",
  server_error: "Most nem sikerült a feliratkozás. Próbáld újra egy kicsit később.",
} as const;

export type SignupStatus = keyof typeof signupMessages;
export type SignupResult = { status: SignupStatus };
export type Attribution = { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null };
export type SignupInput = Attribution & { email: string };

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254) return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return null;
  const labels = domain.split(".");
  if (labels.length < 2 || !labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  return email;
}

// Campaign identifiers only: reject free text, email addresses and encoded PII.
export function campaignValue(value: unknown): string | null {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : null;
}

export function attributionFrom(values: Record<string, unknown>): Attribution {
  return {
    utm_source: campaignValue(values.utm_source),
    utm_medium: campaignValue(values.utm_medium),
    utm_campaign: campaignValue(values.utm_campaign),
  };
}
