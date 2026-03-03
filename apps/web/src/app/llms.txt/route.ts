import { SITE_NAME, SITE_URL } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/content";

export async function GET(): Promise<Response> {
  const posts = await getAllBlogPosts();
  const essayLinks = posts
    .slice(0, 20)
    .map((post) => `- ${post.canonicalUrl?.trim() || `${SITE_URL}/essay/${post.slug}`}`)
    .join("\n");

  const content = `# ${SITE_NAME}

> Public GraphRAG showcase for system thinking, explainable decision support, and transparent retrieval traces.

## Canonical
- ${SITE_URL}

## Important Pages
- ${SITE_URL}/
- ${SITE_URL}/demo
- ${SITE_URL}/story/graphrag
- ${SITE_URL}/essay
- ${SITE_URL}/about

## Essays
${essayLinks}

## Machine-Readable Discovery
- ${SITE_URL}/sitemap.xml
- ${SITE_URL}/robots.txt

## Contact and Legal
- ${SITE_URL}/impressum
- ${SITE_URL}/datenschutz
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
