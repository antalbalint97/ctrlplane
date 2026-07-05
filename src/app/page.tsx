import {
  Button,
  Card,
  Hero,
  SectionHeader,
} from "@meniva/design-system";
import { ArticleExplorer } from "@/components/ArticleExplorer";
import { articles } from "@/data/articles";
import { MENIVA_URL } from "@/lib/site";
import NewsletterPlaceholder from "@/components/NewsletterPlaceholder";

const featuredArticle = articles.find((article) => article.featured) ?? articles[0];

export default function HomePage() {
  return (
    <>
      <div className="cp-hero-band">
        <div className="ds-container ds-container--wide cp-hero-wrap">
          <Hero
            variant="display"
            align="left"
            overline="CtrlPlane · Kiemelt írás"
            title={featuredArticle.title}
            description={featuredArticle.excerpt}
            primaryAction={{ label: "Elolvasom", href: featuredArticle.href }}
            secondaryAction={{ label: "Minden írás", href: "#irasok" }}
          >
            <div className="cp-featured-meta">
              <span>{featuredArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredArticle.date}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredArticle.readingTime}</span>
            </div>
          </Hero>
        </div>
      </div>

      <ArticleExplorer />

      <section id="meniva" className="ds-container ds-container--wide cp-meniva-section">
        <Card padding="lg" className="cp-meniva-card">
          <div className="cp-meniva-brand">
            <span className="ds-overline">A háttérben</span>
            <a href={MENIVA_URL} aria-label="Meniva">
              <img src="/brand/meniva-logo-horizontal.svg" alt="Meniva" style={{ width: 210, height: "auto" }} />
            </a>
          </div>
          <div className="cp-meniva-copy">
            <h2>A CtrlPlane a Meniva szakmai műhelyének része</h2>
            <p>
              Itt az AI-, adat- és szervezeti rendszerek mögötti döntésekről írok.
              A Menivánál ugyanezekből a kérdésekből működő adat- és AI-rendszerek
              születnek.
            </p>
            <Button href={MENIVA_URL} variant="link" size="sm">
              Meniva megismerése →
            </Button>
          </div>
        </Card>
      </section>

      <section id="rolam" className="cp-about">
        <div className="ds-container ds-container--wide cp-about-inner">
          <SectionHeader
            overline="Rólam"
            title="Szakmai jegyzetek a rendszerek mögötti döntésekről"
            description="A CtrlPlane Antal Bálint magyar nyelvű szakmai blogja AI-ról, adatokról, szervezeti működésről és technológiai átmenetekről."
          />
          <div className="cp-about-copy">
            <p>
              A fókusz nem az aktuális eszköz vagy trend, hanem az, milyen
              döntések, ösztönzők, korlátok és következmények épülnek köré.
            </p>
            <p>
              A cél pontos, forrásalapú és gyakorlatban is használható szakmai
              gondolkodás. A CtrlPlane ennek a nyilvános felülete, a Meniva pedig
              a gyakorlati rendszerépítés terepe.
            </p>
          </div>
        </div>
      </section>

      <section id="feliratkozas" className="ds-container ds-container--wide cp-section">
        <Card padding="lg" className="cp-newsletter-card">
          <NewsletterPlaceholder />
        </Card>
      </section>
    </>
  );
}
