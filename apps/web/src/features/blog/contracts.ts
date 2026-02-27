export type BlogPostFrontmatter = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: string;
  heroImage?: string;
  diagramImages?: string[];
  linkedinHook?: string;
  tldr?: string;
  readingTime: string;
  featured: boolean;
  canonicalUrl?: string;
};

export type BlogTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPostSummary = BlogPostFrontmatter & {
  sourcePath: string;
};
