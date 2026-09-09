"use client";

import { type FormEvent, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { attributionFrom, NEWSLETTER_SOURCE, normalizeEmail, signupMessages, type SignupStatus } from "@/lib/newsletter/contract";

export default function NewsletterSignup() {
  const started = useRef(false);
  const inFlight = useRef(false);
  const [state, setState] = useState<SignupStatus | "idle" | "submitting">("idle");

  const start = () => {
    if (started.current) return;
    started.current = true;
    try { trackAnalyticsEvent("newsletter_form_start", { form_id: "ctrlplane_newsletter" }); } catch { /* Optional analytics. */ }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = normalizeEmail(values.get("email"));
    if (!email) { setState("invalid_email"); return; }
    inFlight.current = true;
    setState("submitting");
    try {
      const attribution = attributionFrom(Object.fromEntries(new URLSearchParams(window.location.search)));
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: NEWSLETTER_SOURCE, newsletter_consent: true, website: values.get("website"), ...attribution }),
        signal: AbortSignal.timeout(20_000),
      });
      const result: unknown = await response.json();
      const status = result && typeof result === "object" && "status" in result ? result.status : null;
      const expectedCodes: Partial<Record<SignupStatus, number>> = { success: 201, already_subscribed: 200, unsubscribed: 409, invalid_email: 422, consent_required: 400, invalid_request: response.status === 403 || response.status === 415 ? response.status : 400, server_error: 503 };
      if (typeof status !== "string" || !Object.hasOwn(signupMessages, status) || expectedCodes[status as SignupStatus] !== response.status) {
        setState("server_error");
        return;
      }
      setState(status as SignupStatus);
      if (status === "success") {
        form.reset();
        try {
          trackAnalyticsEvent("newsletter_signup", { source: NEWSLETTER_SOURCE, page_path: window.location.pathname, utm_source: attribution.utm_source });
        } catch { /* Analytics must never change a confirmed signup result. */ }
      }
    } catch { setState("server_error"); }
    finally { inFlight.current = false; }
  };

  return (
    <div>
      <h2>Kevesebb AI-hírfolyam, több összefüggés</h2>
      <p>Kéthetente egy nyugodtabb, szerkesztett összefoglaló AI-ról, adatokról és technológiai döntésekről. A CtrlPlane összegyűjti, amit érdemes közelebbről megnézni.</p>
      <form method="post" action="/api/subscribe" noValidate onSubmit={submit} onFocusCapture={start} className="cp-newsletter-form" aria-busy={state === "submitting"}>
        <label htmlFor="newsletter-email">E-mail-cím</label>
        <input id="newsletter-email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" placeholder="email@example.com" disabled={state === "submitting"} aria-invalid={state === "invalid_email"} aria-describedby="newsletter-feedback newsletter-privacy" />
        <div className="cp-newsletter-honeypot" aria-hidden="true">
          <label htmlFor="newsletter-website">Weboldal</label>
          <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className="ds-btn ds-btn--primary" disabled={state === "submitting"}>
          {state === "submitting" ? "Feliratkozás folyamatban…" : "Feliratkozom a hírlevélre"}
        </button>
      </form>
      <p id="newsletter-privacy" className="cp-newsletter-note">A „Feliratkozom a hírlevélre” gombbal hozzájárulok, hogy a CtrlPlane a megadott e-mail-címemre hírlevelet és új írásokról szóló értesítést küldjön az <a href="/privacy">adatvédelmi tájékoztató</a> szerint.</p>
      <p id="newsletter-feedback" role="status" aria-live="polite" aria-atomic="true" className="cp-newsletter-note">
        {state === "idle" ? "A feliratkozás az analitikai sütik engedélyezése nélkül is működik." : state === "submitting" ? "Feliratkozás folyamatban…" : signupMessages[state]}
      </p>
      <noscript>A feliratkozáshoz engedélyezd a JavaScriptet a böngésződben.</noscript>
    </div>
  );
}
