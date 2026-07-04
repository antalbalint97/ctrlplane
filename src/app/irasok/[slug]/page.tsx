import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@meniva/design-system";
import articleBodies from "@/data/article-bodies.json";
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

  return (
    <article>
      <header className="cp-article-header">
        <div className="ds-container ds-container--content">
          <a className="cp-article-back" href="/#irasok">
            ← Minden írás
          </a>
          <div className="cp-article-meta">
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
          <Button
            href={article.pdfHref}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noreferrer"
          >
            Eredeti PDF megnyitása
          </Button>
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
              return (
                <h2 id={`szakasz-${index}`} key={index}>
                  {block.text}
                </h2>
              );
            }

            if (block.type === "label") {
              return (
                <p className="cp-article-label" key={index}>
                  {block.text}
                </p>
              );
            }

            return (
              <p className={index === 0 ? "cp-article-lead" : undefined} key={index}>
                {block.text}
              </p>
            );
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
