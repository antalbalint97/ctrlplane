"use client";

import { FormEvent, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/components/Analytics";

export default function NewsletterPlaceholder() {
  const started = useRef(false);
  const [message, setMessage] = useState("");

  const start = () => {
    if (started.current) return;
    started.current = true;
    trackAnalyticsEvent("newsletter_form_start", { form_id: "ctrlplane_newsletter" });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("A feliratkozási szolgáltatás bekötése folyamatban van; az e-mail-címedet nem küldtük el.");
  };

  return (
    <div>
      <h2>Kapj értesítést az új írásokról</h2>
      <p>Rövid, elemző írások AI-ról, adatokról, szervezetekről és a technológiai átmenet gyakorlati következményeiről.</p>
      <form onSubmit={submit} onFocusCapture={start} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <label htmlFor="newsletter-email" className="sr-only">E-mail-cím</label>
        <input id="newsletter-email" type="email" required placeholder="email@example.com" style={{ flex: "1 1 260px", padding: "12px 14px", border: "1px solid #9ca3af", borderRadius: 8 }} />
        <button type="submit" className="ds-btn ds-btn--primary">Feliratkozás</button>
      </form>
      <p aria-live="polite" style={{ marginTop: 12 }}>{message || "Csak a hírlevelet küldjük. Egy kattintással leiratkozhatsz."}</p>
    </div>
  );
}

