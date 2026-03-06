export type SiteCTA = {
  label: string;
  href: string;
  surface: "header" | "hero" | "essay" | "story" | "lab" | "footer";
  priority: "high" | "medium" | "low";
};

const SITE_URL_FALLBACK =
  process.env.NODE_ENV === "production"
    ? "https://graphrag-lab.meierhoff-systems.de"
    : "http://localhost:3000";
const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
const isLocalHostUrl = Boolean(
  siteUrlFromEnv?.match(/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i),
);
export const SITE_URL =
  process.env.NODE_ENV === "production" && (!siteUrlFromEnv || isLocalHostUrl)
    ? "https://graphrag-lab.meierhoff-systems.de"
    : siteUrlFromEnv || SITE_URL_FALLBACK;
export const SITE = {
  name: "System GraphRAG Lab",
  description:
    "Öffentlicher GraphRAG Showcase mit System-Thinking-Demo, nachvollziehbarer Herleitung und Story-getriebener Produktdarstellung.",
  url: SITE_URL,
  author: "Michael Meierhoff",
  linkedInProfileUrl: "https://www.linkedin.com/in/michael-meierhoff-b5426458/",
  keywords: [
    "GraphRAG",
    "System Thinking",
    "KI Architektur",
    "Explainable AI",
    "Retrieval Augmented Generation",
    "Decision Intelligence",
    "Neo4j",
    "OpenAI",
  ] as const,
} as const;

export const SITE_NAME = SITE.name;
export const SITE_DESCRIPTION = SITE.description;
export const SITE_AUTHOR = SITE.author;
export const SITE_KEYWORDS = SITE.keywords;
export const LINKEDIN_PROFILE_URL = SITE.linkedInProfileUrl;
export const SITE_LOCALE = "de_DE";

export const SOCIAL_CTA: SiteCTA[] = [
  {
    label: "LinkedIn",
    href: SITE.linkedInProfileUrl,
    surface: "hero",
    priority: "high",
  },
  {
    label: "GitHub",
    href: "https://github.com/mimeonline",
    surface: "hero",
    priority: "high",
  },
];

export function withCanonical(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE.url}${normalized}`;
}
