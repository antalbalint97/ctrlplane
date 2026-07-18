"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/components/Analytics";

type Props = {
  contentId: string;
  contentTitle: string;
  contentCategory?: string;
  estimatedReadingTimeMinutes?: number;
};

function isActivePage() {
  return document.visibilityState === "visible"
    && (typeof document.hasFocus !== "function" || document.hasFocus());
}

export default function ArticleAnalytics({
  contentId,
  contentTitle,
  contentCategory = "uncategorized",
  estimatedReadingTimeMinutes = 0,
}: Props) {
  const engagedRef = useRef(false);
  const activeTimeSecondsRef = useRef(0);
  const maxScrollPercentRef = useRef(0);

  useEffect(() => {
    const fired = new Set<number>();
    let activeSince = isActivePage() ? performance.now() : null;

    const viewed = () => trackAnalyticsEvent("article_view", {
      content_id: contentId,
      content_title: contentTitle,
      content_type: "article",
      content_category: contentCategory,
      estimated_reading_time_minutes: estimatedReadingTimeMinutes,
    });

    const evaluateEngagement = () => {
      if (engagedRef.current || maxScrollPercentRef.current < 50 || activeTimeSecondsRef.current < 60) return;
      const sent = trackAnalyticsEvent("article_engaged", {
        content_id: contentId,
        content_title: contentTitle,
        content_type: "article",
        content_category: contentCategory,
        max_scroll_percent: Math.round(maxScrollPercentRef.current),
        active_time_seconds: Math.floor(activeTimeSecondsRef.current),
        estimated_reading_time_minutes: estimatedReadingTimeMinutes,
      });
      if (sent) engagedRef.current = true;
    };

    const flushActiveTime = () => {
      const now = performance.now();
      if (activeSince !== null) activeTimeSecondsRef.current += Math.max(0, now - activeSince) / 1000;
      activeSince = isActivePage() ? now : null;
      evaluateEngagement();
    };

    const onScroll = () => {
      const body = document.querySelector<HTMLElement>(".cp-article-body");
      if (!body || body.offsetHeight <= 0) return;
      const bodyTop = body.getBoundingClientRect().top + window.scrollY;
      const progress = Math.max(0, Math.min(100, ((window.scrollY + window.innerHeight - bodyTop) / body.offsetHeight) * 100));
      maxScrollPercentRef.current = Math.max(maxScrollPercentRef.current, progress);
      [25, 50, 75, 100].forEach((threshold) => {
        if (progress >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackAnalyticsEvent(`article_read_${threshold}`, {
            content_id: contentId,
            content_title: contentTitle,
            content_type: "article",
            content_category: contentCategory,
            percent_scrolled: threshold,
            max_scroll_percent: Math.round(maxScrollPercentRef.current),
            estimated_reading_time_minutes: estimatedReadingTimeMinutes,
          });
        }
      });
      evaluateEngagement();
    };

    const onActivityStateChange = () => flushActiveTime();
    const activeTimer = window.setInterval(flushActiveTime, 1000);
    viewed();
    onScroll();
    window.addEventListener("analytics-consent-change", viewed);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onActivityStateChange);
    window.addEventListener("focus", onActivityStateChange);
    window.addEventListener("blur", onActivityStateChange);
    return () => {
      flushActiveTime();
      window.clearInterval(activeTimer);
      window.removeEventListener("analytics-consent-change", viewed);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onActivityStateChange);
      window.removeEventListener("focus", onActivityStateChange);
      window.removeEventListener("blur", onActivityStateChange);
    };
  }, [contentCategory, contentId, contentTitle, estimatedReadingTimeMinutes]);

  return null;
}
