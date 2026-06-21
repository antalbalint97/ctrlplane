import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
// Design-system styles first, then app globals (so the brand font overrides win).
import "@meniva/design-system/styles/tokens.css";
import "@meniva/design-system/styles/components.css";
import "./globals.css";
import { Navbar, Footer, LogoLockup } from "@meniva/design-system";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CtrlPlane — the control plane for data & AI teams",
  description:
    "A weekly editorial briefing for engineers and operators building data and AI systems. Sharp essays, field notes, and teardowns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-brand="ctrlplane"
      data-theme="dark"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body>
        <Navbar
          sticky
          container="wide"
          logo={<LogoLockup brand="ctrlplane" href="/" />}
          items={[
            { label: "Issues", href: "/#issues" },
            { label: "About", href: "/#about" },
          ]}
          action={{ label: "Subscribe", href: "#subscribe" }}
        />

        <main className="cp-main">{children}</main>

        <Footer
          container="wide"
          tagline="The control plane for data & AI teams — a weekly editorial briefing."
          copyright={`© ${new Date().getFullYear()} CtrlPlane`}
          columns={[
            {
              title: "Briefing",
              links: [
                { label: "Latest issues", href: "/#issues" },
                { label: "Subscribe", href: "/#subscribe" },
              ],
            },
            {
              title: "More",
              links: [
                { label: "About", href: "/#about" },
                { label: "Archive", href: "/#issues" },
              ],
            },
          ]}
        />
      </body>
    </html>
  );
}
