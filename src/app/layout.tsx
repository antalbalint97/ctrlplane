import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@meniva/design-system/styles/tokens.css";
import "@meniva/design-system/styles/components.css";
import "./globals.css";
import { Footer, LogoLockup, Navbar } from "@meniva/design-system";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CtrlPlane | AI, adatmunka és szervezeti intelligencia",
  description:
    "Elemző blog és hírlevél AI-rendszerekről, adatcsapatokról, munkaerőpiaci jelekről és technológiai döntésekről.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      data-brand="ctrlplane"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body className="ds-base">
        <Navbar
          sticky
          container="wide"
          logo={<LogoLockup brand="ctrlplane" href="/#top" />}
          items={[
            { label: "Írások", href: "/#irasok" },
            { label: "Témák", href: "/#temak" },
            { label: "Rólam", href: "/#rolam" },
          ]}
          action={{ label: "Feliratkozás", href: "/#feliratkozas" }}
        />

        <main id="top" className="cp-main">
          {children}
        </main>

        <Footer
          container="wide"
          className="cp-footer"
          logo={<LogoLockup brand="ctrlplane" href="/#top" size="sm" />}
          tagline="AI, adatmunka és szervezeti intelligencia. A Meniva ökoszisztéma szakmai gondolkodási felülete."
          columns={[
            {
              title: "CtrlPlane",
              links: [
                { label: "Írások", href: "/#irasok" },
                { label: "Témák", href: "/#temak" },
                { label: "Rólam", href: "/#rolam" },
                { label: "Feliratkozás", href: "/#feliratkozas" },
              ],
            },
            {
              title: "Ökoszisztéma",
              links: [{ label: "Meniva", href: "https://meniva.net" }],
            },
          ]}
          copyright={`© ${new Date().getFullYear()} CtrlPlane`}
          bottomNote="A Meniva ökoszisztéma része"
        />
      </body>
    </html>
  );
}
