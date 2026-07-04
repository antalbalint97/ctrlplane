import {
  Card,
  Hero,
  NewsletterSignup,
  SectionHeader,
} from "@meniva/design-system";
import { ArticleExplorer } from "@/components/ArticleExplorer";

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

      <ArticleExplorer />

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
