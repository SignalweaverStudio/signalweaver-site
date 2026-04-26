import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ traceId: string }> }
) {
  try {
    const { traceId } = await params;
    const apiBase = process.env.SIGNALWEAVER_API_BASE_URL;
    const token = process.env.SIGNALWEAVER_BEARER_TOKEN;
    const apiKey = process.env.SIGNALWEAVER_API_KEY;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${apiBase}/gate/replay/${traceId}`, {
      method: "GET",
      headers,
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
