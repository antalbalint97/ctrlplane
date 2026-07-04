"use client";

import { useMemo, useState } from "react";
import { ArticleCard, SectionHeader, ServiceCard } from "@meniva/design-system";
import { articles } from "@/data/articles";

const topics = [
  {
    number: "01",
    title: "AI és adat",
    description: "AI-rendszerek, modellek és a mögöttük lévő adatok és döntések.",
  },
  {
    number: "02",
    title: "Adatmunka",
    description: "Adatcsapatok, pipeline-ok, minőség és a felelősség gyakorlati kérdései.",
  },
  {
    number: "03",
    title: "Tech szervezetek",
    description: "Technológiai csapatok működése és változó felelősségi határai.",
  },
  {
    number: "04",
    title: "Intézményi intelligencia",
    description: "Szervezeti tudás, döntéshozatal és a működés lassú infrastruktúrája.",
  },
  {
    number: "05",
    title: "Munkaerőpiac",
    description: "Szerepek, képességek és jelek egy átalakuló technológiai gazdaságban.",
  },
  {
    number: "06",
    title: "Módszertan",
    description: "Mérés, kísérletezés, forráskritika és kontroll a gyakorlatban.",
  },
];

const tags = Array.from(new Set(articles.flatMap((article) => article.tags))).sort((a, b) =>
  a.localeCompare(b, "hu"),
);

export function ArticleExplorer() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filteredArticles = useMemo(
    () => (activeTag ? articles.filter((article) => article.tags.includes(activeTag)) : articles),
    [activeTag],
  );

  function selectTag(tag: string | null) {
    setActiveTag(tag);
    if (tag) {
      requestAnimationFrame(() =>
        document.querySelector("#irasok")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  return (
    <>
      <section id="temak" className="ds-container ds-container--wide cp-section">
        <SectionHeader
          overline="Témák"
          title="Amiről írok"
          description="Válassz egy témát a kapcsolódó írások szűréséhez. A CtrlPlane azt vizsgálja, milyen rendszerek épülnek a technológia köré, és milyen döntések, ösztönzők és következmények jelennek meg a háttérben."
        />
        <div className="ds-grid ds-grid--3 cp-section-grid">
          {topics.map((topic) => (
            <ServiceCard
              key={topic.number}
              className={`cp-topic-card${activeTag === topic.title ? " cp-topic-card--active" : ""}`}
              icon={<span className="cp-topic-number">{topic.number}</span>}
              title={topic.title}
              description={topic.description}
              action={{ label: activeTag === topic.title ? "Szűrés törlése" : "Szűrés erre", onClick: () => selectTag(activeTag === topic.title ? null : topic.title) }}
            />
          ))}
        </div>
      </section>

      <section id="irasok" className="ds-container ds-container--wide cp-section cp-articles">
        <SectionHeader
          overline="Írások"
          title={activeTag ? `Szűrés: ${activeTag}` : "Friss elemzések"}
          description="Hosszabb elemzések és szakmai körképek AI-ról, adatokról, technológiai szervezetekről és a változás intézményi következményeiről."
        />

        <div className="cp-filter-bar" aria-label="Cikkek szűrése">
          <button
            type="button"
            className={`cp-filter-chip${activeTag === null ? " cp-filter-chip--active" : ""}`}
            aria-pressed={activeTag === null}
            onClick={() => selectTag(null)}
          >
            Mind
          </button>
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`cp-filter-chip${activeTag === tag ? " cp-filter-chip--active" : ""}`}
              aria-pressed={activeTag === tag}
              onClick={() => selectTag(activeTag === tag ? null : tag)}
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
    </>
  );
}
