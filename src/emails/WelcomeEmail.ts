import { colors, CtrlPlaneEmailLayout, emailFooterText, escapeHtml, section, siteUrl, type RenderedEmail } from "./CtrlPlaneEmailLayout";

export const welcomeSubject = "Üdv a CtrlPlane-en";
const paragraphs = [
  "Szia!",
  "Köszönöm, hogy feliratkoztál a CtrlPlane-re.",
  "AI-ról, adatokról és technológiai szervezetekről írok — elsősorban nem arról, mi történt aznap, hanem arról, mi változik ténylegesen, és mi következik belőle.",
  "Ha addig olvasnál valamit, a CtrlPlane-en már több hosszabb elemzést is találsz az agentic codingtól és a vállalati AI-tól a magyar IT-piacig és a hazai nyelvtechnológia történetéig.",
  "Nem kell minden AI-hírt követned ahhoz, hogy értsd, mi számít.",
];

export function WelcomeEmail(): RenderedEmail {
  return {
    subject: welcomeSubject,
    html: CtrlPlaneEmailLayout({
      title: welcomeSubject,
      preheader: paragraphs[1],
      label: "ÜDVÖZLET",
      bodyHtml: section(`<div style="border:1px solid ${colors.border};border-left:3px solid ${colors.accent};background:${colors.card};border-radius:4px;padding:19px 21px;">
        <h1 style="margin:0 0 20px;color:${colors.ink};font-size:22px;line-height:1.3;">${welcomeSubject}</h1>
        ${paragraphs.map((paragraph) => `<p style="margin:0 0 16px;color:${colors.body};font-size:15px;line-height:1.62;">${escapeHtml(paragraph)}</p>`).join("")}
        <p style="margin:0;color:${colors.ink};font-size:15px;line-height:1.62;">Bálint<br>CtrlPlane</p></div>`, "27px 32px 4px"),
      cta: { label: "Olvasok a CtrlPlane-en", url: siteUrl },
    }),
    text: `${welcomeSubject}\n\n${paragraphs.join("\n\n")}\n\nBálint\nCtrlPlane\n\nOlvasok a CtrlPlane-en: ${siteUrl}\n\n${emailFooterText()}\n`,
  };
}
