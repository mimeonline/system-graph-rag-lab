import { SITE } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/content";

export async function GET(): Promise<Response> {
  const posts = await getAllBlogPosts("de");
  const essayLinks = posts
    .slice(0, 20)
    .map((post) => `- ${SITE.url}/de/essay/${post.slug}`)
    .join("\n");

  const content = `# ${SITE.name}

> Public GraphRAG showcase for system thinking, explainable decision support, and transparent retrieval traces.

## Canonical
- ${SITE.url}

## Important Pages
- ${SITE.url}/de
- ${SITE.url}/en
- ${SITE.url}/de/demo
- ${SITE.url}/de/story/graphrag
- ${SITE.url}/de/essay
- ${SITE.url}/de/about

## Essays
${essayLinks}

## Machine-Readable Discovery
- ${SITE.url}/sitemap.xml
- ${SITE.url}/robots.txt

## Contact and Legal
- ${SITE.url}/de/impressum
- ${SITE.url}/de/datenschutz
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
