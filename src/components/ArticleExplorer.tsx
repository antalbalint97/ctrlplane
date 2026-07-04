"use client";

import { useMemo, useState } from "react";
import { ArticleCard, SectionHeader } from "@meniva/design-system";
import { articles } from "@/data/articles";

const archiveArticles = articles.filter((article) => !article.featured);
const tags = Array.from(new Set(archiveArticles.flatMap((article) => article.tags))).sort((a, b) =>
  a.localeCompare(b, "hu"),
);

export function ArticleExplorer() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filteredArticles = useMemo(
    () =>
      activeTag
        ? archiveArticles.filter((article) => article.tags.includes(activeTag))
        : archiveArticles,
    [activeTag],
  );

  return (
    <section id="irasok" className="ds-container ds-container--wide cp-section cp-articles">
      <SectionHeader
        overline="Írások"
        title={activeTag ? `Szűrés: ${activeTag}` : "További írások"}
        description="Elemzések és szakmai körképek AI-ról, adatokról, technológiai szervezetekről és a változás intézményi következményeiről."
      />

      <div className="cp-filter-bar" aria-label="Cikkek szűrése">
        <button
          type="button"
          className={`cp-filter-chip${activeTag === null ? " cp-filter-chip--active" : ""}`}
          aria-pressed={activeTag === null}
          onClick={() => setActiveTag(null)}
        >
          Mind
        </button>
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`cp-filter-chip${activeTag === tag ? " cp-filter-chip--active" : ""}`}
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="cp-filter-count" aria-live="polite">
        {filteredArticles.length} írás
      </p>

      <div className="ds-grid ds-grid--3 cp-section-grid cp-filter-results">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            className="cp-article-card"
            title={article.title}
            href={article.href}
            excerpt={
              <>
                {article.excerpt}
                <span className="cp-card-tags" aria-label="Címkék">
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </>
            }
            category={`${article.category} · ${article.type}`}
            date={article.date}
            readingTime={article.readingTime}
            cta="Elolvasom"
          />
        ))}
      </div>
    </section>
  );
}
