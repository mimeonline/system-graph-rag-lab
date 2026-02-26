import { handleQueryRequest } from "@/features/query/handler";

/**
 * HTTP POST route for `/api/query` with JSON parsing fallback for invalid payloads.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await request.json();
    const result = await handleQueryRequest(payload);

    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: result.headers,
    });
  } catch {
    const result = await handleQueryRequest(null);
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: result.headers,
    });
  }
}
