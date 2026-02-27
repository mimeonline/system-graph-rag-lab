import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { BlogPostFrontmatter, BlogPostSummary, BlogTocItem } from "@/features/blog/contracts";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

async function getBlogFilePaths(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_CONTENT_DIR);
  return entries.filter((entry) => entry.endsWith(".mdx")).map((entry) => path.join(BLOG_CONTENT_DIR, entry));
}

function normalizeFrontmatter(raw: Partial<BlogPostFrontmatter>, sourcePath: string): BlogPostFrontmatter {
  const slug = raw.slug?.trim() || path.basename(sourcePath, ".mdx");
  return {
    slug,
    title: raw.title?.trim() || slug,
    excerpt: raw.excerpt?.trim() || "",
    publishedAt: raw.publishedAt?.trim() || new Date().toISOString(),
    updatedAt: raw.updatedAt?.trim(),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)) : [],
    coverImage: raw.coverImage?.trim(),
    heroImage: raw.heroImage?.trim(),
    diagramImages: Array.isArray(raw.diagramImages) ? raw.diagramImages.map((image) => String(image)) : [],
    linkedinHook: raw.linkedinHook?.trim(),
    tldr: raw.tldr?.trim(),
    readingTime: raw.readingTime?.trim() || "5 min",
    featured: raw.featured === true,
    canonicalUrl: raw.canonicalUrl?.trim(),
  };
}

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  const paths = await getBlogFilePaths();
  const posts = await Promise.all(
    paths.map(async (sourcePath) => {
      const source = await fs.readFile(sourcePath, "utf8");
      const parsed = matter(source);
      const frontmatter = normalizeFrontmatter(parsed.data as Partial<BlogPostFrontmatter>, sourcePath);
      return {
        ...frontmatter,
        sourcePath,
      } satisfies BlogPostSummary;
    }),
  );

  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string): Promise<{
  frontmatter: BlogPostFrontmatter;
  content: React.ReactNode;
  toc: BlogTocItem[];
} | null> {
  const paths = await getBlogFilePaths();
  const match = paths.find((sourcePath) => path.basename(sourcePath, ".mdx") === slug);
  if (!match) {
    return null;
  }

  const source = await fs.readFile(match, "utf8");
  const { content, frontmatter } = await compileMDX<BlogPostFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: {
      h2: ({ children }) => {
        const text = String(children);
        return <h2 id={toHeadingId(text)} className="mt-8 text-[1.35rem] font-semibold text-slate-900">{children}</h2>;
      },
      h3: ({ children }) => {
        const text = String(children);
        return <h3 id={toHeadingId(text)} className="mt-6 text-[1.12rem] font-semibold text-slate-900">{children}</h3>;
      },
      p: ({ children }) => <p className="mt-3 text-[0.95rem] leading-7 text-slate-700">{children}</p>,
      ul: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-5 text-[0.95rem] text-slate-700">{children}</ul>,
      ol: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.95rem] text-slate-700">{children}</ol>,
      li: ({ children }) => <li>{children}</li>,
      blockquote: ({ children }) => (
        <blockquote className="mt-4 rounded-r-md border-l-4 border-sky-300 bg-sky-50 px-4 py-3 text-[0.95rem] text-slate-800">
          {children}
        </blockquote>
      ),
      code: ({ children }) => (
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900">{children}</code>
      ),
      pre: ({ children }) => <pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-4 text-slate-100">{children}</pre>,
      img: ({ src, alt }) => (
        <figure className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Image
            src={String(src ?? "")}
            alt={alt ?? ""}
            width={1400}
            height={900}
            className="block h-auto w-full"
          />
          {alt ? <figcaption className="px-3 py-2 text-xs text-slate-500">{alt}</figcaption> : null}
        </figure>
      ),
      a: ({ href, children }) => (
        <a href={href} className="text-sky-700 underline decoration-sky-300 underline-offset-2" target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      ),
    },
  });

  const normalizedFrontmatter = normalizeFrontmatter(frontmatter as Partial<BlogPostFrontmatter>, match);
  const toc = extractToc(source);

  return {
    frontmatter: normalizedFrontmatter,
    content,
    toc,
  };
}

function extractToc(source: string): BlogTocItem[] {
  const raw = matter(source).content;
  const lines = raw.split("\n");
  const toc: BlogTocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      const text = h2[1]?.trim();
      if (text) {
        toc.push({ id: toHeadingId(text), text, level: 2 });
      }
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      const text = h3[1]?.trim();
      if (text) {
        toc.push({ id: toHeadingId(text), text, level: 3 });
      }
    }
  }
  return toc;
}

function toHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
