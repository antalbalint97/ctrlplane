type ShortLink = {
  destination: "/" | `/irasok/${string}`;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  hash?: string;
};

const SHORT_LINKS: Readonly<Record<string, ShortLink>> = {
  launch: {
    destination: "/",
    source: "linkedin",
    medium: "organic_social",
    campaign: "ctrlplane_launch",
    content: "launch_post_01",
    hash: "feliratkozas",
  },
};

export function shortLinkDestination(slug: string): string | null {
  if (!Object.hasOwn(SHORT_LINKS, slug)) return null;
  const link = SHORT_LINKS[slug];
  const url = new URL(link.destination, "https://ctrplane.com");
  // Keep future registry entries internal, including after URL normalization.
  if (url.origin !== "https://ctrplane.com" || url.pathname.startsWith("//")) return null;
  url.search = new URLSearchParams({
    utm_source: link.source,
    utm_medium: link.medium,
    utm_campaign: link.campaign,
    utm_content: link.content,
  }).toString();
  url.hash = link.hash ?? "";
  // Relative Location keeps production, preview and local traffic on their own origin.
  return `${url.pathname}${url.search}${url.hash}`;
}
