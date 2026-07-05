import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@meniva/design-system/styles/tokens.css";
import "@meniva/design-system/styles/components.css";
import "./globals.css";
import { Footer, Navbar } from "@meniva/design-system";
import { MENIVA_URL, SITE_URL } from "@/lib/site";
import Analytics from "@/components/Analytics";

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
  metadataBase: new URL(SITE_URL),
  title: "CtrlPlane | AI, adatok, technológia",
  description: "Elemzések AI-ról, adatokról és technológiai szervezetekről.",
  applicationName: "CtrlPlane",
  authors: [{ name: "Antal Bálint", url: MENIVA_URL }],
  creator: "Antal Bálint",
  publisher: "Meniva",
  keywords: [
    "mesterséges intelligencia",
    "adatstratégia",
    "technológiai szervezetek",
    "magyar IT",
    "Meniva",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "CtrlPlane",
    title: "CtrlPlane | AI, adatok, technológia",
    description: "Elemzések AI-ról, adatokról és technológiai szervezetekről.",
    url: "/",
    images: [{ url: `${SITE_URL}/brand/og-default.png`, width: 1200, height: 630, alt: "CtrlPlane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CtrlPlane | AI, adatok, technológia",
    description: "Elemzések AI-ról, adatokról és technológiai szervezetekről.",
    images: [`${SITE_URL}/brand/og-default.png`],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CtrlPlane",
  alternateName: "CtrlPlane AI & Data Review",
  description:
    "Antal Bálint szakmai blogja AI-rendszerekről, adatcsapatokról és technológiai döntésekről.",
  inLanguage: "hu-HU",
  author: {
    "@type": "Person",
    name: "Antal Bálint",
    url: MENIVA_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "CtrlPlane",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-avatar.png`,
  },
  about: ["Artificial intelligence", "Data work", "Technology organizations"],
  image: `${SITE_URL}/brand/og-default.png`,
  url: SITE_URL,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "CtrlPlane",
  alternateName: "CtrlPlane AI & Data Review",
  url: SITE_URL,
  description: "Elemzések AI-ról, adatokról és technológiai szervezetekről.",
  inLanguage: "hu-HU",
  image: `${SITE_URL}/brand/og-default.png`,
  publisher: {
    "@type": "Person",
    "@id": `${SITE_URL}/#antal-balint`,
    name: "Antal Bálint",
    url: MENIVA_URL,
  },
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
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteJsonLd, blogJsonLd]) }}
        />
        <Navbar
          sticky
          container="wide"
          logo={<a href="/#top" aria-label="CtrlPlane"><img src="/brand/logo-horizontal.svg" alt="CtrlPlane" style={{ height: 32, width: "auto" }} /></a>}
          items={[
            { label: "Írások", href: "/#irasok" },
            { label: "Rólam", href: "/#rolam" },
            { label: "Meniva", href: MENIVA_URL },
          ]}
          action={{ label: "Feliratkozás", href: "/#feliratkozas" }}
        />

        <main id="top" className="cp-main">
          {children}
        </main>

        <Footer
          container="wide"
          className="cp-footer"
          logo={<a href="/#top" aria-label="CtrlPlane"><img src="/brand/logo-horizontal.svg" alt="CtrlPlane" style={{ height: 30, width: "auto" }} /></a>}
          tagline="AI, adatmunka és szervezeti intelligencia. A Meniva ökoszisztéma szakmai gondolkodási felülete."
          columns={[
            {
              title: "CtrlPlane",
              links: [
                { label: "Írások", href: "/#irasok" },
                { label: "Rólam", href: "/#rolam" },
                { label: "Feliratkozás", href: "/#feliratkozas" },
              ],
            },
            {
              title: "Ökoszisztéma",
              links: [{ label: "Meniva", href: MENIVA_URL }],
            },
          ]}
          copyright={`© ${new Date().getFullYear()} CtrlPlane`}
          bottomNote="A Meniva ökoszisztéma része"
        />
      </body>
    </html>
  );
}
