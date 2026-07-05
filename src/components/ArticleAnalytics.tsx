"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/components/Analytics";

export default function ArticleAnalytics({ contentId, contentTitle }: { contentId: string; contentTitle: string }) {
  useEffect(() => {
    const viewed = () => trackAnalyticsEvent("article_view", { content_id: contentId, content_title: contentTitle });
    viewed();
    window.addEventListener("analytics-consent-change", viewed);

    const fired = new Set<number>();
    const onScroll = () => {
      const body = document.querySelector<HTMLElement>(".cp-article-body");
      if (!body) return;
      const bodyTop = body.getBoundingClientRect().top + window.scrollY;
      const progress = Math.max(0, Math.min(100, ((window.scrollY + window.innerHeight - bodyTop) / body.offsetHeight) * 100));
      [25, 50, 75, 100].forEach((threshold) => {
        if (progress >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackAnalyticsEvent(`article_read_${threshold}`, { content_id: contentId, content_title: contentTitle, percent_scrolled: threshold });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("analytics-consent-change", viewed);
      window.removeEventListener("scroll", onScroll);
    };
  }, [contentId, contentTitle]);

  return null;
}
