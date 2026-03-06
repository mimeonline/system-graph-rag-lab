import type { Metadata } from "next";
import { LINKEDIN_PROFILE_URL, SITE, SITE_AUTHOR } from "@/config/site";
import "./globals.css";

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

/**
 * Global root layout that applies fonts and shared HTML shell for all routes.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <>{children}</>;
}
