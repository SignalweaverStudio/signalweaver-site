export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiBase = process.env.SIGNALWEAVER_API_BASE_URL;
    const token = process.env.SIGNALWEAVER_BEARER_TOKEN;

    const response = await fetch(`${apiBase}/gate/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(err) }),
      { status: 500 }
    );
  }
}