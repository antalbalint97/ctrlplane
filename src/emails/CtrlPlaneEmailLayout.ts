// Port of the table-based presentation in ctrlplane_intel/newsletter.py.
// Plain HTML keeps the existing email-client fallbacks without a Python/React Email dependency.
export const colors = {
  canvas: "#EEF0F3", surface: "#FBFBFD", card: "#FFFFFF", ink: "#14181F",
  body: "#3B4250", muted: "#878E99", border: "#E4E6EB", borderStrong: "#D2D6DD",
  soft: "#F2F3F6", accent: "#3B6FF6", link: "#2F5FE0", accentSoft: "#EDF2FF",
} as const;
export const bodyFont = "Arial,Helvetica,sans-serif";
export const monoFont = "Consolas,'Courier New',monospace";
export const siteUrl = "https://ctrplane.com/";
export const privacyUrl = "https://ctrplane.com/privacy";
export const contactEmail = "info@meniva.net";
export const unsubscribeUrl = `mailto:${contactEmail}?subject=CtrlPlane%20leiratkoz%C3%A1s`;
export type RenderedEmail = { subject: string; html: string; text: string };
export type EmailLink = { label: string; url: string };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

// Newsletter data is plain text plus HTTPS links, never arbitrary HTML.
export function safeUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    return url.href;
  } catch { return ""; }
}

export function sourceList(sources: EmailLink[], prefix = "Források:"): string {
  const links = sources.filter((source) => safeUrl(source.url)).map((source) =>
    `<a href="${escapeHtml(safeUrl(source.url))}" style="color:${colors.link};text-decoration:none;">${escapeHtml(source.label)} &#8599;</a>`);
  return links.length ? `<div style="font-size:12.5px;line-height:1.5;color:${colors.muted};">${escapeHtml(prefix)} ${links.join(' <span style="color:#C7CCD4;">&#183;</span> ')}</div>` : "";
}

export function section(contentHtml: string, padding = "32px 32px 0"): string {
  return `<tr><td class="section-pad" style="padding:${padding};">${contentHtml}</td></tr>`;
}

export function emailFooterText(): string {
  return `CtrlPlane\nEzt a levelet azért kapod, mert feliratkoztál a CtrlPlane hírlevélre.\nÍrások: ${siteUrl}\nAdatvédelem: ${privacyUrl}\nLeiratkozáshoz írj a feliratkozáskor megadott címedről: ${contactEmail}\nA kérelmeket manuálisan dolgozzuk fel.`;
}

type LayoutInput = {
  title: string;
  preheader: string;
  label: string;
  issueDate?: string;
  issueId?: string;
  weekday?: string;
  // Only HTML produced by the local renderers; editorial input must be escaped first.
  bodyHtml: string;
  cta?: EmailLink;
};

export function CtrlPlaneEmailLayout(input: LayoutInput): string {
  const meta = input.issueDate ? `<td class="meta-cell" valign="middle" align="right" style="padding-left:12px;">
    <div style="color:${colors.ink};font-family:${monoFont};font-size:11px;">${escapeHtml(input.issueDate)}</div>
    <div style="margin-top:4px;font-family:${monoFont};font-size:9.5px;color:${colors.muted};letter-spacing:.04em;">${escapeHtml([input.issueId && `ISSUE ${input.issueId}`, input.weekday].filter(Boolean).join(" · "))}</div></td>` : "";
  const cta = input.cta && safeUrl(input.cta.url) ? section(`<div style="padding:24px;text-align:center;background:${colors.card};border:1px solid ${colors.border};border-radius:4px;">
    <a href="${escapeHtml(safeUrl(input.cta.url))}" style="display:inline-block;background:${colors.accent};color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:2px;">${escapeHtml(input.cta.label)} &#8594;</a></div>`, "32px") : "";
  return `<!doctype html>
<html lang="hu"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${escapeHtml(input.title)}</title>
<style>
body { margin:0 !important;padding:0 !important;background:${colors.canvas} !important; }
table { border-spacing:0; } a { color:${colors.link}; }
@media only screen and (max-width:680px) {
  .email-container { width:100% !important;max-width:100% !important; }
  .outer-pad { padding:0 !important; }
  .section-pad { padding-left:20px !important;padding-right:20px !important; }
  .masthead-cell,.meta-cell { display:block !important;width:100% !important; }
  .meta-cell { padding:14px 0 0 !important;text-align:left !important; }
}
</style></head>
<body style="margin:0;padding:0;background:${colors.canvas};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(input.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${colors.canvas};">
<tr><td class="outer-pad" align="center" style="padding:36px 12px;">
<!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" class="email-container" style="width:100%;max-width:640px;background:${colors.surface};border:1px solid ${colors.border};border-radius:6px;font-family:${bodyFont};">
${section(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="masthead-cell" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding-right:10px;"><img src="${siteUrl}brand/logo-icon.png" width="30" height="30" alt="" style="display:block;border:0;"></td>
<td style="color:${colors.ink};font-family:${bodyFont};font-size:21px;font-weight:700;letter-spacing:-.02em;">CtrlPlane</td>
<td style="padding-left:10px;"><span style="display:inline-block;border:1px solid ${colors.borderStrong};padding:4px 7px;border-radius:2px;color:${colors.accent};font-family:${monoFont};font-size:9px;letter-spacing:.16em;">${escapeHtml(input.label)}</span></td>
</tr></table></td>${meta}</tr></table>
<div style="margin-top:14px;color:${colors.muted};font-size:11.5px;line-height:1.5;">Megbízható AI- és open-source jelek, magyarul szerkesztve.</div>`, `30px 32px 25px;border-bottom:1px solid ${colors.border};background:${colors.surface}`)}
${input.bodyHtml}${cta}
${section(`<div style="margin-bottom:13px;color:${colors.ink};font-size:16px;font-weight:700;"><span style="color:${colors.accent};">C</span>&nbsp; CtrlPlane</div>
<div style="margin-bottom:12px;color:${colors.muted};font-size:12.5px;line-height:1.6;">Megbízható AI- és open-source jelek, magyar nyelvű szerkesztéssel — hype nélkül.</div>
<div style="color:${colors.muted};font-size:12px;line-height:1.6;">Ezt a levelet azért kapod, mert feliratkoztál a CtrlPlane hírlevélre.<br>
<a href="${siteUrl}" style="color:${colors.link};">Írások</a> &#183; <a href="${privacyUrl}" style="color:${colors.link};">Adatvédelem</a><br>
Leiratkozáshoz írj a feliratkozáskor megadott címedről: <a href="${unsubscribeUrl}" style="color:${colors.link};">${contactEmail}</a>. A kérelmeket manuálisan dolgozzuk fel.</div>`, `34px 32px 38px;border-top:1px solid ${colors.border}`)}
</table><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}
