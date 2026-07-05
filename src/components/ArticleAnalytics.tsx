"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/components/Analytics";

export default function ArticleAnalytics({ contentId }: { contentId: string }) {
  useEffect(() => {
    const viewed = () => trackAnalyticsEvent("article_view", { content_id: contentId });
    viewed();
    window.addEventListener("analytics-consent-change", viewed);

    const fired = new Set<number>();
    const onScroll = () => {
      const body = document.querySelector<HTMLElement>(".cp-article-body");
      if (!body) return;
      const bodyTop = body.getBoundingClientRect().top + window.scrollY;
      const progress = Math.max(0, Math.min(100, ((window.scrollY + window.innerHeight - bodyTop) / body.offsetHeight) * 100));
      [25, 50, 75, 90].forEach((threshold) => {
        if (progress >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackAnalyticsEvent(`article_read_${threshold}`, { content_id: contentId, percent_scrolled: threshold });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("analytics-consent-change", viewed);
      window.removeEventListener("scroll", onScroll);
    };
  }, [contentId]);

  return null;
}

