import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, withCanonical } from "@/config/site";
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
  metadataBase: new URL(withCanonical("/")),
  title: SITE_NAME,
  description:
    "Öffentlicher GraphRAG Showcase mit System-Thinking-Demo, nachvollziehbarer Herleitung und Story-getriebener Produktdarstellung.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: SITE_NAME,
    description:
      "Öffentlicher GraphRAG Showcase mit System-Thinking-Demo, nachvollziehbarer Herleitung und Story-getriebener Produktdarstellung.",
    url: withCanonical("/"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Öffentlicher GraphRAG Showcase mit System-Thinking-Demo, nachvollziehbarer Herleitung und Story-getriebener Produktdarstellung.",
  },
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
