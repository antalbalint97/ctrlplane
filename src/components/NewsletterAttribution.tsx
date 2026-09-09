"use client";

import { useEffect } from "react";
import { attributionFrom } from "@/lib/newsletter/contract";

// Preserve only campaign identifiers from an article to the existing signup section.
// No cookies or browser storage; attribution does not depend on analytics consent.
export default function NewsletterAttribution() {
  useEffect(() => {
    const preserve = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== "/" || destination.hash !== "#feliratkozas") return;
      const attribution = attributionFrom(Object.fromEntries(new URLSearchParams(window.location.search)));
      Object.entries(attribution).forEach(([key, value]) => { if (value) destination.searchParams.set(key, value); });
      anchor.href = `${destination.pathname}${destination.search}${destination.hash}`;
    };
    document.addEventListener("click", preserve, true);
    document.addEventListener("auxclick", preserve, true);
    return () => { document.removeEventListener("click", preserve, true); document.removeEventListener("auxclick", preserve, true); };
  }, []);
  return null;
}
