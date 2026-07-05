import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@meniva/design-system/styles/tokens.css";
import "@meniva/design-system/styles/components.css";
import "./globals.css";
import { Footer, LogoLockup, Navbar } from "@meniva/design-system";
import { MENIVA_URL, SITE_URL } from "@/lib/site";

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
  title: "CtrlPlane | AI, adatmunka és szervezeti intelligencia",
  description:
    "Elemző blog és hírlevél AI-rendszerekről, adatcsapatokról, munkaerőpiaci jelekről és technológiai döntésekről.",
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
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "CtrlPlane",
    title: "CtrlPlane | AI, adatmunka és szervezeti intelligencia",
    description:
      "Antal Bálint szakmai blogja AI-rendszerekről, adatcsapatokról és technológiai döntésekről, a Meniva ökoszisztéma részeként.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CtrlPlane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CtrlPlane | AI, adatmunka és szervezeti intelligencia",
    description:
      "Magyar elemzések AI-rendszerekről, adatcsapatokról és technológiai döntésekről.",
    images: ["/opengraph-image"],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CtrlPlane",
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
    name: "Meniva",
    url: MENIVA_URL,
  },
  url: SITE_URL,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
        <Navbar
          sticky
          container="wide"
          logo={<LogoLockup brand="ctrlplane" href="/#top" />}
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
          logo={<LogoLockup brand="ctrlplane" href="/#top" size="sm" />}
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
