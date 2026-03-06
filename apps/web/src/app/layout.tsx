import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LINKEDIN_PROFILE_URL, SITE, SITE_AUTHOR } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: SITE.name,
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE_AUTHOR, url: LINKEDIN_PROFILE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "de",
  description: SITE.description,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_AUTHOR,
  url: LINKEDIN_PROFILE_URL,
  sameAs: [
    "https://www.linkedin.com/in/michael-meierhoff-b5426458/",
    "https://github.com/mimeonline",
  ],
};

/**
 * Global root layout that applies fonts and shared HTML shell for all routes.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          src="https://stats.meierhoff-systems.de/api/script.js"
          data-site-id="377ab853f243"
          defer
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
