export type SiteCTA = {
  label: string;
  href: string;
  surface: "header" | "hero" | "blog" | "story" | "lab" | "footer";
  priority: "high" | "medium" | "low";
};

export const SITE_NAME = "System GraphRAG Lab";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const PRIMARY_CTA: SiteCTA = {
  label: "Projekt anfragen",
  href: "mailto:hello@example.com?subject=Projektanfrage%20GraphRAG",
  surface: "hero",
  priority: "high",
};

export const SOCIAL_CTA: SiteCTA[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    surface: "hero",
    priority: "high",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    surface: "hero",
    priority: "high",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "GraphRAG Story", href: "/story/graphrag" },
  { label: "Multi-Agent Lab", href: "/lab/multi-agent" },
] as const;

export function withCanonical(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}
