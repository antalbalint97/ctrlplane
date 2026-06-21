import {
  Hero,
  SectionHeader,
  ArticleCard,
  NewsletterSignup,
  Card,
} from "@meniva/design-system";

const issues = [
  {
    title: "Backpressure is a product decision, not a config flag",
    href: "/issues/backpressure-is-a-product-decision",
    excerpt:
      "Every queue you add is a promise about latency you may not be able to keep. A field guide to designing for overload.",
    category: "Systems",
    date: "Jun 18, 2026",
    readingTime: "9 min",
  },
  {
    title: "The quiet cost of a vector database",
    href: "/issues/the-quiet-cost-of-a-vector-database",
    excerpt:
      "Retrieval looks cheap in the demo and expensive in the invoice. Where the money actually goes, and how to bound it.",
    category: "Teardown",
    date: "Jun 11, 2026",
    readingTime: "12 min",
  },
  {
    title: "Your eval set is your roadmap",
    href: "/issues/your-eval-set-is-your-roadmap",
    excerpt:
      "If you can't name what 'better' means, you can't ship it. Treating evaluation as the primary engineering artifact.",
    category: "AI",
    date: "Jun 4, 2026",
    readingTime: "7 min",
  },
  {
    title: "Idempotency keys, and other apologies to your future self",
    href: "/issues/idempotency-keys",
    excerpt:
      "Retries are inevitable; duplicates are optional. A short, opinionated tour of making writes safe to repeat.",
    category: "Systems",
    date: "May 28, 2026",
    readingTime: "8 min",
  },
  {
    title: "Dashboards lie; traces don't",
    href: "/issues/dashboards-lie-traces-dont",
    excerpt:
      "Aggregates hide the request that ruined someone's afternoon. Why distributed tracing earns its keep.",
    category: "Observability",
    date: "May 21, 2026",
    readingTime: "10 min",
  },
  {
    title: "Schema changes at 3x scale",
    href: "/issues/schema-changes-at-scale",
    excerpt:
      "The migration that worked in staging and melted in prod. Patterns for evolving tables without downtime.",
    category: "Data",
    date: "May 14, 2026",
    readingTime: "11 min",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div className="ds-container ds-container--wide cp-section">
        <Hero
          variant="display"
          align="left"
          overline="The control plane for data & AI teams"
          title={
            <>
              Signal over noise.
              <br />A weekly editorial briefing.
            </>
          }
          description="CtrlPlane is a newsletter for engineers and operators building data and AI systems — sharp essays, field notes, and the occasional teardown. No hype, no hot takes, just the load-bearing ideas."
          primaryAction={{ label: "Subscribe", href: "#subscribe" }}
          secondaryAction={{ label: "Read latest", href: "#issues" }}
        />
      </div>

      {/* Issues */}
      <section id="issues" className="ds-container ds-container--wide cp-section">
        <SectionHeader
          overline="Latest issues"
          title="Recent briefings"
          description="A new issue most weeks. Read a few below, then subscribe to get the next one."
          className="mb-8"
        />
        <div className="cp-grid">
          {issues.map((issue) => (
            <ArticleCard
              key={issue.href}
              title={issue.title}
              href={issue.href}
              excerpt={issue.excerpt}
              category={issue.category}
              date={issue.date}
              readingTime={issue.readingTime}
              cta="Read issue"
            />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="ds-container ds-container--wide cp-section--tight">
        <div style={{ maxWidth: "var(--container-prose)" }}>
          <SectionHeader
            overline="About"
            title="Built for people who run things in production"
            description="CtrlPlane is part of the Meniva ecosystem — the same design language as our consulting and education work, pointed at the operators keeping data and AI systems alive. It's written for engineers, by engineers, and it assumes you've been paged before."
          />
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="ds-container ds-container--wide cp-section">
        <Card padding="lg">
          <NewsletterSignup
            title="Get the next issue"
            description="One editorial briefing, most weeks. Unsubscribe in one click — no funnels, no drip sequences."
            buttonLabel="Subscribe"
            placeholder="you@company.com"
            note="We send the newsletter and nothing else. Your address stays private."
            successMessage="You're in — check your inbox to confirm your subscription."
          />
        </Card>
      </section>
    </>
  );
}
