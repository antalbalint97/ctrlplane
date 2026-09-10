import { colors as c, CtrlPlaneEmailLayout, emailFooterText, escapeHtml as e, monoFont, safeUrl, section, sourceList, type EmailLink, type RenderedEmail } from "./CtrlPlaneEmailLayout";

// Presentation-only counterpart of the original NewsletterPayload. Content is supplied by an editor.
export type NewsletterContent = {
  newsletter_name: string; issue_date: string; issue_id: string; weekday: string; tldr: string;
  stories: Array<{ title: string; what: string; context?: string; why: string; take: string; sources: EmailLink[] }>;
  papers: Array<{ title: string; why: string; context?: string; status: string; tags: string[]; sources: EmailLink[] }>;
  repositories: Array<{ owner: string; name: string; description: string; status: string; source: EmailLink; why: string; context?: string }>;
  watchlist: Array<{ title: string; note: string }>;
  sources: EmailLink[];
  cta?: EmailLink;
};

function label(text: string, color: string = c.accent): string {
  return `<div style="color:${color};font-family:${monoFont};font-size:10px;letter-spacing:.1em;">${e(text)}</div>`;
}
function context(text?: string): string {
  return text ? `<div style="margin-bottom:10px;padding:10px 12px;background:${c.soft};border-left:2px solid ${c.accent};">${label("ELŐZMÉNY / KONTEXTUS")}<div style="margin-top:5px;color:${c.body};font-size:14px;line-height:1.55;">${e(text)}</div></div>` : "";
}
function badge(text: string, primary = false): string {
  return `<span style="display:inline-block;color:${primary ? "#FFFFFF" : c.link};background:${primary ? c.accent : c.accentSoft};border:1px solid ${c.accent};padding:4px 9px;border-radius:2px;font-family:${monoFont};font-size:10px;line-height:1.2;letter-spacing:.08em;">${e(text)}</span>`;
}
function heading(title: string, meta = ""): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;"><tr><td style="color:${c.ink};font-size:20px;font-weight:700;">${e(title)}</td><td align="right" style="color:${c.muted};font-family:${monoFont};font-size:10.5px;">${e(meta)}</td></tr></table>`;
}
function empty(text: string): string {
  return `<div style="color:${c.muted};font-size:13px;">${text}</div>`;
}
function linksText(links: EmailLink[]): string {
  return links.filter((link) => safeUrl(link.url)).map((link) => `${link.label}: ${safeUrl(link.url)}`).join("\n");
}

export function NewsletterEmail(content: NewsletterContent): RenderedEmail {
  const stories = content.stories.map((story) => `<div style="border-top:1px solid ${c.border};padding:21px 0;">
    <h3 style="margin:0 0 14px;color:${c.ink};font-size:18px;line-height:1.28;">${e(story.title)}</h3>
    <div style="margin-bottom:10px;">${label("MI TÖRTÉNT?")}<div style="margin-top:5px;color:${c.body};font-size:14.5px;line-height:1.58;">${e(story.what)}</div></div>
    ${context(story.context)}
    <div style="margin-bottom:10px;">${label("MIÉRT FONTOS?")}<div style="margin-top:5px;color:${c.body};font-size:14.5px;line-height:1.58;">${e(story.why)}</div></div>
    <div style="margin-bottom:14px;border-left:2px solid ${c.borderStrong};padding-left:12px;">${label("CTRLPLANE-NÉZŐPONT", c.muted)}<div style="margin-top:5px;color:#555B66;font-size:14px;font-style:italic;line-height:1.55;">${e(story.take)}</div></div>${sourceList(story.sources)}</div>`).join("") || empty("Nincs új kiemelt történet.");
  const papers = content.papers.map((paper, index) => `<div style="margin-bottom:13px;padding:19px 21px;background:${c.card};border:1px solid ${c.border};border-radius:4px;">
    <div style="margin-bottom:12px;">${badge(paper.status, index === 0)} <span style="display:inline-block;padding:4px 9px;background:${c.soft};border:1px solid ${c.border};border-radius:2px;color:#555B66;font-family:${monoFont};font-size:10px;letter-spacing:.06em;">PREPRINT</span>
    ${paper.tags.map((tag) => `<span style="display:inline-block;padding:4px 5px;color:${c.muted};font-family:${monoFont};font-size:10px;">${e(tag)}</span>`).join("")}</div>
    <h3 style="margin:0 0 10px;color:${c.ink};font-size:17.5px;line-height:1.3;">${e(paper.title)}</h3>${context(paper.context)}
    <div style="margin-bottom:12px;color:${c.body};font-size:14px;line-height:1.58;"><strong style="color:${c.ink};">Miért fontos:</strong> ${e(paper.why)}</div>${sourceList(paper.sources)}</div>`).join("") || empty("Nincs új pontozott paper.");
  const repositories = content.repositories.map((repo) => `<div style="margin-bottom:12px;padding:17px 19px;border:1px solid ${c.border};border-radius:4px;background:${c.card};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top">
    <div style="margin-bottom:6px;color:${c.ink};font-family:${monoFont};font-size:13.5px;">${e(repo.owner)}/<span style="color:${c.link};">${e(repo.name)}</span></div>
    <div style="color:#555B66;font-size:13.5px;line-height:1.55;">${e(repo.description)}</div></td><td valign="top" align="right" style="padding-left:12px;white-space:nowrap;">${badge(repo.status)}</td></tr></table>
    <div style="margin-top:10px;color:${c.body};font-size:13.5px;line-height:1.55;"><strong>Miért releváns:</strong> ${e(repo.why)}</div>
    <div style="margin-top:10px;">${context(repo.context)}</div><div style="margin-top:11px;">${sourceList([repo.source], "")}</div></div>`).join("") || empty("Nincs külön repository-jelölt.");
  const watchlist = content.watchlist.map((item, index) => `<div style="padding:13px 0;${index < content.watchlist.length - 1 ? `border-bottom:1px solid ${c.border};` : ""}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><div style="color:${c.ink};font-size:14px;font-weight:700;">${e(item.title)}</div><div style="margin-top:3px;color:#555B66;font-size:13px;line-height:1.5;">${e(item.note)}</div></td><td valign="top" align="right" style="padding-left:12px;white-space:nowrap;">${badge("WATCH")}</td></tr></table></div>`).join("") || empty("Nincs külön watchlist-jelölt.");
  const sources = content.sources.filter((source) => safeUrl(source.url)).map((source, index) => `<span style="display:inline-block;margin:0 14px 7px 0;">[${index + 1}] <a href="${e(safeUrl(source.url))}" style="color:${c.link};text-decoration:none;">${e(source.label)}</a></span>`).join("") || "Nincs külön forrásjegyzék.";
  const subject = `CtrlPlane ${content.newsletter_name} — ${content.issue_date}`;
  return {
    subject,
    html: CtrlPlaneEmailLayout({ title: subject, label: content.newsletter_name, preheader: content.tldr.slice(0, 150), issueDate: content.issue_date, issueId: content.issue_id, weekday: content.weekday, cta: content.cta,
      bodyHtml: section(`<div style="border:1px solid ${c.border};border-left:3px solid ${c.accent};background:${c.card};border-radius:4px;padding:19px 21px;"><div style="margin-bottom:11px;">${label("SZERKESZTŐI ÖSSZEFOGLALÓ · TL;DR")}</div><div style="color:${c.body};font-size:15px;line-height:1.62;">${e(content.tldr)}</div></div>`, "27px 32px 4px")
        + section(heading("Top AI radar", `${content.stories.length} kiemelt történet`) + stories)
        + section(heading("Papers radar", "arXiv · Hugging Face") + papers)
        + section(heading("Open-source & tools radar") + repositories)
        + section(`<div style="margin-bottom:5px;color:${c.ink};font-size:20px;font-weight:700;">Watchlist</div><div style="margin-bottom:17px;color:${c.muted};font-size:12.5px;">Amit a következő digestig figyelünk — szerkesztői prioritással.</div><div style="padding:3px 19px;background:${c.card};border:1px solid ${c.border};border-radius:4px;">${watchlist}</div>`)
        + section(`<div style="margin-bottom:13px;">${label("FORRÁS- ÉS PROVENANCE-JEGYZÉK", c.muted)}</div><div style="padding:15px 19px;background:${c.soft};border:1px solid ${c.border};border-radius:4px;color:#555B66;font-size:12px;line-height:1.55;">${sources}<div style="margin-top:5px;color:${c.muted};font-size:11px;">A linkfelirat a forrás neve, nem a nyers URL.</div></div>`, "32px"),
    }),
    text: [subject, content.issue_id, "TL;DR", content.tldr, "Top AI radar",
      ...content.stories.map((story) => [story.title, `Mi történt? ${story.what}`, story.context && `Előzmény / kontextus: ${story.context}`, `Miért fontos? ${story.why}`, `CtrlPlane-nézőpont: ${story.take}`, linksText(story.sources)].filter(Boolean).join("\n")),
      "Papers radar", ...content.papers.map((paper) => [paper.title, `[${paper.status}] [PREPRINT] ${paper.tags.join(" · ")}`, paper.context, paper.why, linksText(paper.sources)].filter(Boolean).join("\n")),
      "Open-source & tools radar", ...content.repositories.map((repo) => [`${repo.owner}/${repo.name} [${repo.status}]`, repo.description, repo.why, repo.context, linksText([repo.source])].filter(Boolean).join("\n")),
      "Watchlist", ...content.watchlist.map((item) => `${item.title}: ${item.note}`), "Források", linksText(content.sources),
      content.cta && linksText([content.cta]), emailFooterText(), "",
    ].filter((line) => line !== undefined).join("\n\n"),
  };
}
