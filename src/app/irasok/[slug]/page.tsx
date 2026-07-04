import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@meniva/design-system";
import articleBodies from "@/data/article-bodies.json";
import { articleEnhancements } from "@/data/article-enhancements";
import { articles, getArticleBySlug } from "@/data/articles";

type ArticleBlock = {
  type: "heading" | "label" | "paragraph";
  text: string;
};

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const bodies = articleBodies as Record<string, ArticleBlock[]>;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | CtrlPlane`,
    description: article.excerpt,
    authors: [{ name: article.author, url: "https://meniva.net" }],
    creator: article.author,
    publisher: "Meniva",
    category: article.category,
    keywords: article.tags,
    openGraph: {
      type: "article",
      locale: "hu_HU",
      siteName: "CtrlPlane",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.datePublished,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const blocks = bodies[slug];

  if (!article || !blocks) {
    notFound();
  }

  const headings = blocks
    .map((block, index) => ({ ...block, index }))
    .filter((block) => block.type === "heading");
  const enhancements = articleEnhancements[slug] ?? [];
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.datePublished,
    inLanguage: "hu-HU",
    keywords: article.tags.join(", "),
    author: {
      "@type": "Person",
      name: article.author,
      url: "https://meniva.net",
    },
    publisher: {
      "@type": "Organization",
      name: "Meniva",
      url: "https://meniva.net",
    },
    isPartOf: {
      "@type": "Blog",
      name: "CtrlPlane",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header className="cp-article-header">
        <div className="ds-container ds-container--content">
          <a className="cp-article-back" href="/#irasok">
            ← Minden írás
          </a>
          <div className="cp-article-meta">
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.type}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="cp-article-subtitle">{article.subtitle}</p>
        </div>
      </header>

      <div className="ds-container ds-container--wide cp-article-layout">
        {headings.length > 0 ? (
          <aside className="cp-article-toc">
            <div className="cp-article-toc-title">Tartalom</div>
            <nav aria-label="A cikk tartalma">
              {headings.map((heading) => (
                <a key={heading.index} href={`#szakasz-${heading.index}`}>
                  {heading.text}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}

        <div className="cp-article-body">
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              const enhancement = enhancements.find(
                (item) => item.afterHeading === block.text,
              );

              return (
                <div className="cp-article-section" key={index}>
                  <h2 id={`szakasz-${index}`}>{block.text}</h2>
                  {enhancement ? (
                    <aside className="cp-editorial-callout">
                      <div className="cp-editorial-callout__label">{enhancement.label}</div>
                      {enhancement.text ? <p>{enhancement.text}</p> : null}
                      {enhancement.items ? (
                        <ol>
                          {enhancement.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      ) : null}
                    </aside>
                  ) : null}
                </div>
              );
            }

            if (block.type === "label") {
              return (
                <p className="cp-article-label" key={index}>
                  {block.text}
                </p>
              );
            }

            const numberedPoint = block.text.match(/^(\d{1,2})\.\s+(.+)/);

            if (numberedPoint) {
              return (
                <div className="cp-numbered-point" key={index}>
                  <span>{numberedPoint[1].padStart(2, "0")}</span>
                  <p>{numberedPoint[2]}</p>
                </div>
              );
            }

            return <p className={index === 0 ? "cp-article-lead" : undefined} key={index}>{block.text}</p>;
          })}

          <div className="cp-article-end">
            <span>CtrlPlane</span>
            <Button href="/#irasok" variant="link" size="sm">
              További írások
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
