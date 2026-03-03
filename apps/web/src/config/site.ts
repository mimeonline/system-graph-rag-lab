export type SiteCTA = {
  label: string;
  href: string;
  surface: "header" | "hero" | "essay" | "story" | "lab" | "footer";
  priority: "high" | "medium" | "low";
};

export const SITE_NAME = "System GraphRAG Lab";

export const SITE_DESCRIPTION =
  "Öffentlicher GraphRAG Showcase mit System-Thinking-Demo, nachvollziehbarer Herleitung und Story-getriebener Produktdarstellung.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/michael-meierhoff-b5426458/";
export const SITE_LOCALE = "de_DE";
export const SITE_AUTHOR = "Michael Meierhoff";
export const SITE_KEYWORDS = [
  "GraphRAG",
  "System Thinking",
  "KI Architektur",
  "Explainable AI",
  "Retrieval Augmented Generation",
  "Decision Intelligence",
  "Neo4j",
  "OpenAI",
] as const;

export const SOCIAL_CTA: SiteCTA[] = [
  {
    label: "LinkedIn",
    href: LINKEDIN_PROFILE_URL,
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

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Demo", href: "/demo" },
  { label: "GraphRAG Story", href: "/story/graphrag" },
  { label: "Graph Essays", href: "/essay" },
] as const;

export function withCanonical(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}
