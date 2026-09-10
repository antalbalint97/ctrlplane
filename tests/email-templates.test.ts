import { test } from "node:test";
import assert from "node:assert/strict";
import { WelcomeEmail } from "../src/emails/WelcomeEmail";
import { NewsletterEmail } from "../src/emails/NewsletterEmail";
import { newsletterPreview } from "../src/emails/preview-data";
import { safeUrl } from "../src/emails/CtrlPlaneEmailLayout";

test("welcome renders the supplied copy, preheader, archive CTA and real manual unsubscribe footer", () => {
  const email = WelcomeEmail();
  assert.equal(email.subject, "Üdv a CtrlPlane-en");
  for (const output of [email.html, email.text]) {
    assert.match(output, /Köszönöm, hogy feliratkoztál a CtrlPlane-re/);
    assert.match(output, /Nem kell minden AI-hírt követned ahhoz, hogy értsd, mi számít/);
    assert.match(output, /Bálint/);
    assert.match(output, /https:\/\/ctrplane.com\//);
    assert.match(output, /https:\/\/ctrplane.com\/privacy/);
    assert.match(output, /info@meniva.net/);
    assert.match(output, /manuálisan dolgozzuk fel/);
    assert.doesNotMatch(output, /kéthetente|one.click|\{\{/i);
  }
  assert.match(email.html, /display:none;max-height:0/);
  assert.match(email.html, /href="mailto:info@meniva.net\?subject=CtrlPlane%20leiratkoz%C3%A1s"/);
});

test("newsletter preserves every structured presentation section and its content", () => {
  const email = NewsletterEmail(newsletterPreview);
  for (const output of [email.html, email.text]) {
    for (const value of [newsletterPreview.issue_id, newsletterPreview.tldr, newsletterPreview.stories[0].title, newsletterPreview.stories[0].context!, newsletterPreview.papers[0].title, newsletterPreview.repositories[0].description, newsletterPreview.watchlist[0].note]) {
      assert.ok(output.includes(value), value);
    }
  }
  for (const title of ["Top AI radar", "Papers radar", "Open-source &amp; tools radar", "Watchlist", "FORRÁS- ÉS PROVENANCE-JEGYZÉK"]) assert.ok(email.html.includes(title));
  assert.match(email.text, /További írások: https:\/\/ctrplane.com\//);
});

test("both templates retain the original email-safe shell, fonts, colors and Outlook fallback", () => {
  for (const { html } of [WelcomeEmail(), NewsletterEmail(newsletterPreview)]) {
    assert.match(html, /max-width:640px/);
    assert.match(html, /#EEF0F3/);
    assert.match(html, /#FBFBFD/);
    assert.match(html, /#3B6FF6/);
    assert.match(html, /Arial,Helvetica,sans-serif/);
    assert.match(html, /Consolas,'Courier New',monospace/);
    assert.match(html, /\[if mso\]/);
    assert.match(html, /role="presentation"/);
    assert.match(html, /https:\/\/ctrplane.com\/brand\/logo-icon.png/);
    assert.doesNotMatch(html, /<svg|<script|<link|display:flex|fonts.googleapis|\{\{/i);
  }
});

test("editorial strings cannot inject HTML or unsafe links into email", () => {
  const content = structuredClone(newsletterPreview);
  content.tldr = '<img src=x onerror="bad()"> & text';
  content.stories[0].title = "<script>bad()</script>";
  content.stories[0].sources = [{ label: "bad", url: "javascript:alert(1)" }, { label: '<b>source</b>', url: 'https://example.com/?q="x"&a=1' }];
  content.sources = [{ label: "bad", url: "https://user:password@example.com/" }];
  content.cta = { label: "unsafe", url: "data:text/html,bad" };
  const email = NewsletterEmail(content);
  assert.match(email.html, /&lt;script&gt;bad\(\)&lt;\/script&gt;/);
  assert.match(email.html, /&lt;b&gt;source&lt;\/b&gt;/);
  assert.doesNotMatch(email.html, /<script|<img src=x|href="javascript:|href="data:|user:password/);
  assert.doesNotMatch(email.text, /javascript:|data:text|user:password/);
  for (const url of ["/relative", "http://example.com", "javascript:alert(1)", "https://user:pass@example.com"]) assert.equal(safeUrl(url), "");
});

test("empty newsletter sections render without unresolved template placeholders", () => {
  const email = NewsletterEmail({ ...newsletterPreview, stories: [], papers: [], repositories: [], watchlist: [], sources: [], cta: undefined });
  assert.match(email.html, /Nincs új kiemelt történet/);
  assert.match(email.html, /Nincs külön forrásjegyzék/);
  assert.doesNotMatch(email.html, /undefined|\{\{/);
});
