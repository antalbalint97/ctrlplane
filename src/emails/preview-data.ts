import type { NewsletterContent } from "./NewsletterEmail";

// Synthetic, deliberately labelled preview content; no collectors, subscribers or live sends.
export const newsletterPreview: NewsletterContent = {
  newsletter_name: "AI-RADAR", issue_date: "2026-09-10", issue_id: "PREVIEW-01", weekday: "ELŐNÉZET",
  tldr: "Helyi sablonelőnézet, szemléltető mintaszöveggel. Ez nem szerkesztett vagy kiküldendő hírlevél.",
  stories: [{ title: "Mintatörténet: az AI és a csapat munkafolyamata", what: "Itt kap helyet a szerkesztő által kiválasztott fejlemény.", context: "Az előzmény segít megérteni a változást.", why: "A jelentőségét a csapat tényleges munkájához kapcsoljuk.", take: "Nem minden újdonság jelent működésbeli előrelépést.", sources: [{ label: "CtrlPlane írások", url: "https://ctrplane.com/" }] }],
  papers: [{ title: "Mintakutatás — kizárólag az elrendezés bemutatására", status: "WATCH", tags: ["MINTA"], why: "A következtetések és a korlátok rövid összefoglalója.", context: "Helyi megjelenítési próba.", sources: [{ label: "Példaforrás", url: "https://example.com/paper" }] }],
  repositories: [{ owner: "example", name: "preview-tool", status: "TOOL", description: "Szemléltető eszközkártya.", why: "A gyakorlati alkalmazhatóság leírása.", context: "Nem valódi eszközajánló.", source: { label: "Példaforrás", url: "https://example.com/tool" } }],
  watchlist: [{ title: "Mintatéma", note: "Egy következő elemzés lehetséges kérdése." }],
  sources: [{ label: "CtrlPlane", url: "https://ctrplane.com/" }],
  cta: { label: "További írások", url: "https://ctrplane.com/" },
};
