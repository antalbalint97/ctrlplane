import {
  ArticleCard,
  Card,
  Hero,
  NewsletterSignup,
  SectionHeader,
  ServiceCard,
} from "@meniva/design-system";
import { articles } from "@/data/articles";

const topics = [
  {
    number: "01",
    title: "AI és adat",
    description:
      "AI-rendszerek, retrieval, modellek és a mögöttük lévő adatok és döntések.",
  },
  {
    number: "02",
    title: "Adatmunka",
    description:
      "Adatcsapatok, pipeline-ok, minőség és a felelősség gyakorlati kérdései.",
  },
  {
    number: "03",
    title: "Tech szervezetek",
    description:
      "Technológiai csapatok működése, képességei és változó felelősségi határai.",
  },
  {
    number: "04",
    title: "Intézményi intelligencia",
    description:
      "Szervezeti tudás, döntéshozatal és a működés lassú infrastruktúrája.",
  },
  {
    number: "05",
    title: "Munkaerőpiac",
    description:
      "Szerepek, képességek és jelek egy átalakuló technológiai gazdaságban.",
  },
  {
    number: "06",
    title: "Módszertan",
    description:
      "Mérés, kísérletezés, forráskritika és kontroll a gyakorlatban.",
  },
];

export default function HomePage() {
  return (
    <>
      <div className="cp-hero-band">
        <div className="ds-container ds-container--wide cp-hero-wrap">
          <Hero
            variant="display"
            align="left"
            overline="CtrlPlane"
            title="AI, adatmunka és szervezeti intelligencia"
            description="Elemző blog és hírlevél arról, hogyan alakul át a tudásmunka infrastruktúrája. Írások AI-rendszerekről, adatcsapatokról, munkaerőpiaci jelekről, intézményi működésről és technológiai döntésekről."
            primaryAction={{ label: "Feliratkozás", href: "#feliratkozas" }}
            secondaryAction={{ label: "Legutóbbi írások", href: "#irasok" }}
          >
            <p className="cp-hero-note">
              Nem hype. Nem napi zaj. Rendszerek, döntések, következmények.
            </p>
          </Hero>
        </div>
      </div>

      <section id="temak" className="ds-container ds-container--wide cp-section">
        <SectionHeader
          overline="Témák"
          title="Amiről írok"
          description="A CtrlPlane nem egy eszközről vagy trendről szól. Azt vizsgálja, milyen rendszerek épülnek köréjük, és milyen döntések, ösztönzők, korlátok és következmények jelennek meg a háttérben."
        />
        <div className="ds-grid ds-grid--3 cp-section-grid">
          {topics.map((topic) => (
            <ServiceCard
              key={topic.number}
              className="cp-topic-card"
              icon={<span className="cp-topic-number">{topic.number}</span>}
              title={topic.title}
              description={topic.description}
              action={{ label: "Írások a témában", href: "#irasok" }}
            />
          ))}
        </div>
      </section>

      <section id="irasok" className="ds-container ds-container--wide cp-section cp-articles">
        <SectionHeader
          overline="Legutóbbi írások"
          title="Friss elemzések"
          description="Hosszabb elemzések és szakmai körképek AI-ról, adatokról, technológiai szervezetekről és a változás intézményi következményeiről."
        />
        <div className="ds-grid ds-grid--3 cp-section-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              className="cp-article-card"
              title={article.title}
              href={article.href}
              excerpt={article.excerpt}
              category={`${article.category} · ${article.type}`}
              date={article.date}
              readingTime={article.readingTime}
              cta="PDF megnyitása"
            />
          ))}
        </div>
      </section>

      <section id="rolam" className="cp-about">
        <div className="ds-container ds-container--wide cp-about-inner">
          <SectionHeader
            overline="Rólam"
            title="A CtrlPlane a Meniva ökoszisztéma szakmai gondolkodási felülete"
            description="AI-ról, adatokról, szervezeti működésről és technológiai átmenetekről szól, magyar kontextusban."
          />
          <div className="cp-about-copy">
            <p>
              A fókusz nem az, hogy mi az aktuális eszköz vagy trend, hanem hogy
              milyen rendszerek épülnek köréjük: milyen döntések, ösztönzők,
              korlátok és következmények jelennek meg a háttérben.
            </p>
            <p>
              A CtrlPlane nem csak mérnököknek szól. Azoknak is, akik AI-ról,
              adatról, technológiai szervezetekről, munkaerőpiacról és az
              intézmények modernizációjáról gondolkodnak.
            </p>
          </div>
        </div>
      </section>

      <section id="feliratkozas" className="ds-container ds-container--wide cp-section">
        <Card padding="lg" className="cp-newsletter-card">
          <NewsletterSignup
            title="Kapj értesítést az új írásokról"
            description="Rövid, elemző írások AI-ról, adatokról, szervezetekről és a technológiai átmenet gyakorlati következményeiről."
            buttonLabel="Feliratkozás"
            placeholder="email@example.com"
            note="Csak a hírlevelet küldjük. Egy kattintással leiratkozhatsz."
            successMessage="Kész. Nézd meg a postafiókodat a megerősítéshez."
          />
        </Card>
      </section>
    </>
  );
}
