import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NewsletterEmail } from "../src/emails/NewsletterEmail";
import { WelcomeEmail } from "../src/emails/WelcomeEmail";
import { newsletterPreview } from "../src/emails/preview-data";

async function main() {
  const output = join(process.cwd(), ".local", "email-preview");
  await mkdir(output, { recursive: true });
  for (const [name, email] of [["welcome", WelcomeEmail()], ["newsletter", NewsletterEmail(newsletterPreview)]] as const) {
    await writeFile(join(output, `${name}.html`), email.html, "utf8");
    await writeFile(join(output, `${name}.txt`), email.text, "utf8");
  }
  console.log(`Email previews written to ${output}`);
}
main().catch(() => { console.error("email_preview_failed"); process.exitCode = 1; });
